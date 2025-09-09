import type { UsesEntry } from '$lib/types/usesEntry';
import type { EntryType, UsesEntrySortProperty } from '$lib/types/enums';
import type { UsesEntryStatus } from '$lib/types/enums';
import { SortDirection } from '$lib/types/enums';
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
	const type: EntryType = 'uses';
	const slug = getSlug(entry.title);
	const relativePath = `/uses/${slug}`;

	// Validate required fields
	if (!entry.title || !entry.description || !entry.published || !entry.updated) {
		throw new Error(`Missing required fields in uses entry: ${entry.title || 'untitled'}`);
	}

	return {
		type,
		title: entry.title,
		description: entry.description,
		image: entry.image || '',
		tags: entry.tags?.map((tag: string) => getTag(tag, type)) || [],
		published: getDate(entry.published),
		updated: getDate(entry.updated),
		url: entry.url || '',
		status: (entry.status as UsesEntryStatus) || 'active',
		openSource: entry.openSource || false,
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
		case 'title':
			return sortAlphabetical(b.title, a.title);
		case 'published':
			return sortDate(b.published.raw, a.published.raw);
		case 'updated':
			return sortDate(b.updated.raw, a.updated.raw);
		default:
			return 0;
	}
}

function filterByStatus(entry: UsesEntry, filterStatus: UsesEntryStatus): boolean {
	if (filterStatus === 'all') return true;
	return entry.status === filterStatus;
}
