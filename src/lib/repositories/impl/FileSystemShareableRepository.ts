import type { RawEntry } from '$lib/types/entry';
import type { ShareableSortProperty, SortDirection, EntryType } from '$lib/types/enums';
import type { ContentService } from '$lib/services/ContentService';
import type { ShareableRepository } from '../ShareableRepository';
import { FileSystemContentRepository } from './FileSystemContentRepository';
import { sortAlphabetical, sortDate } from '$lib/util/helper';

/**
 * FileSystem implementation of ShareableRepository
 * Implements shareable-specific query operations
 */
export class FileSystemShareableRepository
	extends FileSystemContentRepository
	implements ShareableRepository
{
	protected readonly entryType: EntryType = 'shareable';

	constructor(contentService: ContentService) {
		super(contentService);
	}

	async findByUrl(url: string): Promise<RawEntry[]> {
		const entries = await this.findAll();
		return entries.filter((entry) => entry.meta.url && entry.meta.url.includes(url));
	}

	async findWithUrls(): Promise<RawEntry[]> {
		const entries = await this.findAll();
		return entries.filter((entry) => entry.meta.url && entry.meta.url.length > 0);
	}

	async findByTagSorted(
		tagSlug: string,
		sortBy: ShareableSortProperty,
		direction: SortDirection
	): Promise<RawEntry[]> {
		const entries = await this.findByTag(tagSlug);
		return this.sortEntries(entries, sortBy, direction);
	}

	async findAllSorted(
		sortBy: ShareableSortProperty,
		direction: SortDirection
	): Promise<RawEntry[]> {
		const entries = await this.findAll();
		return this.sortEntries(entries, sortBy, direction);
	}

	private sortEntries(
		entries: RawEntry[],
		sortBy: ShareableSortProperty,
		direction: SortDirection
	): RawEntry[] {
		const sorted = entries.sort((a, b) => this.sortByProperty(a, b, sortBy));
		return direction === 'DESC' ? sorted : sorted.reverse();
	}

	private sortByProperty(a: RawEntry, b: RawEntry, property: ShareableSortProperty): number {
		switch (property) {
			case 'title':
				return sortAlphabetical(b.meta.title, a.meta.title);
			case 'published':
				return sortDate(new Date(b.meta.published), new Date(a.meta.published));
			case 'updated':
				return sortDate(new Date(b.meta.updated), new Date(a.meta.updated));
			default:
				return 0;
		}
	}
}
