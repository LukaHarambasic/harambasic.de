import type { Shareable } from '$lib/types/shareable';
import type { Tag } from '$lib/types/tag';
import { RepositoryFactory } from '$lib/repositories';
import { getUniqueTags } from '$lib/util/entries';
import { getShareable } from './helper';

export async function requestShareables(): Promise<[Shareable[], Tag[]]> {
	const repository = RepositoryFactory.createShareableRepository();
	const rawEntries = await repository.findAll();
	const entries: Shareable[] = rawEntries.map(getShareable);
	const tags: Tag[] = getUniqueTags(entries);
	return [entries, tags];
}
