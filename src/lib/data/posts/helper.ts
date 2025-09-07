import type { RawEntry } from '$lib/types/entry';
import { EntryType, SortDirection } from '$lib/types/enums';
import type { PostSortProperty } from '$lib/types/enums';
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

export function getPost(entry: RawEntry): Post {
	const type = EntryType.Post;
	const slug = getSlug(entry.title);
	const relativePath = `/${type.toLowerCase()}s/${slug}`;
	return {
		type,
		title: entry.title,
		description: entry.description,
		image: entry.image || '',
		tags: entry.tags.map((tag: string) => getTag(tag, type)) || [],
		published: getDate(entry.published),
		updated: getDate(entry.updated),
		tldr: entry.tldr || '',
		discussion: entry.discussion || '',
		toc: entry.toc,
		slug,
		relativePath,
		fullPath: `https://harambasic.de${relativePath}`,
		html: entry.html
	};
}
