import { createHash } from 'crypto';
import * as fs from 'fs/promises';

/**
 * File hashing utilities for content cache invalidation.
 *
 * Provides functions to generate hashes for file content and processor
 * configuration to enable reliable cache invalidation.
 */

/**
 * Generate MD5 hash of a file's content.
 *
 * Used to detect changes in source files for cache invalidation.
 * MD5 is sufficient for cache keys as collision resistance is not critical.
 */
export async function getFileHash(filePath: string): Promise<string> {
	try {
		const content = await fs.readFile(filePath, 'utf-8');
		return createHash('md5').update(content).digest('hex');
	} catch (error) {
		// If file doesn't exist or can't be read, return a special hash
		// This will cause cache invalidation which is the desired behavior
		return `error:${error instanceof Error ? error.message : 'unknown'}`;
	}
}

/**
 * Generate hash of processor configuration.
 *
 * This hash changes when the markdown processing configuration changes,
 * ensuring cache invalidation when the output format might have changed.
 *
 * Includes:
 * - Package version (from package.json)
 * - Remark plugins configuration
 * - Rehype plugins configuration
 * - Node.js version (affects processing behavior)
 */
export async function getProcessorHash(): Promise<string> {
	try {
		// Create a configuration object that represents processing state
		const configData = {
			// Package version affects processing behavior
			packageVersion: process.env.npm_package_version || '1.0.0',

			// Node version can affect plugin behavior
			nodeVersion: process.version,

			// Plugin configuration (simplified for this implementation)
			// In a full implementation, this would include actual plugin configs
			remarkPlugins: ['remarkFrontmatter', 'remarkParseFrontmatter', 'remarkGenerateNestedToc'],
			rehypePlugins: [
				'rehypeSlug',
				'rehypeAutolinkHeadings',
				'rehypeEnhanceImage',
				'rehypeHighlight'
			],

			// Environment affects some processing decisions
			nodeEnv: process.env.NODE_ENV || 'development'
		};

		const configString = JSON.stringify(configData, null, 0);
		return createHash('md5').update(configString).digest('hex');
	} catch {
		// Return a timestamp-based hash on error to ensure cache invalidation
		return createHash('md5').update(Date.now().toString()).digest('hex');
	}
}

/**
 * Get file modification time safely.
 *
 * Returns null if file doesn't exist or can't be accessed.
 */
export async function getFileModificationTime(filePath: string): Promise<Date | null> {
	try {
		const stats = await fs.stat(filePath);
		return stats.mtime;
	} catch {
		return null;
	}
}

/**
 * Check if a file exists.
 */
export async function fileExists(filePath: string): Promise<boolean> {
	try {
		await fs.access(filePath);
		return true;
	} catch {
		return false;
	}
}
