import type { PageServerLoad } from './$types';

export const load = (async ({ url }) => {
	return {
		title: "Things I've built and shipped",
		subtitle: 'Stuff I do',
		description:
			"A collection of projects I've built, shipped, or contributed to over the years. Each entry is a real product or experiment, side projects, open source, client work. You'll find a mix of skills and domains I've worked in.",
		url: url.pathname
	};
}) satisfies PageServerLoad;
