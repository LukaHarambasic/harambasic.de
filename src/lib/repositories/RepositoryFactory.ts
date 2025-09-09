import { FileSystemContentService } from '$lib/services/FileSystemContentService';
import type { ContentService } from '$lib/services/ContentService';
import type { PostRepository } from './PostRepository';
import type { ProjectRepository } from './ProjectRepository';
import type { UsesRepository } from './UsesRepository';
import type { ShareableRepository } from './ShareableRepository';
import { FileSystemPostRepository } from './impl/FileSystemPostRepository';
import { FileSystemProjectRepository } from './impl/FileSystemProjectRepository';
import { FileSystemUsesRepository } from './impl/FileSystemUsesRepository';
import { FileSystemShareableRepository } from './impl/FileSystemShareableRepository';

/**
 * Factory for creating repository instances
 * Handles dependency injection and repository configuration
 */
export class RepositoryFactory {
	private static contentService: ContentService | null = null;

	/**
	 * Get or create a singleton ContentService instance
	 */
	static getContentService(): ContentService {
		if (!this.contentService) {
			this.contentService = new FileSystemContentService();
		}
		return this.contentService;
	}

	/**
	 * Create a PostRepository instance
	 */
	static createPostRepository(contentService?: ContentService): PostRepository {
		const service = contentService || this.getContentService();
		return new FileSystemPostRepository(service);
	}

	/**
	 * Create a ProjectRepository instance
	 */
	static createProjectRepository(contentService?: ContentService): ProjectRepository {
		const service = contentService || this.getContentService();
		return new FileSystemProjectRepository(service);
	}

	/**
	 * Create a UsesRepository instance
	 */
	static createUsesRepository(contentService?: ContentService): UsesRepository {
		const service = contentService || this.getContentService();
		return new FileSystemUsesRepository(service);
	}

	/**
	 * Create a ShareableRepository instance
	 */
	static createShareableRepository(contentService?: ContentService): ShareableRepository {
		const service = contentService || this.getContentService();
		return new FileSystemShareableRepository(service);
	}

	/**
	 * Clear the singleton ContentService instance (useful for testing)
	 */
	static resetContentService(): void {
		this.contentService = null;
	}
}
