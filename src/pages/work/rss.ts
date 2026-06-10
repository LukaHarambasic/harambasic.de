import type { APIRoute } from 'astro';
import { generateXml, options } from '$lib/rss';
import { buildWorkFeed } from '$lib/rssFeed';

export const GET: APIRoute = async () => {
	const xml = generateXml(await buildWorkFeed(), 'work');
	return new Response(xml, { headers: options.headers });
};
