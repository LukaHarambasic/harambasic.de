import type { RawEntry } from '$lib/types/entry';
import type { ContentStatus } from '$lib/types/enums';

/**
 * Base repository interface for content operations
 * Provides standardized data access patterns for all content types
 */
export interface ContentRepository<T extends RawEntry = RawEntry> {
	// Query operations
	findAll(): Promise<T[]>;
	findBySlug(slug: string): Promise<T | null>;
	findByTag(tag: string): Promise<T[]>;
	findByStatus(status: ContentStatus): Promise<T[]>;

	// Metadata operations
	exists(slug: string): Promise<boolean>;
	getLastModified(slug: string): Promise<Date>;

	// Bulk operations
	findMany(slugs: string[]): Promise<T[]>;
	count(): Promise<number>;
}

/**
 * Error class for repository operations
 */
export class ContentRepositoryError extends Error {
	constructor(
		message: string,
		public entryType: string,
		public slug?: string,
		public cause?: Error
	) {
		super(message);
		this.name = 'ContentRepositoryError';
	}
}
