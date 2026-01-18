import { getUsesEntry, sortByProperty } from '$lib/data/uses/helper';
import type { UsesEntry } from '$lib/types/usesEntry';
import { getContentService } from '$lib/services';
import { generateXml, options } from '$lib/util/rss.server';

export const prerender = true;

export async function GET() {
	const rawEntries = await getContentService().getEntries('uses');
	const entries: UsesEntry[] = rawEntries
		.map(getUsesEntry)
		.sort((a, b) => sortByProperty(a, b, 'published'));
	const body = generateXml(entries, 'uses');
	return new Response(body, options);
}
