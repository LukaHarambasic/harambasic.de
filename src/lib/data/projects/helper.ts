import type { RawEntry } from '$lib/types/entry';
import type { EntryType, ProjectSortProperty } from '$lib/types/enums';
import { ProjectStatus, SortDirection } from '$lib/types/enums';
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
	const type: EntryType = 'project';
	const slug = getSlug(entry.title);
	const relativePath = `/${type}s/${slug}`;
	return {
		type,
		title: entry.title,
		image: entry.image || '',
		imageAlt: entry.imageAlt || '',
		description: entry.description || '',
		tags: entry.tags.map((tag: string) => getTag(tag, type)) || [],
		published: getDate(entry.published),
		updated: getDate(entry.updated),
		links: entry.links || [],
		prio: entry.prio || 0,
		status: entry.status as ProjectStatus,
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
