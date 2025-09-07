import { getProject, sortByProperty } from '$lib/data/projects/helper';
import { EntryType } from '$lib/types/enums';
import type { Project } from '$lib/types/project';
import { getRawEntries } from '$lib/util/converter.server';
import { generateXml, options } from '$lib/util/rss.server';

export const prerender = true;

export async function GET() {
	const rawEntries = await getRawEntries(EntryType.Project);
	const entries: Project[] = rawEntries
		.map(getProject)
		.sort((a, b) => sortByProperty(a, b, 'published'));
	const body = generateXml(entries, EntryType.Project);
	return new Response(body, options);
}
