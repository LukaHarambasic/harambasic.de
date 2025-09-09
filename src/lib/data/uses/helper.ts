import type { UsesEntry } from '$lib/types/usesEntry';
import type { EntryType, UsesEntrySortProperty } from '$lib/types/enums';
import { SortDirection } from '$lib/types/enums';
import type { UsesEntryStatus } from '$lib/types/enums';
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
	const slug = getSlug(entry.meta.title);
	const relativePath = `/uses/${slug}`;

	// Validate required fields
	if (
		!entry.meta.title ||
		!entry.meta.description ||
		!entry.meta.published ||
		!entry.meta.updated
	) {
		throw new Error(`Missing required fields in uses entry: ${entry.meta.title || 'untitled'}`);
	}

	return {
		type,
		title: entry.meta.title,
		description: entry.meta.description,
		image: entry.meta.image || '',
		tags: entry.meta.tags?.map((tag: string) => getTag(tag, type)) || [],
		published: getDate(entry.meta.published),
		updated: getDate(entry.meta.updated),
		url: entry.meta.url || '',
		status: (entry.meta.status as UsesEntryStatus) || 'active',
		openSource: entry.meta.openSource || false,
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
