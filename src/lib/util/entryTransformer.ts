import type { RawEntry } from '$lib/types/entry';
import type { BaseEntry } from '$lib/types/entry';
import type { EntryType } from '$lib/types/enums';
import type { Tag } from '$lib/types/tag';
import type { EntryDate } from '$lib/types/entry';
import { getSlug } from './helper';
import { getTag, getDate } from './entries';

export interface BaseEntryFields {
	type: EntryType;
	slug: string;
	relativePath: string;
	fullPath: string;
	title: string;
	description: string;
	image: string;
	tags: Tag[];
	published: EntryDate;
	updated: EntryDate;
}

export interface EntryTransformConfig<T extends BaseEntry> {
	entryType: EntryType;
	baseUrl?: string;
	transform: (base: BaseEntryFields, raw: RawEntry) => T;
	validate?: (raw: RawEntry) => void;
}

export function getContentPath(entryType: EntryType, slug: string): string {
	if (entryType === 'uses') {
		return `/uses/${slug}`;
	}
	return `/${entryType}s/${slug}`;
}

export function createBaseEntryFields(
	rawEntry: RawEntry,
	entryType: EntryType,
	baseUrl: string = 'https://harambasic.de'
): BaseEntryFields {
	const slug = getSlug(rawEntry.title);
	const relativePath = getContentPath(entryType, slug);
	const fullPath = `${baseUrl}${relativePath}`;

	return {
		type: entryType,
		slug,
		relativePath,
		fullPath,
		title: rawEntry.title,
		description: rawEntry.description,
		image: rawEntry.image || '',
		tags: (rawEntry.tags || []).map((tag: string) => getTag(tag, entryType)),
		published: getDate(rawEntry.published),
		updated: getDate(rawEntry.updated)
	};
}

export function transformEntry<T extends BaseEntry>(
	rawEntry: RawEntry,
	config: EntryTransformConfig<T>
): T {
	const baseUrl = config.baseUrl || 'https://harambasic.de';

	if (config.validate) {
		config.validate(rawEntry);
	}

	const baseFields = createBaseEntryFields(rawEntry, config.entryType, baseUrl);
n
	return config.transform(baseFields, rawEntry);
}

