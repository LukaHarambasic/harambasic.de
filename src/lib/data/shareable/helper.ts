import type { Shareable } from '$lib/types/shareable';
import type { EntryType, ShareableSortProperty } from '$lib/types/enums';
import { SortDirection } from '$lib/types/enums';
import { filterByTag, getDate, getTag } from '$lib/util/entries';
import { getSlug, sortAlphabetical } from '$lib/util/helper';
import type { RawEntry } from '$lib/types/entry';

export function filterAndSort(
	entries: Shareable[],
	filterTagSlug: string,
	sortProperty: ShareableSortProperty,
	sortDirection: SortDirection
): Shareable[] {
	const sorted = entries
		.filter((entry) => filterByTag(entry, filterTagSlug))
		.sort((a, b) => sortByProperty(a, b, sortProperty));

	return sortDirection === SortDirection.Asc ? sorted : sorted.reverse();
}

export function getShareable(entry: RawEntry): Shareable {
	const type: EntryType = 'shareable';
	const slug = getSlug(entry.title);
	const relativePath = `/${type}s/${slug}`;
	return {
		type,
		title: entry.title,
		description: entry.description,
		comment: entry.tldr || '',
		tags: (entry.tags || []).map((tag: string) => getTag(tag, type)),
		published: getDate(entry.published),
		updated: getDate(entry.updated),
		url: entry.url || '',
		slug,
		relativePath,
		fullPath: `https://harambasic.de${relativePath}`
	};
}

function sortByProperty(a: Shareable, b: Shareable, property: ShareableSortProperty): number {
	switch (property) {
		case 'title':
			return sortAlphabetical(a.title, b.title);
		case 'published':
			return a.published.raw.getTime() - b.published.raw.getTime(); // ASC order (oldest first)
		case 'updated':
			return a.updated.raw.getTime() - b.updated.raw.getTime(); // ASC order (oldest first)
		default:
			return 0;
	}
}
