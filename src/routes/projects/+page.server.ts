import { request } from '$lib/data/projects/api';
import type { PageServerLoad } from './$types';

export const load = (async () => {
    //TODO other meta data
    return {
        title: 'Projects',
        entries: await request()
    };
}) satisfies PageServerLoad;
