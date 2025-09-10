import type { EntryType } from '$lib/types/enums';
import type { RawEntry } from '$lib/types/entry';
import { getRawEntries as getUncachedRawEntries } from './converter.server';
import { getCacheManager } from '$lib/cache/CacheManager';
import { getSlug } from './helper';
import * as path from 'path';
import * as fs from 'fs/promises';
import { remark } from 'remark';
import remarkFrontmatter from 'remark-frontmatter';
import remarkParseFrontmatter from 'remark-parse-frontmatter';
import remarkRehype from 'remark-rehype';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeHighlight from 'rehype-highlight';
import rehypeStringify from 'rehype-stringify';
import { slug as slugger } from 'github-slugger';
import { visit } from 'unist-util-visit';
import type { VFile } from 'vfile';
import type { Node } from 'unist';
import type { TocNode } from '$lib/types/post';

/**
 * Cached wrapper for content processing.
 *
 * Provides the same API as the original converter but with caching support.
 * Processes individual files efficiently and caches results.
 */

// Create the markdown processor (same as original)
const processor = remark()
	.use(remarkFrontmatter)
	.use(remarkParseFrontmatter)
	.use(_remarkGenerateNestedToc)
	.use(remarkRehype)
	.use(rehypeSlug)
	.use(rehypeAutolinkHeadings)
	.use(rehypeHighlight)
	.use(rehypeStringify)
	.freeze();

/**
 * Get raw entries with caching support.
 *
 * This function replaces the original getRawEntries with caching capabilities:
 * - Checks cache for each entry first
 * - Falls back to processing if cache miss or invalid
 * - Stores processed entries in cache for future requests
 *
 * @param entryType Type of entries to load (post, project, uses, shareable)
 * @returns Promise resolving to array of raw entries
 */
export async function getRawEntries(entryType: EntryType): Promise<RawEntry[]> {
	const cacheManager = getCacheManager();
	const startTime = Date.now();

	try {
		// Get file paths for this entry type
		const filePaths = await getContentFilePaths(entryType);
		const results: RawEntry[] = [];
		let cacheHits = 0;
		let cacheMisses = 0;

		console.log(`[ContentCache] Processing ${filePaths.length} ${entryType} files`);

		// Process each file with caching
		for (const filePath of filePaths) {
			const slug = getSlugFromFilePath(filePath);

			// Try to get from cache first
			const cachedEntry = await cacheManager.get(entryType, slug, filePath);

			if (cachedEntry) {
				results.push(cachedEntry);
				cacheHits++;
			} else {
				// Cache miss - process the file
				const processedEntry = await processAndCacheFile(entryType, slug, filePath, cacheManager);
				results.push(processedEntry);
				cacheMisses++;
			}
		}

		const duration = Date.now() - startTime;
		const hitRate = filePaths.length > 0 ? ((cacheHits / filePaths.length) * 100).toFixed(1) : '0';

		console.log(
			`[ContentCache] Processed ${entryType} entries in ${duration}ms (${cacheHits} hits, ${cacheMisses} misses, ${hitRate}% hit rate)`
		);

		return results;
	} catch (error) {
		console.warn(`[ContentCache] Cache error, falling back to uncached processing:`, error);
		// Fall back to uncached processing on any error
		return getUncachedRawEntries(entryType);
	}
}

/**
 * Get file paths for a specific entry type.
 *
 * Builds absolute file paths for caching and validation.
 */
async function getContentFilePaths(entryType: EntryType): Promise<string[]> {
	const folderName = entryType === 'uses' ? 'uses' : `${entryType}s`;
	const folderPath = path.join(process.cwd(), 'src', 'content', folderName);

	try {
		const { readdir } = await import('fs/promises');
		const fileNames = await readdir(folderPath);

		return fileNames
			.filter((fileName) => fileName.endsWith('.md'))
			.map((fileName) => path.join(folderPath, fileName));
	} catch (error) {
		console.error(`Failed to read content directory ${folderPath}:`, error);
		return [];
	}
}

/**
 * Extract slug from file path.
 *
 * Converts file path to slug for cache key generation.
 */
function getSlugFromFilePath(filePath: string): string {
	const fileName = path.basename(filePath, '.md');
	return getSlug(fileName);
}

/**
 * Process a single file and cache the result.
 */
