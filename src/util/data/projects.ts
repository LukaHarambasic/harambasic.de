import type { MarkdownInstance } from 'astro';
import { getSlug } from '../helper';
import type { Project, Responsibility } from '../../types/project';

// TODO test
export function rawToProjects(rawProjects: MarkdownInstance<Record<string, any>>[]): Project[] {
	return rawProjects.map((rawProject) => {
		const { title, img, alt, prio, status, links, responsibilities } =
			rawProject.frontmatter as Project;
		return {
			title,
			img,
			alt,
			prio,
			status,
			links,
			responsibilities,
			Content: rawProject.Content,
			rawContent: rawProject.rawContent(),
			compiledContent: rawProject.compiledContent(),
			file: rawProject.file,
			slug: getSlug(title)
		};
	});
}

export function rawToResponsibilities(rawResponsibilities: string[]): Responsibility[] {
	if (rawResponsibilities.length === 0) return [];
	return rawResponsibilities.map((responsibility) => {
		const slug = getSlug(responsibility);
		return {
			display: responsibility,
			slug,
			fullPath: `/projects/?responsibility=${slug}`,
			count: 0,
		}
	});
}
