import type { TocNode } from '$lib/types/post';

/**
 * Result of processing markdown content
 */
export interface ProcessedContent {
	/** Generated HTML content */
	html: string;
	/** Extracted frontmatter data */
	frontmatter: Record<string, unknown>;
	/** Generated table of contents */
	toc: TocNode[];
	/** Content metadata */
	metadata: ContentMetadata;
}

/**
 * Extracted metadata from processed content
 */
export interface ContentMetadata {
	/** Word count of the content */
	wordCount: number;
	/** Estimated reading time in minutes */
	readingTime: number;
	/** Number of headings in the content */
	headingCount: number;
	/** Character count (without HTML tags) */
	characterCount: number;
}

/**
 * Interface for markdown processing operations
 *
 * Provides pure transformation functions that convert markdown content
 * into structured HTML with metadata, without any file I/O operations.
 */
export interface MarkdownProcessor {
	/**
	 * Process markdown content asynchronously
	 *
	 * @param markdownContent Raw markdown content as string
	 * @returns Promise resolving to processed content
	 */
	process(markdownContent: string): Promise<ProcessedContent>;

	/**
	 * Process markdown content synchronously
	 *
	 * @param markdownContent Raw markdown content as string
	 * @returns Processed content
	 */
	processSync(markdownContent: string): ProcessedContent;
}

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
