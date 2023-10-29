import type { PageServerLoad } from './$types'
import { env } from '$env/dynamic/private'

export const prerender = true

export const load = (async ({ url, parent, params }) => {
  //TODO other meta data
  // TODO
  // console.log('args', args);
  const { posts } = await parent()
  const [entries] = posts
  const entry = entries.find((post) => post.slug === params.slug)
  return {
    title: entry?.title,
    description: entry?.description,
    published: entry?.published,
    relativePath: url.pathname,
    permalink: env.DEPLOY_PRIME_URL || env.URL,
    entry
  }
}) satisfies PageServerLoad
