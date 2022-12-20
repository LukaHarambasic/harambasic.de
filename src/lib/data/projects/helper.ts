import { ProjectSortProperty, SortDirection, ProjectStatus, EntryType } from "$lib/types/enums";
import type { Tag } from "$lib/types/tag";
import type { Project } from "$lib/types/project";
import { getTag } from "$lib/util/entries";
import { sortAlphabetical, sortDate, sortNumber, getSlug } from "$lib/util/helper";
import { getDate } from "date-fns";

export function getSortedProjects(
	unsorted: Project[],
	property: ProjectSortProperty,
	direction: SortDirection
): Project[] {
	const entriesCopy = JSON.parse(JSON.stringify(unsorted));
	switch (property) {
		case ProjectSortProperty.Title:
			if (direction === SortDirection.Asc) {
				return entriesCopy.sort((a: Project, b: Project) => sortAlphabetical(a.title, b.title));
			} else if (direction === SortDirection.Desc) {
				return entriesCopy.sort((a: Project, b: Project) => sortAlphabetical(b.title, a.title));
			}
			break;
		case ProjectSortProperty.Published:
			if (direction === SortDirection.Asc) {
				return entriesCopy.sort((a: Project, b: Project) =>
					sortDate(b.published.raw, a.published.raw)
				);
			} else if (direction === SortDirection.Desc) {
				return entriesCopy.sort((a: Project, b: Project) =>
					sortDate(a.published.raw, b.published.raw)
				);
			}
			break;
		case ProjectSortProperty.Updated:
			if (direction === SortDirection.Asc) {
				return entriesCopy.sort((a: Project, b: Project) => sortDate(b.updated.raw, a.updated.raw));
			} else if (direction === SortDirection.Desc) {
				return entriesCopy.sort((a: Project, b: Project) => sortDate(a.updated.raw, b.updated.raw));
			}
			break;
		case ProjectSortProperty.Priority:
			if (direction === SortDirection.Asc) {
				return entriesCopy.sort((a: Project, b: Project) => sortNumber(b.prio, a.prio));
			} else if (direction === SortDirection.Desc) {
				return entriesCopy.sort((a: Project, b: Project) => sortNumber(a.prio, b.prio));
			}
			break;
		default:
			return [];
	}
	return [];
}

export function getFilteredProjects(
	unfiltered: Project[],
	filteringTag: Tag,
	filteringStatus: ProjectStatus
): Project[] {
	const entriesCopy = JSON.parse(JSON.stringify(unfiltered));
	const showAll = filteringTag.slug === 'all' && filteringStatus === ProjectStatus.Null;
	if (showAll) {
		return entriesCopy;
	}
	const onlyFilterTags = filteringTag.slug !== 'all' && filteringStatus === ProjectStatus.Null;
	if (onlyFilterTags) {
		return entriesCopy.filter((entry: Project) => {
			return entry.tags.some((tag) => tag.slug === filteringTag.slug);
		});
	}
	const onlyFilterStatus = filteringTag.slug === 'all' && filteringStatus !== ProjectStatus.Null;
	if (onlyFilterStatus) {
		return entriesCopy.filter((entry: Project) => entry.status === filteringStatus);
	}
	// TODO
	return entriesCopy.filter((entry): Project[] => {
		const hasTag = entry.tags.some((tag: Tag) => tag.slug === filteringTag.slug);
		const hasStatus = entry.status == filteringStatus;
		return hasTag && hasStatus;
	});
}

export function getProject(e: any): Project {
	const f = e.frontmatter;
	const type = EntryType.Project;
	const slug = getSlug(f.title);
	const relativePath = `/${type.toLowerCase()}s/${slug}`;
	return {
		type,
		title: f.title,
		description: f.description,
		image: f.image,
		tags: f.tags.map((tag) => getTag(tag, type)),
		published: getDate(f.published),
		updated: getDate(f.updated),
		Content: e.Content,
		links: f.links,
		prio: f.prio,
		status: f.status,
		slug,
		relativePath,
		fullPath: `https://harambasic.de${relativePath}`,
	};
}
