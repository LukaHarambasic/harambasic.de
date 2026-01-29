import { sortByProperty } from '$lib/util/entryHelpers';
import { requestWork } from '$lib/data/api.server';
import { generateXml, options } from '$lib/util/rss.server';

export const prerender = true;

export async function GET() {
	const [entries] = await requestWork();
	const sorted = entries.sort((a, b) => sortByProperty(a, b, 'published'));
	const body = generateXml(sorted, 'work');
	return new Response(body, options);
}
