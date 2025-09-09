import type { RawEntry } from '$lib/types/entry';
import type { ContentStatus, EntryType } from '$lib/types/enums';
import type { ContentService } from '$lib/services/ContentService';
import type { ContentRepository } from '../ContentRepository';
import { ContentRepositoryError } from '../ContentRepository';
import { getSlug } from '$lib/util/helper';

/**
 * Base FileSystem implementation of ContentRepository
 * Uses ContentService for data access and implements common query patterns
 */
export abstract class FileSystemContentRepository implements ContentRepository<RawEntry> {
	protected abstract readonly entryType: EntryType;

	constructor(protected contentService: ContentService) {}

	async findAll(): Promise<RawEntry[]> {
		try {
			return await this.contentService.getEntries(this.entryType);
		} catch (error) {
			throw new ContentRepositoryError(
				`Failed to find all ${this.entryType} entries`,
				this.entryType,
				undefined,
				error as Error
			);
		}
	}

	async findBySlug(slug: string): Promise<RawEntry | null> {
		try {
			return await this.contentService.getEntry(this.entryType, slug);
		} catch (error) {
			throw new ContentRepositoryError(
				`Failed to find ${this.entryType} entry by slug: ${slug}`,
				this.entryType,
				slug,
				error as Error
			);
		}
	}

	async findByTag(tag: string): Promise<RawEntry[]> {
		try {
			const entries = await this.findAll();
			return entries.filter(
				(entry) => entry.meta.tags && entry.meta.tags.some((entryTag) => getSlug(entryTag) === tag)
			);
		} catch (error) {
			throw new ContentRepositoryError(
				`Failed to find ${this.entryType} entries by tag: ${tag}`,
				this.entryType,
				undefined,
				error as Error
			);
		}
	}

	async findByStatus(status: ContentStatus): Promise<RawEntry[]> {
		try {
			const entries = await this.findAll();
			if (status === 'all') {
				return entries;
			}
			return entries.filter((entry) => entry.meta.status === status);
		} catch (error) {
			throw new ContentRepositoryError(
				`Failed to find ${this.entryType} entries by status: ${status}`,
				this.entryType,
				undefined,
				error as Error
			);
		}
	}

	async exists(slug: string): Promise<boolean> {
		try {
			const entry = await this.findBySlug(slug);
			return entry !== null;
		} catch (error) {
			throw new ContentRepositoryError(
				`Failed to check existence of ${this.entryType} entry: ${slug}`,
				this.entryType,
				slug,
				error as Error
			);
		}
	}

	async getLastModified(slug: string): Promise<Date> {
		try {
			const entry = await this.findBySlug(slug);
			if (!entry) {
				throw new Error(`Entry not found: ${slug}`);
			}
			return new Date(entry.meta.updated || entry.meta.published);
		} catch (error) {
			throw new ContentRepositoryError(
				`Failed to get last modified date for ${this.entryType} entry: ${slug}`,
				this.entryType,
				slug,
				error as Error
			);
		}
	}

	async findMany(slugs: string[]): Promise<RawEntry[]> {
		try {
			const entries = await this.findAll();
			const slugSet = new Set(slugs);
			return entries.filter((entry) => slugSet.has(getSlug(entry.meta.title)));
		} catch (error) {
			throw new ContentRepositoryError(
				`Failed to find multiple ${this.entryType} entries`,
				this.entryType,
				undefined,
				error as Error
			);
		}
	}

	async count(): Promise<number> {
		try {
			const entries = await this.findAll();
			return entries.length;
		} catch (error) {
			throw new ContentRepositoryError(
				`Failed to count ${this.entryType} entries`,
				this.entryType,
				undefined,
				error as Error
			);
		}
	}

	// Helper methods for subclasses
	protected hasTag(entry: RawEntry, tagSlug: string): boolean {
		return entry.meta.tags && entry.meta.tags.some((entryTag) => getSlug(entryTag) === tagSlug);
	}

	protected hasCommonTags(entry1: RawEntry, entry2: RawEntry): boolean {
		const tags1 = entry1.meta.tags || [];
		const tags2 = entry2.meta.tags || [];
		return tags1.some((tag1) => tags2.some((tag2) => getSlug(tag1) === getSlug(tag2)));
	}

	protected calculateSimilarity(entry1: RawEntry, entry2: RawEntry): number {
		const tags1 = entry1.meta.tags || [];
		const tags2 = entry2.meta.tags || [];
		const commonTags = tags1.filter((tag1) =>
			tags2.some((tag2) => getSlug(tag1) === getSlug(tag2))
		);
		return commonTags.length;
	}
}
