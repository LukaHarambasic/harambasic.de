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

initEntries.listen((value: readonly Bookmark[]) => {
	const uniqueTags = getUniqueTags(value as Bookmark[]);
	initTags.set(uniqueTags);
	const sorted = getSortedBookmarks(value as Bookmark[], sortProperty.get(), sortDirection.get());
	entries.set(sorted);
});

initTags.listen((value: readonly Tag[]) => {
	tags.set(value as Tag[]);
});

filterTag.listen((value: Readonly<Tag>) => {
	const filtered = getFilteredProjects(initEntries.get(), value, filterStatus.get());
	const sortedAndFiltered = getSortedBookmarks(filtered, sortProperty.get(), sortDirection.get());
	entries.set(sortedAndFiltered);
});

filterStatus.listen((value: Readonly<BookmarkStatus>) => {
	const filtered = getFilteredProjects(initEntries.get(), filterTag.get(), value);
	const sortedAndFiltered = getSortedBookmarks(filtered, sortProperty.get(), sortDirection.get());
	entries.set(sortedAndFiltered);
});

sortProperty.listen((value: BookmarkSortProperty) => {
	const sorted = getSortedBookmarks(entries.get(), value, sortDirection.get());
	entries.set(sorted);
});

sortDirection.listen((value: SortDirection) => {
	const sorted = getSortedBookmarks(entries.get(), sortProperty.get(), value);
	entries.set(sorted);
});

