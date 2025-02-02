import { DEPLOY_PRIME_URL, URL } from '$env/static/private';
import type { LayoutServerLoad } from './$types';
import { request as requestPosts } from '$lib/data/posts/api.server';
import { request as requestProjects } from '$lib/data/projects/api.server';
import { requestUses } from '$lib/data/uses/api.server';
import { requestShareables } from '$lib/data/shareable/api.server';
import { authenticateUser, type User } from '$lib/users/auth';
import { redirect } from '@sveltejs/kit';

// For full SSG: https://kit.svelte.dev/docs/adapter-static
export const prerender = true;

export const load = (async ({ url, locals, cookies }) => {
	const sessionCookie = cookies.get('session');
	if (sessionCookie) {
		const sessionUser: User = JSON.parse(sessionCookie);
		const authenticatedUser = authenticateUser(sessionUser.userName, sessionUser.pin);
		if (authenticatedUser) {
			locals.user = authenticatedUser;
		} else {
			locals.user = null;
			throw redirect(302, '/login');
		}
	} else {
		locals.user = null;
	}
	return {
		user: locals.user,
		permalink: DEPLOY_PRIME_URL || URL,
		relativePath: url.pathname,
		posts: await requestPosts(),
		projects: await requestProjects(),
		uses: await requestUses(),
		shareables: await requestShareables()
		// images: await getImages()
	};
}) satisfies LayoutServerLoad;
