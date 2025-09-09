import * as fs from 'fs/promises';
import { join } from 'path';
import type { EntryType } from '$lib/types/enums';
import type { RawEntry } from '$lib/types/entry';
import { MarkdownProcessor } from '$lib/processors';
import type { ContentService, ValidationResult } from './ContentService';
import { ContentServiceError } from './ContentService';

/**
 * Filesystem-based implementation of ContentService.
 * Reads markdown files from the content directory and processes them.
 */
export class FileSystemContentService implements ContentService {
	private processor: MarkdownProcessor;
	private contentRoot: string;

	constructor(contentRoot?: string, processor?: MarkdownProcessor) {
		this.contentRoot = contentRoot || join(process.cwd(), 'src', 'content');
		this.processor = processor || new MarkdownProcessor();
	}

	/**
	 * Get all entries of a specific type
	 */
	async getEntries(entryType: EntryType): Promise<RawEntry[]> {
		console.time(`Loading ${entryType} entries`);
		try {
			const files = await this.readContentFiles(entryType);
			const rawEntries = await this.processor.processMany(files);
			// Flatten the structure to match RawEntry interface
			const entries = rawEntries.map((entry: any) => this.flattenEntry(entry));
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
	async getEntry(entryType: EntryType, slug: string): Promise<RawEntry | null> {
		try {
			const entries = await this.getEntries(entryType);
			// Find entry by matching slug (derived from title) - now using flattened structure
			const entry = entries.find((entry) => {
				const entrySlug = this.generateSlug(entry.title);
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
	async getEntryMetadata(
		entryType: EntryType,
		slug: string
	): Promise<Pick<RawEntry, 'title' | 'description' | 'published'> | null> {
		try {
			const entry = await this.getEntry(entryType, slug);
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
	async validateContent(entryType: EntryType): Promise<ValidationResult[]> {
		const results: ValidationResult[] = [];

		try {
			const folderPath = this.getContentFolderPath(entryType);

			// Check if folder exists
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

			// Get all files and validate each
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

			// Validate each file
			for (const fileName of markdownFiles) {
				const result = await this.validateSingleFile(entryType, fileName, folderPath);
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
	 * Read all content files for a given entry type
	 */
	private async readContentFiles(entryType: EntryType): Promise<string[]> {
		const folderPath = this.getContentFolderPath(entryType);

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

	/**
	 * Get the folder path for a specific entry type
	 */
	private getContentFolderPath(entryType: EntryType): string {
		// Handle special case for 'uses' vs 'usess'
		const folderName = entryType === 'uses' ? 'uses' : `${entryType}s`;
		return join(this.contentRoot, folderName);
	}

	/**
	 * Generate slug from title (replicates logic from existing helper)
	 */
	private generateSlug(title: string): string {
		return title
			.toLowerCase()
			.replace(/[^\w\s-]/g, '')
			.replace(/[\s_-]+/g, '-')
			.replace(/^-+|-+$/g, '');
	}

	/**
	 * Validate a single content file
	 */
	private async validateSingleFile(
		entryType: EntryType,
		fileName: string,
		folderPath: string
	): Promise<ValidationResult> {
		const filePath = join(folderPath, fileName);

		try {
			const content = await fs.readFile(filePath, 'utf8');

			// Try to process the file to validate structure
			const rawEntry = this.processor.process(content);
			const entry = this.flattenEntry(rawEntry);

			// Basic validation checks
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
	 * Flatten nested entry structure to match RawEntry interface
	 */
	private flattenEntry(entry: any): RawEntry {
		return {
			// Content from root level
			html: entry.html,
			toc: entry.toc || [],

			// Frontmatter from meta property (flattened)
			title: entry.meta?.title || '',
			description: entry.meta?.description || '',
			image: entry.meta?.image || '',
			tags: entry.meta?.tags || [],
			published: entry.meta?.published || '',
			updated: entry.meta?.updated || '',

			// Optional fields from meta
			url: entry.meta?.url,
			status: entry.meta?.status,
			openSource: entry.meta?.openSource,
			tldr: entry.meta?.tldr,
			discussion: entry.meta?.discussion,
			links: entry.meta?.links,
			prio: entry.meta?.prio,
			imageAlt: entry.meta?.imageAlt
		};
	}
}
