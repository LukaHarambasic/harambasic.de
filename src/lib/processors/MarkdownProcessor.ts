import type { TocNode } from '$lib/types/post';
import type { RawEntry, RawEntryMeta } from '$lib/types/entry';
import { slug as slugger } from 'github-slugger';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import rehypeStringify from 'rehype-stringify';
import { remark } from 'remark';
import remarkFrontmatter from 'remark-frontmatter';
import remarkParseFrontmatter from 'remark-parse-frontmatter';
import remarkRehype from 'remark-rehype';
import type { VFile } from 'vfile';
import type { Node } from 'unist';
import { visit } from 'unist-util-visit';

/**
 * Processor for converting Markdown content to structured RawEntry format.
 * Handles frontmatter parsing, table of contents generation, and HTML conversion.
 */
export class MarkdownProcessor {
	private processor;

	constructor() {
		this.processor = remark()
			.use(remarkFrontmatter)
			.use(remarkParseFrontmatter)
			.use(this.remarkGenerateNestedToc)
			.use(remarkRehype)
			.use(rehypeSlug)
			.use(rehypeAutolinkHeadings)
			.use(this.rehypeEnhanceImage)
			.use(rehypeHighlight)
			.use(rehypeStringify)
			.freeze();
	}

	/**
	 * Process markdown content into structured RawEntry
	 * @param markdownContent - Raw markdown content as string
	 * @returns Processed entry with HTML, metadata, and table of contents
	 */
	process(markdownContent: string): RawEntry {
		try {
			const output = this.processor.processSync(markdownContent);
			return {
				html: String(output.value),
				meta: output.data.frontmatter as RawEntryMeta,
				toc: output.data.toc as TocNode[]
			};
		} catch (error) {
			throw new Error(
				`Failed to process markdown content: ${error instanceof Error ? error.message : String(error)}`
			);
		}
	}

	/**
	 * Process multiple markdown contents
	 * @param markdownContents - Array of markdown content strings
	 * @returns Array of processed entries
	 */
	async processMany(markdownContents: string[]): Promise<RawEntry[]> {
		return markdownContents.map((content) => this.process(content));
	}

	/**
	 * Remark plugin to generate nested table of contents
	 */
	private remarkGenerateNestedToc = () => {
		return (tree: Node, file: VFile) => {
			const headings: { value: string; depth: number; slug: string }[] = [];
			visit(tree, 'heading', (node: TocNode) => {
				const value = (node?.children ?? []).reduce((text, child) => text + child.value, '');
				const slug = slugger(value);
				headings.push({ value, depth: node.depth, slug });
			});
			file.data.toc = this.getNestedToc(headings);
		};
	};

	/**
	 * Rehype plugin to enhance image elements (currently inactive but preserved)
	 */
	private rehypeEnhanceImage = () => {
		// TODO: Implement image enhancement when ready
		// Currently commented out in original implementation
		// This placeholder preserves the plugin structure for future use
	};

	/**
	 * Convert flat heading structure to nested table of contents
	 * @param markdownHeadings - Array of headings with depth, value, and slug
	 * @returns Nested table of contents structure
	 */
	private getNestedToc(markdownHeadings: TocNode[]): TocNode[] {
		let latestEntry: TocNode | null;
		let latestParent: TocNode | null;
		const markdownHeadingCopy = JSON.parse(JSON.stringify(markdownHeadings));

		if (markdownHeadingCopy.length <= 1) return markdownHeadingCopy;

		// Find the minimum depth to determine entry level
		const entryDepth: number = markdownHeadings.reduce((acc: number, item: TocNode) => {
			return item.depth < acc ? item.depth : acc;
		}, Number.POSITIVE_INFINITY);

		return markdownHeadingCopy.reduce((result: TocNode[], entry: TocNode) => {
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
}
