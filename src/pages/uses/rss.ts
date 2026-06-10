import type { APIRoute } from 'astro';
import { generateXml, options } from '$lib/rss';
import { buildUsesFeed } from '$lib/rssFeed';

export const GET: APIRoute = async () => {
	const xml = generateXml(await buildUsesFeed(), 'uses');
	return new Response(xml, { headers: options.headers });
};
