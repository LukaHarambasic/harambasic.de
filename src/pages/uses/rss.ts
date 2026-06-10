import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { buildUsesItems, sectionChannel, selfLink } from '$lib/rssFeed';

export async function GET(context: APIContext) {
	return rss({
		...sectionChannel('uses'),
		...selfLink('/uses/rss'),
		site: context.site ?? 'https://harambasic.de',
		items: await buildUsesItems(),
		trailingSlash: false
	});
}
