import { atom, computed } from 'nanostores';
import type { Bookmark } from '$lib/types/bookmark';
import { BookmarkSortProperty, BookmarkStatus, SortDirection } from '$lib/types/enums';
import type { Tag } from '$lib/types/tag';
import { getUniqueTags } from '$lib/util/entries';
import { getSortedBookmarks, getFilteredBookmarks } from '$lib/data/bookmarks/helper';

export const initEntries = atom<Bookmark[]>([]);
export const tags = atom<Tag[]>([]);
export const filterTagSlug = atom<string>('all');
export const filterStatus = atom<BookmarkStatus>(BookmarkStatus.Empty);
export const sortProperty = atom<BookmarkSortProperty>(BookmarkSortProperty.Title);
export const sortDirection = atom<SortDirection>(SortDirection.Desc);

export const entries = computed(
	[initEntries, tags, filterTagSlug, filterStatus, sortProperty, sortDirection],
	(initEntries, tags, filterTagSlug, filterStatus, sortProperty, sortDirection) => {
		console.log('compute entries"');
		const filtered = getFilteredBookmarks(initEntries, filterTagSlug, filterStatus);
		return getSortedBookmarks(filtered, sortProperty, sortDirection);
	}
);

// TODO should/could be an action but the only benefit is the logging which I dont use, soooooo nah
export function init(entries: Bookmark[]) {
	if (initEntries.get().length !== 0) return
	const uniqueTags = getUniqueTags(entries);
	tags.set(uniqueTags);
	initEntries.set(entries);
}
