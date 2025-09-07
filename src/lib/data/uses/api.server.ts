import type { UsesEntry } from '$lib/types/usesEntry';
import type { Tag } from '$lib/types/tag';
import { getRawEntries } from '$lib/util/converter.server';
import { getUniqueTags } from '$lib/util/entries';
import { getUsesEntry } from './helper';

export async function requestUses(): Promise<[UsesEntry[], Tag[]]> {
	const rawEntries = await getRawEntries('uses');
	const entries: UsesEntry[] = rawEntries.map(getUsesEntry);
	const tags: Tag[] = getUniqueTags(entries);
	return [entries, tags];
}
