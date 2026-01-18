import type { PageServerLoad } from './$types';

export const load = (async ({ url }) => {
	return {
		title: 'Work',
		subtitle: "Where I've worked",
		description:
			"My professional journey across different companies and roles. Each entry represents a company where I've worked, with multiple positions and experiences.",
		url: url.pathname
	};
}) satisfies PageServerLoad;
