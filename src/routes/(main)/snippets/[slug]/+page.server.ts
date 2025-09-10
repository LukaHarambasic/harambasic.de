import type { PageServerLoad } from './$types';

export const prerender = true;

export const load = (async ({ parent, params }) => {
	const { snippets } = await parent();
	const [entries] = snippets;
	const entry = entries.find((snippet) => snippet.slug === params.slug);
	return {
		title: entry?.title,
		description: entry?.description,
		published: entry?.published,
		entry
	};
}) satisfies PageServerLoad;
