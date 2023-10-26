import type { PageServerLoad } from './$types'
import { env } from '$env/dynamic/private'

export const load = (async ({ url }) => {
  return {
    title: 'Shareable',
    description: "All the links I normally share with good friends, now open to everyone.",
    socialImgAlt: 'TODO',
    relativePath: url.pathname,
    permalink: env.DEPLOY_PRIME_URL || env.URL
  }
}) satisfies PageServerLoad
