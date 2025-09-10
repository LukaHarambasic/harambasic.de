import type { UsesEntry } from '$lib/types/usesEntry';
import type { EntryDate } from '$lib/types/entry';
import type { EntryType } from '$lib/types/enums';
import { SortDirection } from '$lib/types/enums';
import type { Post } from '$lib/types/post';
import type { Project } from '$lib/types/project';
import type { Tag } from '$lib/types/tag';
import { formatDate, getSlug, sortAlphabetical } from './helper';
import type { Shareable } from '$lib/types/shareable';

export function findBySlug(entry: Post | Project | UsesEntry | Shareable, slug: string): boolean {
	return entry.slug === slug;
}

export function getTag(display: string, type: EntryType, iniCount = 0): Tag {
	const slug = getSlug(display);
	const path = type === 'uses' ? 'uses' : `${type}s`;
	return {
		display,
		slug: slug,
		relativePath: `/${path}?tag=${slug}`,
		count: iniCount,
		type
	};
}

export function getDate(rawString: string): EntryDate {
	if (!rawString || rawString === 'undefined') {
		throw new Error(`Invalid date string: "${rawString}". Date cannot be empty or undefined.`);
	}

	const raw = new Date(rawString);

	// Check if the date is valid
	if (isNaN(raw.getTime())) {
		throw new Error(
			`Invalid date format: "${rawString}". Must be a valid ISO date string (YYYY-MM-DD).`
		);
	}

	return {
		raw,
		display: formatDate(raw)
	};
}

export function filterByTag(
	entry: Post | Project | UsesEntry | Shareable,
	filterTagSlug: string
): boolean {
	if (filterTagSlug === 'all' || filterTagSlug === '') return true;
	return entry.tags.some((tag) => tag.slug === filterTagSlug);
}

export function sortByDirection(sortDirection: SortDirection): number {
	return sortDirection === SortDirection.Asc ? 1 : -1;
}

export function getUniqueTags(entries: Project[] | UsesEntry[] | Post[] | Shareable[]): Tag[] {
	// Filter out undefined/null entries and ensure tags exist
	const validEntries = entries.filter((entry) => entry && entry.tags && Array.isArray(entry.tags));

	if (validEntries.length === 0) {
		// If no valid entries, return empty array with a default "post" type
		const defaultAllTag = getTag('All', 'post', 0);
		return [defaultAllTag];
	}

	// rewrite with map and than loop over non uniqque for counting - aka make henry happy > no functional change :D
	const duplicateTags = validEntries.map((entry) => entry.tags).flat();
	const uniqueTags: Tag[] = duplicateTags
		.filter((item) => item && item.slug && item.type) // Filter out invalid tag objects
		.reduce((unique: Tag[], item: Tag): Tag[] => {
			const tagIndex = unique.findIndex((u) => item.slug === u.slug);
			const isItemInUnique = tagIndex >= 0;
			if (isItemInUnique) {
				unique[tagIndex].count++;
			} else {
				unique.push({
					...item,
					count: 1
				});
			}
			return unique;
		}, [])
		.sort((a: Tag, b: Tag) => sortAlphabetical(a.display, b.display));

	// Get type from first valid entry if no unique tags exist
	const type = uniqueTags.length > 0 ? uniqueTags[0].type : validEntries[0].type;
	const allTag = getTag('All', type, validEntries.length);
	return [allTag, ...uniqueTags];
}

export function getTagBySlug(tags: Tag[], slug: string): Tag {
	const foundTag = tags.find((tag) => tag.slug === slug);
	if (foundTag === undefined) {
		throw new Error(`Tag couldn't be found by slug: ${slug}`);
	}
	return foundTag;
}
