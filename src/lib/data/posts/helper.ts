import { PostSortProperty, SortDirection, EntryType } from '$lib/types/enums';
import type { Post, TocNode } from '$lib/types/post';
import type { Tag } from '$lib/types/tag';
import { getTag, getDate } from '$lib/util/entries';
import { sortAlphabetical, sortDate, getSlug } from '$lib/util/helper';

export function getSortedPosts(
	unsorted: Post[],
	property: PostSortProperty,
	direction: SortDirection
): Post[] {
	const entriesCopy = JSON.parse(JSON.stringify(unsorted));
	switch (property) {
		case PostSortProperty.Title:
			if (direction === SortDirection.Asc) {
				return entriesCopy.sort((a: Post, b: Post) => sortAlphabetical(a.title, b.title));
			} else if (direction === SortDirection.Desc) {
				return entriesCopy.sort((a: Post, b: Post) => sortAlphabetical(b.title, a.title));
			}
			break;
		case PostSortProperty.Published:
			if (direction === SortDirection.Asc) {
				return entriesCopy.sort((a: Post, b: Post) => sortDate(b.published.raw, a.published.raw));
			} else if (direction === SortDirection.Desc) {
				return entriesCopy.sort((a: Post, b: Post) => sortDate(a.published.raw, b.published.raw));
			}
			break;
		case PostSortProperty.Updated:
			if (direction === SortDirection.Asc) {
				return entriesCopy.sort((a: Post, b: Post) => sortDate(b.updated.raw, a.updated.raw));
			} else if (direction === SortDirection.Desc) {
				return entriesCopy.sort((a: Post, b: Post) => sortDate(a.updated.raw, b.updated.raw));
			}
			break;
		default:
			return [];
	}
	return [];
}

export function getFilteredPosts(unfiltered: Post[], filteringTag: Tag): Post[] {
	const entriesCopy = JSON.parse(JSON.stringify(unfiltered));
	if (filteringTag.slug === 'all') {
		return entriesCopy;
	}
	return entriesCopy.filter((entry: Post) => {
		return entry.tags.some((tag) => tag.slug === filteringTag.slug);
	});
}

export function getPost(entry: any): Post {
	const meta = entry.meta;
	const type = EntryType.Post;
	const slug = getSlug(meta.title);
	const relativePath = `/${type.toLowerCase()}s/${slug}`;
	// TODO add toc: getNestedToc(entry.getHeadings()),
	return {
		type,
		title: meta.title,
		description: meta.description,
		image: meta.image || '',
		tags: meta.tags.map((tag: string) => getTag(tag, type)),
		published: getDate(meta.published),
		updated: getDate(meta.updated),
		tldr: meta.tldr,
		discussion: meta.discussion,
		toc: [],
		slug,
		relativePath,
		fullPath: `https://harambasic.de${relativePath}`,
		html: entry.html
	};
}

// TODO test
// TODO can this be rewritten in a nicer way?
// provided by https://codepen.io/Frnak/pen/mdmEjyG?editors=0011
// TODO fix markdownHeadings any
export function getNestedToc(markdownHeading: any): TocNode[] {
	let latestEntry: TocNode | null;
	let latestParent: TocNode | null;
	const markdownHeadingCopy = JSON.parse(JSON.stringify(markdownHeading));
	if (markdownHeadingCopy.length <= 1) return markdownHeadingCopy;
	const entryDepth = markdownHeading.reduce((acc, item) => {
		return item.depth < acc ? item.depth : acc;
	}, Number.POSITIVE_INFINITY);
	return markdownHeadingCopy.reduce((result, entry) => {
		if (latestEntry && !latestEntry.children) {
			latestEntry.children = [];
		}
		const latestEntryDepth = latestEntry?.depth || 0;
		const latestEntryChildren = latestEntry?.children || [];
		const latestParentChildren = latestParent?.children || [];
		if (entry.depth === entryDepth) {
			entry.children = [];
			result.push(entry);
			latestParent = null;
		} else if (entry.depth === latestEntryDepth + 1) {
			latestEntryChildren.push(entry);
			latestParent = latestEntry;
		} else if (entry.depth === latestEntryDepth) {
			latestParentChildren.push(entry);
		} else {
			console.error('Unexpected Toc behaviour', entry);
		}
		latestEntry = entry;
		return result;
	}, []);
}
