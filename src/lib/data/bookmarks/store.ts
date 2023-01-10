
import { atom } from 'nanostores';
import type { Bookmark } from '$lib/types/bookmark';
import { BookmarkSortProperty, BookmarkStatus, EntryType, SortDirection } from '$lib/types/enums';
import type { Tag } from '$lib/types/tag';
import { getTag, getUniqueTags } from '$lib/util/entries';
import { getBookmark, getSortedBookmarks, getFilteredProjects } from '$lib/data/bookmarks/helper';

const initialTag: Tag = getTag('all', EntryType.Project);

export const initEntries = atom<Bookmark[]>([]);
export const initTags = atom<Tag[]>([]);
export let entries = atom<Bookmark[]>([]);
export let tags = atom<Tag[]>([]);
export let filterTag = atom<Tag>(initialTag);
export let filterStatus = atom<BookmarkStatus>(BookmarkStatus.Empty);
export let sortProperty = atom<BookmarkSortProperty>(BookmarkSortProperty.Title);
export let sortDirection = atom<SortDirection>(SortDirection.Desc);


export function init(raw: any) {
	const enrichedEntries = raw.map(getBookmark);
	initEntries.set(enrichedEntries);
}

initEntries.subscribe((value: readonly Bookmark[]) => {
	const uniqueTags = getUniqueTags(value as Bookmark[]);
	initTags.set(uniqueTags);
	const sorted = getSortedBookmarks(value as Bookmark[], $sortProperty, $sortDirection);
	entries.set(sorted);
});

initTags.subscribe((value: readonly Tag[]) => {
	tags.set(value as Tag[]);
});

filterTag.subscribe((value: Readonly<Tag>) => {
	const filtered = getFilteredProjects(initEntries, value, filterStatus);
	const sortedAndFiltered = getSortedBookmarks(filtered, sortProperty, sortDirection);
	entries.set(sortedAndFiltered);
});

filterStatus.subscribe((value: Readonly<BookmarkStatus>) => {
	const filtered = getFilteredProjects(initEntries, filterTag, value);
	const sortedAndFiltered = getSortedBookmarks(filtered, sortProperty, sortDirection);
	entries.set(sortedAndFiltered);
});

sortProperty.subscribe((value: BookmarkSortProperty) => {
	const sorted = getSortedBookmarks(entries, value, sortDirection);
	entries.set(sorted);
});

sortDirection.subscribe((value: SortDirection) => {
	const sorted = getSortedBookmarks(entries, sortProperty, value);
	entries.set(sorted);
});
