import * as fs from 'fs/promises';
import * as path from 'path';
import type { RawEntry } from '$lib/types/entry';
import type { EntryType } from '$lib/types/enums';
import type { CacheConfig } from './CacheConfig';
import type {
	ContentCacheEntry,
	ContentCache,
	CacheValidationResult,
	CacheMetrics
} from './CacheEntry';
import { generateCacheKey } from './CacheEntry';
import {
	getFileHash,
	getProcessorHash,
	getFileModificationTime,
	fileExists
} from '$lib/utils/fileHash';

/**
 * Content cache state type for functional programming approach.
 */
type CacheState = {
	cache: Map<string, ContentCacheEntry>;
	cacheFile: string;
	config: CacheConfig;
	metrics: CacheMetrics;
	processorHash: string | null;
	isLoaded: boolean;
};

/**
 * Create initial cache state.
 */
function createCacheState(config: CacheConfig): CacheState {
	return {
		cache: new Map<string, ContentCacheEntry>(),
		cacheFile: path.join(config.directory, 'content-cache.json'),
		config,
		metrics: initializeMetrics(),
		processorHash: null,
		isLoaded: false
	};
}

/**
 * Initialize cache metrics.
 */
function initializeMetrics(): CacheMetrics {
	return {
		hits: 0,
		misses: 0,
		hitRate: 0,
		averageProcessingTime: 0,
		cacheSizeMB: 0,
		totalEntries: 0,
		invalidations: 0
	};
}

/**
 * Load cache from disk if it exists.
 */
async function loadCache(state: CacheState): Promise<CacheState> {
	if (state.isLoaded || !state.config.enabled) {
		return state;
	}

	try {
		await fs.mkdir(path.dirname(state.cacheFile), { recursive: true });

		if (await fileExists(state.cacheFile)) {
			const cacheData = await fs.readFile(state.cacheFile, 'utf-8');
			const parsed: ContentCache = JSON.parse(cacheData);

			// Convert date strings back to Date objects
			for (const [key, entry] of Object.entries(parsed.entries)) {
				entry.lastModified = new Date(entry.lastModified);
				entry.cacheTime = new Date(entry.cacheTime);
				state.cache.set(key, entry);
			}

			logMessage(state.config, `Loaded ${state.cache.size} entries from cache`);
		}
	} catch (error) {
		logMessage(
			state.config,
			`Failed to load cache: ${error instanceof Error ? error.message : 'unknown error'}`
		);
		// Continue with empty cache on load failure
	}

	return { ...state, isLoaded: true };
}

/**
 * Get cached entry if valid, null otherwise.
 */
export async function getCacheEntry(
	state: CacheState,
	entryType: EntryType,
	slug: string,
	filePath: string
): Promise<{ state: CacheState; entry: RawEntry | null }> {
	if (!state.config.enabled) {
		return { state, entry: null };
	}

	const updatedState = await loadCache(state);

	const cacheKey = generateCacheKey(entryType, slug);
	const entry = updatedState.cache.get(cacheKey);

	if (!entry) {
		const newState = recordMiss(updatedState);
		return { state: newState, entry: null };
	}

	const validation = await validateEntry(entry, filePath, updatedState.config);
	if (!validation.valid) {
		updatedState.cache.delete(cacheKey);
		const invalidatedState = {
			...updatedState,
			metrics: { ...updatedState.metrics, invalidations: updatedState.metrics.invalidations + 1 }
		};
		logMessage(invalidatedState.config, `Cache invalidated for ${cacheKey}: ${validation.reason}`);
		const newState = recordMiss(invalidatedState);
		return { state: newState, entry: null };
	}

	const hitState = recordHit(updatedState);
	logMessage(hitState.config, `Cache hit for ${cacheKey}`);
	return { state: hitState, entry: entry.rawEntry };
}

/**
 * Store entry in cache.
 */
export async function setCacheEntry(
	state: CacheState,
	entryType: EntryType,
	slug: string,
	filePath: string,
	rawEntry: RawEntry
): Promise<CacheState> {
	if (!state.config.enabled) {
		return state;
	}

	const updatedState = await loadCache(state);

	const cacheKey = generateCacheKey(entryType, slug);
	const fileModTime = await getFileModificationTime(filePath);
	const fileHash = await getFileHash(filePath);
	const processorHash = await getCachedProcessorHash(updatedState);

	if (!fileModTime) {
		logMessage(updatedState.config, `Cannot cache ${cacheKey}: file not found`);
		return updatedState;
	}

	const cacheEntry: ContentCacheEntry = {
		slug,
		entryType,
		lastModified: fileModTime,
		cacheTime: new Date(),
		filePath,
		rawEntry,
		fileHash,
		dependenciesHash: processorHash
	};

	updatedState.cache.set(cacheKey, cacheEntry);
	logMessage(updatedState.config, `Cached ${cacheKey}`);

	// Persist cache after adding entry
	await persistCache(updatedState);
	return updatedState;
}

