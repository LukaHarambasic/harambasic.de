import type { Project } from '$lib/types/project';
import type { Tag } from '$lib/types/tag';
import { getRawEntries } from '$lib/util/cachedConverter.server';
import { getUniqueTags } from '$lib/util/entries';
import { getProject } from './helper';

export async function request(): Promise<[Project[], Tag[]]> {
	const rawEntries = await getRawEntries('project');
	const entries: Project[] = rawEntries.map(getProject);
	const tags: Tag[] = getUniqueTags(entries);
	return [entries, tags];
}
