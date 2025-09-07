import { getUsesEntry, sortByProperty } from '$lib/data/uses/helper';
import { UsesEntrySortProperty } from '$lib/types/enums';
import type { UsesEntry } from '$lib/types/usesEntry';
import { getRawEntries } from '$lib/util/converter.server';
import { generateXml, options } from '$lib/util/rss.server';

export const prerender = true;

export async function GET() {
	const rawEntries = await getRawEntries('uses');
	const entries: UsesEntry[] = rawEntries
		.map(getUsesEntry)
		.sort((a, b) => sortByProperty(a, b, UsesEntrySortProperty.Published));
	const body = generateXml(entries, 'uses');
	return new Response(body, options);
}
