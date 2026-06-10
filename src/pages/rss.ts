import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { buildMergedItems, mergedChannel, selfLink } from '$lib/rssFeed';

export async function GET(context: APIContext) {
	return rss({
		...mergedChannel,
		...selfLink('/rss'),
		site: context.site ?? 'https://harambasic.de',
		items: await buildMergedItems(),
		trailingSlash: false
	});
}
