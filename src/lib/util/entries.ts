import type { Bookmark } from '$lib/types/bookmark';
import type { EntryDate } from '$lib/types/entry';
import type { EntryType } from '$lib/types/enums';
import type { Post } from '$lib/types/post';
import type { Tag } from '$lib/types/tag';
import type { Project } from '@playwright/test';
import { getSlug, formatDate } from './helper';

export function getTag(display: string, type: EntryType): Tag {
	const slug = getSlug(display);
	return {
		display,
		slug: slug,
		fullPath: `/${type.toLowerCase()}s/?tag=${slug}`,
		count: 0
	};
}

export function getDate(rawString: string): EntryDate {
	const raw = new Date(rawString);
	return {
		raw,
		display: formatDate(raw)
	};
}

export function getUniqueTags(entries: Project[] | Bookmark[] | Post[]): Tag[] {
	const duplicateTags = entries.map((entry) => entry.tags).flat();
	return duplicateTags.reduce((unique: Tag[], item: Tag): Tag[] => {
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
	}, []);
}

export function getTagBySlug(tags: Tag[], slug: string): Tag {
	const foundTag = tags.find((tag) => tag.slug === slug);
	if (foundTag === undefined) {
		throw new Error(`Tag couldn't be found by slug: ${slug}`);
	}
	return foundTag;
}
