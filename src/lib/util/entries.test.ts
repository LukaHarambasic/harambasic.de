import type { EntryDate } from '$lib/types/entry';
import { EntryType, SortDirection } from '$lib/types/enums';
import type { Project } from '$lib/types/project';
import type { Tag } from '$lib/types/tag';
import { expect, test } from 'vitest';
import {
	findBySlug,
	getDate,
	getTag,
	filterByTag,
	sortByDirection,
	getUniqueTags,
	getTagBySlug
} from './entries';

test('findBySlug - find entry by slug', async () => {
	const entry = {
		slug: 'test-slug-for-testing-purpose-only'
	} as Project;
	expect(findBySlug(entry, 'test-slug-for-testing-purpose-only')).toBe(true);
});

test('getTag - generate a tag based on display text and type maybe with an initial count', async () => {
	const resultTag: Tag = {
		display: 'test',
		slug: 'test',
		relativePath: '/projects?tag=test',
		count: 0,
		type: 'PROJECT'
	};
	expect(getTag('test', EntryType.Project)).toStrictEqual(resultTag);
});

test('getDate - generate date based on string', async () => {
	const resultDate: EntryDate = {
		raw: new Date('1996-02-18'),
		display: '1996-02-18'
	};
	expect(getDate('1996-02-18')).toStrictEqual(resultDate);
});

test('filterByTag - filter entries by tag slug', async () => {
	const tags: Tag[] = [
		{
			display: 'JavaScript',
			slug: 'javascript',
			relativePath: '/projects?tag=javascript',
			count: 1,
			type: 'PROJECT'
		},
		{
			display: 'Vue.js',
			slug: 'vuejs',
			relativePath: '/projects?tag=vuejs',
			count: 1,
			type: 'PROJECT'
		}
	];
	const entry = { tags } as Project;

	expect(filterByTag(entry, 'javascript')).toBe(true);
	expect(filterByTag(entry, 'python')).toBe(false);
	expect(filterByTag(entry, 'all')).toBe(true);
	expect(filterByTag(entry, '')).toBe(true);
});

test('sortByDirection - return correct sort direction multiplier', async () => {
	expect(sortByDirection(SortDirection.Asc)).toBe(1);
	expect(sortByDirection(SortDirection.Desc)).toBe(-1);
});

test('getUniqueTags - generate unique tags with counts from entries', async () => {
	const tag1: Tag = {
		display: 'JavaScript',
		slug: 'javascript',
		relativePath: '/projects?tag=javascript',
		count: 1,
		type: 'PROJECT'
	};
	const tag2: Tag = {
		display: 'Vue.js',
		slug: 'vuejs',
		relativePath: '/projects?tag=vuejs',
		count: 1,
		type: 'PROJECT'
	};

	const entries: Project[] = [{ tags: [tag1, tag2] } as Project, { tags: [tag1] } as Project];

	const result = getUniqueTags(entries);

	// Should have "All" tag + 2 unique tags
	expect(result).toHaveLength(3);
	expect(result[0].display).toBe('All');
	expect(result[0].count).toBe(2); // Total entry count

	// Find JavaScript tag and check its count
	const jsTag = result.find((tag) => tag.slug === 'javascript');
	expect(jsTag?.count).toBe(2); // Appears in 2 entries

	// Find Vue.js tag and check its count
	const vueTag = result.find((tag) => tag.slug === 'vuejs');
	expect(vueTag?.count).toBe(1); // Appears in 1 entry
});

test('getTagBySlug - find tag by slug or throw error', async () => {
	const tags: Tag[] = [
		{
			display: 'JavaScript',
			slug: 'javascript',
			relativePath: '/projects?tag=javascript',
			count: 1,
			type: 'PROJECT'
		},
		{
			display: 'Vue.js',
			slug: 'vuejs',
			relativePath: '/projects?tag=vuejs',
			count: 1,
			type: 'PROJECT'
		}
	];

	const foundTag = getTagBySlug(tags, 'javascript');
	expect(foundTag.display).toBe('JavaScript');

	expect(() => getTagBySlug(tags, 'nonexistent')).toThrow(
		"Tag couldn't be found by slug: nonexistent"
	);
});
