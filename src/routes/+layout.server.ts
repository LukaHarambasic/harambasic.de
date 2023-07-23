import type { LayoutServerLoad } from './$types';
import { request as requestPosts } from '$lib/data/posts/api.server';
import { request as requestProjects } from '$lib/data/projects/api.server';
import { requestStack } from '$lib/data/stack/api.server';
import { requestShareables } from '$lib/data/shareable/api.server';
// import { getImages } from '$lib/util/markdown-images';

// default mode for all pages - prerender = static
// https://kit.svelte.dev/docs/page-options#prerender
export const prerender = false;

export const load = (async () => {
    return {
        posts: await requestPosts(),
        projects: await requestProjects(),
        stack: await requestStack(),
        shareables: await requestShareables(),
        // images: await getImages()
    };
}) satisfies LayoutServerLoad;