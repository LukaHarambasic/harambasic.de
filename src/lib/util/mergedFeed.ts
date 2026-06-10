import type { EntryDate } from '$lib/types/entry';
import type { Post } from '$lib/types/post';
import type { Project } from '$lib/types/project';
import type { UsesEntry } from '$lib/types/usesEntry';
import type { WorkEntry } from '$lib/types/workEntry';
import { isExternalUrl } from '$lib/util/helper';

export type MergedFeedCategory = 'Posts' | 'Projects' | 'Uses' | 'Work';

export type MergedFeedEntry = {
	title: string;
	description: string;
	slug: string;
	published: EntryDate;
	updated: EntryDate;
	relativePath: string;
	category: MergedFeedCategory;
	href: string;
	isExternal: boolean;
	image: string;
};

type BaseFeedEntry = {
	title: string;
	description: string;
	slug: string;
	published: EntryDate;
	updated: EntryDate;
	relativePath: string;
	image: string;
};

function toMergedEntry(
	entry: BaseFeedEntry | UsesEntry,
	category: MergedFeedCategory
): MergedFeedEntry {
	const href =
		category === 'Uses' ? (entry as UsesEntry).url || entry.relativePath : entry.relativePath;
	return {
		title: entry.title,
		description: entry.description,
		slug: entry.slug,
		published: entry.published,
		updated: entry.updated,
		relativePath: entry.relativePath,
		category,
		href,
		isExternal: category === 'Uses' ? isExternalUrl(href) : false,
		image: entry.image
	};
}

function getSortTime(entry: MergedFeedEntry): number {
	const updated = entry.updated?.raw;
	const published = entry.published?.raw;
	if (updated) return new Date(updated).getTime();
	if (published) return new Date(published).getTime();
	return 0;
}

export function getMergedFeedEntries(
	posts: Post[],
	projects: Project[],
	uses: UsesEntry[],
	work: WorkEntry[]
): MergedFeedEntry[] {
	const merged: MergedFeedEntry[] = [
		...posts.map((e) => toMergedEntry(e, 'Posts')),
		...projects.map((e) => toMergedEntry(e, 'Projects')),
		...uses.map((e) => toMergedEntry(e, 'Uses')),
		...work.map((e) => toMergedEntry(e, 'Work'))
	];

	merged.sort((a, b) => getSortTime(b) - getSortTime(a));
	return merged;
}
