import { FileSystemContentService } from './FileSystemContentService.js';
import { MarkdownProcessor } from '$lib/processors';
import type { ContentService } from './ContentService.js';

/**
 * Singleton service instance for content operations.
 * Uses filesystem-based implementation by default.
 */
let contentServiceInstance: ContentService | null = null;

/**
 * Get the shared content service instance
 */
export function getContentService(): ContentService {
	if (!contentServiceInstance) {
		contentServiceInstance = new FileSystemContentService(
			undefined, // Use default content root
			new MarkdownProcessor()
		);
	}
	return contentServiceInstance;
}

/**
 * Set a custom content service instance (useful for testing)
 */
export function setContentService(service: ContentService): void {
	contentServiceInstance = service;
}

/**
 * Reset the service instance (useful for testing)
 */
export function resetContentService(): void {
	contentServiceInstance = null;
}
