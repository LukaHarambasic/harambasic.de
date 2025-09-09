import type { TocNode } from '$lib/types/post';
import type { RawEntry } from '$lib/types/entry';
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
 * Result of processing markdown content
 */
export type ProcessedContent = {
	/** Generated HTML content */
	html: string;
	/** Extracted frontmatter data */
	frontmatter: Record<string, any>;
	/** Generated table of contents */
	tableOfContents: TocNode[];
};

/**
 * Metadata extracted from content during processing
 */
export type ContentMetadata = {
	/** Word count of content */
	wordCount: number;
	/** Estimated reading time in minutes */
	readingTime: number;
	/** List of headings found */
	headings: TocNode[];
};

/**
 * Error thrown during markdown processing
 */
export class MarkdownProcessingError extends Error {
	constructor(
		message: string,
		public readonly cause?: Error,
		public readonly content?: string
	) {
		super(message);
		this.name = 'MarkdownProcessingError';
	}
}

const createRemarkProcessor = () => {
	return remark()
		.use(remarkFrontmatter)
		.use(remarkParseFrontmatter)
		.use(remarkGenerateNestedToc)
		.use(remarkRehype)
		.use(rehypeSlug)
		.use(rehypeAutolinkHeadings)
		.use(rehypeEnhanceImage)
		.use(rehypeHighlight)
		.use(rehypeStringify)
		.freeze();
};

const processor = createRemarkProcessor();

/**
 * Process markdown content into structured RawEntry
 */
export function processMarkdown(markdownContent: string): RawEntry {
	try {
		const output = processor.processSync(markdownContent);
		const frontmatter = output.data.frontmatter as any;
		
		return {
			html: String(output.value),
			toc: output.data.toc as TocNode[] || [],
			title: frontmatter?.title || '',
			description: frontmatter?.description || '',
			image: frontmatter?.image || '',
			tags: frontmatter?.tags || [],
			published: frontmatter?.published || '',
			updated: frontmatter?.updated || '',
			url: frontmatter?.url,
			status: frontmatter?.status,
			openSource: frontmatter?.openSource,
			tldr: frontmatter?.tldr,
			discussion: frontmatter?.discussion,
			links: frontmatter?.links,
			prio: frontmatter?.prio,
			imageAlt: frontmatter?.imageAlt
		};
	} catch (error) {
		throw new MarkdownProcessingError(
			`Failed to process markdown content: ${error instanceof Error ? error.message : String(error)}`,
			error instanceof Error ? error : undefined,
			markdownContent
		);
	}
}

/**
 * Process multiple markdown contents in parallel
 */
export async function processMarkdownBatch(markdownContents: string[]): Promise<RawEntry[]> {
	const CHUNK_SIZE = 10;
	const results: RawEntry[] = [];

	for (let i = 0; i < markdownContents.length; i += CHUNK_SIZE) {
		const chunk = markdownContents.slice(i, i + CHUNK_SIZE);
		const chunkResults = await Promise.all(
			chunk.map(async (content) => {
				return Promise.resolve(processMarkdown(content));
			})
		);
		results.push(...chunkResults);
	}

	return results;
}

function remarkGenerateNestedToc() {
	return (tree: Node, file: VFile) => {
		const headings: { value: string; depth: number; slug: string }[] = [];
		visit(tree, 'heading', (node: TocNode) => {
			const value = (node?.children ?? []).reduce(
				(text, child) => text + (child.value || ''),
				''
			);
			const slug = slugger(value);
			headings.push({ value, depth: node.depth, slug });
		});
		file.data.toc = getNestedToc(headings);
	};
}

function rehypeEnhanceImage() {
	// TODO: Implement image enhancement when ready
	// Currently commented out in original implementation
	// This placeholder preserves the plugin structure for future use
}

function getNestedToc(markdownHeadings: TocNode[]): TocNode[] {
	let latestEntry: TocNode | null;
	let latestParent: TocNode | null;
	const markdownHeadingCopy = markdownHeadings.map((heading) => ({ ...heading, children: [] }));

	if (markdownHeadingCopy.length <= 1) return markdownHeadingCopy;

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

/**
 * Processor for converting Markdown content to structured RawEntry format.
 * Handles frontmatter parsing, table of contents generation, and HTML conversion.
 */
export class MarkdownProcessor {
	process(markdownContent: string): RawEntry {
		return processMarkdown(markdownContent);
	}

	async processMany(markdownContents: string[]): Promise<RawEntry[]> {
		return processMarkdownBatch(markdownContents);
	}
}