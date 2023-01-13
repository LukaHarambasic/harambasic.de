import { EntryType } from '$lib/types/enums';
import type { Project } from '$lib/types/project';
import { getRawEntries } from '$lib/util/converter';
import { getProject } from './helper';

export async function request(): Promise<Project[]> {
	const rawEntries = await getRawEntries(EntryType.Project);
	const entries: Project[] = rawEntries.map(getProject);
	return entries;
}
