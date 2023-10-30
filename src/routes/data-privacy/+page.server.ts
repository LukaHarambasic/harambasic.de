import type { PageServerLoad } from './$types'

export const load = (async ({ url }) => {
  return {
    title: 'Data Privacy',
    description: 'Data Privacy, not more, but also not less.'
  }
}) satisfies PageServerLoad
