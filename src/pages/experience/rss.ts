import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { buildExperienceItems, sectionChannel, selfLink } from '$lib/rssFeed';

export async function GET(context: APIContext) {
	return rss({
		...sectionChannel('experience'),
		...selfLink('/experience/rss'),
		site: context.site ?? 'https://harambasic.de',
		items: await buildExperienceItems(),
		trailingSlash: false
	});
}
