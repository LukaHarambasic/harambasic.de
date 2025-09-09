import type { RawEntry } from '$lib/types/entry';
import type {
	UsesEntrySortProperty,
	SortDirection,
	ContentStatus,
	EntryType
} from '$lib/types/enums';
import type { ContentService } from '$lib/services/ContentService';
import type { UsesRepository } from '../UsesRepository';
import { FileSystemContentRepository } from './FileSystemContentRepository';
import { sortAlphabetical, sortDate } from '$lib/util/helper';

/**
 * FileSystem implementation of UsesRepository
 * Implements uses-specific query operations
 */
export class FileSystemUsesRepository
	extends FileSystemContentRepository
	implements UsesRepository
{
	protected readonly entryType: EntryType = 'uses';

	constructor(contentService: ContentService) {
		super(contentService);
	}

	async findRecommended(): Promise<RawEntry[]> {
		const entries = await this.findAll();
		return entries.filter((entry) => entry.meta.status === 'active');
	}

	async findByCategory(category: string): Promise<RawEntry[]> {
		const entries = await this.findAll();
		return entries.filter(
			(entry) =>
				entry.meta.tags &&
				entry.meta.tags.some((tag) => tag.toLowerCase().includes(category.toLowerCase()))
		);
	}

	async findFilteredAndSorted(
		tagSlug: string,
		status: ContentStatus,
		sortBy: UsesEntrySortProperty,
		direction: SortDirection
	): Promise<RawEntry[]> {
		const entries = await this.findAll();

		const filtered = entries
			.filter((entry) => tagSlug === '' || this.hasTag(entry, tagSlug))
			.filter((entry) => this.filterByStatus(entry, status));

		return this.sortEntries(filtered, sortBy, direction);
	}

	async findAllSorted(
		sortBy: UsesEntrySortProperty,
		direction: SortDirection
	): Promise<RawEntry[]> {
		const entries = await this.findAll();
		return this.sortEntries(entries, sortBy, direction);
	}

	private filterByStatus(entry: RawEntry, filterStatus: ContentStatus): boolean {
		if (filterStatus === 'all') return true;
		return entry.meta.status === filterStatus;
	}

	private sortEntries(
		entries: RawEntry[],
		sortBy: UsesEntrySortProperty,
		direction: SortDirection
	): RawEntry[] {
		const sorted = entries.sort((a, b) => this.sortByProperty(a, b, sortBy));
		return direction === 'DESC' ? sorted : sorted.reverse();
	}

	private sortByProperty(a: RawEntry, b: RawEntry, property: UsesEntrySortProperty): number {
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
