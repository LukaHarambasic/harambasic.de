import type { LayoutServerLoad } from './$types';
import { request as requestPosts } from '$lib/data/posts/api.server';
import { request as requestProjects } from '$lib/data/projects/api.server';
import { requestBookmarks } from '$lib/data/bookmarks/api.server';

// default mode for all pages - prerender = static
// https://kit.svelte.dev/docs/page-options#prerender
export const prerender = true;

export const load = (async () => {
    return {
        posts: await requestPosts(),
        projects: await requestProjects(),
        bookmarks: await requestBookmarks()
    };
}) satisfies LayoutServerLoad;