import { getSlug } from '../../util/helper';
import { expect, test } from 'vitest';

test('getSlug - generate slugs', () => {
	const data = [
		{
			title: 'Nuxt.js',
			slug: 'nuxtjs',
		},
		{
			title: 'Lorem Ipsum',
			slug: 'lorem-ipsum',
		},
		{
			title: '1234567',
			slug: '1234567',
		},
		{
			title: 'How to be 10 times more productive!',
			slug: 'how-to-be-10-times-more-productive',
		},
		{
			title: '3 3 6 $ 4 1 ?= !',
			slug: '3-3-6-4-1-',
		},
		{
			title: '#important post with hashtags! ',
			slug: 'important-post-with-hashtags',
		},
		{
			title: ' starts and ends with space ',
			slug: 'starts-and-ends-with-space',
		},
	];
	data.forEach((item) => {
		expect(getSlug(item.title)).toBe(item.slug);
	});
});

// test('getRandomItems - just for the coverage', () => {
// 	getRandomItems([], 0);
// 	expect(true).toBe(true);
// });

// test('formatDate - markdown date to formatted date', () => {
// 	expect(formatDate(new Date('1996-02-18'))).toBe('02/18/1996');
// });
