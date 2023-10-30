import type { PageServerLoad } from './$types'

export const load = (async ({ url }) => {
  return {
    title: 'Imprint',
    description: 'Imprint, not more, but also not less.'
  }
}) satisfies PageServerLoad
