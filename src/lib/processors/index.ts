// Core interfaces and types
export type { MarkdownProcessor, ProcessedContent, ContentMetadata } from './MarkdownProcessor';
export { MarkdownProcessingError } from './MarkdownProcessor';

// Configuration types and builders
export type { ProcessorConfig } from './ProcessorConfig';
export { ProcessorConfigBuilder } from './ProcessorConfig';

// Main processor implementation
export { RemarkRehypeProcessor } from './RemarkRehypeProcessor';

// Plugin types and factories
export type { TocConfig } from './plugins/TocPlugin';
export { createTocPlugin } from './plugins/TocPlugin';

export type { ImageConfig } from './plugins/ImagePlugin';
export { createImagePlugin } from './plugins/ImagePlugin';

import { RemarkRehypeProcessor as RRP } from './RemarkRehypeProcessor';
import { ProcessorConfigBuilder as PCB } from './ProcessorConfig';
import type { ProcessorConfig as PC } from './ProcessorConfig';

/**
 * Creates a default processor instance for development
 */
export function createDevelopmentProcessor() {
	return new RRP(PCB.development());
}

/**
 * Creates a default processor instance for production
 */
export function createProductionProcessor() {
	return new RRP(PCB.production());
}

/**
 * Creates a processor instance with custom configuration
 */
export function createCustomProcessor(config: PC) {
	return new RRP(config);
}
