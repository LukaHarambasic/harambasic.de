/**
 * Configuration interface for content caching system.
 *
 * Defines cache behavior including TTL, size limits, and cleanup intervals.
 * Environment-based configuration ensures appropriate settings for development vs production.
 */

export interface CacheConfig {
	/** Whether caching is enabled */
	enabled: boolean;

	/** Directory path for cache storage */
	directory: string;

	/** Cache time-to-live in milliseconds */
	maxAge: number;

	/** Maximum cache size in megabytes */
	maxSize: number;

	/** Cleanup interval in milliseconds */
	cleanupInterval: number;

	/** Enable verbose logging for cache operations */
	verbose: boolean;
}

/**
 * Get cache configuration based on environment.
 *
 * Development: Caching enabled with shorter TTL for faster iteration
 * Production: Caching disabled to ensure fresh content in builds
 */
export function getCacheConfig(): CacheConfig {
	const isDev = process.env.NODE_ENV === 'development';

	return {
		enabled: isDev,
		directory: '.cache/content',
		maxAge: isDev ? 1000 * 60 * 60 : 0, // 1 hour in dev, disabled in prod
		maxSize: 100, // 100MB max cache size
		cleanupInterval: 1000 * 60 * 15, // 15 minutes cleanup interval
		verbose: isDev && process.env.CACHE_VERBOSE === 'true'
	};
}

/**
 * Default cache configuration for testing and initialization.
 */
export const DEFAULT_CACHE_CONFIG: CacheConfig = {
	enabled: true,
	directory: '.cache/content',
	maxAge: 1000 * 60 * 60,
	maxSize: 100,
	cleanupInterval: 1000 * 60 * 15,
	verbose: false
};
