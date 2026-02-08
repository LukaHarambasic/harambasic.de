import type { PageServerLoad } from './$types';

export const load = (async ({ url }) => {
	return {
		title: 'Tools and gear I actually use',
		subtitle: 'Stuff I use',
		description:
			"An overview of the software, hardware, and workflows I rely on in my daily work and life. No affiliate fluff, just what's on my desk and in my stack, and why I use it.",
		path: url.pathname
	};
}) satisfies PageServerLoad;
