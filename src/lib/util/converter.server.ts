import * as fs from 'fs/promises';
import type { EntryType } from '$lib/types/enums';
import { join } from 'path';
import type { TocNode } from '$lib/types/post';
import { slug as slugger } from 'github-slugger';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import rehypeStringify from 'rehype-stringify';
import { remark } from 'remark';
import remarkFrontmatter from 'remark-frontmatter';
import remarkParseFrontmatter from 'remark-parse-frontmatter';
import remarkRehype from 'remark-rehype';
import type { VFile } from 'remark-rehype/lib';
import type { Node } from 'unist';
import { visit } from 'unist-util-visit';

// todo maybe markdown file?
const processor = remark()
	.use(remarkFrontmatter)
	.use(remarkParseFrontmatter)
	.use(_remarkGenerateNestedToc)
	.use(remarkRehype)
	.use(rehypeSlug)
	.use(rehypeAutolinkHeadings)
	.use(_rehypeEnhanceImage)
	.use(rehypeHighlight)
	.use(rehypeStringify)
	.freeze();

// TODO still needs to be transformed to the corresponding Entry types
export async function getRawEntries(entryType: EntryType): Promise<any[]> {
	const files = await _getFiles(entryType);
	const entries = await Promise.all(
		files.map(async (file) => {
			const output = processor.processSync(file);
			return { html: output.value, meta: output.data.frontmatter, toc: output.data.toc };
		})
	);
	return entries;
}

export async function _getFiles(entryType: EntryType): Promise<string[]> {
	const folderName =
		entryType.toLowerCase() === 'stack_entry' ? 'stack' : `${entryType.toLowerCase()}s`;
	const folderPath = join(process.cwd(), 'src', 'content', folderName);
	const fileNames = await fs.readdir(folderPath);
	return await Promise.all(
		fileNames.map(async (fileName) => {
			const filePath = join(folderPath, fileName);
			return await fs.readFile(filePath, 'utf8');
		})
	);
}

// todo maybe markdown file?
function _rehypeEnhanceImage() {
	console.log('_enhanceImage');
	return (tree: any) => {
		visit(tree, 'element', (node) => {
			if (node.tagName === 'img') {
				if (!node.properties.src.endsWith('gif') || !node.properties.src.endsWith('svg')) {
					// TODO dont get processed by svelte or vite or whoever, need to solve this before putting it life
					// node.tagName = 'enhanced:img'
					// node.properties.src = `${node.properties.src}?w=1280;640;400`
					// node.properties.sizes = '(min-width:1920px) 1280px, (min-width:1080px) 640px, (min-width:768px) 400px'
				}
			}
		});
	};
}

// todo maybe markdown file?
interface HeadingNode extends Node {
	depth: number;
	children: { value: string }[];
}

// todo maybe markdown file?
function _remarkGenerateNestedToc() {
	console.log('------------------');
	return (tree: Node, file: VFile) => {
		const headings: { value: string; depth: number; slug: string }[] = [];
		visit(tree, 'heading', (node: HeadingNode) => {
			const value = node.children.reduce((text, child) => text + child.value, '');
			const slug = slugger(value);
			headings.push({ value, depth: node.depth, slug });
		});
		file.data.toc = _getNestedToc(headings);
	};
}

function _getNestedToc(markdownHeading: any): TocNode[] {
	let latestEntry: TocNode | null;
	let latestParent: TocNode | null;
	const markdownHeadingCopy = JSON.parse(JSON.stringify(markdownHeading));
	if (markdownHeadingCopy.length <= 1) return markdownHeadingCopy;
	// TODO fix any
	const entryDepth: number[] = markdownHeading.reduce((acc: number, item: any) => {
		return item.depth < acc ? item.depth : acc;
	}, Number.POSITIVE_INFINITY);
	// TODO fix any
	return markdownHeadingCopy.reduce((result: any, entry: any) => {
		if (latestEntry && !latestEntry.children) {
			latestEntry.children = [];
		}
		const latestEntryDepth = latestEntry?.depth || 0;
		const latestEntryChildren = latestEntry?.children || [];
		const latestParentChildren = latestParent?.children || [];
		if (entry.depth === entryDepth) {
			entry.children = [];
			result.push(entry);
			latestParent = null;
		} else if (entry.depth === latestEntryDepth + 1) {
			latestEntryChildren.push(entry);
			latestParent = latestEntry;
		} else if (entry.depth === latestEntryDepth) {
			latestParentChildren.push(entry);
		} else {
			console.error('Unexpected Toc behaviour', entry);
		}
		latestEntry = entry;
		return result;
	}, []);
}
