import type { PageServerLoad } from './$types';

export const load = (async ({ url }) => {
	return {
		title: 'Snippets',
		subtitle: 'Code snippets and quick scripts',
		description:
			'Collection of useful code snippets, configuration files, and shell scripts for quick copy-paste usage.',
		path: url.pathname
	};
}) satisfies PageServerLoad;
