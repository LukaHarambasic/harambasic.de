import type { PageServerLoad } from './$types'

export const load = (async ({ parent, params }) => {
    //TODO other meta data
    // TODO
    // console.log('args', args);
    const {posts, projects}  = await parent();
    const [
        entries,
        tags
      ] = posts
    const entry = entries.find((post) => post.slug === params.slug);
    return {
        title: entry.title,
        entry
    }
}) satisfies PageServerLoad

