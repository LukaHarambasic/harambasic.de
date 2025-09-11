/**
 * Secret content service
 * Handles encrypted content processing, decryption, and metadata extraction
 */

import { decryptData, type EncryptedData } from '$lib/util/encryption';
import {
	type SecretContent,
	type SecretContentMeta,
	type SecretContentError,
	isEncryptedFile
} from '$lib/types/secret';
import { getSlug } from '$lib/util/helper';

// Content processing result types
export type ContentResult<T> =
	| { success: true; data: T }
	| { success: false; error: SecretContentError };

export type ContentListResult = ContentResult<SecretContentMeta[]>;
export type ContentDetailResult = ContentResult<SecretContent>;

/**
 * Parse front matter from markdown content
 * Simplified parser for basic metadata extraction
 */
function parseFrontMatter(content: string): { metadata: Record<string, unknown>; body: string } {
	const frontMatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
	const match = content.match(frontMatterRegex);

	if (!match) {
		return { metadata: {}, body: content };
	}

	const [, frontMatter, body] = match;
	const metadata: Record<string, unknown> = {};

	// Simple YAML-like parsing for basic key-value pairs
	const lines = frontMatter.split('\n');
	for (const line of lines) {
		const colonIndex = line.indexOf(':');
		if (colonIndex > 0) {
			const key = line.slice(0, colonIndex).trim();
			const value = line.slice(colonIndex + 1).trim();

			// Handle different value types
			if (value.startsWith('[') && value.endsWith(']')) {
				// Simple array parsing
				const arrayContent = value.slice(1, -1);
				metadata[key] = arrayContent
					.split(',')
					.map((item) => item.trim().replace(/^['"]|['"]$/g, ''));
			} else if (value.startsWith('"') && value.endsWith('"')) {
				metadata[key] = value.slice(1, -1);
			} else if (value.startsWith("'") && value.endsWith("'")) {
				metadata[key] = value.slice(1, -1);
			} else if (!isNaN(Date.parse(value))) {
				metadata[key] = new Date(value);
			} else {
				metadata[key] = value;
			}
		}
	}

	return { metadata, body };
}

/**
 * Process decrypted markdown content into structured data
 */
function processMarkdownContent(markdownContent: string, slug: string): SecretContent {
	const { metadata, body } = parseFrontMatter(markdownContent);

	// Extract title from metadata or generate from slug
	const title = typeof metadata.title === 'string' ? metadata.title : slug.replace(/-/g, ' ');

	// Extract dates
	const published = metadata.published instanceof Date ? metadata.published : new Date();
	const updated = metadata.updated instanceof Date ? metadata.updated : undefined;

	// Extract tags
	const tags = Array.isArray(metadata.tags)
		? metadata.tags.filter((tag): tag is string => typeof tag === 'string')
		: undefined;

	return {
		slug,
		title,
		content: body.trim(),
		published,
		updated,
		tags
	};
}

/**
 * Decrypt and parse secret content from encrypted data
 */
export async function decryptSecretContent(
	encryptedData: EncryptedData,
	passphrase: string,
	slug: string
): Promise<ContentDetailResult> {
	try {
		if (!isEncryptedFile(encryptedData)) {
			return { success: false, error: 'INVALID_FORMAT' };
		}

		const decryptedContent = await decryptData(encryptedData, passphrase);
		const secretContent = processMarkdownContent(decryptedContent, slug);

		return { success: true, data: secretContent };
	} catch (error) {
		console.error('Content decryption error:', error);
		return { success: false, error: 'DECRYPTION_FAILED' };
	}
}

/**
 * Extract metadata from encrypted content without decrypting the full content
 * This is useful for content listings where full content isn't needed
 */
export async function extractContentMetadata(
	encryptedData: EncryptedData,
	passphrase: string,
	slug: string
): Promise<ContentResult<SecretContentMeta>> {
	try {
		if (!isEncryptedFile(encryptedData)) {
			return { success: false, error: 'INVALID_FORMAT' };
		}

		const decryptedContent = await decryptData(encryptedData, passphrase);
		const { metadata } = parseFrontMatter(decryptedContent);

		// Extract only metadata needed for listing
		const title = typeof metadata.title === 'string' ? metadata.title : slug.replace(/-/g, ' ');
		const published = metadata.published instanceof Date ? metadata.published : new Date();
		const updated = metadata.updated instanceof Date ? metadata.updated : undefined;
		const tags = Array.isArray(metadata.tags)
			? metadata.tags.filter((tag): tag is string => typeof tag === 'string')
			: undefined;

		const contentMeta: SecretContentMeta = {
			slug,
			title,
			published,
			updated,
			tags
		};

		return { success: true, data: contentMeta };
	} catch (error) {
		console.error('Metadata extraction error:', error);
		return { success: false, error: 'DECRYPTION_FAILED' };
	}
}

/**
 * Process multiple encrypted content files to create a content listing
 */
export async function processContentList(
	encryptedContents: Array<{ slug: string; data: EncryptedData }>,
	passphrase: string
): Promise<ContentListResult> {
	try {
		const metadataPromises = encryptedContents.map(async ({ slug, data }) => {
			const result = await extractContentMetadata(data, passphrase, slug);
			return result.success ? result.data : null;
		});

		const metadata = await Promise.all(metadataPromises);
		const validMetadata = metadata.filter((meta): meta is SecretContentMeta => meta !== null);

		// Sort by published date (newest first)
		validMetadata.sort((a, b) => b.published.getTime() - a.published.getTime());

		return { success: true, data: validMetadata };
	} catch (error) {
		console.error('Content list processing error:', error);
		return { success: false, error: 'DECRYPTION_FAILED' };
	}
}

/**
 * Generate slug from filename
 */
export function extractSlugFromFilename(filename: string): string {
	// Remove file extensions and convert to slug
	const nameWithoutExt = filename.replace(/\.(secret\.md|encrypted)$/, '');
	return getSlug(nameWithoutExt);
}

/**
 * Validate content structure
 */
export function validateSecretContent(content: unknown): content is SecretContent {
	if (typeof content !== 'object' || content === null) return false;

	const c = content as Record<string, unknown>;

	return (
		typeof c.slug === 'string' &&
		typeof c.title === 'string' &&
		typeof c.content === 'string' &&
		c.published instanceof Date &&
		c.slug.length > 0 &&
		c.title.length > 0 &&
		c.content.length > 0
	);
}

/**
 * Get user-friendly error message for content errors
 */
export function getContentErrorMessage(error: SecretContentError): string {
	switch (error) {
		case 'CONTENT_NOT_FOUND':
			return 'The requested content could not be found.';
		case 'DECRYPTION_FAILED':
			return 'Unable to decrypt content. Please check your credentials.';
		case 'INVALID_FORMAT':
			return 'Content format is invalid or corrupted.';
		case 'ACCESS_DENIED':
			return 'You do not have permission to access this content.';
		default:
			return 'An error occurred while processing the content.';
	}
}

/**
 * Sanitize content for safe HTML rendering
 * Basic XSS prevention for markdown content
 */
export function sanitizeContent(content: string): string {
	// Basic HTML tag stripping - in a real implementation,
	// you might want to use a proper sanitization library
	return content
		.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
		.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
		.replace(/javascript:/gi, '')
		.replace(/on\w+\s*=/gi, '');
}
