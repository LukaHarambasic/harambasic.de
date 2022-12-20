import { EntryType, PostSortProperty, SortDirection } from "$lib/types/enums";
import type { Post } from "$lib/types/post";
import type { Tag } from "$lib/types/tag";
import { getTag, getUniqueTags } from "$lib/util/entries";
import { getPost, getSortedPosts, getFilteredPosts } from "./helper";

const initialTag: Tag = getTag('all', EntryType.Post);

export const initEntries = atom<Post[]>([]);
export const initTags = atom<Tag[]>([]);
export let entries = atom<Post[]>([]);
export let tags = atom<Tag[]>([]);
export let filterTag = atom<Tag>(initialTag);
export let sortProperty = atom<PostSortProperty>(PostSortProperty.Title);
export let sortDirection = atom<SortDirection>(SortDirection.Desc);

export function init(raw: any) {
	const enrichedEntries = raw.map(getPost);
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
