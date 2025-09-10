import type { TocConfig } from './plugins/TocPlugin';
import type { ImageConfig } from './plugins/ImagePlugin';

/**
 * Configuration options for the markdown processor
 */
export interface ProcessorConfig {
	/** Table of contents generation configuration */
	toc?: TocConfig;

	/** Autolink headings configuration */
	autolink?: {
		/** Link behavior: wrap text, place before, or place after */
		behavior?: 'wrap' | 'before' | 'after';
		/** Additional properties for the link element */
		properties?: Record<string, unknown>;
	};

	/** Image processing configuration */
	images?: ImageConfig;

	/** Syntax highlighting configuration */
	highlight?: {
		/** Theme name for syntax highlighting */
		theme?: string;
		/** Languages to include (default: all) */
		languages?: string[];
		/** Additional highlight.js configuration */
		hljs?: Record<string, unknown>;
	};

	/** Metadata extraction configuration */
	metadata?: {
		/** Whether to calculate word count (default: true) */
		wordCount?: boolean;
		/** Whether to calculate reading time (default: true) */
		readingTime?: boolean;
		/** Words per minute for reading time calculation (default: 200) */
		wordsPerMinute?: number;
	};

	/** HTML sanitization configuration */
	sanitization?: {
		/** Whether to enable HTML sanitization (default: true for security) */
		enabled?: boolean;
		/** List of allowed HTML tags (default: common safe tags) */
		allowedTags?: string[];
		/** List of allowed HTML attributes (default: common safe attributes) */
		allowedAttributes?: string[];
		/** Whether to allow data attributes (default: false) */
		allowDataAttributes?: boolean;
	};
}

/**
 * Validates a processor configuration and throws errors for invalid settings
 * @param config Configuration to validate
 * @throws Error if configuration is invalid
 */
export function validateProcessorConfig(config: ProcessorConfig): void {
	// Validate TOC configuration
	if (config.toc) {
		const { maxDepth, minDepth } = config.toc;
		if (maxDepth !== undefined && minDepth !== undefined) {
			if (maxDepth < minDepth) {
				throw new Error(
					`TOC maxDepth (${maxDepth}) must be greater than or equal to minDepth (${minDepth})`
				);
			}
			if (minDepth < 1 || minDepth > 6) {
				throw new Error(`TOC minDepth must be between 1 and 6, got ${minDepth}`);
			}
			if (maxDepth < 1 || maxDepth > 6) {
				throw new Error(`TOC maxDepth must be between 1 and 6, got ${maxDepth}`);
			}
		}
	}

	// Validate image configuration
	if (config.images) {
		const { quality, formats } = config.images;
		if (quality !== undefined && (quality < 1 || quality > 100)) {
			throw new Error(`Image quality must be between 1 and 100, got ${quality}`);
		}
		if (formats && formats.length === 0) {
			throw new Error('Image formats array cannot be empty');
		}
	}

	// Validate metadata configuration
	if (config.metadata) {
		const { wordsPerMinute } = config.metadata;
		if (wordsPerMinute !== undefined && wordsPerMinute <= 0) {
			throw new Error(`Words per minute must be positive, got ${wordsPerMinute}`);
		}
	}

	// Validate sanitization configuration
	if (config.sanitization) {
		const { allowedTags, allowedAttributes } = config.sanitization;
		if (allowedTags && allowedTags.some((tag) => !tag.trim())) {
			throw new Error('Allowed tags cannot contain empty or whitespace-only strings');
		}
		if (allowedAttributes && allowedAttributes.some((attr) => !attr.trim())) {
			throw new Error('Allowed attributes cannot contain empty or whitespace-only strings');
		}
	}
}

/**
 * Default processor configuration for all environments
 * Balanced settings suitable for both development and production
 */
export const DEFAULT_PROCESSOR_CONFIG: ProcessorConfig = {
	toc: {
		maxDepth: 6,
		minDepth: 1,
		includeParents: true
	},
	autolink: {
		behavior: 'after',
		properties: {
			className: ['heading-link'],
			'aria-label': 'Link to section'
		}
	},
	images: {
		enhance: true,
		responsive: true,
		quality: 85,
		formats: ['webp', 'avif', 'jpeg']
	},
	highlight: {
		theme: 'github-light'
	},
	metadata: {
		wordCount: true,
		readingTime: true,
		wordsPerMinute: 200
	},
	sanitization: {
		enabled: true,
		allowedTags: [
			'p',
			'br',
			'strong',
			'em',
			'code',
			'pre',
			'h1',
			'h2',
			'h3',
			'h4',
			'h5',
			'h6',
			'ul',
			'ol',
			'li',
			'a',
			'blockquote',
			'img',
			'table',
			'tr',
			'td',
			'th',
			'thead',
			'tbody'
		],
		allowedAttributes: [
			'href',
			'title',
			'alt',
			'class',
			'id',
			'aria-label',
			'src',
			'width',
			'height'
		],
		allowDataAttributes: true
	}
};
