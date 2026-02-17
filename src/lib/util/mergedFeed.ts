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

const FULL_CATEGORIES: MergedFeedCategory[] = ['Posts', 'Projects', 'Work'];

function isFullWidth(entry: MergedFeedEntry): boolean {
	return FULL_CATEGORIES.includes(entry.category);
}

export function getLayoutOrderedEntries(entries: MergedFeedEntry[]): MergedFeedEntry[] {
	const byDate = [...entries].sort((a, b) => getSortTime(b) - getSortTime(a));
	const result: MergedFeedEntry[] = [];
	let halfBuffer: MergedFeedEntry[] = [];
	let i = 0;

	while (i < byDate.length) {
		const entry = byDate[i];
		if (entry === undefined) {
			i++;
			continue;
		}
		if (isFullWidth(entry)) {
			const firstUseAfter = byDate.slice(i + 1).find((e) => !isFullWidth(e));
			const halfFirst = halfBuffer[0];
			const fullIsNewerThanBuffer =
				halfBuffer.length === 0 ||
				(halfFirst !== undefined && getSortTime(entry) >= getSortTime(halfFirst));
			const fullIsNewerThanUsesAfter =
				firstUseAfter === undefined || getSortTime(entry) >= getSortTime(firstUseAfter);
			// Only reorder for layout when 1–2 Uses before and Uses after (e.g. Use, Work, Use)
			const fullIsSandwiched =
				halfBuffer.length > 0 &&
				halfBuffer.length <= 2 &&
				firstUseAfter &&
				fullIsNewerThanUsesAfter &&
				!fullIsNewerThanBuffer;

			if (fullIsSandwiched || fullIsNewerThanBuffer) {
				result.push(entry);
				result.push(...halfBuffer);
			} else {
				result.push(...halfBuffer);
				result.push(entry);
			}
			halfBuffer = [];
		} else {
			halfBuffer.push(entry);
		}
		i++;
	}
	result.push(...halfBuffer);
	return result;
}

function endsWithOrphan(layoutOrdered: MergedFeedEntry[], count: number): boolean {
	let col = 0;
	for (let i = 0; i < count && i < layoutOrdered.length; i++) {
		const item = layoutOrdered[i];
		const span = item !== undefined && isFullWidth(item) ? 2 : 1;
		col += span;
		if (col >= 2) col = 0;
	}
	return col === 1;
}

export function getTargetVisibleCount(
	layoutOrdered: MergedFeedEntry[],
	currentVisible: number,
	targetIncrement: number
): number {
	let next = Math.min(currentVisible + targetIncrement, layoutOrdered.length);
	while (next < layoutOrdered.length && endsWithOrphan(layoutOrdered, next)) {
		next++;
	}
	return next;
}

export function getInitialVisibleCount(
	layoutOrdered: MergedFeedEntry[],
	targetCount: number
): number {
	if (layoutOrdered.length === 0) return 0;
	let n = Math.min(targetCount, layoutOrdered.length);
	while (endsWithOrphan(layoutOrdered, n) && n < layoutOrdered.length) {
		n++;
	}
	return n;
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
