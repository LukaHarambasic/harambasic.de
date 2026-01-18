import { getProject, sortByProperty } from '$lib/data/projects/helper';
import type { Project } from '$lib/types/project';
import { getContentService } from '$lib/services';
import { generateXml, options } from '$lib/util/rss.server';

export const prerender = true;

export async function GET() {
	const rawEntries = await getContentService().getEntries('project');
	const entries: Project[] = rawEntries
		.map(getProject)
		.sort((a, b) => sortByProperty(a, b, 'published'));
	const body = generateXml(entries, 'project');
	return new Response(body, options);
}
