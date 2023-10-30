import type { PageServerLoad } from './$types'

export const load = (async () => {
  return {
    title: 'Imprint',
    description: 'Imprint, not more, but also not less.'
  }
}) satisfies PageServerLoad
