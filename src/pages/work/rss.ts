import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { buildWorkItems, sectionChannel, selfLink } from '$lib/rssFeed';

export async function GET(context: APIContext) {
	return rss({
		...sectionChannel('work'),
		...selfLink('/work/rss'),
		site: context.site ?? 'https://harambasic.de',
		items: await buildWorkItems(),
		trailingSlash: false
	});
}
