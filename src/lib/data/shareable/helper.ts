import type { Shareable } from '$lib/types/shareable'
import { ShareableSortProperty, EntryType, SortDirection } from '$lib/types/enums'
import { getTag, getDate, filterByTag, sortByDirection } from '$lib/util/entries'
import { sortAlphabetical, sortDate, getSlug } from '$lib/util/helper'

export function filterAndSort(
  entries: Shareable[],
  filterTagSlug: string,
  sortProperty: ShareableSortProperty,
  sortDirection: SortDirection
): Shareable[] {
  return entries
    .filter((entry) => filterByTag(entry, filterTagSlug))
    .sort((a, b) => sortByProperty(a, b, sortProperty))
    .sort(() => sortByDirection(sortDirection))
}

export function getShareable(entry: any): Shareable {
  const meta = entry.meta
  const type = EntryType.Shareable
  const slug = getSlug(meta.title)
  const relativePath = `/${type.toLowerCase()}s/${slug}`
  console.log(entry)
  return {
    type,
    title: meta.title,
    description: meta.description,
    comment: '', // TODO fix mapping
    tags: meta.tags.map((tag: string) => getTag(tag, type)),
    published: getDate(meta.published),
    updated: getDate(meta.updated),
    url: meta.url,
    slug,
    relativePath,
    fullPath: `https://harambasic.de${relativePath}`
  }
}

function sortByProperty(
  a: Shareable,
  b: Shareable,
  property: ShareableSortProperty,
): number {
  switch (property) {
    case ShareableSortProperty.Title:
      return sortAlphabetical(b.title, a.title)
    case ShareableSortProperty.Published:
      return sortDate(b.published.raw, a.published.raw)
    case ShareableSortProperty.Updated:
      return sortDate(b.updated.raw, a.updated.raw)
    default:
      return 0
  }
}
