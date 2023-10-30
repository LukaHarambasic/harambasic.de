import type { PageServerLoad } from './$types'

export const load = (async ({ url }) => {
  return {
    title: 'Projects',
    description: "Check out all the projects I've worked on over the years! Get a glimpse of my diverse range of skills and interests."
  }
}) satisfies PageServerLoad
