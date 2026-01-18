import type { BaseEntry } from '$lib/types/entry';
import type { ContentStatus, SortDirection } from '$lib/types/enums';
import type { Post } from '$lib/types/post';
import type { Project } from '$lib/types/project';
import type { UsesEntry } from '$lib/types/usesEntry';
import type { Shareable } from '$lib/types/shareable';
import type { Snippet } from '$lib/types/snippet';
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

export function filterAndSort<T extends BaseEntry>(
	entries: T[],
	options: FilterAndSortOptions
): T[] {
	let filtered = entries;

	if (options.filterTagSlug !== undefined) {
		filtered = filtered.filter((entry) =>
			filterByTag(entry as unknown as Post | Project | UsesEntry | Shareable | Snippet, options.filterTagSlug!)
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
