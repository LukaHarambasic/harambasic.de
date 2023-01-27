import { PostSortProperty, EntryType, SortDirection } from '$lib/types/enums'
import type { Post, TocNode } from '$lib/types/post'
import { getTag, getDate, filterByTag, sortByDirection } from '$lib/util/entries'
import { sortAlphabetical, sortDate, getSlug } from '$lib/util/helper'

export function filterAndSort(
  entries: Post[],
  filterTagSlug: string,
  sortProperty: PostSortProperty,
  sortDirection: SortDirection,
): Post[] {
  return entries
    .filter((entry) => filterByTag(entry, filterTagSlug))
    .sort((a, b) => sortByProperty(a, b, sortProperty))
    .sort(() => sortByDirection(sortDirection))
}

export function sortByProperty(
  a: Post,
  b: Post,
  property: PostSortProperty,
): number {
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
  // TODO add toc: getNestedToc(entry.getHeadings()),
  return {
    type,
    title: meta.title,
    description: meta.description,
    image: meta.image || '',
    tags: meta.tags.map((tag: string) => getTag(tag, type)),
    published: getDate(meta.published),
    updated: getDate(meta.updated),
    tldr: meta.tldr,
    discussion: meta.discussion,
    toc: [],
    slug,
    relativePath,
    fullPath: `https://harambasic.de${relativePath}`,
    html: entry.html
  }
}

// TODO test
// TODO can this be rewritten in a nicer way?
// provided by https://codepen.io/Frnak/pen/mdmEjyG?editors=0011
// TODO fix markdownHeadings any
// check if this might be a nicer solution: https://github.com/ryanfiller/portfolio-svelte/blob/main/src/plugins/rehype/table-of-contents.js#L29
export function getNestedToc(markdownHeading: any): TocNode[] {
  let latestEntry: TocNode | null
  let latestParent: TocNode | null
  const markdownHeadingCopy = JSON.parse(JSON.stringify(markdownHeading))
  if (markdownHeadingCopy.length <= 1) return markdownHeadingCopy
  const entryDepth = markdownHeading.reduce((acc, item) => {
    return item.depth < acc ? item.depth : acc
  }, Number.POSITIVE_INFINITY)
  return markdownHeadingCopy.reduce((result, entry) => {
    if (latestEntry && !latestEntry.children) {
      latestEntry.children = []
    }
    const latestEntryDepth = latestEntry?.depth || 0
    const latestEntryChildren = latestEntry?.children || []
    const latestParentChildren = latestParent?.children || []
    if (entry.depth === entryDepth) {
      entry.children = []
      result.push(entry)
      latestParent = null
    } else if (entry.depth === latestEntryDepth + 1) {
      latestEntryChildren.push(entry)
      latestParent = latestEntry
    } else if (entry.depth === latestEntryDepth) {
      latestParentChildren.push(entry)
    } else {
      console.error('Unexpected Toc behaviour', entry)
    }
    latestEntry = entry
    return result
  }, [])
}
