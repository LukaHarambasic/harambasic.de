import type { StackEntry } from '$lib/types/stackEntry'
import { EntryType } from '$lib/types/enums'
import type { Tag } from '$lib/types/tag'
import { getRawEntries } from '$lib/util/converter.server'
import { getUniqueTags } from '$lib/util/entries'
import { getStackEntry } from './helper'

export async function requestStack(): Promise<[StackEntry[], Tag[]]> {
  const rawEntries = await getRawEntries(EntryType.StackEntry)
  const entries: StackEntry[] = rawEntries.map(getStackEntry)
  const tags: Tag[] = getUniqueTags(entries)
  return [entries, tags]
}
