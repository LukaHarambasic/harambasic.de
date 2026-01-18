import { getSnippet, sortByProperty } from '$lib/data/snippets/helper';
import type { Snippet } from '$lib/types/snippet';
import { getContentService } from '$lib/services';
import { generateXml, options } from '$lib/util/rss.server';

export const prerender = true;

export async function GET() {
	const rawEntries = await getContentService().getEntries('snippet');
	const entries: Snippet[] = rawEntries
		.map(getSnippet)
		.filter((snippet): snippet is Snippet => snippet !== null)
		.sort((a, b) => sortByProperty(a, b, 'published'));
	const body = generateXml(entries, 'snippet');
	return new Response(body, options);
}
