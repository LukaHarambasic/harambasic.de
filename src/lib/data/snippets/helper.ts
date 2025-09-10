import type { RawEntry } from '$lib/types/entry';
import type { EntryType, SnippetSortProperty } from '$lib/types/enums';
import { SortDirection } from '$lib/types/enums';
import type { Snippet } from '$lib/types/snippet';
import { filterByTag, getDate, getTag, sortByDirection } from '$lib/util/entries';
import { getSlug, sortAlphabetical, sortDate } from '$lib/util/helper';

export function filterAndSort(
	entries: Snippet[],
	filterTagSlug: string,
	sortProperty: SnippetSortProperty,
	sortDirection: SortDirection
): Snippet[] {
	return entries
		.filter((entry) => filterByTag(entry, filterTagSlug))
		.sort((a, b) => sortByProperty(a, b, sortProperty))
		.sort(() => sortByDirection(sortDirection));
}

export function sortByProperty(a: Snippet, b: Snippet, property: SnippetSortProperty): number {
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

export function getSnippet(entry: RawEntry): Snippet | null {
	try {
		if (!entry || !entry.title || !entry.description) {
			console.warn('Invalid snippet entry:', entry);
			return null;
		}

		const type: EntryType = 'snippet';
		const slug = getSlug(entry.title);
		const relativePath = `/${type}s/${slug}`;
		return {
			type,
			title: entry.title,
			description: entry.description,
			image: entry.image || '',
			tags: (entry.tags || []).map((tag: string) => getTag(tag, type)),
			published: getDate(entry.published),
			updated: getDate(entry.updated),
			slug,
			relativePath,
			fullPath: `https://harambasic.de${relativePath}`,
			html: entry.html || ''
		};
	} catch (error) {
		console.error('Error processing snippet entry:', entry, error);
		return null;
	}
}
