import { filterStatus } from "$lib/data/bookmarks/store";
import type { Bookmark } from "$lib/types/bookmark";
import { BookmarkSortProperty, BookmarkStatus, EntryType, SortDirection,  } from "$lib/types/enums";
import type { Tag } from "$lib/types/tag";
import { getDate } from "date-fns";
import { getTag } from "$lib/util/entries";
import { sortAlphabetical, sortDate, getSlug } from "$lib/util/helper";

export function getSortedBookmarks(
	unsorted: Bookmark[],
	property: BookmarkSortProperty,
	direction: SortDirection
): Bookmark[] {
	const entriesCopy = JSON.parse(JSON.stringify(unsorted));
	switch (property) {
		case BookmarkSortProperty.Title:
			if (direction === SortDirection.Asc) {
				return entriesCopy.sort((a: Bookmark, b: Bookmark) => sortAlphabetical(a.title, b.title));
			} else if (direction === SortDirection.Desc) {
				return entriesCopy.sort((a: Bookmark, b: Bookmark) => sortAlphabetical(b.title, a.title));
			}
			break;
		case BookmarkSortProperty.Published:
			if (direction === SortDirection.Asc) {
				return entriesCopy.sort((a: Bookmark, b: Bookmark) =>
					sortDate(b.published.raw, a.published.raw)
				);
			} else if (direction === SortDirection.Desc) {
				return entriesCopy.sort((a: Bookmark, b: Bookmark) =>
					sortDate(a.published.raw, b.published.raw)
				);
			}
			break;
		case BookmarkSortProperty.Updated:
			if (direction === SortDirection.Asc) {
				return entriesCopy.sort((a: Bookmark, b: Bookmark) =>
					sortDate(b.updated.raw, a.updated.raw)
				);
			} else if (direction === SortDirection.Desc) {
				return entriesCopy.sort((a: Bookmark, b: Bookmark) =>
					sortDate(a.updated.raw, b.updated.raw)
				);
			}
			break;
		default:
			return [];
	}
	return [];
}

export function getFilteredProjects(
	unfiltered: Bookmark[],
	filteringTag: Tag,
	filteringStatus: BookmarkStatus
): Bookmark[] {
	const entriesCopy = JSON.parse(JSON.stringify(unfiltered));
	const showAll = filteringTag.slug === 'all' && filteringStatus === BookmarkStatus.Empty;
	if (showAll) {
		return entriesCopy;
	}
	const onlyFilterTags = filteringTag.slug !== 'all' && filteringStatus === BookmarkStatus.Empty;
	if (onlyFilterTags) {
		return entriesCopy.filter((entry: Bookmark) => {
			return entry.tags.some((tag) => tag.slug === filteringTag.slug);
		});
	}
	const onlyFilterStatus = filteringTag.slug === 'all' && filteringStatus !== BookmarkStatus.Empty;
	if (onlyFilterStatus) {
		return entriesCopy.filter((entry: Bookmark) => entry.status === filteringStatus);
	}
	// TODO
	return entriesCopy.filter((entry: any): Bookmark[] => {
		const hasTag = entry.tags.some((tag: Tag) => tag.slug === filteringTag.slug);
		const hasStatus = entry.status == filterStatus;
		return hasTag && hasStatus;
	});
}

export function getBookmark(bookmark: any): Bookmark {
	const f = bookmark.fields;
	const type = EntryType.Bookmark;
	const slug = getSlug(f.Title);
	const relativePath = `/${type.toLowerCase()}s/${slug}`;
	const rawTags = [f.Tag];
	return {
		type,
		title: f.Title,
		description: f.Description,
		image: f.Image || '',
		tags: rawTags.map((tag) => getTag(tag, type)),
		published: getDate(f.Published),
		updated: getDate(f.Updated),
		url: f.URL,
		status: f.Status,
		openSource: f.OpenSource,
		slug,
		relativePath,
		fullPath: `https://harambasic.de${relativePath}`,
	};
}