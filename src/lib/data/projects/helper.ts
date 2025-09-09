import type { RawEntry } from '$lib/types/entry';
import type { EntryType, ProjectSortProperty } from '$lib/types/enums';
import type { ProjectStatus } from '$lib/types/enums';
import { SortDirection } from '$lib/types/enums';
import type { Project } from '$lib/types/project';
import { filterByTag, getDate, getTag, sortByDirection } from '$lib/util/entries';
import { getSlug, sortAlphabetical, sortDate, sortNumber } from '$lib/util/helper';

export function filterAndSort(
	entries: Project[],
	filterTagSlug: string,
	filterStatus: ProjectStatus,
	sortProperty: ProjectSortProperty,
	sortDirection: SortDirection
): Project[] {
	return entries
		.filter((entry) => filterByTag(entry, filterTagSlug))
		.filter((entry) => filterByStatus(entry, filterStatus))
		.sort((a, b) => sortByProperty(a, b, sortProperty))
		.sort(() => sortByDirection(sortDirection));
}

export function getProject(entry: RawEntry): Project {
	const meta = entry.meta;
	const type: EntryType = 'project';
	const slug = getSlug(meta.title);
	const relativePath = `/${type}s/${slug}`;
	return {
		type,
		title: meta.title,
		image: meta.image || '',
		imageAlt: meta.imageAlt || '',
		description: meta.description || '',
		tags: meta.tags.map((tag: string) => getTag(tag, type)) || [],
		published: getDate(meta.published),
		updated: getDate(meta.updated),
		links: meta.links || [],
		prio: meta.prio || 0,
		status: meta.status as ProjectStatus,
		slug,
		relativePath,
		fullPath: `https://harambasic.de${relativePath}`,
		html: entry.html
	};
}

export function sortByProperty(a: Project, b: Project, property: ProjectSortProperty): number {
	switch (property) {
		case 'title':
			return sortAlphabetical(b.title, a.title);
		case 'priority':
			return sortNumber(b.prio, a.prio);
		case 'published':
			return sortDate(b.published.raw, a.published.raw);
		case 'updated':
			return sortDate(b.updated.raw, a.updated.raw);
		default:
			return 0;
	}
}

function filterByStatus(entry: Project, filterStatus: ProjectStatus): boolean {
	if (filterStatus === 'all') return true;
	return entry.status === filterStatus;
}
