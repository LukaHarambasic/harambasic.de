import { DEPLOY_PRIME_URL, URL } from '$env/static/private';
import type { LayoutServerLoad } from './$types';
import { request as requestPosts } from '$lib/data/posts/api.server';
import { request as requestProjects } from '$lib/data/projects/api.server';
import { requestUses } from '$lib/data/uses/api.server';
import { requestShareables } from '$lib/data/shareable/api.server';

// For full SSG: https://kit.svelte.dev/docs/adapter-static
export const prerender = true;

export const load = (async ({ url }) => {
	return {
		permalink: DEPLOY_PRIME_URL || URL,
		relativePath: url.pathname,
		posts: await requestPosts(),
		projects: await requestProjects(),
		uses: await requestUses(),
		shareables: await requestShareables()
		// images: await getImages()
	};
}) satisfies LayoutServerLoad;
