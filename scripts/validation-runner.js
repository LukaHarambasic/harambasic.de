/**
 * Validation Runner for Content Files
 *
 * This module provides a Node.js compatible interface to run content validation
 * outside of the SvelteKit environment for use in git hooks and CI/CD.
 */

import * as fs from 'fs/promises';
import { join } from 'path';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

// Content type mapping
const CONTENT_TYPES = ['post', 'project', 'uses', 'shareable'];

/**
 * Get content folder path for a given entry type
 */
function getContentFolderPath(entryType, contentRoot) {
	const folderName = entryType === 'uses' ? 'uses' : `${entryType}s`;
	return join(contentRoot, folderName);
}

/**
 * Read and parse frontmatter from a markdown file
 */
async function parseMarkdownFile(filePath) {
	try {
		const content = await fs.readFile(filePath, 'utf8');

		// Use front-matter library to parse
		const fm = require('front-matter');
		const parsed = fm(content);

		return {
			frontmatter: parsed.attributes,
			body: parsed.body,
			content: content
		};
	} catch (error) {
		throw new Error(`Failed to read file ${filePath}: ${error.message}`);
	}
}

/**
 * Simple validation function that checks basic content structure
 * This is a simplified version for the git hook environment
 */
function validateEntry(rawEntry, entryType, filePath) {
	const errors = [];
	const { frontmatter } = rawEntry;

	// Basic required field validation
	if (!frontmatter.title) {
		errors.push('Missing required field: title');
	}

	if (!frontmatter.description) {
		errors.push('Missing required field: description');
	}

	if (!frontmatter.published) {
		errors.push('Missing required field: published');
	}

	if (!frontmatter.tags || !Array.isArray(frontmatter.tags) || frontmatter.tags.length === 0) {
		errors.push('Missing or invalid tags field (must be non-empty array)');
	}

	// Content type specific validation
	if (entryType === 'post') {
		if (!frontmatter.image) {
			errors.push('Posts require an image field');
		}
	}

	if (entryType === 'project') {
		if (!frontmatter.links) {
			errors.push('Projects require a links field');
		}
	}

	if (entryType === 'uses') {
		if (!frontmatter.url) {
			errors.push('Uses entries require a url field');
		}
		if (!frontmatter.status) {
			errors.push('Uses entries require a status field');
		}
		// Note: Uses entries can have empty bodies - they're reference entries, not full articles
	}

	// Date format validation (supports multiple formats)
	if (frontmatter.published && typeof frontmatter.published === 'string') {
		const dateOnlyRegex = /^\d{4}-\d{2}-\d{2}$/;
		const isoDatetimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/;
		const spaceDatetimeRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/;

		if (
			!dateOnlyRegex.test(frontmatter.published) &&
			!isoDatetimeRegex.test(frontmatter.published) &&
			!spaceDatetimeRegex.test(frontmatter.published)
		) {
			errors.push(
				'Invalid published date format (expected YYYY-MM-DD, YYYY-MM-DD HH:MM, or ISO datetime)'
			);
		}
	}

	if (frontmatter.updated && typeof frontmatter.updated === 'string') {
		const dateOnlyRegex = /^\d{4}-\d{2}-\d{2}$/;
		const isoDatetimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/;
		const spaceDatetimeRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/;

		if (
			!dateOnlyRegex.test(frontmatter.updated) &&
			!isoDatetimeRegex.test(frontmatter.updated) &&
			!spaceDatetimeRegex.test(frontmatter.updated)
		) {
			errors.push(
				'Invalid updated date format (expected YYYY-MM-DD, YYYY-MM-DD HH:MM, or ISO datetime)'
			);
		}
	}

	// URL validation for fields that should be URLs
	if (frontmatter.url && typeof frontmatter.url === 'string') {
		try {
			new URL(frontmatter.url);
		} catch {
			errors.push('Invalid URL format in url field');
		}
	}

	if (
		frontmatter.discussion &&
		typeof frontmatter.discussion === 'string' &&
		frontmatter.discussion !== ''
	) {
		try {
			new URL(frontmatter.discussion);
		} catch {
			errors.push('Invalid URL format in discussion field');
		}
	}

	return {
		success: errors.length === 0,
		filePath,
		errors: errors.length > 0 ? errors : undefined
	};
}

/**
 * Validate all content files of a specific type
 */
async function validateContentType(entryType, contentRoot) {
	const folderPath = getContentFolderPath(entryType, contentRoot);
	const results = [];

	try {
		const fileNames = await fs.readdir(folderPath);
		const markdownFiles = fileNames.filter((name) => name.endsWith('.md'));

		for (const fileName of markdownFiles) {
			const filePath = join(folderPath, fileName);
			const relativePath = `src/content/${entryType === 'uses' ? 'uses' : `${entryType}s`}/${fileName}`;

			try {
				const { frontmatter, body, content } = await parseMarkdownFile(filePath);

				const rawEntry = {
					frontmatter,
					body,
					content,
					slug: fileName.replace('.md', ''),
					relativePath,
					fullPath: filePath
				};

				const result = validateEntry(rawEntry, entryType, relativePath);
				results.push(result);
			} catch (error) {
				results.push({
					success: false,
					filePath: relativePath,
					errors: [`File processing error: ${error.message}`]
				});
			}
		}
	} catch (folderError) {
		// If the folder doesn't exist, that's okay - just skip this content type
		if (folderError.code !== 'ENOENT') {
			results.push({
				success: false,
				filePath: `${entryType}s folder`,
				errors: [`Failed to read content folder: ${folderError.message}`]
			});
		}
	}

	return results;
}

/**
 * Validate all content files across all content types
 */
export async function validateAllContent(contentRoot) {
	const allResults = [];

	// Validate each content type
	for (const contentType of CONTENT_TYPES) {
		const typeResults = await validateContentType(contentType, contentRoot);
		allResults.push(...typeResults);
	}

	return allResults;
}

/**
 * Check if any staged files are content files that need validation
 */
export async function hasContentChanges() {
	try {
		const { execSync } = require('child_process');
		const stagedFiles = execSync('git diff --cached --name-only', { encoding: 'utf8' })
			.split('\n')
			.filter(Boolean);

		return stagedFiles.some((file) => file.startsWith('src/content/') && file.endsWith('.md'));
	} catch {
		// If we can't check git status, assume we need to validate
		return true;
	}
}
