import { atom } from 'nanostores'
import type { Bookmark } from '../types/bookmark';
import type { Tag } from '../types/tag';
import { BookmarkSortProperty, BookmarkStatus, EntryType, SortDirection } from '../types/enums';
import { getDate, getTag, getUniqueTags } from '../util/entries';
import { getSlug, sortAlphabetical, sortDate } from '../util/helper';

const initialTag: Tag = getTag('all', EntryType.Project)

export const initEntries = atom<Bookmark[]>([])
export const initTags = atom<Tag[]>([])
export let entries = atom<Bookmark[]>([])
export let tags = atom<Tag[]>([])
export let filterTag = atom<Tag>(initialTag)
export let filterStatus = atom<BookmarkStatus>(BookmarkStatus.Empty)
export let sortProperty = atom<BookmarkSortProperty>(BookmarkSortProperty.Title)
export let sortDirection = atom<SortDirection>(SortDirection.Desc)

export function init(raw: any) {
    const enrichedEntries = raw.map(getBookmark)
    initEntries.set(enrichedEntries)
}

initEntries.listen((value: readonly Bookmark[]) => {
    const uniqueTags = getUniqueTags(value as Bookmark[])
    initTags.set(uniqueTags)
    const sorted = getSortedBookmarks(value as Bookmark[], sortProperty.get(), sortDirection.get())
    entries.set(sorted)
})

initTags.listen((value: readonly Tag[]) => {
    tags.set(value as Tag[])
})

filterTag.listen((value: Readonly<Tag>) => {
    const filtered = getFilteredProjects(initEntries.get(), value, filterStatus.get())
    const sortedAndFiltered = getSortedBookmarks(filtered, sortProperty.get(), sortDirection.get())
    entries.set(sortedAndFiltered)
})

filterStatus.listen((value: Readonly<BookmarkStatus>) => {
    const filtered = getFilteredProjects(initEntries.get(), filterTag.get(), value)
    const sortedAndFiltered = getSortedBookmarks(filtered, sortProperty.get(), sortDirection.get())
    entries.set(sortedAndFiltered)
})

sortProperty.listen((value: BookmarkSortProperty) => {
    const sorted = getSortedBookmarks(entries.get(), value, sortDirection.get())
    entries.set(sorted)
})

sortDirection.listen((value: SortDirection) => {
    const sorted = getSortedBookmarks(entries.get(), sortProperty.get(), value)
    entries.set(sorted)
})

function getSortedBookmarks(unsorted: Bookmark[], property: BookmarkSortProperty, direction: SortDirection): Bookmark[] {
    const entriesCopy = JSON.parse(JSON.stringify(unsorted))
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
                return entriesCopy.sort((a: Bookmark, b: Bookmark) => sortDate(b.published.raw, a.published.raw));
            } else if (direction === SortDirection.Desc) {
                return entriesCopy.sort((a: Bookmark, b: Bookmark) => sortDate(a.published.raw, b.published.raw));
            }
            break;
        case BookmarkSortProperty.Updated:
            if (direction === SortDirection.Asc) {
                return entriesCopy.sort((a: Bookmark, b: Bookmark) => sortDate(b.updated.raw, a.updated.raw));
            } else if (direction === SortDirection.Desc) {
                return entriesCopy.sort((a: Bookmark, b: Bookmark) => sortDate(a.updated.raw, b.updated.raw));
            }
            break;
        default:
            return [];
    }
    return [];
}

function getFilteredProjects(unfiltered: Bookmark[], filteringTag: Tag, filteringStatus: BookmarkStatus): Bookmark[] {
    const entriesCopy = JSON.parse(JSON.stringify(unfiltered))
    const showAll = filteringTag.slug === 'all' && filteringStatus === BookmarkStatus.Empty
    if (showAll) {
        return entriesCopy;
    }
    const onlyFilterTags = filteringTag.slug !== 'all' && filteringStatus === BookmarkStatus.Empty
    if (onlyFilterTags) {
        return entriesCopy.filter((entry: Bookmark) => {
            return entry.tags.some((tag) => tag.slug === filteringTag.slug);
        });
    }
    const onlyFilterStatus = filteringTag.slug === 'all' && filteringStatus !== BookmarkStatus.Empty
    if (onlyFilterStatus) {
        return entriesCopy.filter((entry: Bookmark) => entry.status === filteringStatus);
    }
    // TODO
    return entriesCopy.filter((entry): Bookmark[] => {
        const hasTag = entry.tags.some((tag) => tag.slug === filteringTag.slug);
        const hasStatus = entry.status == filterStatus
        return hasTag && hasStatus
    });
}

function getBookmark(bookmark: any): Bookmark {
    const f = bookmark.fields;
    const type = EntryType.Bookmark
    const slug = getSlug(f.Title)
    const relativePath = `/${(type).toLowerCase()}s/${slug}`
    const rawTags = [f.Tag]
    return {
        type,
        title: f.Title,
        description: f.Description,
        image: f.Image || '',
        tags: rawTags.map(tag => getTag(tag, type)),
        published: getDate(f.Published),
        updated: getDate(f.Updated),
        url: f.URL,
        status: f.Status,
        openSource: f.OpenSource,
        slug,
        relativePath,
        fullPath: `https://harambasic.de${relativePath}`,
    }
}