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
 * Manages content caching with file-based persistence and validation.
 *
 * Provides a caching layer for content processing that:
 * - Stores processed content in memory and persists to disk
 * - Validates cache entries based on file modification and processor changes
 * - Manages cache size and cleanup
 * - Provides performance metrics
 */
export class ContentCacheManager {
	private cache = new Map<string, ContentCacheEntry>();
	private cacheFile: string;
	private config: CacheConfig;
	private metrics: CacheMetrics;
	private processorHash: string | null = null;
	private isLoaded = false;

	constructor(config: CacheConfig) {
		this.config = config;
		this.cacheFile = path.join(config.directory, 'content-cache.json');
		this.metrics = this.initializeMetrics();
	}

	/**
	 * Initialize cache metrics.
	 */
	private initializeMetrics(): CacheMetrics {
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
	private async loadCache(): Promise<void> {
		if (this.isLoaded || !this.config.enabled) {
			return;
		}

		try {
			await fs.mkdir(path.dirname(this.cacheFile), { recursive: true });

			if (await fileExists(this.cacheFile)) {
				const cacheData = await fs.readFile(this.cacheFile, 'utf-8');
				const parsed: ContentCache = JSON.parse(cacheData);

				// Convert date strings back to Date objects
				for (const [key, entry] of Object.entries(parsed.entries)) {
					entry.lastModified = new Date(entry.lastModified);
					entry.cacheTime = new Date(entry.cacheTime);
					this.cache.set(key, entry);
				}

				this.log(`Loaded ${this.cache.size} entries from cache`);
			}
		} catch (error) {
			this.log(`Failed to load cache: ${error instanceof Error ? error.message : 'unknown error'}`);
			// Continue with empty cache on load failure
		}

		this.isLoaded = true;
	}

	/**
	 * Get cached entry if valid, null otherwise.
	 */
	async get(entryType: EntryType, slug: string, filePath: string): Promise<RawEntry | null> {
		if (!this.config.enabled) {
			return null;
		}

		await this.loadCache();

		const cacheKey = generateCacheKey(entryType, slug);
		const entry = this.cache.get(cacheKey);

		if (!entry) {
			this.recordMiss();
			return null;
		}

		const validation = await this.validateEntry(entry, filePath);
		if (!validation.valid) {
			this.cache.delete(cacheKey);
			this.metrics.invalidations++;
			this.log(`Cache invalidated for ${cacheKey}: ${validation.reason}`);
			this.recordMiss();
			return null;
		}

		this.recordHit();
		this.log(`Cache hit for ${cacheKey}`);
		return entry.rawEntry;
	}

	/**
	 * Store entry in cache.
	 */
	async set(
		entryType: EntryType,
		slug: string,
		filePath: string,
		rawEntry: RawEntry
	): Promise<void> {
		if (!this.config.enabled) {
			return;
		}

		await this.loadCache();

		const cacheKey = generateCacheKey(entryType, slug);
		const fileModTime = await getFileModificationTime(filePath);
		const fileHash = await getFileHash(filePath);
		const processorHash = await this.getProcessorHash();

		if (!fileModTime) {
			this.log(`Cannot cache ${cacheKey}: file not found`);
			return;
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

		this.cache.set(cacheKey, cacheEntry);
		this.log(`Cached ${cacheKey}`);

		// Persist cache after adding entry
		await this.persistCache();
	}

	/**
	 * Validate if cache entry is still valid.
	 */
	private async validateEntry(
		entry: ContentCacheEntry,
		filePath: string
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
		if (cacheAge > this.config.maxAge) {
			return {
				valid: false,
				reason: 'expired',
				details: {
					cacheAge,
					maxAge: this.config.maxAge
				}
			};
		}

		// Check processor configuration
		const currentProcessorHash = await this.getProcessorHash();
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
	private async getProcessorHash(): Promise<string> {
		if (!this.processorHash) {
			this.processorHash = await getProcessorHash();
		}
		return this.processorHash;
	}

	/**
	 * Persist cache to disk.
	 */
	private async persistCache(): Promise<void> {
		if (!this.config.enabled) {
			return;
		}

		try {
			const cacheData: ContentCache = {
				entries: Object.fromEntries(this.cache),
				metadata: {
					version: '1.0.0',
					lastCleanup: new Date(),
					totalEntries: this.cache.size,
					totalSize: this.calculateCacheSize(),
					lastUpdate: new Date()
				}
			};

			await fs.writeFile(this.cacheFile, JSON.stringify(cacheData, null, 2), 'utf-8');
		} catch (error) {
			this.log(
				`Failed to persist cache: ${error instanceof Error ? error.message : 'unknown error'}`
			);
		}
	}

	/**
	 * Calculate approximate cache size in bytes.
	 */
	private calculateCacheSize(): number {
		let size = 0;
		for (const entry of this.cache.values()) {
			// Rough calculation: JSON.stringify the entry
			size += JSON.stringify(entry).length * 2; // *2 for UTF-16 encoding
		}
		return size;
	}

	/**
	 * Clear all cached entries.
	 */
	async clear(): Promise<void> {
		this.cache.clear();
		this.metrics = this.initializeMetrics();

		try {
			if (await fileExists(this.cacheFile)) {
				await fs.unlink(this.cacheFile);
			}
		} catch (error) {
			this.log(
				`Failed to clear cache file: ${error instanceof Error ? error.message : 'unknown error'}`
			);
		}

		this.log('Cache cleared');
	}

	/**
	 * Get cache performance metrics.
	 */
	getMetrics(): CacheMetrics {
		const totalRequests = this.metrics.hits + this.metrics.misses;
		return {
			...this.metrics,
			hitRate: totalRequests > 0 ? (this.metrics.hits / totalRequests) * 100 : 0,
			cacheSizeMB: this.calculateCacheSize() / (1024 * 1024),
			totalEntries: this.cache.size
		};
	}

	/**
	 * Record cache hit for metrics.
	 */
	private recordHit(): void {
		this.metrics.hits++;
	}

	/**
	 * Record cache miss for metrics.
	 */
	private recordMiss(): void {
		this.metrics.misses++;
	}

	/**
	 * Log message if verbose logging is enabled.
	 */
	private log(message: string): void {
		if (this.config.verbose) {
			console.log(`[ContentCache] ${message}`);
		}
	}

	/**
	 * Cleanup old cache entries based on TTL.
	 */
	async cleanup(): Promise<void> {
		if (!this.config.enabled) {
			return;
		}

		await this.loadCache();

		const now = Date.now();
		let removed = 0;

		for (const [key, entry] of this.cache.entries()) {
			const age = now - entry.cacheTime.getTime();
			if (age > this.config.maxAge) {
				this.cache.delete(key);
				removed++;
			}
		}

		if (removed > 0) {
			this.log(`Cleaned up ${removed} expired cache entries`);
			await this.persistCache();
		}
	}
}
