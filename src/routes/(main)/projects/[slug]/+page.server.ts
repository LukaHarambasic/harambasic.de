import type { PageServerLoad } from './$types';

export const prerender = true;

export const load = (async ({ parent, params }) => {
	const { projects } = await parent();
	const [entries] = projects;
	const entry = entries.find((entry) => entry.slug === params.slug);
	return {
		title: entry?.title,
		description: entry?.description,
		entry
	};
}) satisfies PageServerLoad;
