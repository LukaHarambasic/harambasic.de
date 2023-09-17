import type { StackEntry } from '$lib/types/stackEntry'
import { StackEntrySortProperty, StackEntryStatus, EntryType, SortDirection } from '$lib/types/enums'
import { getTag, getDate, filterByTag, sortByDirection } from '$lib/util/entries'
import { sortAlphabetical, sortDate, getSlug } from '$lib/util/helper'

export function filterAndSort(
  entries: StackEntry[],
  filterTagSlug: string,
  filterStatus: StackEntryStatus,
  sortProperty: StackEntrySortProperty,
  sortDirection: SortDirection
): StackEntry[] {
  return entries
    .filter((entry) => filterByTag(entry, filterTagSlug))
    .filter((entry) => filterByStatus(entry, filterStatus))
    .sort((a, b) => sortByProperty(a, b, sortProperty))
    .sort(() => sortByDirection(sortDirection))
}

export function getStackEntry(entry: any): StackEntry {
  const meta = entry.meta
  const type = EntryType.StackEntry
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

function sortByProperty(a: StackEntry, b: StackEntry, property: StackEntrySortProperty): number {
  switch (property) {
    case StackEntrySortProperty.Title:
      return sortAlphabetical(b.title, a.title)
    case StackEntrySortProperty.Published:
      return sortDate(b.published.raw, a.published.raw)
    case StackEntrySortProperty.Updated:
      return sortDate(b.updated.raw, a.updated.raw)
    default:
      return 0
  }
}

function filterByStatus(entry: StackEntry, filterStatus: StackEntryStatus): boolean {
  if (filterStatus === StackEntryStatus.All) return true
  return entry.status === filterStatus
}
