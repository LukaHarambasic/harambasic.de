import type { PageServerLoad } from './$types'
import { env } from '$env/dynamic/private'


export const load = (async ({url}) => {
  console.log('#lh')
  console.log(env)
  console.log(url)
  console.log('################################')
  //TODO other meta data
  return {
    title: 'Projects',
    description: "Check out all the projects I've worked on over the years! Get a glimpse of my diverse range of skills and interests.",
    socialImgAlt: 'TODO',
    permalink: url.href,
  }
}) satisfies PageServerLoad
