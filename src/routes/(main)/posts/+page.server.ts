import type { PageServerLoad } from './$types';

export const load = (async ({ url }) => {
	return {
		title: 'Writing about what I build and think',
		subtitle: 'Stuff I write',
		description:
			"A mix of technical and non-technical posts: how I build things, what I've learned, and ideas I want to put down. Everything here is something I cared enough about to write at length and publish.",
		path: url.pathname
	};
}) satisfies PageServerLoad;
