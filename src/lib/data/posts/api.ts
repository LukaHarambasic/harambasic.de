import { EntryType } from '$lib/types/enums';
import type { Post } from '$lib/types/post';
import { getRawEntries } from '$lib/util/converter';
import { getPost } from './helper';

// This might seem to be overkill, but therefore it decouples the data gathering from the actual framework
export async function request(): Promise<Post[]> {
	const rawEntries = await getRawEntries(EntryType.Post);
	return rawEntries.map(getPost);
}
