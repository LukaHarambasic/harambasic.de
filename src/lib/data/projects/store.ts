import { EntryType, ProjectStatus, ProjectSortProperty, SortDirection } from '$lib/types/enums';
import type { Tag } from '$lib/types/tag';
import type { Project } from '$lib/types/project';
import { getTag, getUniqueTags } from '$lib/util/entries';
import { getProject } from './helper';

const initialTag: Tag = getTag('all', EntryType.Project);

export const initEntries = atom<Project[]>([]);
export const initTags = atom<Tag[]>([]);
export let entries = atom<Project[]>([]);
export let tags = atom<Tag[]>([]);
export let filterTag = atom<Tag>(initialTag);
export let filterStatus = atom<ProjectStatus>(ProjectStatus.Null);
export let sortProperty = atom<ProjectSortProperty>(ProjectSortProperty.Priority);
export let sortDirection = atom<SortDirection>(SortDirection.Desc);

export function init(raw: any) {
	const enrichedEntries = raw.map(getProject);
	initEntries.set(enrichedEntries);
}

initEntries.listen((value: readonly Project[]) => {
	const uniqueTags = getUniqueTags(value as Project[]);
	initTags.set(uniqueTags);
	const sorted = entries.get(); // getSortedProjects(value as Project[], sortProperty.get(), sortDirection.get())
	entries.set(sorted);
});

initTags.listen((value: readonly Tag[]) => {
	tags.set(value as Tag[]);
});

filterTag.listen((value: Readonly<Tag>) => {
	const filtered = entries.get(); // getFilteredProjects(initEntries.get(), value, filterStatus.get())
	const sortedAndFiltered = entries.get(); // getSortedProjects(filtered, sortProperty.get(), sortDirection.get())
	entries.set(sortedAndFiltered);
});

filterStatus.listen((value: Readonly<ProjectStatus>) => {
	const filtered = entries.get(); // getFilteredProjects(initEntries.get(), filterTag.get(), value)
	const sortedAndFiltered = entries.get(); // getSortedProjects(filtered, sortProperty.get(), sortDirection.get())
	entries.set(sortedAndFiltered);
});

sortProperty.listen((value: ProjectSortProperty) => {
	const sorted = entries.get(); // getSortedProjects(entries.get(), value, sortDirection.get())
	entries.set(sorted);
});

sortDirection.listen((value: SortDirection) => {
	const sorted = entries.get(); // getSortedProjects(entries.get(), sortProperty.get(), value)
	entries.set(sorted);
});
