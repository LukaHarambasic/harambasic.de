/**
 * Content caching module exports.
 *
 * Provides a centralized caching system for content processing
 * to improve development build performance and enable incremental builds.
 */

export { ContentCacheManager } from './ContentCacheManager';
export type {
	ContentCacheEntry,
	ContentCache,
	CacheValidationResult,
	CacheMetrics
} from './CacheEntry';
export { generateCacheKey, parseCacheKey } from './CacheEntry';
export type { CacheConfig } from './CacheConfig';
export { getCacheConfig, DEFAULT_CACHE_CONFIG } from './CacheConfig';

// Create singleton cache manager instance
import { ContentCacheManager } from './ContentCacheManager';
import { getCacheConfig } from './CacheConfig';

let cacheManagerInstance: ContentCacheManager | null = null;

/**
 * Get the singleton cache manager instance.
 *
 * Creates the instance on first access with current configuration.
 * This ensures consistent caching behavior across the application.
 */
export function getCacheManager(): ContentCacheManager {
	if (!cacheManagerInstance) {
		const config = getCacheConfig();
		cacheManagerInstance = new ContentCacheManager(config);
	}
	return cacheManagerInstance;
}

/**
 * Reset the cache manager instance (primarily for testing).
 */
export function resetCacheManager(): void {
	cacheManagerInstance = null;
}
