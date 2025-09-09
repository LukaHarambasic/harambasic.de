import type { UsesEntry } from '$lib/types/usesEntry';
import type { Tag } from '$lib/types/tag';
import { RepositoryFactory } from '$lib/repositories';
import { getUniqueTags } from '$lib/util/entries';
import { getUsesEntry } from './helper';

export async function requestUses(): Promise<[UsesEntry[], Tag[]]> {
	const repository = RepositoryFactory.createUsesRepository();
	const rawEntries = await repository.findAll();
	const entries: UsesEntry[] = rawEntries.map(getUsesEntry);
	const tags: Tag[] = getUniqueTags(entries);
	return [entries, tags];
}
