import type { Bookmark } from '$lib/types/bookmark'
import { EntryType } from '$lib/types/enums'
import type { Tag } from '$lib/types/tag'
import { getRawEntries } from '$lib/util/converter.server'
import { getUniqueTags } from '$lib/util/entries'
import { getBookmark } from './helper'

export async function requestBookmarks(): Promise<[Bookmark[], Tag[]]> {
  const rawEntries = await getRawEntries(EntryType.Bookmark)
  const entries: Bookmark[] = rawEntries.map(getBookmark)
  const tags: Tag[] = getUniqueTags(entries)
  return [
    entries,
    tags
  ]
}