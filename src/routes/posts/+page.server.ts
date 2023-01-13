import { request } from '$lib/data/posts/api'
import type { PageServerLoad } from './$types'

export const load = (async () => {
  //TODO other meta data
  return {
    title: 'Posts',
    entries: await request()
  }
}) satisfies PageServerLoad
