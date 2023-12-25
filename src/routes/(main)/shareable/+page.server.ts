import type { PageServerLoad } from './$types'

export const load = (async () => {
  return {
    title: 'Shareable',
    description: 'All the links I normally share with good friends, now open to everyone.'
  }
}) satisfies PageServerLoad
