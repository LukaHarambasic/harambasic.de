// Main processor implementation - backward compatibility with main branch
export { MarkdownProcessor } from './MarkdownProcessor.js';

// Core interfaces and types
export type { IMarkdownProcessor, ProcessedContent, ContentMetadata } from './MarkdownProcessor';
export { MarkdownProcessingError } from './MarkdownProcessor';

// Configuration types and defaults
export type { ProcessorConfig } from './ProcessorConfig';
export { DEFAULT_PROCESSOR_CONFIG } from './ProcessorConfig';

// Enhanced processor implementation
export { RemarkRehypeProcessor } from './RemarkRehypeProcessor';

// Plugin types and factories
export type { TocConfig } from './plugins/TocPlugin';
export { createTocPlugin } from './plugins/TocPlugin';

export type { ImageConfig } from './plugins/ImagePlugin';
export { createImagePlugin } from './plugins/ImagePlugin';

import { RemarkRehypeProcessor as RRP } from './RemarkRehypeProcessor';
import { DEFAULT_PROCESSOR_CONFIG } from './ProcessorConfig';
import type { ProcessorConfig as PC } from './ProcessorConfig';

/**
 * Creates a processor instance with default configuration
 */
export function createDefaultProcessor() {
	return new RRP(DEFAULT_PROCESSOR_CONFIG);
}

/**
 * Creates a processor instance with custom configuration
 */
export function createCustomProcessor(config: PC) {
	return new RRP(config);
}
