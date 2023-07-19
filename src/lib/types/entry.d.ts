import { StackEntrySortProperty, EntryType, PostSortProperty, ProjectSortProperty, ProjectStatus } from './enums'
import type { Shareable } from './shareable'
import type { Tag } from './tag'

export interface EntryDate {
  raw: Date
  display: string
}

export interface Entry {
  type: EntryType
  title: string
  description: string
  image: string
  tags: Tag[]
  published: EntryDate
  updated: EntryDate
  slug: string
  relativePath: string
  fullPath: string
}

export type SortProperty = PostSortProperty | ProjectSortProperty | StackEntrySortProperty | ShareableSortProperty

export type StatusFilter = ProjectStatus | StackEntryStatus
