import type { APIRoute } from 'astro';
import { generateMergedXml, options } from '$lib/rss';
import { buildMergedEntries } from '$lib/rssFeed';

export const GET: APIRoute = async () => {
	const xml = generateMergedXml(await buildMergedEntries());
	return new Response(xml, { headers: options.headers });
};
