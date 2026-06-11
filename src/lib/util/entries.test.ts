import type { EntryDate } from '$lib/types/entry';
import type { Post } from '$lib/types/post';
import type { Tag } from '$lib/types/tag';
import { expect, test } from 'vitest';
import { findBySlug, getDate, getTag } from './entries';

test('findBySlug - find entry by slug', async () => {
	const entry = {
		slug: 'test-slug-for-testing-purpose-only'
	} as Post;
	expect(findBySlug(entry, 'test-slug-for-testing-purpose-only')).toBe(true);
});

test('getTag - generate a tag based on display text and type maybe with an initial count', async () => {
	const resultTag: Tag = {
		display: 'test',
		slug: 'test',
		relativePath: '/experience?tag=test',
		count: 0,
		type: 'experience'
	};
	expect(getTag('test', 'experience')).toStrictEqual(resultTag);
});

test('getDate - generate date based on string', async () => {
	const resultDate: EntryDate = {
		raw: new Date('1996-02-18'),
		display: 'Feb 1996'
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
