import type { Project } from '$lib/types/project';
import type { Tag } from '$lib/types/tag';
import { getContentService } from '$lib/services';
import { getUniqueTags } from '$lib/util/entries';
import { getProject } from './helper';

export async function request(): Promise<[Project[], Tag[]]> {
	const contentService = getContentService();
	const rawEntries = await contentService.getEntries('project');
	const entries: Project[] = rawEntries
		.map(getProject)
		.filter((entry): entry is Project => entry != null);
	const tags: Tag[] = getUniqueTags(entries);
	return [entries, tags];
}
