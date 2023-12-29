import type { PageServerLoad } from './$types';

export const prerender = true;

export const load = (async ({ parent, params }) => {
	const { posts } = await parent();
	const [entries] = posts;
	const entry = entries.find((post) => post.slug === params.slug);
	return {
		title: entry?.title,
		description: entry?.description,
		published: entry?.published,
		entry
	};
}) satisfies PageServerLoad;
