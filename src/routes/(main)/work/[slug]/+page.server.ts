import type { PageServerLoad } from './$types';
import { requestProjects } from '$lib/data/api.server';

export const prerender = true;

export const load = (async ({ parent, params }) => {
	const { work } = await parent();
	const [entries] = work;
	const entry = entries.find((entry) => entry.slug === params.slug);
	
	// Load related projects if any
	let relatedProjects = [];
	if (entry?.relatedProjects && entry.relatedProjects.length > 0) {
		const [projects] = await requestProjects();
		relatedProjects = projects.filter((p) => entry.relatedProjects?.includes(p.slug));
	}

	return {
		title: entry?.title,
		description: entry?.description,
		entry,
		relatedProjects
	};
}) satisfies PageServerLoad;

