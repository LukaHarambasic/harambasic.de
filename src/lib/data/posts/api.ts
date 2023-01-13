import { EntryType } from '$lib/types/enums';
import type { Post } from '$lib/types/post';
import { getRawEntries } from '$lib/util/converter';
import { getPost } from './helper';

export async function request(): Promise<Post[]> {
	const rawEntries = await getRawEntries(EntryType.Post);
	return rawEntries.map(getPost);
}
