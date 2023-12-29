import type { RawEntry } from '$lib/types/entry';
import { EntryType, ProjectSortProperty, ProjectStatus, SortDirection } from '$lib/types/enums';
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
	const type = EntryType.Project;
	const slug = getSlug(meta.title);
	const relativePath = `/${type.toLowerCase()}s/${slug}`;
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
		status: meta.status,
		slug,
		relativePath,
		fullPath: `https://harambasic.de${relativePath}`,
		html: entry.html
	};
}

function sortByProperty(a: Project, b: Project, property: ProjectSortProperty): number {
	switch (property) {
		case ProjectSortProperty.Title:
			return sortAlphabetical(b.title, a.title);
		case ProjectSortProperty.Priority:
			return sortNumber(b.prio, a.prio);
		case ProjectSortProperty.Published:
			return sortDate(b.published.raw, a.published.raw);
		case ProjectSortProperty.Updated:
			return sortDate(b.updated.raw, a.updated.raw);
		default:
			return 0;
	}
}

function filterByStatus(entry: Project, filterStatus: ProjectStatus): boolean {
	if (filterStatus === ProjectStatus.All) return true;
	return entry.status === filterStatus;
}
