import * as fs from 'fs/promises';
import { join } from 'path';
import type { EntryType } from '$lib/types/enums';
import type { RawEntry } from '$lib/types/entry';
import { processMarkdown } from '$lib/processors/MarkdownProcessor';
import type { ContentService, ValidationResult } from './ContentService';
import { ContentServiceError } from './ContentService';
import { getSlug } from '$lib/util/helper';

function getContentFolderPath(entryType: EntryType, contentRoot: string): string {
	const folderName = entryType === 'uses' ? 'uses' : `${entryType}s`;
	return join(contentRoot, folderName);
}

async function readContentFiles(entryType: EntryType, contentRoot: string): Promise<string[]> {
	const folderPath = getContentFolderPath(entryType, contentRoot);

	try {
		const fileNames = await fs.readdir(folderPath);
		const markdownFiles = fileNames.filter((name) => name.endsWith('.md'));

		return await Promise.all(
			markdownFiles.map(async (fileName) => {
				const filePath = join(folderPath, fileName);
				return await fs.readFile(filePath, 'utf8');
			})
		);
	} catch (error) {
		throw new Error(
			`Failed to read content files from ${folderPath}: ${error instanceof Error ? error.message : String(error)}`
		);
	}
}

async function validateSingleFile(
	entryType: EntryType,
	fileName: string,
	folderPath: string
): Promise<ValidationResult> {
	const filePath = join(folderPath, fileName);

	try {
		const content = await fs.readFile(filePath, 'utf8');

		const entry = processMarkdown(content);

		if (!entry.title) {
			return {
				entryType,
				slug: fileName,
				isValid: false,
				message: 'Missing required field: title'
			};
		}

		if (!entry.description) {
			return {
				entryType,
				slug: fileName,
				isValid: false,
				message: 'Missing required field: description'
			};
		}

		if (!entry.published) {
			return {
				entryType,
				slug: fileName,
				isValid: false,
				message: 'Missing required field: published date'
			};
		}

		return {
			entryType,
			slug: fileName,
			isValid: true,
			message: 'Content is valid'
		};
	} catch (error) {
		return {
			entryType,
			slug: fileName,
			isValid: false,
			message: 'Failed to parse content',
			details: error instanceof Error ? error.message : String(error)
		};
	}
}

/**
 * Get all entries of a specific type
 */
export async function getContentEntries(
	entryType: EntryType,
	contentRoot?: string
): Promise<RawEntry[]> {
	const root = contentRoot || join(process.cwd(), 'src', 'content');
	console.time(`Loading ${entryType} entries`);

	try {
		const files = await readContentFiles(entryType, root);
		const entries = await Promise.all(files.map(processMarkdown));
		console.timeEnd(`Loading ${entryType} entries`);
		return entries;
	} catch (error) {
		console.error(`Failed to load ${entryType} entries:`, error);
		throw new ContentServiceError(
			`Failed to load ${entryType} entries`,
			entryType,
			undefined,
			error instanceof Error ? error : new Error(String(error))
		);
	}
}

/**
 * Get single entry by type and slug
 */
export async function getContentEntry(
	entryType: EntryType,
	slug: string,
	contentRoot?: string
): Promise<RawEntry | null> {
	try {
		const entries = await getContentEntries(entryType, contentRoot);
		const entry = entries.find((entry) => {
			const entrySlug = getSlug(entry.title);
			return entrySlug === slug;
		});
		return entry || null;
	} catch (error) {
		console.error(`Failed to load ${entryType} entry with slug ${slug}:`, error);
		throw new ContentServiceError(
			`Failed to load ${entryType} entry`,
			entryType,
			slug,
			error instanceof Error ? error : new Error(String(error))
		);
	}
}

/**
 * Get entry metadata only (faster for listings)
 */
export async function getContentEntryMetadata(
	entryType: EntryType,
	slug: string,
	contentRoot?: string
): Promise<Pick<RawEntry, 'title' | 'description' | 'published'> | null> {
	try {
		const entry = await getContentEntry(entryType, slug, contentRoot);
		if (!entry) return null;

		return {
			title: entry.title,
			description: entry.description,
			published: entry.published
		};
	} catch (error) {
		console.error(`Failed to load ${entryType} metadata for slug ${slug}:`, error);
		throw new ContentServiceError(
			`Failed to load ${entryType} metadata`,
			entryType,
			slug,
			error instanceof Error ? error : new Error(String(error))
		);
	}
}

/**
 * Validate content structure for a specific entry type
 */
export async function validateContent(
	entryType: EntryType,
	contentRoot?: string
): Promise<ValidationResult[]> {
	const root = contentRoot || join(process.cwd(), 'src', 'content');
	const results: ValidationResult[] = [];

	try {
		const folderPath = getContentFolderPath(entryType, root);

		try {
			await fs.access(folderPath);
		} catch {
			results.push({
				entryType,
				isValid: false,
				message: `Content folder does not exist: ${folderPath}`
			});
			return results;
		}

		const fileNames = await fs.readdir(folderPath);
		const markdownFiles = fileNames.filter((name) => name.endsWith('.md'));

		if (markdownFiles.length === 0) {
			results.push({
				entryType,
				isValid: false,
				message: 'No markdown files found in content folder'
			});
			return results;
		}

		for (const fileName of markdownFiles) {
			const result = await validateSingleFile(entryType, fileName, folderPath);
			results.push(result);
		}

		return results;
	} catch (error) {
		results.push({
			entryType,
			isValid: false,
			message: 'Failed to validate content',
			details: error instanceof Error ? error.message : String(error)
		});
		return results;
	}
}

/**
 * Filesystem-based implementation of ContentService.
 * Reads markdown files from the content directory and processes them.
 */
export class FileSystemContentService implements ContentService {
	private contentRoot: string;

	constructor(contentRoot?: string) {
		this.contentRoot = contentRoot || join(process.cwd(), 'src', 'content');
	}

	async getEntries(entryType: EntryType): Promise<RawEntry[]> {
		return getContentEntries(entryType, this.contentRoot);
	}

	async getEntry(entryType: EntryType, slug: string): Promise<RawEntry | null> {
		return getContentEntry(entryType, slug, this.contentRoot);
	}

	async getEntryMetadata(
		entryType: EntryType,
		slug: string
	): Promise<Pick<RawEntry, 'title' | 'description' | 'published'> | null> {
		return getContentEntryMetadata(entryType, slug, this.contentRoot);
	}

	async validateContent(entryType: EntryType): Promise<ValidationResult[]> {
		return validateContent(entryType, this.contentRoot);
	}
}
