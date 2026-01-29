import type { BaseEntry } from '$lib/types/entry';
import type {
	ContentStatus,
	SortDirection,
	PostSortProperty,
	ProjectSortProperty,
	UsesEntrySortProperty,
	ProjectStatus,
	UsesEntryStatus,
	WorkEntrySortProperty
} from '$lib/types/enums';
import type { Post } from '$lib/types/post';
import type { Project } from '$lib/types/project';
import type { UsesEntry } from '$lib/types/usesEntry';
import type { WorkEntry } from '$lib/types/workEntry';
import { filterByTag } from './entries';
import { sortAlphabetical } from './helper';

export function filterByStatus<T extends BaseEntry & { status?: ContentStatus }>(
	entry: T,
	filterStatus: ContentStatus
): boolean {
	if (filterStatus === 'all') return true;
	return entry.status === filterStatus;
}

export function sortByProperty<T extends BaseEntry>(
	a: T,
	b: T,
	property: 'title' | 'published' | 'updated' | 'priority'
): number {
	switch (property) {
		case 'title':
			return sortAlphabetical(a.title, b.title);
		case 'published':
			return a.published.raw.getTime() - b.published.raw.getTime();
		case 'updated':
			return a.updated.raw.getTime() - b.updated.raw.getTime();
		case 'priority':
			if ('prio' in a && 'prio' in b) {
				return (a as T & { prio: number }).prio - (b as T & { prio: number }).prio;
			}
			return 0;
		default:
			return 0;
	}
}

export interface FilterAndSortOptions {
	filterTagSlug?: string;
	filterStatus?: ContentStatus;
	sortProperty: 'title' | 'published' | 'updated' | 'priority';
	sortDirection: SortDirection;
}

// Overloaded function signatures for positional parameters
export function filterAndSort(
	entries: Post[],
	filterTagSlug: string,
	sortProperty: PostSortProperty,
	sortDirection: SortDirection
): Post[];
export function filterAndSort(
	entries: Project[],
	filterTagSlug: string,
	filterStatus: ProjectStatus,
	sortProperty: ProjectSortProperty,
	sortDirection: SortDirection
): Project[];
export function filterAndSort(
	entries: UsesEntry[],
	filterTagSlug: string,
	filterStatus: UsesEntryStatus,
	sortProperty: UsesEntrySortProperty,
	sortDirection: SortDirection
): UsesEntry[];
export function filterAndSort(
	entries: WorkEntry[],
	filterTagSlug: string,
	filterStatus: ContentStatus,
	sortProperty: WorkEntrySortProperty,
	sortDirection: SortDirection
): WorkEntry[];
// Generic implementation with options object
export function filterAndSort<T extends BaseEntry>(
	entries: T[],
	options: FilterAndSortOptions
): T[];
// Implementation
export function filterAndSort<T extends BaseEntry>(
	entries: T[],
	optionsOrFilterTagSlug: FilterAndSortOptions | string,
	filterStatusOrSortProperty?:
		| ContentStatus
		| PostSortProperty
		| ProjectSortProperty
		| UsesEntrySortProperty
		| WorkEntrySortProperty,
	sortPropertyOrSortDirection?:
		| ProjectSortProperty
		| UsesEntrySortProperty
		| PostSortProperty
		| WorkEntrySortProperty
		| SortDirection,
	sortDirection?: SortDirection
): T[] {
	// Convert positional parameters to options object if needed
	let options: FilterAndSortOptions;

	if (typeof optionsOrFilterTagSlug === 'string') {
		// Positional parameters: determine which overload pattern based on number of arguments
		if (sortDirection !== undefined) {
			// Pattern: (entries, filterTagSlug, filterStatus, sortProperty, sortDirection) - Project or UsesEntry
			options = {
				filterTagSlug: optionsOrFilterTagSlug,
				filterStatus: filterStatusOrSortProperty as ContentStatus,
				sortProperty: sortPropertyOrSortDirection as 'title' | 'published' | 'updated' | 'priority',
				sortDirection: sortDirection
			};
		} else if (sortPropertyOrSortDirection !== undefined) {
			// Pattern: (entries, filterTagSlug, sortProperty, sortDirection) - Post
			options = {
				filterTagSlug: optionsOrFilterTagSlug,
				sortProperty: filterStatusOrSortProperty as 'title' | 'published' | 'updated' | 'priority',
				sortDirection: sortPropertyOrSortDirection as SortDirection
			};
		} else {
			// Fallback (shouldn't happen with proper overloads)
			options = {
				filterTagSlug: optionsOrFilterTagSlug,
				sortProperty: filterStatusOrSortProperty as 'title' | 'published' | 'updated' | 'priority',
				sortDirection: 'DESC'
			};
		}
	} else {
		// Options object pattern
		options = optionsOrFilterTagSlug;
	}

	let filtered = entries;

	if (options.filterTagSlug !== undefined) {
		filtered = filtered.filter((entry) =>
			filterByTag(
				entry as unknown as Post | Project | UsesEntry | WorkEntry,
				options.filterTagSlug!
			)
		);
	}

	if (options.filterStatus !== undefined) {
		filtered = filtered.filter((entry) => {
			if ('status' in entry) {
				return filterByStatus(entry as T & { status?: ContentStatus }, options.filterStatus!);
			}
			return true;
		});
	}

	const sorted = filtered.sort((a, b) => sortByProperty(a, b, options.sortProperty));

	return options.sortDirection === 'ASC' ? sorted : sorted.reverse();
}
