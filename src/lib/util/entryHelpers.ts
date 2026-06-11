import type { BaseEntry } from '$lib/types/entry';
import type {
	ContentStatus,
	SortDirection,
	PostSortProperty,
	UsesEntrySortProperty,
	UsesEntryStatus,
	ExperienceEntrySortProperty
} from '$lib/types/enums';
import type { Post } from '$lib/types/post';
import type { UsesEntry } from '$lib/types/usesEntry';
import type { ExperienceEntry } from '$lib/types/experienceEntry';
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
	property: 'title' | 'published' | 'updated'
): number {
	switch (property) {
		case 'title':
			return sortAlphabetical(a.title, b.title);
		case 'published':
			return a.published.raw.getTime() - b.published.raw.getTime();
		case 'updated':
			return a.updated.raw.getTime() - b.updated.raw.getTime();
		default:
			return 0;
	}
}

export interface FilterAndSortOptions {
	filterTagSlug?: string;
	filterStatus?: ContentStatus;
	sortProperty: 'title' | 'published' | 'updated';
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
	entries: UsesEntry[],
	filterTagSlug: string,
	filterStatus: UsesEntryStatus,
	sortProperty: UsesEntrySortProperty,
	sortDirection: SortDirection
): UsesEntry[];
export function filterAndSort(
	entries: ExperienceEntry[],
	filterTagSlug: string,
	filterStatus: ContentStatus,
	sortProperty: ExperienceEntrySortProperty,
	sortDirection: SortDirection
): ExperienceEntry[];
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
		| UsesEntrySortProperty
		| ExperienceEntrySortProperty,
	sortPropertyOrSortDirection?:
		| UsesEntrySortProperty
		| PostSortProperty
		| ExperienceEntrySortProperty
		| SortDirection,
	sortDirection?: SortDirection
): T[] {
	// Convert positional parameters to options object if needed
	let options: FilterAndSortOptions;

	if (typeof optionsOrFilterTagSlug === 'string') {
		// Positional parameters: determine which overload pattern based on number of arguments
		if (sortDirection !== undefined) {
			// Pattern: (entries, filterTagSlug, filterStatus, sortProperty, sortDirection) - UsesEntry or ExperienceEntry
			options = {
				filterTagSlug: optionsOrFilterTagSlug,
				filterStatus: filterStatusOrSortProperty as ContentStatus,
				sortProperty: sortPropertyOrSortDirection as 'title' | 'published' | 'updated',
				sortDirection: sortDirection
			};
		} else if (sortPropertyOrSortDirection !== undefined) {
			// Pattern: (entries, filterTagSlug, sortProperty, sortDirection) - Post
			options = {
				filterTagSlug: optionsOrFilterTagSlug,
				sortProperty: filterStatusOrSortProperty as 'title' | 'published' | 'updated',
				sortDirection: sortPropertyOrSortDirection as SortDirection
			};
		} else {
			// Fallback (shouldn't happen with proper overloads)
			options = {
				filterTagSlug: optionsOrFilterTagSlug,
				sortProperty: filterStatusOrSortProperty as 'title' | 'published' | 'updated',
				sortDirection: 'DESC'
			};
		}
	} else {
		// Options object pattern
		options = optionsOrFilterTagSlug;
	}

	let filtered = entries;

	const filterTagSlug = options.filterTagSlug;
	if (filterTagSlug !== undefined) {
		filtered = filtered.filter((entry) =>
			filterByTag(entry as unknown as Post | UsesEntry | ExperienceEntry, filterTagSlug)
		);
	}

	const filterStatus = options.filterStatus;
	if (filterStatus !== undefined) {
		filtered = filtered.filter((entry) => {
			if ('status' in entry) {
				return filterByStatus(entry as T & { status?: ContentStatus }, filterStatus);
			}
			return true;
		});
	}

	const sorted = filtered.sort((a, b) => sortByProperty(a, b, options.sortProperty));

	return options.sortDirection === 'ASC' ? sorted : sorted.reverse();
}
