/**
 * Functional cache manager with singleton state management.
 *
 * Provides a class-like API while using functional programming internally.
 * Maintains backward compatibility with the original class-based approach.
 */

import {
	createCacheState,
	getCacheEntry,
	setCacheEntry,
	clearCache,
	getCacheMetrics,
	cleanupCache
} from './ContentCacheManager';
import { getCacheConfig } from './CacheConfig';
import type { RawEntry } from '$lib/types/entry';
import type { EntryType } from '$lib/types/enums';

// Cache state type for the singleton
type CacheState = ReturnType<typeof createCacheState>;

let cacheStateInstance: CacheState | null = null;

/**
 * Get the singleton cache state instance.
 *
 * Creates the instance on first access with current configuration.
 * This ensures consistent caching behavior across the application.
 */
function getCacheState(): CacheState {
	if (!cacheStateInstance) {
		const config = getCacheConfig();
		cacheStateInstance = createCacheState(config);
	}
	return cacheStateInstance;
}

/**
 * Reset the cache state instance (primarily for testing).
 */
export function resetCacheState(): void {
	cacheStateInstance = null;
}

/**
 * Functional cache manager API that maintains singleton state internally.
 * Provides the same interface as the old class-based approach.
 */
export const cacheManager = {
	/**
	 * Get cached entry if valid, null otherwise.
	 */
	async get(entryType: EntryType, slug: string, filePath: string): Promise<RawEntry | null> {
		const state = getCacheState();
		const result = await getCacheEntry(state, entryType, slug, filePath);
		// Update singleton state
		cacheStateInstance = result.state;
		return result.entry;
	},

	/**
	 * Store entry in cache.
	 */
	async set(
		entryType: EntryType,
		slug: string,
		filePath: string,
		rawEntry: RawEntry
	): Promise<void> {
		const state = getCacheState();
		const newState = await setCacheEntry(state, entryType, slug, filePath, rawEntry);
		// Update singleton state
		cacheStateInstance = newState;
	},

	/**
	 * Get cache performance metrics.
	 */
	getMetrics() {
		const state = getCacheState();
		return getCacheMetrics(state);
	},

	/**
	 * Clear all cached entries.
	 */
	async clear(): Promise<void> {
		const state = getCacheState();
		const newState = await clearCache(state);
		// Update singleton state
		cacheStateInstance = newState;
	},

	/**
	 * Cleanup old cache entries based on TTL.
	 */
	async cleanup(): Promise<void> {
		const state = getCacheState();
		const newState = await cleanupCache(state);
		// Update singleton state
		cacheStateInstance = newState;
	}
};

/**
 * Get the functional cache manager instance.
 * Provides backward compatibility with the class-based API.
 */
export function getCacheManager() {
	return cacheManager;
}
