import type { RawEntry } from '$lib/types/entry';
import type { EntryType } from '$lib/types/enums';

/**
 * Represents a single cached content entry with validation metadata.
 *
 * Contains both the cached content and metadata needed for cache invalidation
 * including file modification time, content hash, and processor configuration hash.
 */
export interface ContentCacheEntry {
	// Cache metadata
	/** Unique identifier for the cached entry */
	slug: string;

	/** Type of content (post, project, uses, shareable) */
	entryType: EntryType;

	/** File modification time when cached */
	lastModified: Date;

	/** When this entry was cached */
	cacheTime: Date;

	/** Full file path of the cached content */
	filePath: string;

	// Cached content
	/** The processed content entry */
	rawEntry: RawEntry;

	// Cache validation
	/** Hash of file content for change detection */
	fileHash: string;

	/** Hash of processor configuration for invalidation when processing changes */
	dependenciesHash: string;
}

/**
 * Represents the entire content cache with metadata.
 *
 * Contains all cached entries plus cache-wide metadata for management
 * and cleanup operations.
 */
export interface ContentCache {
	/** Map of cache keys to cached entries */
	entries: Record<string, ContentCacheEntry>;

	/** Cache-wide metadata */
	metadata: {
		/** Cache format version for migration purposes */
		version: string;

		/** Last time cache cleanup was performed */
		lastCleanup: Date;

		/** Total number of cached entries */
		totalEntries: number;

		/** Approximate cache size in bytes */
		totalSize: number;

		/** When the cache was last updated */
		lastUpdate: Date;
	};
}

/**
 * Result of cache validation check.
 *
 * Indicates whether a cache entry is still valid and provides
 * detailed reason for invalidation if needed.
 */
export interface CacheValidationResult {
	/** Whether the cache entry is valid */
	valid: boolean;

	/** Reason for invalidation if invalid */
	reason?:
		| 'file_changed'
		| 'expired'
		| 'processor_changed'
		| 'dependencies_changed'
		| 'missing_file';

	/** Additional context for debugging */
	details?: {
		lastModified?: Date;
		currentModified?: Date;
		cacheAge?: number;
		maxAge?: number;
	};
}

/**
 * Cache performance metrics for monitoring and optimization.
 */
export interface CacheMetrics {
	/** Number of cache hits */
	hits: number;

	/** Number of cache misses */
	misses: number;

	/** Cache hit rate as percentage */
	hitRate: number;

	/** Average time to process content (ms) */
	averageProcessingTime: number;

	/** Current cache size in MB */
	cacheSizeMB: number;

	/** Total number of cached entries */
	totalEntries: number;

	/** Number of cache invalidations */
	invalidations: number;
}

/**
 * Generate a consistent cache key for content entries.
 */
export function generateCacheKey(entryType: EntryType, slug: string): string {
	return `${entryType}:${slug}`;
}

/**
 * Parse a cache key back into entry type and slug.
 */
export function parseCacheKey(key: string): { entryType: EntryType; slug: string } {
	const [entryType, slug] = key.split(':', 2);
	return { entryType: entryType as EntryType, slug };
}
