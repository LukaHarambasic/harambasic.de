import type { PageServerLoad } from './$types'
import { env } from '$env/dynamic/private'

export const load = (async ({ url }) => {
  // console.log('--------- Project (page.server.ts) ---------')
  // console.log(url)
  //TODO other meta data
  const pathname = url.pathname
  // console.log(pathname)
  // console.log('---------- Project (page.server.ts) (END) -----------------')
  return {
    title: 'Projects',
    description: "Check out all the projects I've worked on over the years! Get a glimpse of my diverse range of skills and interests.",
    socialImgAlt: 'TODO',
    relativePath: url.pathname,
    href: url.href,
    permalink: env.DEPLOY_PRIME_URL || env.URL
  }
}) satisfies PageServerLoad
