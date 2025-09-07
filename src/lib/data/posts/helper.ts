import type { RawEntry } from '$lib/types/entry';
import type { EntryType } from '$lib/types/enums';
import { PostSortProperty, SortDirection } from '$lib/types/enums';
import type { Post } from '$lib/types/post';
import { filterByTag, getDate, getTag, sortByDirection } from '$lib/util/entries';
import { getSlug, sortAlphabetical, sortDate } from '$lib/util/helper';

export function filterAndSort(
	entries: Post[],
	filterTagSlug: string,
	sortProperty: PostSortProperty,
	sortDirection: SortDirection
): Post[] {
	return entries
		.filter((entry) => filterByTag(entry, filterTagSlug))
		.sort((a, b) => sortByProperty(a, b, sortProperty))
		.sort(() => sortByDirection(sortDirection));
}

export function sortByProperty(a: Post, b: Post, property: PostSortProperty): number {
	switch (property) {
		case PostSortProperty.Title:
			return sortAlphabetical(b.title, a.title);
		case PostSortProperty.Published:
			return sortDate(b.published.raw, a.published.raw);
		case PostSortProperty.Updated:
			return sortDate(b.updated.raw, a.updated.raw);
		default:
			return 0;
	}
}

export function getPost(entry: RawEntry): Post {
	const meta = entry.meta;
	const type: EntryType = 'post';
	const slug = getSlug(meta.title);
	const relativePath = `/${type}s/${slug}`;
	return {
		type,
		title: meta.title,
		description: meta.description,
		image: meta.image || '',
		tags: meta.tags.map((tag: string) => getTag(tag, type)) || [],
		published: getDate(meta.published),
		updated: getDate(meta.updated),
		tldr: meta.tldr || '',
		discussion: meta.discussion || '',
		toc: entry.toc,
		slug,
		relativePath,
		fullPath: `https://harambasic.de${relativePath}`,
		html: entry.html
	};
}