/**
 * Validate if cache entry is still valid.
 */
async function validateEntry(
	entry: ContentCacheEntry,
	filePath: string,
	config: CacheConfig
): Promise<CacheValidationResult> {
	// Check if file still exists
	const fileModTime = await getFileModificationTime(filePath);
	if (!fileModTime) {
		return {
			valid: false,
			reason: 'missing_file'
		};
	}

	// Check if file was modified
	if (fileModTime.getTime() > entry.lastModified.getTime()) {
		return {
			valid: false,
			reason: 'file_changed',
			details: {
				lastModified: entry.lastModified,
				currentModified: fileModTime
			}
		};
	}

	// Check cache age
	const cacheAge = Date.now() - entry.cacheTime.getTime();
	if (cacheAge > config.maxAge) {
		return {
			valid: false,
			reason: 'expired',
			details: {
				cacheAge,
				maxAge: config.maxAge
			}
		};
	}

	// Check processor configuration
	const currentProcessorHash = await getProcessorHash();
	if (entry.dependenciesHash !== currentProcessorHash) {
		return {
			valid: false,
			reason: 'processor_changed'
		};
	}

	return { valid: true };
}

/**
 * Get processor hash, caching the result.
 */
async function getCachedProcessorHash(state: CacheState): Promise<string> {
	if (!state.processorHash) {
		state.processorHash = await getProcessorHash();
	}
	return state.processorHash;
}

/**
 * Persist cache to disk.
 */
async function persistCache(state: CacheState): Promise<void> {
	if (!state.config.enabled) {
		return;
	}

	try {
		const cacheData: ContentCache = {
			entries: Object.fromEntries(state.cache),
			metadata: {
				version: '1.0.0',
				lastCleanup: new Date(),
				totalEntries: state.cache.size,
				totalSize: calculateCacheSize(state.cache),
				lastUpdate: new Date()
			}
		};

		await fs.writeFile(state.cacheFile, JSON.stringify(cacheData, null, 2), 'utf-8');
	} catch (error) {
		logMessage(
			state.config,
			`Failed to persist cache: ${error instanceof Error ? error.message : 'unknown error'}`
		);
	}
}

/**
 * Calculate approximate cache size in bytes.
 */
function calculateCacheSize(cache: Map<string, ContentCacheEntry>): number {
	let size = 0;
	for (const entry of cache.values()) {
		// Rough calculation: JSON.stringify the entry
		size += JSON.stringify(entry).length * 2; // *2 for UTF-16 encoding
	}
	return size;
}

/**
 * Clear all cached entries.
 */
export async function clearCache(state: CacheState): Promise<CacheState> {
	state.cache.clear();
	const clearedState = {
		...state,
		metrics: initializeMetrics()
	};

	try {
		if (await fileExists(state.cacheFile)) {
			await fs.unlink(state.cacheFile);
		}
	} catch (error) {
		logMessage(
			clearedState.config,
			`Failed to clear cache file: ${error instanceof Error ? error.message : 'unknown error'}`
		);
	}

	logMessage(clearedState.config, 'Cache cleared');
	return clearedState;
}

/**
 * Get cache performance metrics.
 */
export function getCacheMetrics(state: CacheState): CacheMetrics {
	const totalRequests = state.metrics.hits + state.metrics.misses;
	return {
		...state.metrics,
		hitRate: totalRequests > 0 ? (state.metrics.hits / totalRequests) * 100 : 0,
		cacheSizeMB: calculateCacheSize(state.cache) / (1024 * 1024),
		totalEntries: state.cache.size
	};
}

/**
 * Record cache hit for metrics.
 */
function recordHit(state: CacheState): CacheState {
	return {
		...state,
		metrics: { ...state.metrics, hits: state.metrics.hits + 1 }
	};
}

/**
 * Record cache miss for metrics.
 */
function recordMiss(state: CacheState): CacheState {
	return {
		...state,
		metrics: { ...state.metrics, misses: state.metrics.misses + 1 }
	};
}

/**
 * Log message if verbose logging is enabled.
 */
function logMessage(config: CacheConfig, message: string): void {
	if (config.verbose) {
		console.log(`[ContentCache] ${message}`);
	}
}

/**
 * Cleanup old cache entries based on TTL.
 */
export async function cleanupCache(state: CacheState): Promise<CacheState> {
	if (!state.config.enabled) {
		return state;
	}

	const updatedState = await loadCache(state);

	const now = Date.now();
	let removed = 0;

	for (const [key, entry] of updatedState.cache.entries()) {
		const age = now - entry.cacheTime.getTime();
		if (age > updatedState.config.maxAge) {
			updatedState.cache.delete(key);
			removed++;
		}
	}

	if (removed > 0) {
		logMessage(updatedState.config, `Cleaned up ${removed} expired cache entries`);
		await persistCache(updatedState);
	}

	return updatedState;
}

/**
 * Main export: create a new cache state instance.
 */
export { createCacheState };
