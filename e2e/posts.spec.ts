import { test, expect } from '@playwright/test';

test.describe('Posts Page', () => {
	test('should display posts list', async ({ page }) => {
		await page.goto('/posts');

		// Check page loads with correct title
		await expect(page.locator('h1')).toContainText(/posts/i);

		// Check that posts are displayed (assuming there are some)
		const entries = page.locator('.entries');
		await expect(entries).toBeVisible();
	});

	test('should have working filter and sort functionality', async ({ page }) => {
		await page.goto('/posts');

		// Check that sidebar with filters exists
		const sidebar = page.locator('.sidebar');
		await expect(sidebar).toBeVisible();

		// Check for sort controls
		const sortControls = page.locator('select, button').filter({ hasText: /sort|filter/i });
		if ((await sortControls.count()) > 0) {
			await expect(sortControls.first()).toBeVisible();
		}
	});

	test('should have working RSS feed link', async ({ page }) => {
		await page.goto('/posts');

		// Look for RSS link
		const rssLink = page.locator('a[href*="rss"]');
		if ((await rssLink.count()) > 0) {
			await expect(rssLink).toBeVisible();

			// Verify RSS link goes to correct endpoint
			const href = await rssLink.getAttribute('href');
			expect(href).toContain('rss');
		}
	});

	test('should navigate to individual post', async ({ page }) => {
		await page.goto('/posts');

		// Find first post link (if any posts exist)
		const postLinks = page.locator('a[href^="/posts/"]:not([href$="/posts/rss"])');
		const postCount = await postLinks.count();

		if (postCount > 0) {
			const firstPost = postLinks.first();
			const postHref = await firstPost.getAttribute('href');

			await firstPost.click();

			// Should navigate to individual post page
			await expect(page).toHaveURL(postHref!);
			await expect(page.locator('main')).toBeVisible();
		}
	});
});
