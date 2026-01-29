import type { PageServerLoad } from './$types';

export const load = (async ({ parent, url }) => {
	const { work, projects } = await parent();
	const [workEntries] = work;
	const [projectEntries] = projects;

	// Create a map of project slugs to project objects for quick lookup
	const projectMap = new Map(
		projectEntries.map((project) => [project.slug, { slug: project.slug, title: project.title }])
	);

	// Create an object mapping work entry slugs to their related project objects
	const workRelatedProjects: Record<string, Array<{ slug: string; title: string }>> = {};
	for (const entry of workEntries) {
		if (entry.relatedProjects && entry.relatedProjects.length > 0) {
			const relatedProjects = entry.relatedProjects
				.map((slug) => projectMap.get(slug))
				.filter((project): project is { slug: string; title: string } => project !== undefined);
			if (relatedProjects.length > 0) {
				workRelatedProjects[entry.slug] = relatedProjects;
			}
		}
	}

	return {
		description:
			"My professional journey across different companies and roles. Each entry represents a company where I've worked, with multiple positions and experiences.",
		url: url.pathname,
		workRelatedProjects
	};
}) satisfies PageServerLoad;
