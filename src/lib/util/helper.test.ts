import { expect, test } from 'vitest';
import { enumToArray, formatDate, getSlug, sortAlphabetical, sortDate, sortNumber } from './helper';

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

test('enumtoArray - convert enum to array', async () => {
	enum InputEnum {
		Title = 'TITLE',
		Published = 'PUBLISHED',
		Updated = 'UPDATED',
		Priority = 'PRIORITY'
	}
	const resultArray = [
		{
			display: 'Title',
			key: 'TITLE'
		},
		{
			display: 'Published',
			key: 'PUBLISHED'
		},
		{
			display: 'Updated',
			key: 'UPDATED'
		},
		{
			display: 'Priority',
			key: 'PRIORITY'
		}
	];
	expect(enumToArray(InputEnum)).toEqual(resultArray);
});
