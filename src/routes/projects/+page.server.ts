import type { PageServerLoad } from './$types'
import { env } from '$env/dynamic/private'

export const load = (async ({ url }) => {
  return {
    title: 'Projects',
    description: "Check out all the projects I've worked on over the years! Get a glimpse of my diverse range of skills and interests.",
    socialImgAlt: 'TODO',
    relativePath: url.pathname,
    permalink: env.DEPLOY_PRIME_URL || env.URL
  }
}) satisfies PageServerLoad
