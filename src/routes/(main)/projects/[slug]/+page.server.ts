import type { PageServerLoad } from './$types';
import { requestWork } from '$lib/data/api.server';

export const prerender = true;

export const load = (async ({ parent, params }) => {
	const { projects } = await parent();
	const [entries] = projects;
	const entry = entries.find((entry) => entry.slug === params.slug);

	// Load related work entries if any
	let relatedWork: Awaited<ReturnType<typeof requestWork>>[0] = [];
	if (entry?.relatedWork && entry.relatedWork.length > 0) {
		const [workEntries] = await requestWork();
		relatedWork = workEntries.filter((w) => entry.relatedWork?.includes(w.slug));
	}

	return {
		title: entry?.title,
		description: entry?.description,
		entry,
		relatedWork
	};
}) satisfies PageServerLoad;
