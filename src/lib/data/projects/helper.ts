import { ProjectSortProperty, SortDirection, EntryType, ProjectStatus } from "$lib/types/enums"
import type { Project } from "$lib/types/project"
import { getTag, getDate, filterByTag, sortByDirection } from "$lib/util/entries"
import { sortAlphabetical, sortNumber, sortDate, getSlug } from "$lib/util/helper"

export function filterAndSortProjects(
  entries: Project[],
  filterTagSlug: string,
  filterStatus: ProjectStatus,
  sortProperty: ProjectSortProperty,
  sortDirection: SortDirection,
): Project[] {
  // TODO sort - make this somehow nicer and as function
  return entries
    .filter((entry) => filterByTag(entry, filterTagSlug))
    .filter((entry) => filterByStatus(entry, filterStatus))
    .sort((a, b) => sortByProperty(a, b, sortProperty))
    .sort(() => sortByDirection(sortDirection))
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

function sortByProperty(
  a: Project,
  b: Project,
  property: ProjectSortProperty,
): number {
  switch (property) {
    case ProjectSortProperty.Title:
      return sortAlphabetical(b.title, a.title)
    case ProjectSortProperty.Priority:
      return sortNumber(b.prio, a.prio)
    case ProjectSortProperty.Published:
      return sortDate(b.published.raw, a.published.raw)
    case ProjectSortProperty.Updated:
      return sortDate(b.updated.raw, a.updated.raw)
    default:
      return 0
  }
}

function filterByStatus(entry: Project, filterStatus: ProjectStatus): boolean {
  if (filterStatus === ProjectStatus.None) return true
  return entry.status === filterStatus
}