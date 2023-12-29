import { PostSortProperty, EntryType, SortDirection } from '$lib/types/enums'
import type { Post, TocNode } from '$lib/types/post'
import { getTag, getDate, filterByTag, sortByDirection } from '$lib/util/entries'
import { sortAlphabetical, sortDate, getSlug } from '$lib/util/helper'

export function filterAndSort(
  entries: Post[],
  filterTagSlug: string,
  sortProperty: PostSortProperty,
  sortDirection: SortDirection
): Post[] {
  return entries
    .filter((entry) => filterByTag(entry, filterTagSlug))
    .sort((a, b) => sortByProperty(a, b, sortProperty))
    .sort(() => sortByDirection(sortDirection))
}

export function sortByProperty(a: Post, b: Post, property: PostSortProperty): number {
  switch (property) {
    case PostSortProperty.Title:
      return sortAlphabetical(b.title, a.title)
    case PostSortProperty.Published:
      return sortDate(b.published.raw, a.published.raw)
    case PostSortProperty.Updated:
      return sortDate(b.updated.raw, a.updated.raw)
    default:
      return 0
  }
}

export function getPost(entry: any): Post {
  const meta = entry.meta
  const type = EntryType.Post
  const slug = getSlug(meta.title)
  const relativePath = `/${type.toLowerCase()}s/${slug}`
  return {
    type,
    title: meta.title,
    description: meta.description,
    image: meta.image || '',
    tags: meta.tags.map((tag: string) => getTag(tag, type)) || [],
    published: getDate(meta.published),
    updated: getDate(meta.updated),
    tldr: meta.tldr,
    discussion: meta.discussion,
    toc: entry.toc,
    slug,
    relativePath,
    fullPath: `https://harambasic.de${relativePath}`,
    html: entry.html
  }
}
