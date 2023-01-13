import { request } from '$lib/data/bookmarks/api'
import type { PageServerLoad } from './$types'

export const load = (async () => {
  //TODO other meta data
  return {
    title: 'Bookmarks',
    entries: await request()
  }
}) satisfies PageServerLoad
