import { test, expect } from '@playwright/test';
import { RSS_FEEDS, slugsFor } from './helpers';

/**
 * Structural RSS validation. The feeds moved from a hand-rolled XML generator
 * to @astrojs/rss, so byte-parity with the old SvelteKit fixtures is gone by
 * design. Instead, assert what subscribers depend on: every content entry is
 * present exactly once with the right canonical link, and full-content feeds
 * carry <content:encoded>.
 */

const SECTION_FOR_FEED: Record<string, 'posts' | 'projects' | 'uses' | 'work'> = {
	'/posts/rss': 'posts',
	'/projects/rss': 'projects',
	'/uses/rss': 'uses',
	'/work/rss': 'work'
};

const FULL_CONTENT_FEEDS = new Set(['/posts/rss', '/projects/rss', '/work/rss']);
const MERGED_FEEDS = new Set(['/rss', '/feeds/rss']);

function countOccurrences(haystack: string, needle: string): number {
	return haystack.split(needle).length - 1;
}

for (const feed of RSS_FEEDS) {
	test(`rss structure: ${feed}`, async ({ request }) => {
		const res = await request.get(feed);
		expect(res.status(), `status for ${feed}`).toBe(200);
		// Content-Type for the extensionless feed files is set by Netlify via
		// public/_headers; `astro preview` doesn't apply it, so assert the body.
		const body = await res.text();
		expect(body.startsWith('<?xml')).toBe(true);
		expect(body).toContain('<rss');
		expect(body).toContain('<channel>');

		const itemCount = countOccurrences(body, '<item>');

		if (MERGED_FEEDS.has(feed)) {
			const total =
				slugsFor('posts').length +
				slugsFor('projects').length +
				slugsFor('uses').length +
				slugsFor('work').length;
			expect(itemCount, `merged feed item count`).toBe(total);
			// Every section is represented as a <category>.
			for (const category of ['Posts', 'Projects', 'Uses', 'Work']) {
				expect(body).toContain(`<category>${category}</category>`);
			}
			return;
		}

		const section = SECTION_FOR_FEED[feed];
		const slugs = slugsFor(section);
		expect(itemCount, `item count for ${feed}`).toBe(slugs.length);
		for (const slug of slugs) {
			const link = `https://harambasic.de/${section}/${slug}`;
			expect(body, `link for ${section}/${slug}`).toContain(`<link>${link}</link>`);
			expect(body, `guid for ${section}/${slug}`).toContain(
				`<guid isPermaLink="true">${link}</guid>`
			);
		}
		if (FULL_CONTENT_FEEDS.has(feed)) {
			expect(countOccurrences(body, '<content:encoded>'), `content:encoded in ${feed}`).toBe(
				slugs.length
			);
		}
	});
}
