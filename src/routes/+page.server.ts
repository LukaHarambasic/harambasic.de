import type { PageServerLoad } from './$types'

export const load = (async ({ url }) => {
  return {
    title: '',
    description: 'My private playground, publishing my thoughts and ideas. Showing of what I did and playing around with new technologies.'
  }
}) satisfies PageServerLoad
