import { ProjectSortProperty, SortDirection, ProjectStatus, EntryType } from '$lib/types/enums'
import type { Tag } from '$lib/types/tag'
import type { Project } from '$lib/types/project'
import { getDate, getTag } from '$lib/util/entries'
import { sortAlphabetical, sortDate, sortNumber, getSlug } from '$lib/util/helper'

export function getSortedProjects(
  unsorted: Project[],
  property: ProjectSortProperty,
  direction: SortDirection
): Project[] {
  const entriesCopy = JSON.parse(JSON.stringify(unsorted))
  // TODO just sort based on the property and then reverse the array in the end
  switch (property) {
    case ProjectSortProperty.Title:
      // TODO just sort ones and than revert the array
      if (direction === SortDirection.Asc) {
        return entriesCopy.sort((a: Project, b: Project) => sortAlphabetical(a.title, b.title))
      } else if (direction === SortDirection.Desc) {
        return entriesCopy.sort((a: Project, b: Project) => sortAlphabetical(b.title, a.title))
      }
      break
    case ProjectSortProperty.Published:
      if (direction === SortDirection.Asc) {
        return entriesCopy.sort((a: Project, b: Project) =>
          sortDate(b.published.raw, a.published.raw)
        )
      } else if (direction === SortDirection.Desc) {
        return entriesCopy.sort((a: Project, b: Project) =>
          sortDate(a.published.raw, b.published.raw)
        )
      }
      break
    case ProjectSortProperty.Updated:
      if (direction === SortDirection.Asc) {
        return entriesCopy.sort((a: Project, b: Project) => sortDate(b.updated.raw, a.updated.raw))
      } else if (direction === SortDirection.Desc) {
        return entriesCopy.sort((a: Project, b: Project) => sortDate(a.updated.raw, b.updated.raw))
      }
      break
    case ProjectSortProperty.Priority:
      if (direction === SortDirection.Asc) {
        return entriesCopy.sort((a: Project, b: Project) => sortNumber(b.prio, a.prio))
      } else if (direction === SortDirection.Desc) {
        return entriesCopy.sort((a: Project, b: Project) => sortNumber(a.prio, b.prio))
      }
      break
    default:
      return []
  }
  return []
}

export function getFilteredProjects(
  unfiltered: Project[],
  filteringTagSlug: string,
  filteringStatus: ProjectStatus
): Project[] {
  const entriesCopy = JSON.parse(JSON.stringify(unfiltered))
  const showAll = filteringTagSlug === 'all' && filteringStatus === ProjectStatus.None
  if (showAll) {
    return entriesCopy
  }
  const onlyFilterTags = filteringTagSlug !== 'all' && filteringStatus === ProjectStatus.None
  if (onlyFilterTags) {
    return entriesCopy.filter((entry: Project) => {
      return entry.tags.some((tag) => tag.slug === filteringTagSlug)
    })
  }
  const onlyFilterStatus = filteringTagSlug === 'all' && filteringStatus !== ProjectStatus.None
  if (onlyFilterStatus) {
    return entriesCopy.filter((entry: Project) => entry.status === filteringStatus)
  }
  // TODO
  return entriesCopy.filter((entry: Project) => {
    const hasTag = entry.tags.some((tag: Tag) => tag.slug === filteringTagSlug)
    const hasStatus = entry.status == filteringStatus
    return hasTag && hasStatus
  })
}

export function getProject(entry: any): Project {
  const meta = entry.meta
  const type = EntryType.Project
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
    links: meta.links,
    prio: meta.prio,
    status: meta.status,
    slug,
    relativePath,
    fullPath: `https://harambasic.de${relativePath}`,
    html: entry.html
  }
}
