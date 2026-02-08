import type { PageServerLoad } from './$types';

export const load = (async () => {
	return {
		title: 'Feeds',
		description:
			'I want to expose my data in an open format that can be consumed by everyone who is interested. Either the full feed or just subsets of it.'
	};
}) satisfies PageServerLoad;
