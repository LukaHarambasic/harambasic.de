import type { PageServerLoad } from './$types'

export const load = (async () => {
    //TODO other meta data
    // TODO
    return {
        title: 'Static post for testing',
        // entry: await getEntryBySlug('add-github-actions-for-testing-linting-to-your-repository')
    }
}) satisfies PageServerLoad
