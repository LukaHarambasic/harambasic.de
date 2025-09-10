import type { TocNode } from '$lib/types/post';
import type { RawEntry } from '$lib/types/entry';
import {
	validateRawEntry,
	validateContentQuality,
	validateMarkdownStructure
} from '$lib/schemas/validation';
import type { ContentQualityIssue, ValidationResult } from '$lib/schemas';
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
 * Result of processing markdown content with validation
 */
export type ProcessedContent = {
	/** Generated HTML content */
	html: string;
	/** Extracted frontmatter data */
	frontmatter: Record<string, any>;
	/** Generated table of contents */
	tableOfContents: TocNode[];
	/** Validation result */
	validation: ValidationResult & { data?: RawEntry };
	/** Content quality issues */
	qualityIssues: ContentQualityIssue[];
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
 * Creates a markdown processing error with additional context
 */
export function createMarkdownProcessingError(
	message: string,
	cause?: Error,
	content?: string
): Error {
	const error = new Error(message);
	error.name = 'MarkdownProcessingError';
	if (cause) {
		(error as any).cause = cause;
	}
	if (content) {
		(error as any).content = content;
	}
	return error;
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
 * Process markdown content into structured RawEntry with validation
 */
export function processMarkdown(markdownContent: string, filePath?: string): RawEntry {
	try {
		const output = processor.processSync(markdownContent);
		const frontmatter = output.data.frontmatter as any;

		const rawEntry = {
			html: String(output.value),
			toc: (output.data.toc as TocNode[]) || [],
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
			imageAlt: frontmatter?.imageAlt,
			comment: frontmatter?.comment
		};

		// Validate the processed raw entry
		const validationResult = validateRawEntry(rawEntry, filePath);

		if (!validationResult.isValid) {
			throw createMarkdownProcessingError(
				`Content validation failed: ${validationResult.message}`,
				undefined,
				markdownContent
			);
		}

		return validationResult.data!;
	} catch (error) {
		throw createMarkdownProcessingError(
			`Failed to process markdown content: ${error instanceof Error ? error.message : String(error)}`,
			error instanceof Error ? error : undefined,
			markdownContent
		);
	}
}

/**
 * Process markdown content with comprehensive validation and quality checks
 */
export function processMarkdownWithValidation(
	markdownContent: string,
	filePath?: string
): ProcessedContent {
	try {
		const output = processor.processSync(markdownContent);
		const frontmatter = output.data.frontmatter as any;
		const html = String(output.value);
		const toc = (output.data.toc as TocNode[]) || [];

		const rawEntry = {
			html,
			toc,
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
			imageAlt: frontmatter?.imageAlt,
			comment: frontmatter?.comment
		};

		// Validate the raw entry structure
		const validation = validateRawEntry(rawEntry, filePath);

		// Perform content quality checks
		const qualityIssues: ContentQualityIssue[] = [];

		if (validation.data) {
			qualityIssues.push(
				...validateContentQuality(validation.data),
				...validateMarkdownStructure(html)
			);
		}

		return {
			html,
			frontmatter,
			tableOfContents: toc,
			validation,
			qualityIssues
		};
	} catch (error) {
		throw createMarkdownProcessingError(
			`Failed to process markdown content: ${error instanceof Error ? error.message : String(error)}`,
			error instanceof Error ? error : undefined,
			markdownContent
		);
	}
}

/**
 * Process multiple markdown contents in parallel
 */
export async function processMarkdownBatch(
	markdownContents: Array<{ content: string; filePath?: string }>
): Promise<RawEntry[]> {
	const CHUNK_SIZE = 10;
	const results: RawEntry[] = [];

	for (let i = 0; i < markdownContents.length; i += CHUNK_SIZE) {
		const chunk = markdownContents.slice(i, i + CHUNK_SIZE);
		const chunkResults = await Promise.all(
			chunk.map(async ({ content, filePath }) => {
				return Promise.resolve(processMarkdown(content, filePath));
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
			const value = (node?.children ?? []).reduce((text, child) => text + (child.value || ''), '');
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
