import { atom, computed } from 'nanostores';
import { ProjectSortProperty, ProjectStatus, SortDirection } from '$lib/types/enums';
import type { Project } from '$lib/types/project';
import type { Tag } from '$lib/types/tag';
import { getUniqueTags } from '$lib/util/entries';
import { getSortedProjects, getFilteredProjects } from './helper';

export const initEntries = atom<Project[]>([]);
export const tags = atom<Tag[]>([]);
export const filterTagSlug = atom<string>('all');
export const filterStatus = atom<ProjectStatus>(ProjectStatus.Empty);
export const sortProperty = atom<ProjectSortProperty>(ProjectSortProperty.Title);
export const sortDirection = atom<SortDirection>(SortDirection.Desc);

export const entries = computed(
	[initEntries, tags, filterTagSlug, filterStatus, sortProperty, sortDirection],
	(initEntries, tags, filterTagSlug, filterStatus, sortProperty, sortDirection) => {
		const filtered = getFilteredProjects(initEntries, filterTagSlug, filterStatus);
		return getSortedProjects(filtered, sortProperty, sortDirection);
	}
);

// TODO should/could be an action but the only benefit is the logging which I dont use, soooooo nah
export function init(entries: Project[]) {
	if (initEntries.get().length !== 0) return
	console.log('init projects');
	console.log(entries);
	const uniqueTags = getUniqueTags(entries);
	tags.set(uniqueTags);
	initEntries.set(entries);
}
