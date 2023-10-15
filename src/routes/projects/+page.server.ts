import type { PageServerLoad } from './$types'
import { env } from '$env/dynamic/private'

export const load = (async ({url}) => {
  console.log('#lh')
  console.log(url)
  console.log('################################')
  //TODO other meta data
  const pathname = url.pathname
  console.log(pathname)
  return {
    title: 'Projects',
    description: "Check out all the projects I've worked on over the years! Get a glimpse of my diverse range of skills and interests.",
    socialImgAlt: 'TODO',
    relativePath: pathname,
    permalink: env.DEPLOY_PRIME_URL || env.URL,
  }
}) satisfies PageServerLoad
