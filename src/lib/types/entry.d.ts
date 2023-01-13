import { EntryType } from './enums'
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
