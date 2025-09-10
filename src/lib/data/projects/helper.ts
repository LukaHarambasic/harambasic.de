import type { RawEntry } from '$lib/types/entry';
import type { EntryType, ProjectSortProperty } from '$lib/types/enums';
import type { ProjectStatus } from '$lib/types/enums';
import { SortDirection } from '$lib/types/enums';
import type { Project } from '$lib/types/project';
import { filterByTag, getDate, getTag } from '$lib/util/entries';
import { getSlug, sortAlphabetical, sortDate, sortNumber } from '$lib/util/helper';

export function filterAndSort(
	entries: Project[],
	filterTagSlug: string,
	filterStatus: ProjectStatus,
	sortProperty: ProjectSortProperty,
	sortDirection: SortDirection
): Project[] {
	const sorted = entries
		.filter((entry) => filterByTag(entry, filterTagSlug))
		.filter((entry) => filterByStatus(entry, filterStatus))
		.sort((a, b) => sortByProperty(a, b, sortProperty));

	return sortDirection === SortDirection.Asc ? sorted.reverse() : sorted;
}

export function getProject(entry: RawEntry): Project {
	const type: EntryType = 'project';
	const slug = getSlug(entry.title);
	const relativePath = `/${type}s/${slug}`;

	// Strict validation of date formats - fail fast with detailed error
	if (entry.published === undefined || entry.published === null) {
		throw new Error(
			`Missing 'published' date in project file "${slug}" (title: "${entry.title}"). This field is mandatory and must be a valid ISO date string (YYYY-MM-DD).`
		);
	}

	if (entry.updated === undefined || entry.updated === null) {
		throw new Error(
			`Missing 'updated' date in project file "${slug}" (title: "${entry.title}"). This field is mandatory and must be a valid ISO date string (YYYY-MM-DD).`
		);
	}

	// Process dates with enhanced error context
	let published: ReturnType<typeof getDate>;
	let updated: ReturnType<typeof getDate>;

	try {
		published = getDate(entry.published);
	} catch (error) {
		throw new Error(
			`Invalid 'published' date in project file "${slug}" (title: "${entry.title}"): ${error instanceof Error ? error.message : String(error)}`
		);
	}

	try {
		updated = getDate(entry.updated);
	} catch (error) {
		throw new Error(
			`Invalid 'updated' date in project file "${slug}" (title: "${entry.title}"): ${error instanceof Error ? error.message : String(error)}`
		);
	}

	return {
		type,
		title: entry.title,
		image: entry.image || '',
		imageAlt: entry.imageAlt || '',
		description: entry.description || '',
		tags: (entry.tags || []).map((tag: string) => getTag(tag, type)),
		published,
		updated,
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
