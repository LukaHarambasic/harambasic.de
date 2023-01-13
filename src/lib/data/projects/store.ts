import { atom, computed } from 'nanostores'
import { ProjectSortProperty, ProjectStatus, SortDirection } from '$lib/types/enums'
import type { Project } from '$lib/types/project'
import type { Tag } from '$lib/types/tag'
import { getUniqueTags } from '$lib/util/entries'
import { getSortedProjects, getFilteredProjects } from './helper'

export const initEntries = atom<Project[]>([])
export const tags = atom<Tag[]>([])
export const filterTagSlug = atom<string>('all')
export const filterStatus = atom<ProjectStatus>(ProjectStatus.None)
export const sortProperty = atom<ProjectSortProperty>(ProjectSortProperty.Title)
export const sortDirection = atom<SortDirection>(SortDirection.Desc)

export const entries = computed(
  [initEntries, tags, filterTagSlug, filterStatus, sortProperty, sortDirection],
  (initEntries, tags, filterTagSlug, filterStatus, sortProperty, sortDirection) => {
    console.log('computing projects', initEntries.length)
    const filtered = getFilteredProjects(initEntries, filterTagSlug, filterStatus)
    const tmp = getSortedProjects(filtered, sortProperty, sortDirection)
    console.log('computed tmp', tmp.length)
    return tmp
  }
)

// TODO should/could be an action but the only benefit is the logging which I dont use, soooooo nah
export function init(entries: Project[]) {
  if (initEntries.get().length !== 0) return
  const uniqueTags = getUniqueTags(entries)
  tags.set(uniqueTags)
  initEntries.set(entries)
}
