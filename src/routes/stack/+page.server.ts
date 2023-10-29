import type { PageServerLoad } from './$types'
import { env } from '$env/dynamic/private'

export const load = (async ({ url }) => {
  return {
    title: 'Stack',
    description: 'An overview of the things I use, like really use. Things I rely on a daily basis.',
    relativePath: url.pathname,
    permalink: env.DEPLOY_PRIME_URL || env.URL
  }
}) satisfies PageServerLoad
