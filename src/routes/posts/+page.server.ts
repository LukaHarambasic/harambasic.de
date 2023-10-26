import type { PageServerLoad } from './$types'
import { env } from '$env/dynamic/private'

export const load = (async ({ url }) => {
  return {
    title: 'Posts',
    description: "Overview of all my blog posts. It's a mix of technical and non-technical topics, everything that interests me.",
    socialImgAlt: 'TODO',
    relativePath: url.pathname,
    permalink: env.DEPLOY_PRIME_URL || env.URL
  }
}) satisfies PageServerLoad
