import type { Post } from '$lib/types/post';
import type { Tag } from '$lib/types/tag';
import { RepositoryFactory } from '$lib/repositories';
import { getUniqueTags } from '$lib/util/entries';
import { getPost } from './helper';

export async function request(): Promise<[Post[], Tag[]]> {
	const repository = RepositoryFactory.createPostRepository();
	const rawEntries = await repository.findAll();
	const entries: Post[] = rawEntries.map(getPost);
	const tags: Tag[] = getUniqueTags(entries);
	return [entries, tags];
}
