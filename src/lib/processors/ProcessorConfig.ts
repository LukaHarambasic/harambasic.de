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

	/** Development-specific optimizations */
	development?: {
		/** Skip expensive operations in development mode */
		skipImageProcessing?: boolean;
		/** Use lighter syntax highlighting */
		lightSyntaxHighlighting?: boolean;
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
 * Factory class for creating processor configurations
 */
export class ProcessorConfigBuilder {
	/**
	 * Creates a configuration optimized for development
	 * Fast processing with minimal features for development speed
	 */
	static development(): ProcessorConfig {
		return {
			toc: {
				maxDepth: 4,
				minDepth: 1
			},
			autolink: {
				behavior: 'after',
				properties: {
					className: ['heading-link'],
					'aria-label': 'Link to section'
				}
			},
			images: {
				enhance: false,
				responsive: false
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
					'blockquote'
				],
				allowedAttributes: ['href', 'title', 'alt', 'class', 'id', 'aria-label'],
				allowDataAttributes: false
			},
			development: {
				skipImageProcessing: true,
				lightSyntaxHighlighting: true
			}
		};
	}

	/**
	 * Creates a configuration optimized for production
	 * Full feature set with all optimizations enabled
	 */
	static production(): ProcessorConfig {
		return {
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
	}

	/**
	 * Creates a minimal configuration for testing
	 * Basic processing without expensive operations
	 */
	static testing(): ProcessorConfig {
		return {
			toc: {
				maxDepth: 3,
				minDepth: 1
			},
			autolink: {
				behavior: 'after'
			},
			images: {
				enhance: false
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
				allowedTags: ['p', 'br', 'strong', 'em', 'code', 'h1', 'h2', 'h3'],
				allowedAttributes: ['class', 'id'],
				allowDataAttributes: false
			}
		};
	}

	/**
	 * Creates a custom configuration by merging with defaults
	 *
	 * @param baseConfig Base configuration to start with
	 * @param overrides Configuration overrides
	 * @returns Merged configuration
	 */
	static custom(baseConfig: ProcessorConfig, overrides: Partial<ProcessorConfig>): ProcessorConfig {
		return {
			...baseConfig,
			...overrides,
			// Deep merge nested objects
			toc: { ...baseConfig.toc, ...overrides.toc },
			autolink: { ...baseConfig.autolink, ...overrides.autolink },
			images: { ...baseConfig.images, ...overrides.images },
			highlight: { ...baseConfig.highlight, ...overrides.highlight },
			metadata: { ...baseConfig.metadata, ...overrides.metadata },
			sanitization: { ...baseConfig.sanitization, ...overrides.sanitization },
			development: { ...baseConfig.development, ...overrides.development }
		};
	}
}
