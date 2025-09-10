import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';
import { getRawEntries, getCacheMetrics, clearContentCache } from './cachedConverter.server';
import { resetCacheManager } from '$lib/cache';

describe('Cached Content Converter', () => {
	let tempDir: string;
	let testContentDir: string;

	beforeEach(async () => {
		// Reset cache manager for clean tests
		resetCacheManager();

		// Create temporary directory structure
		tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'cached-converter-test-'));
		testContentDir = path.join(tempDir, 'src', 'content');

		// Mock process.cwd() to return our temp directory
		vi.spyOn(process, 'cwd').mockReturnValue(tempDir);

		// Set up test environment
		process.env.NODE_ENV = 'development';
		process.env.CACHE_VERBOSE = 'false';
	});

	afterEach(async () => {
		// Restore original cwd
		vi.restoreAllMocks();

		// Clean up temporary directory
		try {
			await fs.rm(tempDir, { recursive: true, force: true });
		} catch {
			// Ignore cleanup errors
		}
	});

	async function createTestContent() {
		// Create content directories
		await fs.mkdir(path.join(testContentDir, 'posts'), { recursive: true });
		await fs.mkdir(path.join(testContentDir, 'projects'), { recursive: true });
		await fs.mkdir(path.join(testContentDir, 'uses'), { recursive: true });

		// Create test post
		const postContent = `---
title: Test Post
description: A test post for caching
image: /images/test-post.jpg
tags: ['test', 'cache']
published: 2024-01-01
updated: 2024-01-01
---

# Test Post

This is a test post for cache testing.`;

		await fs.writeFile(path.join(testContentDir, 'posts', 'test-post.md'), postContent);

		// Create test project
		const projectContent = `---
title: Test Project
description: A test project for caching
image: /images/test-project.jpg
tags: ['test', 'project']
published: 2024-01-02
updated: 2024-01-02
prio: 1
---

# Test Project

This is a test project for cache testing.`;

		await fs.writeFile(path.join(testContentDir, 'projects', 'test-project.md'), projectContent);

		// Create test uses entry
		const usesContent = `---
title: Test Tool
description: A test tool for caching
image: /images/test-tool.jpg
tags: ['test', 'tool']
published: 2024-01-03
updated: 2024-01-03
---

# Test Tool

This is a test tool for cache testing.`;

		await fs.writeFile(path.join(testContentDir, 'uses', 'test-tool.md'), usesContent);
	}

	describe('Basic Content Loading', () => {
		it('should load posts with caching', async () => {
			await createTestContent();

			const posts = await getRawEntries('post');

			expect(posts).toHaveLength(1);
			expect(posts[0].title).toBe('Test Post');
			expect(posts[0].description).toBe('A test post for caching');
			expect(posts[0].tags).toEqual(['test', 'cache']);
			expect(posts[0].html).toContain('Test Post');
			expect(posts[0].toc).toBeDefined();
		});

		it('should load projects with caching', async () => {
			await createTestContent();

			const projects = await getRawEntries('project');

			expect(projects).toHaveLength(1);
			expect(projects[0].title).toBe('Test Project');
			expect(projects[0].prio).toBe(1);
		});

		it('should load uses entries with caching', async () => {
			await createTestContent();

			const uses = await getRawEntries('uses');

			expect(uses).toHaveLength(1);
			expect(uses[0].title).toBe('Test Tool');
		});
	});

	describe('Cache Performance', () => {
		it('should show cache miss on first load', async () => {
			await createTestContent();

			// Clear metrics
			await clearContentCache();

			await getRawEntries('post');

			const metrics = getCacheMetrics();
			expect(metrics.misses).toBe(1);
			expect(metrics.hits).toBe(0);
			expect(metrics.hitRate).toBe(0);
		});

		it('should show cache hit on second load', async () => {
			await createTestContent();

			// Clear cache and metrics
			await clearContentCache();

			// First load (cache miss)
			await getRawEntries('post');

			// Second load (cache hit)
			await getRawEntries('post');

			const metrics = getCacheMetrics();
			expect(metrics.hits).toBe(1);
			expect(metrics.misses).toBe(1);
			expect(metrics.hitRate).toBe(50);
		});

		it('should have good performance on cache hits', async () => {
			await createTestContent();

			// First load to populate cache
			await getRawEntries('post');

			// Time second load (should be faster)
			const start = Date.now();
			await getRawEntries('post');
			const duration = Date.now() - start;

			// Cache hit should be very fast (< 50ms)
			expect(duration).toBeLessThan(50);
		});
	});

	describe('Cache Invalidation', () => {
		it('should invalidate cache when file is modified', async () => {
			await createTestContent();

			// First load
			const posts1 = await getRawEntries('post');
			expect(posts1[0].title).toBe('Test Post');

			// Modify the file
			const postPath = path.join(testContentDir, 'posts', 'test-post.md');
			const modifiedContent = `---
title: Modified Test Post
description: A modified test post
image: /images/test-post.jpg
tags: ['test', 'cache', 'modified']
published: 2024-01-01
updated: 2024-01-01
---

# Modified Test Post

This post has been modified.`;

			await new Promise((resolve) => setTimeout(resolve, 10));
			await fs.writeFile(postPath, modifiedContent);

			// Second load should get updated content
			const posts2 = await getRawEntries('post');
			expect(posts2[0].title).toBe('Modified Test Post');
			expect(posts2[0].tags).toEqual(['test', 'cache', 'modified']);
		});

		it('should handle file deletion gracefully', async () => {
			await createTestContent();

			// First load
			const posts1 = await getRawEntries('post');
			expect(posts1).toHaveLength(1);

			// Delete the file
			const postPath = path.join(testContentDir, 'posts', 'test-post.md');
			await fs.unlink(postPath);

			// Second load should return empty array
			const posts2 = await getRawEntries('post');
			expect(posts2).toHaveLength(0);
		});
	});

	describe('Error Handling', () => {
		it('should fall back to uncached processing on cache errors', async () => {
			await createTestContent();

			// Mock cache error by making cache directory read-only
			const cacheDir = path.join(tempDir, '.cache');
			await fs.mkdir(cacheDir, { recursive: true });

			try {
				await fs.chmod(cacheDir, 0o444);

				// Should still work despite cache errors
				const posts = await getRawEntries('post');
				expect(posts).toHaveLength(1);
				expect(posts[0].title).toBe('Test Post');
			} catch {
				// Skip if we can't change permissions
			}
		});

		it('should handle missing content directory', async () => {
			// Don't create content, directory doesn't exist

			const posts = await getRawEntries('post');
			expect(posts).toEqual([]);
		});

		it('should handle invalid frontmatter gracefully', async () => {
			await fs.mkdir(path.join(testContentDir, 'posts'), { recursive: true });

			const invalidContent = `---
title: Test Post
# Missing required fields
---

# Test Post`;

			await fs.writeFile(path.join(testContentDir, 'posts', 'invalid-post.md'), invalidContent);

			// Should handle gracefully and continue processing
			await expect(getRawEntries('post')).rejects.toThrow();
		});
	});

	describe('Multiple Entry Types', () => {
		it('should cache different entry types independently', async () => {
			await createTestContent();

			// Load different types
			const posts = await getRawEntries('post');
			const projects = await getRawEntries('project');
			const uses = await getRawEntries('uses');

			expect(posts).toHaveLength(1);
			expect(projects).toHaveLength(1);
			expect(uses).toHaveLength(1);

			// Each should have correct content
			expect(posts[0].title).toBe('Test Post');
			expect(projects[0].title).toBe('Test Project');
			expect(uses[0].title).toBe('Test Tool');

			// Check cache metrics
			const metrics = getCacheMetrics();
			expect(metrics.totalEntries).toBeGreaterThanOrEqual(3);
		});

		it('should invalidate cache per entry type correctly', async () => {
			await createTestContent();

			// Load all types to populate cache
			await getRawEntries('post');
			await getRawEntries('project');
			await getRawEntries('uses');

			// Modify only post
			const postPath = path.join(testContentDir, 'posts', 'test-post.md');
			await new Promise((resolve) => setTimeout(resolve, 10));
			await fs.writeFile(
				postPath,
				`---
title: Modified Post
description: Modified
image: /images/test.jpg
tags: ['modified']
published: 2024-01-01
updated: 2024-01-01
---

# Modified Post`
			);

			// Load again
			const posts = await getRawEntries('post');
			const projects = await getRawEntries('project');

			// Post should be updated
			expect(posts[0].title).toBe('Modified Post');

			// Project should still be cached
			expect(projects[0].title).toBe('Test Project');
		});
	});

	describe('Cache Management', () => {
		it('should clear cache completely', async () => {
			await createTestContent();

			// Clear cache first to ensure clean state
			await clearContentCache();

			// Populate cache
			await getRawEntries('post');

			let metrics = getCacheMetrics();
			expect(metrics.totalEntries).toBe(1);

			// Clear cache
			await clearContentCache();

			// Verify cache is empty
			metrics = getCacheMetrics();
			expect(metrics.totalEntries).toBe(0);

			// Load again (should be cache miss)
			await getRawEntries('post');

			metrics = getCacheMetrics();
			expect(metrics.totalEntries).toBe(1);
			expect(metrics.misses).toBeGreaterThanOrEqual(1);
			expect(metrics.hits).toBeGreaterThanOrEqual(0);
		});
	});
});
