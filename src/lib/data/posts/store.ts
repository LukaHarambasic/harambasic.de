import { atom, computed } from 'nanostores';
import { PostSortProperty, SortDirection } from '$lib/types/enums';
import type { Post } from '$lib/types/post';
import type { Tag } from '$lib/types/tag';
import { getUniqueTags } from '$lib/util/entries';
import { getSortedPosts, getFilteredPosts } from './helper';

export const initEntries = atom<Post[]>([]);
export const tags = atom<Tag[]>([]);
export const filterTagSlug = atom<string>('all');
export const sortProperty = atom<PostSortProperty>(PostSortProperty.Title);
export const sortDirection = atom<SortDirection>(SortDirection.Desc);

export const entries = computed(
	[initEntries, tags, filterTagSlug, sortProperty, sortDirection],
	(initEntries, tags, filterTagSlug, sortProperty, sortDirection) => {
		const filtered = getFilteredPosts(initEntries, filterTagSlug);
		return getSortedPosts(filtered, sortProperty, sortDirection);
	}
);

// TODO should/could be an action but the only benefit is the logging which I dont use, soooooo nah
export function init(entries: Post[]) {
	if (initEntries.get().length !== 0) return;
	const uniqueTags = getUniqueTags(entries);
	tags.set(uniqueTags);
	initEntries.set(entries);
}
