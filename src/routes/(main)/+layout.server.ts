import { DEPLOY_PRIME_URL, URL } from '$env/static/private';
import type { LayoutServerLoad } from './$types';
import {
	requestPosts,
	requestProjects,
	requestUses,
	requestShareables,
	requestSnippets
} from '$lib/data/api.server';

// For full SSG: https://kit.svelte.dev/docs/adapter-static
export const prerender = true;

export const load = (async ({ url }) => {
	return {
		permalink: DEPLOY_PRIME_URL || URL,
		relativePath: url.pathname,
		posts: await requestPosts(),
		projects: await requestProjects(),
		uses: await requestUses(),
		shareables: await requestShareables(),
		snippets: await requestSnippets()
		// images: await getImages()
	};
}) satisfies LayoutServerLoad;
