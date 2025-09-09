import type { UsesEntry } from '$lib/types/usesEntry';
import type { Tag } from '$lib/types/tag';
import { getContentService } from '$lib/services';
import { getUniqueTags } from '$lib/util/entries';
import { getUsesEntry } from './helper';

export async function requestUses(): Promise<[UsesEntry[], Tag[]]> {
	const contentService = getContentService();
	const rawEntries = await contentService.getEntries('uses');
	const entries: UsesEntry[] = rawEntries.map(getUsesEntry).filter(Boolean); // Filter out undefined entries
	const tags: Tag[] = getUniqueTags(entries);
	return [entries, tags];
}
