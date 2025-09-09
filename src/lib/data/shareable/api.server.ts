import type { Shareable } from '$lib/types/shareable';
import type { Tag } from '$lib/types/tag';
import { getContentService } from '$lib/services';
import { getUniqueTags } from '$lib/util/entries';
import { getShareable } from './helper';

export async function requestShareables(): Promise<[Shareable[], Tag[]]> {
	const contentService = getContentService();
	const rawEntries = await contentService.getEntries('shareable');
	const entries: Shareable[] = rawEntries.map(getShareable).filter((entry): entry is Shareable => entry != null);
	const tags: Tag[] = getUniqueTags(entries);
	return [entries, tags];
}
