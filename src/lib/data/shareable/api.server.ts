import type { Shareable } from '$lib/types/shareable';
import type { Tag } from '$lib/types/tag';
import { getRawEntries } from '$lib/util/converter.server';
import { getUniqueTags } from '$lib/util/entries';
import { getShareable } from './helper';

export async function requestShareables(): Promise<[Shareable[], Tag[]]> {
	const rawEntries = await getRawEntries('shareable');
	const entries: Shareable[] = rawEntries.map(getShareable);
	const tags: Tag[] = getUniqueTags(entries);
	return [entries, tags];
}
