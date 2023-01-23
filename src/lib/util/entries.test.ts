import type { EntryDate } from '$lib/types/entry';
import { EntryType } from '$lib/types/enums';
import type { Project } from '$lib/types/project';
import type { Tag } from '$lib/types/tag';
import { expect, test } from 'vitest'
import { findBySlug, getDate, getTag } from './entries';

test('findBySlug - find entry by slug', async () => {
    const entry = {
        slug: 'test-slug-for-testing-purpose-only'
    } as Project
    expect(findBySlug(entry, 'test-slug-for-testing-purpose-only')).toBe(true);
})

test('getTag - generate a tag based on display text and type maybe with an initial count', async () => {
    const resultTag: Tag = {
        display: 'test',
        slug: 'test',
        relativePath: '/projects/?tag=test',
        count: 0,
        type: 'PROJECT'
    }
    expect(getTag('test', EntryType.Project)).toStrictEqual(resultTag);
})

test('getDate - generate date based on string', async () => {
    const resultDate: EntryDate = {
        raw: new Date('1996-02-18'),
        display: '1996-02-18'
    }
    expect(getDate('1996-02-18')).toStrictEqual(resultDate);
})

test('filterByTag - ', async () => {
    expect(true).toBe(false);
})

test('sortByDirection - ', async () => {
    expect(true).toBe(false);
})

test('getUniqueTags - ', async () => {
    expect(true).toBe(false);
})

test('getTagBySlug - ', async () => {
    expect(true).toBe(false);
})