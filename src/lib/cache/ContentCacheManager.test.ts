import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';
import { ContentCacheManager } from './ContentCacheManager';
import type { CacheConfig } from './CacheConfig';
import type { RawEntry } from '$lib/types/entry';

describe('ContentCacheManager', () => {
	let cacheManager: ContentCacheManager;
	let tempDir: string;
	let config: CacheConfig;
	let mockRawEntry: RawEntry;

	beforeEach(async () => {
		// Create temporary directory for testing
		tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'cache-test-'));

		config = {
			enabled: true,
			directory: tempDir,
			maxAge: 1000 * 60, // 1 minute for testing
			maxSize: 10, // 10MB
			cleanupInterval: 1000 * 30, // 30 seconds
			verbose: false
		};

		cacheManager = new ContentCacheManager(config);

		mockRawEntry = {
			html: '<h1>Test Post</h1><p>Test content</p>',
			toc: [{ value: 'Test Post', depth: 1, slug: 'test-post', children: [] }],
			title: 'Test Post',
			description: 'Test description',
			image: '/images/test.jpg',
			tags: ['test', 'cache'],
			published: '2024-01-01',
			updated: '2024-01-01'
		};
	});

	afterEach(async () => {
		// Clean up temporary directory
		try {
			await fs.rm(tempDir, { recursive: true, force: true });
		} catch {
			// Ignore cleanup errors
		}
	});

	describe('Basic Cache Operations', () => {
		it('should return null for cache miss', async () => {
			const filePath = path.join(tempDir, 'test.md');
			await fs.writeFile(filePath, '# Test');

			const result = await cacheManager.get('post', 'test', filePath);
			expect(result).toBeNull();
		});

		it('should cache and retrieve entries', async () => {
			const filePath = path.join(tempDir, 'test.md');
			await fs.writeFile(filePath, '# Test');

			await cacheManager.set('post', 'test', filePath, mockRawEntry);
			const retrieved = await cacheManager.get('post', 'test', filePath);

			expect(retrieved).toEqual(mockRawEntry);
		});

		it('should handle multiple entry types', async () => {
			const postPath = path.join(tempDir, 'test-post.md');
			const projectPath = path.join(tempDir, 'test-project.md');

			await fs.writeFile(postPath, '# Test Post');
			await fs.writeFile(projectPath, '# Test Project');

			await cacheManager.set('post', 'test-post', postPath, mockRawEntry);
			await cacheManager.set('project', 'test-project', projectPath, mockRawEntry);

			const postEntry = await cacheManager.get('post', 'test-post', postPath);
			const projectEntry = await cacheManager.get('project', 'test-project', projectPath);

			expect(postEntry).toEqual(mockRawEntry);
			expect(projectEntry).toEqual(mockRawEntry);
		});
	});

	describe('Cache Invalidation', () => {
		it('should invalidate cache when file is modified', async () => {
			const filePath = path.join(tempDir, 'test.md');
			await fs.writeFile(filePath, '# Test');

			// Cache the entry
			await cacheManager.set('post', 'test', filePath, mockRawEntry);

			// Verify it's cached
			let result = await cacheManager.get('post', 'test', filePath);
			expect(result).toEqual(mockRawEntry);

			// Wait a bit to ensure different mtime
			await new Promise((resolve) => setTimeout(resolve, 10));

			// Modify the file
			await fs.writeFile(filePath, '# Modified Test');

			// Should return null (cache invalidated)
			result = await cacheManager.get('post', 'test', filePath);
			expect(result).toBeNull();
		});

		it('should invalidate cache when file is deleted', async () => {
			const filePath = path.join(tempDir, 'test.md');
			await fs.writeFile(filePath, '# Test');

			await cacheManager.set('post', 'test', filePath, mockRawEntry);

			// Verify it's cached
			let result = await cacheManager.get('post', 'test', filePath);
			expect(result).toEqual(mockRawEntry);

			// Delete the file
			await fs.unlink(filePath);

			// Should return null (file missing)
			result = await cacheManager.get('post', 'test', filePath);
			expect(result).toBeNull();
		});

		it('should invalidate cache when entry expires', async () => {
			// Create cache manager with very short TTL
			const shortTtlConfig = { ...config, maxAge: 50 }; // 50ms
			const shortTtlManager = new ContentCacheManager(shortTtlConfig);

			const filePath = path.join(tempDir, 'test.md');
			await fs.writeFile(filePath, '# Test');

			await shortTtlManager.set('post', 'test', filePath, mockRawEntry);

			// Should be cached initially
			let result = await shortTtlManager.get('post', 'test', filePath);
			expect(result).toEqual(mockRawEntry);

			// Wait for expiration
			await new Promise((resolve) => setTimeout(resolve, 100));

			// Should be expired
			result = await shortTtlManager.get('post', 'test', filePath);
			expect(result).toBeNull();
		});
	});

	describe('Persistence', () => {
		it('should persist cache to disk and reload', async () => {
			const filePath = path.join(tempDir, 'test.md');
			await fs.writeFile(filePath, '# Test');

			// Cache entry
			await cacheManager.set('post', 'test', filePath, mockRawEntry);

			// Create new cache manager with same directory
			const newCacheManager = new ContentCacheManager(config);

			// Should load from disk
			const result = await newCacheManager.get('post', 'test', filePath);
			expect(result).toEqual(mockRawEntry);
		});

		it('should handle corrupted cache file gracefully', async () => {
			const cacheFile = path.join(tempDir, 'content-cache.json');

			// Write corrupted JSON
			await fs.writeFile(cacheFile, '{ invalid json }');

			// Should not throw and should work normally
			const filePath = path.join(tempDir, 'test.md');
			await fs.writeFile(filePath, '# Test');

			const result = await cacheManager.get('post', 'test', filePath);
			expect(result).toBeNull();

			// Should be able to cache new entries
			await cacheManager.set('post', 'test', filePath, mockRawEntry);
			const cached = await cacheManager.get('post', 'test', filePath);
			expect(cached).toEqual(mockRawEntry);
		});
	});

	describe('Cache Management', () => {
		it('should clear all cache entries', async () => {
			const filePath = path.join(tempDir, 'test.md');
			await fs.writeFile(filePath, '# Test');

			await cacheManager.set('post', 'test', filePath, mockRawEntry);

			// Verify cached
			let result = await cacheManager.get('post', 'test', filePath);
			expect(result).toEqual(mockRawEntry);

			// Clear cache
			await cacheManager.clear();

			// Should be empty
			result = await cacheManager.get('post', 'test', filePath);
			expect(result).toBeNull();
		});

		it('should provide accurate metrics', async () => {
			const filePath1 = path.join(tempDir, 'test1.md');
			const filePath2 = path.join(tempDir, 'test2.md');

			await fs.writeFile(filePath1, '# Test 1');
			await fs.writeFile(filePath2, '# Test 2');

			// Initial metrics
			let metrics = cacheManager.getMetrics();
			expect(metrics.hits).toBe(0);
			expect(metrics.misses).toBe(0);
			expect(metrics.hitRate).toBe(0);

			// Cache miss
			await cacheManager.get('post', 'test1', filePath1);
			metrics = cacheManager.getMetrics();
			expect(metrics.misses).toBe(1);
			expect(metrics.hitRate).toBe(0);

			// Cache entry
			await cacheManager.set('post', 'test1', filePath1, mockRawEntry);

			// Cache hit
			await cacheManager.get('post', 'test1', filePath1);
			metrics = cacheManager.getMetrics();
			expect(metrics.hits).toBe(1);
			expect(metrics.misses).toBe(1);
			expect(metrics.hitRate).toBe(50);
		});

		it('should cleanup expired entries', async () => {
			// Create cache manager with very short TTL
			const shortTtlConfig = { ...config, maxAge: 50 }; // 50ms
			const shortTtlManager = new ContentCacheManager(shortTtlConfig);

			const filePath = path.join(tempDir, 'test.md');
			await fs.writeFile(filePath, '# Test');

			await shortTtlManager.set('post', 'test', filePath, mockRawEntry);

			// Wait for expiration
			await new Promise((resolve) => setTimeout(resolve, 100));

			// Run cleanup
			await shortTtlManager.cleanup();

			// Should be removed
			const result = await shortTtlManager.get('post', 'test', filePath);
			expect(result).toBeNull();
		});
	});

	describe('Error Handling', () => {
		it('should handle disabled cache gracefully', async () => {
			const disabledConfig = { ...config, enabled: false };
			const disabledManager = new ContentCacheManager(disabledConfig);

			const filePath = path.join(tempDir, 'test.md');
			await fs.writeFile(filePath, '# Test');

			// Should not cache
			await disabledManager.set('post', 'test', filePath, mockRawEntry);
			const result = await disabledManager.get('post', 'test', filePath);
			expect(result).toBeNull();
		});

		it('should handle file system errors gracefully', async () => {
			const readOnlyDir = path.join(tempDir, 'readonly');
			await fs.mkdir(readOnlyDir);

			// Make directory read-only (this might not work on all systems)
			try {
				await fs.chmod(readOnlyDir, 0o444);

				const readOnlyConfig = { ...config, directory: readOnlyDir };
				const readOnlyManager = new ContentCacheManager(readOnlyConfig);

				const filePath = path.join(tempDir, 'test.md');
				await fs.writeFile(filePath, '# Test');

				// Should not throw, just fail gracefully
				await readOnlyManager.set('post', 'test', filePath, mockRawEntry);
				const result = await readOnlyManager.get('post', 'test', filePath);
				expect(result).toBeNull();
			} catch {
				// Skip this test if we can't make read-only directory
			}
		});
	});
});
