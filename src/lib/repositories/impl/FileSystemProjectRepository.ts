import type { RawEntry } from '$lib/types/entry';
import type {
	ProjectSortProperty,
	SortDirection,
	ContentStatus,
	EntryType
} from '$lib/types/enums';
import type { ContentService } from '$lib/services/ContentService';
import type { ProjectRepository } from '../ProjectRepository';
import { FileSystemContentRepository } from './FileSystemContentRepository';
import { sortAlphabetical, sortDate, sortNumber } from '$lib/util/helper';

/**
 * FileSystem implementation of ProjectRepository
 * Implements project-specific query operations
 */
export class FileSystemProjectRepository
	extends FileSystemContentRepository
	implements ProjectRepository
{
	protected readonly entryType: EntryType = 'project';

	constructor(contentService: ContentService) {
		super(contentService);
	}

	async findByOpenSource(isOpenSource: boolean): Promise<RawEntry[]> {
		const entries = await this.findAll();
		return entries.filter((entry) => {
			const openSource = entry.meta.openSource;
			return isOpenSource ? !!openSource : !openSource;
		});
	}

	async findByPriority(minPriority: number): Promise<RawEntry[]> {
		const entries = await this.findAll();
		return entries.filter((entry) => {
			const prio = entry.meta.prio || 0;
			return prio >= minPriority;
		});
	}

	async findWithLinks(): Promise<RawEntry[]> {
		const entries = await this.findAll();
		return entries.filter((entry) => entry.meta.links && entry.meta.links.length > 0);
	}

	async findFilteredAndSorted(
		tagSlug: string,
		status: ContentStatus,
		sortBy: ProjectSortProperty,
		direction: SortDirection
	): Promise<RawEntry[]> {
		const entries = await this.findAll();

		const filtered = entries
			.filter((entry) => tagSlug === '' || this.hasTag(entry, tagSlug))
			.filter((entry) => this.filterByStatus(entry, status));

		return this.sortEntries(filtered, sortBy, direction);
	}

	async findAllSorted(sortBy: ProjectSortProperty, direction: SortDirection): Promise<RawEntry[]> {
		const entries = await this.findAll();
		return this.sortEntries(entries, sortBy, direction);
	}

	async findHighPriorityProjects(limit: number = 10): Promise<RawEntry[]> {
		const entries = await this.findAll();
		return entries
			.filter((entry) => (entry.meta.prio || 0) > 0)
			.sort((a, b) => (b.meta.prio || 0) - (a.meta.prio || 0))
			.slice(0, limit);
	}

	private filterByStatus(entry: RawEntry, filterStatus: ContentStatus): boolean {
		if (filterStatus === 'all') return true;
		return entry.meta.status === filterStatus;
	}

	private sortEntries(
		entries: RawEntry[],
		sortBy: ProjectSortProperty,
		direction: SortDirection
	): RawEntry[] {
		const sorted = entries.sort((a, b) => this.sortByProperty(a, b, sortBy));
		return direction === 'DESC' ? sorted : sorted.reverse();
	}

	private sortByProperty(a: RawEntry, b: RawEntry, property: ProjectSortProperty): number {
		switch (property) {
			case 'title':
				return sortAlphabetical(b.meta.title, a.meta.title);
			case 'priority':
				return sortNumber(b.meta.prio || 0, a.meta.prio || 0);
			case 'published':
				return sortDate(new Date(b.meta.published), new Date(a.meta.published));
			case 'updated':
				return sortDate(new Date(b.meta.updated), new Date(a.meta.updated));
			default:
				return 0;
		}
	}
}
