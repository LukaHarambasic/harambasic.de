import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';
import {
	createCacheState,
	getCacheEntry,
	setCacheEntry,
	clearCache,
	getCacheMetrics,
	cleanupCache
} from './ContentCacheManager';
import type { CacheConfig } from './CacheConfig';
import type { RawEntry } from '$lib/types/entry';

type CacheState = ReturnType<typeof createCacheState>;

describe('ContentCacheManager', () => {
	let cacheState: CacheState;
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

		cacheState = createCacheState(config);

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

			const result = await getCacheEntry(cacheState, 'post', 'test', filePath);
			expect(result.entry).toBeNull();
		});

		it('should cache and retrieve entries', async () => {
			const filePath = path.join(tempDir, 'test.md');
			await fs.writeFile(filePath, '# Test');

			cacheState = await setCacheEntry(cacheState, 'post', 'test', filePath, mockRawEntry);
			const result = await getCacheEntry(cacheState, 'post', 'test', filePath);
			cacheState = result.state;

			expect(result.entry).toEqual(mockRawEntry);
		});

		it('should handle multiple entry types', async () => {
			const postPath = path.join(tempDir, 'test-post.md');
			const projectPath = path.join(tempDir, 'test-project.md');

			await fs.writeFile(postPath, '# Test Post');
			await fs.writeFile(projectPath, '# Test Project');

			cacheState = await setCacheEntry(cacheState, 'post', 'test-post', postPath, mockRawEntry);
			cacheState = await setCacheEntry(
				cacheState,
				'project',
				'test-project',
				projectPath,
				mockRawEntry
			);

			const postResult = await getCacheEntry(cacheState, 'post', 'test-post', postPath);
			cacheState = postResult.state;
			const projectResult = await getCacheEntry(cacheState, 'project', 'test-project', projectPath);
			cacheState = projectResult.state;

			expect(postResult.entry).toEqual(mockRawEntry);
			expect(projectResult.entry).toEqual(mockRawEntry);
		});
	});

	describe('Cache Invalidation', () => {
		it('should invalidate cache when file is modified', async () => {
			const filePath = path.join(tempDir, 'test.md');
			await fs.writeFile(filePath, '# Test');

			// Cache the entry
			cacheState = await setCacheEntry(cacheState, 'post', 'test', filePath, mockRawEntry);

			// Verify it's cached
			let result = await getCacheEntry(cacheState, 'post', 'test', filePath);
			cacheState = result.state;
			expect(result.entry).toEqual(mockRawEntry);

			// Wait and modify the file
			await new Promise((resolve) => setTimeout(resolve, 10));
			await fs.writeFile(filePath, '# Modified Test');

			// Should be invalidated now
			result = await getCacheEntry(cacheState, 'post', 'test', filePath);
			cacheState = result.state;
			expect(result.entry).toBeNull();
		});

		it('should invalidate cache when file is deleted', async () => {
			const filePath = path.join(tempDir, 'test.md');
			await fs.writeFile(filePath, '# Test');

			cacheState = await setCacheEntry(cacheState, 'post', 'test', filePath, mockRawEntry);

			// Delete the file
			await fs.unlink(filePath);

			const result = await getCacheEntry(cacheState, 'post', 'test', filePath);
			cacheState = result.state;
			expect(result.entry).toBeNull();
		});

		it('should invalidate cache when entry expires', async () => {
			// Use very short TTL for this test
			const shortConfig = { ...config, maxAge: 10 }; // 10ms
			cacheState = createCacheState(shortConfig);

			const filePath = path.join(tempDir, 'test.md');
			await fs.writeFile(filePath, '# Test');

			cacheState = await setCacheEntry(cacheState, 'post', 'test', filePath, mockRawEntry);

			// Wait for expiration
			await new Promise((resolve) => setTimeout(resolve, 20));

			const result = await getCacheEntry(cacheState, 'post', 'test', filePath);
			cacheState = result.state;
			expect(result.entry).toBeNull();
		});
	});

	describe('Persistence', () => {
		it('should persist cache to disk and reload', async () => {
			const filePath = path.join(tempDir, 'test.md');
			await fs.writeFile(filePath, '# Test');

			// Cache entry
			cacheState = await setCacheEntry(cacheState, 'post', 'test', filePath, mockRawEntry);

			// Create new cache state (simulates restart)
			const newCacheState = createCacheState(config);

			// Should load from disk
			const result = await getCacheEntry(newCacheState, 'post', 'test', filePath);
			expect(result.entry).toEqual(mockRawEntry);
		});

		it('should handle corrupted cache file gracefully', async () => {
			const cacheFile = path.join(tempDir, 'content-cache.json');
			await fs.writeFile(cacheFile, 'invalid json');

			// Should not throw and continue with empty cache
			const result = await getCacheEntry(cacheState, 'post', 'test', '/fake/path.md');
			expect(result.entry).toBeNull();
		});
	});

	describe('Cache Management', () => {
		it('should clear all cache entries', async () => {
			const filePath = path.join(tempDir, 'test.md');
			await fs.writeFile(filePath, '# Test');

			cacheState = await setCacheEntry(cacheState, 'post', 'test', filePath, mockRawEntry);

			// Verify cached
			let result = await getCacheEntry(cacheState, 'post', 'test', filePath);
			cacheState = result.state;
			expect(result.entry).toEqual(mockRawEntry);

			// Clear cache
			cacheState = await clearCache(cacheState);

			// Should be gone
			result = await getCacheEntry(cacheState, 'post', 'test', filePath);
			cacheState = result.state;
			expect(result.entry).toBeNull();
		});

		it('should provide accurate metrics', async () => {
			const filePath = path.join(tempDir, 'test.md');
			await fs.writeFile(filePath, '# Test');

			// Initial metrics
			let metrics = getCacheMetrics(cacheState);
			expect(metrics.hits).toBe(0);
			expect(metrics.misses).toBe(0);

			// Cache miss
			let result = await getCacheEntry(cacheState, 'post', 'test', filePath);
			cacheState = result.state;
			metrics = getCacheMetrics(cacheState);
			expect(metrics.misses).toBe(1);

			// Cache entry
			cacheState = await setCacheEntry(cacheState, 'post', 'test', filePath, mockRawEntry);

			// Cache hit
			result = await getCacheEntry(cacheState, 'post', 'test', filePath);
			cacheState = result.state;
			metrics = getCacheMetrics(cacheState);
			expect(metrics.hits).toBe(1);
			expect(metrics.misses).toBe(1);
		});

		it('should cleanup expired entries', async () => {
			// Use very short TTL
			const shortConfig = { ...config, maxAge: 10 }; // 10ms
			cacheState = createCacheState(shortConfig);

			const filePath = path.join(tempDir, 'test.md');
			await fs.writeFile(filePath, '# Test');

			cacheState = await setCacheEntry(cacheState, 'post', 'test', filePath, mockRawEntry);

			// Wait for expiration
			await new Promise((resolve) => setTimeout(resolve, 20));

			// Run cleanup
			cacheState = await cleanupCache(cacheState);

			// Entry should be removed
			const result = await getCacheEntry(cacheState, 'post', 'test', filePath);
			cacheState = result.state;
			expect(result.entry).toBeNull();
		});
	});

	describe('Error Handling', () => {
		it('should handle disabled cache gracefully', async () => {
			const disabledConfig = { ...config, enabled: false };
			cacheState = createCacheState(disabledConfig);

			const filePath = path.join(tempDir, 'test.md');

			// Should not cache when disabled
			const newState = await setCacheEntry(cacheState, 'post', 'test', filePath, mockRawEntry);
			const result = await getCacheEntry(newState, 'post', 'test', filePath);

			expect(result.entry).toBeNull();
		});

		it('should handle file system errors gracefully', async () => {
			const invalidPath = '/invalid/path/that/does/not/exist/test.md';

			// Should not throw on invalid file path
			const result = await getCacheEntry(cacheState, 'post', 'test', invalidPath);
			expect(result.entry).toBeNull();
		});
	});
});
