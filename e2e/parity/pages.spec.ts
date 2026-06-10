import { test, expect } from '@playwright/test';
import { htmlUrlInventory, urlKey } from './helpers';

/**
 * Parity snapshots of page STRUCTURE and METADATA — not full-page HTML.
 * Code-block markup (rehype-highlight -> Shiki) and image markup
 * (enhanced-img -> astro:assets) intentionally change across the migration,
 * so they are deliberately excluded from these snapshots.
 */

for (const url of htmlUrlInventory()) {
	test(`page parity: ${url}`, async ({ page }) => {
		const response = await page.goto(url);
		expect(response?.status(), `status for ${url}`).toBe(200);

		const meta = (name: string) =>
			page.locator(`head > meta[name="${name}"]`).first().getAttribute('content');

		const h1Loc = page.locator('main#main h1').first();
		const h1 = (await h1Loc.count()) ? ((await h1Loc.textContent())?.trim() ?? null) : null;

		const snapshot = {
			url,
			status: response?.status() ?? null,
			title: await page.title(),
			description: await meta('description'),
			ogImage: await meta('og:image'),
			h1,
			landmarks: {
				header: await page.locator('header').count(),
				nav: await page.locator('header nav').count(),
				main: await page.locator('main#main').count(),
				footer: await page.locator('footer').count(),
				skipLink: await page.locator('#skip-link[href="#main"]').count()
			},
			navHrefs: await page
				.locator('header nav ul li a')
				.evaluateAll((els) => els.map((el) => (el as HTMLAnchorElement).getAttribute('href'))),
			footerHrefs: await page
				.locator('footer ul li a')
				.evaluateAll((els) => els.map((el) => (el as HTMLAnchorElement).getAttribute('href')))
		};

		expect(JSON.stringify(snapshot, null, 2)).toMatchSnapshot(`${urlKey(url)}.json`);
	});
}
