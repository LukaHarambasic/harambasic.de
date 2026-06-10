import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { buildPostsItems, sectionChannel, selfLink } from '$lib/rssFeed';

export async function GET(context: APIContext) {
	return rss({
		...sectionChannel('posts'),
		...selfLink('/posts/rss'),
		site: context.site ?? 'https://harambasic.de',
		items: await buildPostsItems(),
		trailingSlash: false
	});
}
