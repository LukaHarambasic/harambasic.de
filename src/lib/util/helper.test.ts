import { expect, test } from 'vitest';
import {
	statusFilterToArray,
	sortDirectionsToArray,
	sortPropertyToArray,
	formatDate,
	formatDateDisplay,
	sortPositionsByDate,
	getSlug,
	sortAlphabetical,
	sortDate,
	sortNumber,
	isValidPostSortProperty,
	isValidProjectSortProperty,
	isValidSortDirection
} from './helper';

test('getSlug - string to slug', async () => {
	const data = [
		{
			title: 'Nuxt.js',
			slug: 'nuxtjs'
		},
		{
			title: 'Lorem Ipsum',
			slug: 'lorem-ipsum'
		},
		{
			title: '1234567',
			slug: '1234567'
		},
		{
			title: 'How to be 10 times more productive!',
			slug: 'how-to-be-10-times-more-productive'
		},
		{
			title: '3 3 6 $ 4 1 ?= !',
			slug: '3-3-6-4-1-'
		},
		{
			title: '#important post with hashtags! ',
			slug: 'important-post-with-hashtags'
		},
		{
			title: ' starts and ends with space ',
			slug: 'starts-and-ends-with-space'
		}
	];
	data.forEach((item) => {
		expect(getSlug(item.title)).toEqual(item.slug);
	});
});

test('formatDate - date to formatted string', async () => {
	expect(formatDate(new Date('1996-02-18'))).toBe('1996-02-18');
	expect(formatDate(new Date('1996-02-18T00:00'))).toBe('1996-02-18');
});

test('formatDateDisplay - date string to display format (MMM YYYY)', async () => {
	expect(formatDateDisplay('2024-01-15')).toBe('Jan 2024');
	expect(formatDateDisplay('2023-12-01')).toBe('Dec 2023');
	expect(formatDateDisplay('2025-06-30')).toBe('Jun 2025');
});

test('sortPositionsByDate - sort positions by start date (most recent first)', async () => {
	const positions = [
		{ startDate: '2020-01-01', title: 'Old' },
		{ startDate: '2024-01-01', title: 'Recent' },
		{ startDate: '2022-06-15', title: 'Middle' }
	];
	const sorted = sortPositionsByDate(positions);
	expect(sorted[0]?.title).toBe('Recent');
	expect(sorted[1]?.title).toBe('Middle');
	expect(sorted[2]?.title).toBe('Old');
	// Verify original array is not mutated
	expect(positions[0]?.title).toBe('Old');
});

test('sortAlphabetical - a to z', async () => {
	expect(sortAlphabetical('a', 'z')).lessThan(0);
	expect(sortAlphabetical('a', 'a')).toEqual(0);
	expect(sortAlphabetical('z', 'a')).greaterThan(0);
});

test('sortDate - is date A before date B', async () => {
	expect(sortDate(new Date('1996-02-18'), new Date('1996-02-17'))).lessThan(0);
	expect(sortDate(new Date('1996-02-18'), new Date('1996-02-18'))).toEqual(0);
	expect(sortDate(new Date('1996-02-18'), new Date('1996-02-19'))).greaterThan(0);
});

test('sortNumber - is A smaller than B', async () => {
	expect(sortNumber(10, 5)).lessThan(0);
	expect(sortNumber(11, 11)).toEqual(0);
	expect(sortNumber(5, 10)).greaterThan(0);
});

test('statusFilterToArray - convert status values to array', async () => {
	const resultArray = [
		{
			display: 'Active',
			key: 'active'
		},
		{
			display: 'Inactive',
			key: 'inactive'
		},
		{
			display: 'All',
			key: 'all'
		}
	];
	expect(statusFilterToArray()).toEqual(resultArray);
});

test('sortDirectionsToArray - convert sort directions to array', async () => {
	const resultArray = [
		{
			display: 'Asc',
			key: 'ASC'
		},
		{
			display: 'Desc',
			key: 'DESC'
		}
	];
	expect(sortDirectionsToArray()).toEqual(resultArray);
});

test('sortPropertyToArray - convert sort properties to array', async () => {
	const inputProperties = ['title', 'published', 'updated'];
	const resultArray = [
		{
			display: 'Title',
			key: 'title'
		},
		{
			display: 'Published',
			key: 'published'
		},
		{
			display: 'Updated',
			key: 'updated'
		}
	];
	expect(sortPropertyToArray(inputProperties)).toEqual(resultArray);
});

test('isValidPostSortProperty - validate post sort properties', async () => {
	expect(isValidPostSortProperty('title')).toBe(true);
	expect(isValidPostSortProperty('published')).toBe(true);
	expect(isValidPostSortProperty('updated')).toBe(true);
	expect(isValidPostSortProperty('priority')).toBe(false);
	expect(isValidPostSortProperty('invalid')).toBe(false);
});

test('isValidProjectSortProperty - validate project sort properties', async () => {
	expect(isValidProjectSortProperty('title')).toBe(true);
	expect(isValidProjectSortProperty('published')).toBe(true);
	expect(isValidProjectSortProperty('updated')).toBe(true);
	expect(isValidProjectSortProperty('priority')).toBe(true);
	expect(isValidProjectSortProperty('invalid')).toBe(false);
});

test('isValidSortDirection - validate sort directions', async () => {
	expect(isValidSortDirection('ASC')).toBe(true);
	expect(isValidSortDirection('DESC')).toBe(true);
	expect(isValidSortDirection('asc')).toBe(false);
	expect(isValidSortDirection('desc')).toBe(false);
	expect(isValidSortDirection('invalid')).toBe(false);
});
