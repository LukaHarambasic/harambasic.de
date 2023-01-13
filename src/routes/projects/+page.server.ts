import type { PageServerLoad } from './$types'

export const load = (async () => {
  //TODO other meta data
  return {
    title: 'Projects'
  }
}) satisfies PageServerLoad
