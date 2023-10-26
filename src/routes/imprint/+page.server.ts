import type { PageServerLoad } from './$types'
import { env } from '$env/dynamic/private'

export const load = (async ({ url }) => {
  return {
    title: 'Imprint',
    description: "Imprint, not more, but also not less.",
    socialImgAlt: 'TODO',
    relativePath: url.pathname,
    permalink: env.DEPLOY_PRIME_URL || env.URL
  }
}) satisfies PageServerLoad
