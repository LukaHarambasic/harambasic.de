import { test, expect } from '@playwright/test';
import { htmlUrlInventory, RSS_FEEDS } from './helpers';

const SITE = 'https://harambasic.de';

test('sitemap lists every HTML page and no feed endpoints', async ({ request }) => {
	const index = await request.get('/sitemap-index.xml');
	expect(index.status()).toBe(200);
	expect(await index.text()).toContain('/sitemap-0.xml');

	const res = await request.get('/sitemap-0.xml');
	expect(res.status()).toBe(200);
	const body = await res.text();

	// Every HTML URL is present exactly once (home is the bare origin).
	for (const url of htmlUrlInventory()) {
		const loc = url === '/' ? SITE : `${SITE}${url}`;
		expect(body, `sitemap should contain ${loc}`).toContain(`<loc>${loc}</loc>`);
	}

	// No RSS endpoints leak into the sitemap.
	for (const feed of RSS_FEEDS) {
		expect(body, `sitemap should not contain ${feed}`).not.toContain(`${SITE}${feed}</loc>`);
	}
});
