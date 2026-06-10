import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { buildProjectsItems, sectionChannel, selfLink } from '$lib/rssFeed';

export async function GET(context: APIContext) {
	return rss({
		...sectionChannel('projects'),
		...selfLink('/projects/rss'),
		site: context.site ?? 'https://harambasic.de',
		items: await buildProjectsItems(),
		trailingSlash: false
	});
}
