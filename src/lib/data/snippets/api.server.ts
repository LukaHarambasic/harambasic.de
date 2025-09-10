import type { Snippet } from '$lib/types/snippet';
import type { Tag } from '$lib/types/tag';
import { getContentService } from '$lib/services';
import { getUniqueTags } from '$lib/util/entries';
import { getSnippet } from './helper';

export async function request(): Promise<[Snippet[], Tag[]]> {
	const contentService = getContentService();
	const rawEntries = await contentService.getEntries('snippet');
	const entries: Snippet[] = rawEntries
		.map(getSnippet)
		.filter((entry): entry is Snippet => entry != null);
	const tags: Tag[] = getUniqueTags(entries);
	return [entries, tags];
}
