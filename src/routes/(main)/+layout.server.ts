import { env } from '$env/dynamic/private';
import type { LayoutServerLoad } from './$types';
import { request as requestPosts } from '$lib/data/posts/api.server';
import { request as requestProjects } from '$lib/data/projects/api.server';
import { requestStack } from '$lib/data/stack/api.server';
import { requestShareables } from '$lib/data/shareable/api.server';

// For full SSG: https://kit.svelte.dev/docs/adapter-static
export const prerender = true;

export const load = (async ({ url }) => {
	return {
		permalink: env.DEPLOY_PRIME_URL || env.URL,
		relativePath: url.pathname,
		posts: await requestPosts(),
		projects: await requestProjects(),
		stack: await requestStack(),
		shareables: await requestShareables()
		// images: await getImages()
	};
}) satisfies LayoutServerLoad;
