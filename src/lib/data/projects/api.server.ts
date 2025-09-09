import type { Project } from '$lib/types/project';
import type { Tag } from '$lib/types/tag';
import { RepositoryFactory } from '$lib/repositories';
import { getUniqueTags } from '$lib/util/entries';
import { getProject } from './helper';

export async function request(): Promise<[Project[], Tag[]]> {
	const repository = RepositoryFactory.createProjectRepository();
	const rawEntries = await repository.findAll();
	const entries: Project[] = rawEntries.map(getProject);
	const tags: Tag[] = getUniqueTags(entries);
	return [entries, tags];
}