async function processAndCacheFile(
	entryType: EntryType,
	slug: string,
	filePath: string,
	cacheManager: ReturnType<typeof getCacheManager>
): Promise<RawEntry> {
	const startTime = Date.now();

	try {
		// Read and process the individual file
		const fileContent = await fs.readFile(filePath, 'utf-8');
		const output = processor.processSync(fileContent);
		const frontmatter = output.data.frontmatter as Record<string, unknown>;

		// Validate required fields (same as original converter)
		if (!frontmatter) {
			throw new Error(`Missing frontmatter in ${entryType} entry: ${filePath}`);
		}
		if (
			!frontmatter.title ||
			!frontmatter.description ||
			!frontmatter.published ||
			!frontmatter.updated
		) {
			throw new Error(
				`Missing required frontmatter fields in ${entryType} entry: ${frontmatter.title || 'untitled'}`
			);
		}

		// Create the raw entry (same structure as original)
		const rawEntry: RawEntry = {
			html: String(output.value),
			toc: output.data.toc as TocNode[],
			// Flatten frontmatter fields directly into the object
			...(frontmatter as Omit<RawEntry, 'html' | 'toc'>)
		};

		// Cache the processed entry
		await cacheManager.set(entryType, slug, filePath, rawEntry);

		const duration = Date.now() - startTime;
		console.log(`[ContentCache] Processed and cached ${entryType}:${slug} in ${duration}ms`);

		return rawEntry;
	} catch (error) {
		const duration = Date.now() - startTime;
		console.error(`[ContentCache] Failed to process ${entryType}:${slug} in ${duration}ms:`, error);
		throw error;
	}
}

// Copy the TOC generation function from the original converter
function _remarkGenerateNestedToc() {
	return (tree: Node, file: VFile) => {
		const headings: { value: string; depth: number; slug: string }[] = [];
		visit(tree, 'heading', (node: TocNode) => {
			const value = (node?.children ?? []).reduce((text, child) => text + child.value, '');
			const slug = slugger(value);
			headings.push({ value, depth: node.depth, slug });
		});
		file.data.toc = _getNestedToc(headings);
	};
}

function _getNestedToc(markdownHeadings: TocNode[]): TocNode[] {
	let latestEntry: TocNode | null;
	let latestParent: TocNode | null;
	const markdownHeadingCopy = JSON.parse(JSON.stringify(markdownHeadings));
	if (markdownHeadingCopy.length <= 1) return markdownHeadingCopy;

	const entryDepth: number = markdownHeadings.reduce((acc: number, item: TocNode) => {
		return item.depth < acc ? item.depth : acc;
	}, Number.POSITIVE_INFINITY);

	return markdownHeadingCopy.reduce((result: TocNode[], entry: TocNode) => {
		if (latestEntry && !latestEntry.children) {
			latestEntry.children = [];
		}
		const latestEntryDepth = latestEntry?.depth || 0;
		const latestEntryChildren = latestEntry?.children || [];
		const latestParentChildren = latestParent?.children || [];
		if (entry.depth === entryDepth) {
			entry.children = [];
			result.push(entry);
			latestParent = null;
		} else if (entry.depth === latestEntryDepth + 1) {
			latestEntryChildren.push(entry);
			latestParent = latestEntry;
		} else if (entry.depth === latestEntryDepth) {
			latestParentChildren.push(entry);
		} else {
			console.error('Unexpected Toc behaviour', entry);
		}
		latestEntry = entry;
		return result;
	}, []);
}

/**
 * Get cache manager metrics for monitoring.
 *
 * Provides insights into cache performance for development and debugging.
 */
export function getCacheMetrics() {
	const cacheManager = getCacheManager();
	return cacheManager.getMetrics();
}

/**
 * Clear the content cache.
 *
 * Useful for debugging or when cache corruption is suspected.
 */
export async function clearContentCache(): Promise<void> {
	const cacheManager = getCacheManager();
	await cacheManager.clear();
	console.log('[ContentCache] Cache cleared');
}

/**
 * Cleanup expired cache entries.
 *
 * Can be called periodically to maintain cache hygiene.
 */
export async function cleanupContentCache(): Promise<void> {
	const cacheManager = getCacheManager();
	await cacheManager.cleanup();
}
