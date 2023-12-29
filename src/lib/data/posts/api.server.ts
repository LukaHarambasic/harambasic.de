import { EntryType } from '$lib/types/enums';
import type { Post } from '$lib/types/post';
import type { Tag } from '$lib/types/tag';
import { getRawEntries } from '$lib/util/converter.server';
import { getUniqueTags } from '$lib/util/entries';
import { getPost } from './helper';

export async function request(): Promise<[Post[], Tag[]]> {
	const rawEntries = await getRawEntries(EntryType.Post);
	const entries: Post[] = rawEntries.map(getPost);
	const tags: Tag[] = getUniqueTags(entries);
	return [entries, tags];
}
