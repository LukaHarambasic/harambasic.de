import type { Shareable } from '$lib/types/shareable';
import type { EntryType, ShareableSortProperty } from '$lib/types/enums';
import { SortDirection } from '$lib/types/enums';
import { filterByTag, getDate, getTag, sortByDirection } from '$lib/util/entries';
import { getSlug, sortAlphabetical, sortDate } from '$lib/util/helper';
import type { RawEntry } from '$lib/types/entry';

export function filterAndSort(
	entries: Shareable[],
	filterTagSlug: string,
	sortProperty: ShareableSortProperty,
	sortDirection: SortDirection
): Shareable[] {
	return entries
		.filter((entry) => filterByTag(entry, filterTagSlug))
		.sort((a, b) => sortByProperty(a, b, sortProperty))
		.sort(() => sortByDirection(sortDirection));
}

export function getShareable(entry: RawEntry): Shareable {
	const meta = entry.meta;
	const type: EntryType = 'shareable';
	const slug = getSlug(meta.title);
	const relativePath = `/${type}s/${slug}`;
	return {
		type,
		title: meta.title,
		description: meta.description,
		comment: '', // TODO fix mapping
		tags: meta.tags.map((tag: string) => getTag(tag, type)) || [],
		published: getDate(meta.published),
		updated: getDate(meta.updated),
		url: meta.url || '',
		slug,
		relativePath,
		fullPath: `https://harambasic.de${relativePath}`
	};
}

function sortByProperty(a: Shareable, b: Shareable, property: ShareableSortProperty): number {
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
