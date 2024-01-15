import { getStackEntry, sortByProperty } from '$lib/data/stack/helper';
import { EntryType, StackEntrySortProperty } from '$lib/types/enums';
import type { StackEntry } from '$lib/types/stackEntry';
import { getRawEntries } from '$lib/util/converter.server';
import { generateXml, options } from '$lib/util/rss.server';

export async function GET() {
	const rawEntries = await getRawEntries(EntryType.StackEntry);
	const entries: StackEntry[] = rawEntries
		.map(getStackEntry)
		.sort((a, b) => sortByProperty(a, b, StackEntrySortProperty.Published));
	const body = generateXml(entries, EntryType.StackEntry);
	return new Response(body, options);
}
