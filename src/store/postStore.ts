import { EntryType, PostSortProperty, SortDirection } from '../types/enums';
import type { Post, TocNode } from '../types/post';
import type { Tag } from '../types/tag';
import { getDate, getTag, getUniqueTags } from '../util/entries';
import { getSlug, sortAlphabetical, sortDate } from '../util/helper';
import { MarkdownHeading } from 'astro';
import { atom } from 'nanostores';

const initialTag: Tag = getTag('all', EntryType.Post);

export const initEntries = atom<Post[]>([]);
export const initTags = atom<Tag[]>([]);
export let entries = atom<Post[]>([]);
export let tags = atom<Tag[]>([]);
export let filterTag = atom<Tag>(initialTag);
export let sortProperty = atom<PostSortProperty>(PostSortProperty.Title);
export let sortDirection = atom<SortDirection>(SortDirection.Desc);

export function init(raw: any) {
	const enrichedEntries = raw.map(_getPost);
	console.log(enrichedEntries);
	initEntries.set(enrichedEntries);
}

initEntries.listen((value: readonly Post[]) => {
	const uniqueTags = getUniqueTags(value as Post[]);
	initTags.set(uniqueTags);
	const sorted = getSortedPosts(value as Post[], sortProperty.get(), sortDirection.get());
	entries.set(sorted);
});

initTags.listen((value: readonly Tag[]) => {
	tags.set(value as Tag[]);
});

filterTag.listen((value: Readonly<Tag>) => {
	const filtered = getFilteredPosts(initEntries.get(), value);
	const sortedAndFiltered = getSortedPosts(filtered, sortProperty.get(), sortDirection.get());
	entries.set(sortedAndFiltered);
});

sortProperty.listen((value: PostSortProperty) => {
	const sorted = getSortedPosts(entries.get(), value, sortDirection.get());
	entries.set(sorted);
});

sortDirection.listen((value: SortDirection) => {
	const sorted = getSortedPosts(entries.get(), sortProperty.get(), value);
	entries.set(sorted);
});

function getSortedPosts(
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

function getFilteredPosts(unfiltered: Post[], filteringTag: Tag): Post[] {
	const entriesCopy = JSON.parse(JSON.stringify(unfiltered));
	if (filteringTag.slug === 'all') {
		return entriesCopy;
	}
	return entriesCopy.filter((entry: Post) => {
		return entry.tags.some((tag) => tag.slug === filteringTag.slug);
	});
}

export function _getPost(e: any): Post {
	const f = e.frontmatter;
	const type = EntryType.Post;
	const slug = getSlug(f.title);
	const relativePath = `/${type.toLowerCase()}s/${slug}`;
	return {
		type,
		title: f.title,
		description: f.description,
		image: f.image || '',
		tags: f.tags.map((tag) => getTag(tag, type)),
		published: getDate(f.published),
		updated: getDate(f.updated),
		toc: getNestedToc(e.getHeadings()),
		tldr: f.tldr,
		discussion: f.discussion,
		Content: e.Content,
		slug,
		relativePath,
		fullPath: `https://harambasic.de${relativePath}`,
	};
}

// TODO test
// TODO can this be rewritten in a nicer way?
// provided by https://codepen.io/Frnak/pen/mdmEjyG?editors=0011
function getNestedToc(markdownHeading: MarkdownHeading[]): TocNode[] {
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
		let latestEntryDepth = latestEntry?.depth || 0;
		let latestEntryChildren = latestEntry?.children || [];
		let latestParentChildren = latestParent?.children || [];
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
