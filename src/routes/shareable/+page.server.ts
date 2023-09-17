import type { PageServerLoad } from './$types'

export const load = (async () => {
  //TODO other meta data
  return {
    title: 'Shareable'
  }
}) satisfies PageServerLoad
