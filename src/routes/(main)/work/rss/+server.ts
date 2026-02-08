import { sortByProperty } from '$lib/util/entryHelpers';
import { workEntryToFullHtml } from '$lib/util/workEntry';
import { requestWork } from '$lib/data/api.server';
import { generateXml, options } from '$lib/util/rss.server';

export const prerender = true;

export async function GET() {
	const [entries] = await requestWork();
	const sorted = entries.sort((a, b) => sortByProperty(a, b, 'published'));
	const withHtml = sorted.map((e) => ({ ...e, html: workEntryToFullHtml(e) }));
	const body = generateXml(withHtml, 'work');
	return new Response(body, options);
}
