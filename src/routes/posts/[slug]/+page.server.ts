import type { PageServerLoad } from './$types'

export const load = (async ({ params }) => {
    //TODO other meta data
    const slug = params.slug
    return {
        title: slug,
        slug
    }
}) satisfies PageServerLoad
