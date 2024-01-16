import type { PageServerLoad } from './$types';

export const load = (async ({ url }) => {
	return {
		title: 'Posts',
		subtitle: 'Stuff I write',
		description:
			"Overview of all my blog posts. It's a mix of technical and non-technical topics, everything that interests me.",
		path: url.pathname
	};
}) satisfies PageServerLoad;
