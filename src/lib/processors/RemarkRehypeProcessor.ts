import { remark } from 'remark';
import remarkFrontmatter from 'remark-frontmatter';
import remarkParseFrontmatter from 'remark-parse-frontmatter';
import remarkRehype from 'remark-rehype';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeHighlight from 'rehype-highlight';
import rehypeStringify from 'rehype-stringify';

import type { ProcessedContent, ContentMetadata } from './MarkdownProcessor';
import { MarkdownProcessingError } from './MarkdownProcessor';
import type { ProcessorConfig } from './ProcessorConfig';
import { validateProcessorConfig } from './ProcessorConfig';
import { createTocPlugin } from './plugins/TocPlugin';
import { createImagePlugin } from './plugins/ImagePlugin';
import { sanitizeHtml, DEFAULT_SANITIZATION_CONFIG } from './utils/HtmlSanitizer';
import type { TocNode } from '$lib/types/post';

const createRemarkRehypeProcessor = (config: ProcessorConfig = {}) => {
	validateProcessorConfig(config);

	let processor = remark()
		.use(remarkFrontmatter)
		.use(remarkParseFrontmatter)
		.use(createTocPlugin(config.toc))
		.use(remarkRehype)
		.use(rehypeSlug);

	processor = processor.use(rehypeAutolinkHeadings);
	processor = processor.use(createImagePlugin(config.images));

	if (config.highlight) {
		processor = processor.use(rehypeHighlight, config.highlight.hljs);
	} else {
		processor = processor.use(rehypeHighlight);
	}

	return processor.use(rehypeStringify).freeze();
};

function extractMetadata(html: string, originalContent: string, config: ProcessorConfig): ContentMetadata {
	const metadataConfig = config.metadata || {};
	const {
		wordCount: calculateWordCount = true,
		readingTime: calculateReadingTime = true,
		wordsPerMinute = 200
	} = metadataConfig;

	const textContent = html
		.replace(/<[^>]*>/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();

	const wordCount = calculateWordCount
		? textContent.split(/\s+/).filter((word) => word.length > 0).length
		: 0;

	const readingTime = calculateReadingTime ? Math.ceil(wordCount / wordsPerMinute) : 0;
	const characterCount = textContent.length;
	const headingMatches = originalContent.match(/^#{1,6}\s+/gm) || [];
	const headingCount = headingMatches.length;

	return {
		wordCount,
		readingTime,
		headingCount,
		characterCount
	};
}

function createProcessedContent(result: any, originalContent: string, config: ProcessorConfig): ProcessedContent {
	let html = String(result.value);
	const frontmatter = (result.data.frontmatter || {}) as Record<string, unknown>;
	const toc = (result.data.toc || []) as TocNode[];

	html = sanitizeHtml(html, config.sanitization || DEFAULT_SANITIZATION_CONFIG);

	const metadata = extractMetadata(html, originalContent, config);

	return {
		html,
		frontmatter,
		toc,
		metadata
	};
}

/**
 * Process markdown content asynchronously using remark and rehype
 */
export async function processRemarkRehype(markdownContent: string, config: ProcessorConfig = {}): Promise<ProcessedContent> {
	try {
		const processor = createRemarkRehypeProcessor(config);
		const result = await processor.process(markdownContent);
		return createProcessedContent(result, markdownContent, config);
	} catch (error) {
		throw new MarkdownProcessingError(
			'Failed to process markdown content asynchronously',
			error as Error,
			markdownContent.substring(0, 500) + (markdownContent.length > 500 ? '...' : '')
		);
	}
}

/**
 * Process markdown content synchronously using remark and rehype
 */
export function processRemarkRehypeSync(markdownContent: string, config: ProcessorConfig = {}): ProcessedContent {
	try {
		const processor = createRemarkRehypeProcessor(config);
		const result = processor.processSync(markdownContent);
		return createProcessedContent(result, markdownContent, config);
	} catch (error) {
		throw new MarkdownProcessingError(
			'Failed to process markdown content synchronously',
			error as Error,
			markdownContent.substring(0, 500) + (markdownContent.length > 500 ? '...' : '')
		);
	}
}

/**
 * Implementation of MarkdownProcessor using remark and rehype
 */
export class RemarkRehypeProcessor {
	private config: ProcessorConfig;

	constructor(config: ProcessorConfig = {}) {
		this.config = config;
	}

	async process(markdownContent: string): Promise<ProcessedContent> {
		return processRemarkRehype(markdownContent, this.config);
	}

	processSync(markdownContent: string): ProcessedContent {
		return processRemarkRehypeSync(markdownContent, this.config);
	}
}