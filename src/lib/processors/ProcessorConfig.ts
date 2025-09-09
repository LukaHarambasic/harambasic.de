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

	/** Development-specific optimizations */
	development?: {
		/** Skip expensive operations in development mode */
		skipImageProcessing?: boolean;
		/** Use lighter syntax highlighting */
		lightSyntaxHighlighting?: boolean;
	};
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
			development: { ...baseConfig.development, ...overrides.development }
		};
	}
}
