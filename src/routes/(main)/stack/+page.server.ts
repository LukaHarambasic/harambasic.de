import type { PageServerLoad } from './$types'

export const load = (async () => {
  return {
    title: 'Stack',
    subtitle: 'Stuff I use',
    description: 'An overview of the things I use, like really use. Things I rely on a daily basis.'
  }
}) satisfies PageServerLoad
