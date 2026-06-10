import type { APIRoute } from 'astro';
import { generateXml, options } from '$lib/rss';
import { buildPostsFeed } from '$lib/rssFeed';

export const GET: APIRoute = async () => {
	const xml = generateXml(await buildPostsFeed(), 'post');
	return new Response(xml, { headers: options.headers });
};
