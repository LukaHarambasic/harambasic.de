import type { PageServerLoad } from './$types';

export const load = (async ({ url }) => {
	return {
		title: 'Stack',
		subtitle: 'Stuff I use',
		description:
			'An overview of the things I use, like really use. Things I rely on a daily basis.',
		path: url.pathname
	};
}) satisfies PageServerLoad;
