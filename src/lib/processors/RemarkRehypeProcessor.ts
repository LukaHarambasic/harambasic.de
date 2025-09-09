import { remark } from 'remark';
import remarkFrontmatter from 'remark-frontmatter';
import remarkParseFrontmatter from 'remark-parse-frontmatter';
import remarkRehype from 'remark-rehype';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeHighlight from 'rehype-highlight';
import rehypeStringify from 'rehype-stringify';

import type { MarkdownProcessor, ProcessedContent, ContentMetadata } from './MarkdownProcessor';
import { MarkdownProcessingError } from './MarkdownProcessor';
import type { ProcessorConfig } from './ProcessorConfig';
import { createTocPlugin } from './plugins/TocPlugin';
import { createImagePlugin } from './plugins/ImagePlugin';
import type { TocNode } from '$lib/types/post';

/**
 * Implementation of MarkdownProcessor using remark and rehype
 *
 * Provides a configurable markdown processing pipeline that transforms
 * markdown content into HTML with extracted metadata and table of contents.
 */
export class RemarkRehypeProcessor implements MarkdownProcessor {
	private processor: any;
	private config: ProcessorConfig;

	/**
	 * Creates a new RemarkRehypeProcessor instance
	 *
	 * @param config Configuration options for the processor
	 */
	constructor(config: ProcessorConfig = {}) {
		this.config = config;
		this.processor = this.createProcessor();
	}

	/**
	 * Process markdown content asynchronously
	 */
	async process(markdownContent: string): Promise<ProcessedContent> {
		try {
			const result = await this.processor.process(markdownContent);
			return this.createProcessedContent(result, markdownContent);
		} catch (error) {
			throw new MarkdownProcessingError(
				'Failed to process markdown content asynchronously',
				error as Error,
				markdownContent.substring(0, 100) + '...'
			);
		}
	}

	/**
	 * Process markdown content synchronously
	 */
	processSync(markdownContent: string): ProcessedContent {
		try {
			const result = this.processor.processSync(markdownContent);
			return this.createProcessedContent(result, markdownContent);
		} catch (error) {
			throw new MarkdownProcessingError(
				'Failed to process markdown content synchronously',
				error as Error,
				markdownContent.substring(0, 100) + '...'
			);
		}
	}

	/**
	 * Creates the unified processor with configured plugins
	 */
	private createProcessor(): any {
		let processor = remark()
			.use(remarkFrontmatter)
			.use(remarkParseFrontmatter)
			.use(createTocPlugin(this.config.toc))
			.use(remarkRehype)
			.use(rehypeSlug);

		// Add autolink headings if configured
		processor = processor.use(rehypeAutolinkHeadings);

		// Add image enhancement
		processor = processor.use(createImagePlugin(this.config.images));

		// Add syntax highlighting
		if (this.config.highlight) {
			processor = processor.use(rehypeHighlight, this.config.highlight.hljs);
		} else {
			processor = processor.use(rehypeHighlight);
		}

		return processor.use(rehypeStringify).freeze();
	}

	/**
	 * Creates ProcessedContent from unified processing result
	 */
	private createProcessedContent(result: any, originalContent: string): ProcessedContent {
		const html = String(result.value);
		const frontmatter = (result.data.frontmatter || {}) as Record<string, unknown>;
		const toc = (result.data.toc || []) as TocNode[];

		const metadata = this.extractMetadata(html, originalContent);

		return {
			html,
			frontmatter,
			toc,
			metadata
		};
	}

	/**
	 * Extracts content metadata from processed HTML and original content
	 */
	private extractMetadata(html: string, originalContent: string): ContentMetadata {
		const config = this.config.metadata || {};
		const {
			wordCount: calculateWordCount = true,
			readingTime: calculateReadingTime = true,
			wordsPerMinute = 200
		} = config;

		// Extract text content from HTML for word count
		const textContent = html
			.replace(/<[^>]*>/g, ' ')
			.replace(/\s+/g, ' ')
			.trim();

		const wordCount = calculateWordCount
			? textContent.split(/\s+/).filter((word) => word.length > 0).length
			: 0;

		const readingTime = calculateReadingTime ? Math.ceil(wordCount / wordsPerMinute) : 0;

		const characterCount = textContent.length;

		// Count headings from original content
		const headingMatches = originalContent.match(/^#{1,6}\s+/gm) || [];
		const headingCount = headingMatches.length;

		return {
			wordCount,
			readingTime,
			headingCount,
			characterCount
		};
	}
}
