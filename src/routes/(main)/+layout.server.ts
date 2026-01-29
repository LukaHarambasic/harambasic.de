import { DEPLOY_PRIME_URL, URL } from '$env/static/private';
import type { LayoutServerLoad } from './$types';
import { requestPosts, requestProjects, requestUses, requestWork } from '$lib/data/api.server';

// For full SSG: https://kit.svelte.dev/docs/adapter-static
export const prerender = true;

export const load = (async ({ url }) => {
	return {
		permalink: DEPLOY_PRIME_URL || URL,
		relativePath: url.pathname,
		posts: await requestPosts(),
		work: await requestWork(),
		projects: await requestProjects(),
		uses: await requestUses()
	};
}) satisfies LayoutServerLoad;
