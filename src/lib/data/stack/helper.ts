import type { StackEntry } from '$lib/types/stackEntry';
import {
	EntryType,
	SortDirection,
	StackEntrySortProperty,
	StackEntryStatus
} from '$lib/types/enums';
import { filterByTag, getDate, getTag, sortByDirection } from '$lib/util/entries';
import { getSlug, sortAlphabetical, sortDate } from '$lib/util/helper';
import type { RawEntry } from '$lib/types/entry';

export function filterAndSort(
	entries: StackEntry[],
	filterTagSlug: string,
	filterStatus: StackEntryStatus,
	sortProperty: StackEntrySortProperty,
	sortDirection: SortDirection
): StackEntry[] {
	return entries
		.filter((entry) => filterByTag(entry, filterTagSlug))
		.filter((entry) => filterByStatus(entry, filterStatus))
		.sort((a, b) => sortByProperty(a, b, sortProperty))
		.sort(() => sortByDirection(sortDirection));
}

export function getStackEntry(entry: RawEntry): StackEntry {
	if (!entry.meta) {
		throw new Error('Missing meta data');
	}
	const meta = entry.meta;
	const type = EntryType.StackEntry;
	const slug = getSlug(meta.title);
	const relativePath = `/stack/${slug}`;
	return {
		type,
		title: meta.title,
		description: meta.description,
		image: meta.image || '',
		tags: meta.tags.map((tag: string) => getTag(tag, type)) || [],
		published: getDate(meta.published),
		updated: getDate(meta.updated),
		url: meta.url || '',
		status: meta.status,
		openSource: meta.openSource || false,
		slug,
		relativePath,
		fullPath: `https://harambasic.de${relativePath}`
	};
}

function sortByProperty(a: StackEntry, b: StackEntry, property: StackEntrySortProperty): number {
	switch (property) {
		case StackEntrySortProperty.Title:
			return sortAlphabetical(b.title, a.title);
		case StackEntrySortProperty.Published:
			return sortDate(b.published.raw, a.published.raw);
		case StackEntrySortProperty.Updated:
			return sortDate(b.updated.raw, a.updated.raw);
		default:
			return 0;
	}
}

function filterByStatus(entry: StackEntry, filterStatus: StackEntryStatus): boolean {
	if (filterStatus === StackEntryStatus.All) return true;
	return entry.status === filterStatus;
}
