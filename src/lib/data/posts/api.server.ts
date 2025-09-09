import type { Post } from '$lib/types/post';
import type { Tag } from '$lib/types/tag';
import { getContentService } from '$lib/services';
import { getUniqueTags } from '$lib/util/entries';
import { getPost } from './helper';

export async function request(): Promise<[Post[], Tag[]]> {
	const contentService = getContentService();
	const rawEntries = await contentService.getEntries('post');
	const entries: Post[] = rawEntries.map(getPost).filter((entry): entry is Post => entry != null);
	const tags: Tag[] = getUniqueTags(entries);
	return [entries, tags];
}
