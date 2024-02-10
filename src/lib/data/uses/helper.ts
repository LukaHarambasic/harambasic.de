import type { UsesEntry } from '$lib/types/usesEntry';
import {
	EntryType,
	SortDirection,
	UsesEntrySortProperty,
	UsesEntryStatus
} from '$lib/types/enums';
import { filterByTag, getDate, getTag, sortByDirection } from '$lib/util/entries';
import { getSlug, sortAlphabetical, sortDate } from '$lib/util/helper';
import type { RawEntry } from '$lib/types/entry';

export function filterAndSort(
	entries: UsesEntry[],
	filterTagSlug: string,
	filterStatus: UsesEntryStatus,
	sortProperty: UsesEntrySortProperty,
	sortDirection: SortDirection
): UsesEntry[] {
	return entries
		.filter((entry) => filterByTag(entry, filterTagSlug))
		.filter((entry) => filterByStatus(entry, filterStatus))
		.sort((a, b) => sortByProperty(a, b, sortProperty))
		.sort(() => sortByDirection(sortDirection));
}

export function getUsesEntry(entry: RawEntry): UsesEntry {
	if (!entry.meta) {
		throw new Error('Missing meta data');
	}
	const meta = entry.meta;
	const type = EntryType.UsesEntry;
	const slug = getSlug(meta.title);
	const relativePath = `/uses/${slug}`;
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

export function sortByProperty(
	a: UsesEntry,
	b: UsesEntry,
	property: UsesEntrySortProperty
): number {
	switch (property) {
		case UsesEntrySortProperty.Title:
			return sortAlphabetical(b.title, a.title);
		case UsesEntrySortProperty.Published:
			return sortDate(b.published.raw, a.published.raw);
		case UsesEntrySortProperty.Updated:
			return sortDate(b.updated.raw, a.updated.raw);
		default:
			return 0;
	}
}

function filterByStatus(entry: UsesEntry, filterStatus: UsesEntryStatus): boolean {
	if (filterStatus === UsesEntryStatus.All) return true;
	return entry.status === filterStatus;
}
