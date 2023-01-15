import type { Bookmark } from '$lib/types/bookmark'
import type { EntryDate } from '$lib/types/entry'
import { SortDirection, type EntryType } from '$lib/types/enums'
import type { Post } from '$lib/types/post'
import type { Project } from '$lib/types/project'
import type { Tag } from '$lib/types/tag'
import { getSlug, formatDate } from './helper'

export function findBySlug(entry: Post | Project | Bookmark, slug: string): boolean {
  return entry.slug === slug
}

export function getTag(display: string, type: EntryType, iniCount = 0): Tag {
  const slug = getSlug(display)
  return {
    display,
    slug: slug,
    fullPath: `/${type.toLowerCase()}s/?tag=${slug}`,
    count: iniCount,
    type
  }
}

export function getDate(rawString: string): EntryDate {
  const raw = new Date(rawString)
  return {
    raw,
    display: formatDate(raw)
  }
}

export function filterByTag(entry: Post | Project | Bookmark, filterTagSlug: string): boolean {
  if (filterTagSlug === 'all' || filterTagSlug === '') return true
  return entry.tags.some((tag) => tag.slug === filterTagSlug)
}

export function sortByDirection(sortDirection: SortDirection): number {
  return sortDirection === SortDirection.Asc ? 1 : -1
}

export function getUniqueTags(entries: Project[] | Bookmark[] | Post[]): Tag[] {
  // rewrite with map and than loop over non uniqque for counting - aka make henry happy > no functional change :D
  const duplicateTags = entries.map((entry) => entry.tags).flat()
  const uniqueTags: Tag[] = duplicateTags.reduce((unique: Tag[], item: Tag): Tag[] => {
    const tagIndex = unique.findIndex((u) => item.slug === u.slug)
    const isItemInUnique = tagIndex >= 0
    if (isItemInUnique) {
      unique[tagIndex].count++
    } else {
      unique.push({
        ...item,
        count: 1
      })
    }
    return unique
  }, [])
  const type = uniqueTags[0].type
  const allTag = getTag('All', type, entries.length)
  return [allTag, ...uniqueTags]
}

export function getTagBySlug(tags: Tag[], slug: string): Tag {
  const foundTag = tags.find((tag) => tag.slug === slug)
  if (foundTag === undefined) {
    throw new Error(`Tag couldn't be found by slug: ${slug}`)
  }
  return foundTag
}
