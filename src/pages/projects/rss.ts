import type { APIRoute } from 'astro';
import { generateXml, options } from '$lib/rss';
import { buildProjectsFeed } from '$lib/rssFeed';

export const GET: APIRoute = async () => {
	const xml = generateXml(await buildProjectsFeed(), 'project');
	return new Response(xml, { headers: options.headers });
};
