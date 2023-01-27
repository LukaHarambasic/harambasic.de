import type { Bookmark } from '$lib/types/bookmark'
import { BookmarkSortProperty, BookmarkStatus, EntryType, SortDirection } from '$lib/types/enums'
import { getTag, getDate, filterByTag, sortByDirection } from '$lib/util/entries'
import { sortAlphabetical, sortDate, getSlug } from '$lib/util/helper'

export function filterAndSort(
  entries: Bookmark[],
  filterTagSlug: string,
  filterStatus: BookmarkStatus,
  sortProperty: BookmarkSortProperty,
  sortDirection: SortDirection
): Bookmark[] {
  return entries
    .filter((entry) => filterByTag(entry, filterTagSlug))
    .filter((entry) => filterByStatus(entry, filterStatus))
    .sort((a, b) => sortByProperty(a, b, sortProperty))
    .sort(() => sortByDirection(sortDirection))
}

export function getBookmark(entry: any): Bookmark {
  const meta = entry.meta
  const type = EntryType.Bookmark
  const slug = getSlug(meta.title)
  const relativePath = `/${type.toLowerCase()}s/${slug}`
  return {
    type,
    title: meta.title,
    description: meta.description,
    image: meta.image || '',
    tags: meta.tags.map((tag: string) => getTag(tag, type)),
    published: getDate(meta.published),
    updated: getDate(meta.updated),
    url: meta.url,
    status: meta.status,
    openSource: meta.openSource,
    slug,
    relativePath,
    fullPath: `https://harambasic.de${relativePath}`
  }
}

function sortByProperty(
  a: Bookmark,
  b: Bookmark,
  property: BookmarkSortProperty,
): number {
  switch (property) {
    case BookmarkSortProperty.Title:
      return sortAlphabetical(b.title, a.title)
    case BookmarkSortProperty.Published:
      return sortDate(b.published.raw, a.published.raw)
    case BookmarkSortProperty.Updated:
      return sortDate(b.updated.raw, a.updated.raw)
    default:
      return 0
  }
}

function filterByStatus(entry: Bookmark, filterStatus: BookmarkStatus): boolean {
  if (filterStatus === BookmarkStatus.All) return true
  return entry.status === filterStatus
}