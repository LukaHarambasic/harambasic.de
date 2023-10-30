import type { PageServerLoad } from './$types'

export const load = (async () => {
  return {
    title: 'Posts',
    description: "Overview of all my blog posts. It's a mix of technical and non-technical topics, everything that interests me."
  }
}) satisfies PageServerLoad
