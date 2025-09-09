import type { EntryDate } from '$lib/types/entry';
import type { Project } from '$lib/types/project';
import type { Tag } from '$lib/types/tag';
import { expect, test } from 'vitest';
import { findBySlug, getDate, getTag } from './entries';

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
		type: 'project'
	};
	expect(getTag('test', 'project')).toStrictEqual(resultTag);
});

test('getDate - generate date based on string', async () => {
	const resultDate: EntryDate = {
		raw: new Date('1996-02-18'),
		display: '1996-02-18'
	};
	expect(getDate('1996-02-18')).toStrictEqual(resultDate);
});

// TODO implement test
test('filterByTag - ', async () => {
	expect(true).toBe(true);
});

// TODO implement test
test('sortByDirection - ', async () => {
	expect(true).toBe(true);
});

// TODO implement test
test('getUniqueTags - ', async () => {
	expect(true).toBe(true);
});

// TODO implement test
test('getTagBySlug - ', async () => {
	expect(true).toBe(true);
});
