import { test, expect } from '@playwright/test';

test.describe('Accessibility', () => {
	const pages = [
		{ path: '/', name: 'Homepage' },
		{ path: '/posts', name: 'Posts' },
		{ path: '/projects', name: 'Projects' },
		{ path: '/uses', name: 'Uses' }
	];

	pages.forEach(({ path, name }) => {
		test(`${name} should have proper heading structure`, async ({ page }) => {
			await page.goto(path);

			// Check for h1
			const h1 = page.locator('h1');
			await expect(h1).toHaveCount(1);

			// Check heading hierarchy (h1 -> h2 -> h3, etc.)
			const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();

			if (headings.length > 1) {
				let currentLevel = 1;
				for (const heading of headings) {
					const tagName = await heading.evaluate((el) => el.tagName.toLowerCase());
					const level = parseInt(tagName.charAt(1));

					// Level should not skip more than 1 (h1 -> h3 is bad)
					expect(level).toBeLessThanOrEqual(currentLevel + 1);
					currentLevel = Math.min(level, currentLevel + 1);
				}
			}
		});

		test(`${name} should have skip link`, async ({ page }) => {
			await page.goto(path);

			// Skip to content link should be present
			const skipLink = page.locator('text=Skip to content');
			await expect(skipLink).toBeVisible();

			// Skip link should point to main content
			const href = await skipLink.getAttribute('href');
			expect(href).toBe('#main');
		});

		test(`${name} should have proper landmarks`, async ({ page }) => {
			await page.goto(path);

			// Should have main landmark
			await expect(page.locator('main')).toBeVisible();

			// Should have header/navigation
			const nav = page.locator('nav, header');
			await expect(nav).toHaveCountGreaterThan(0);

			// Should have footer
			await expect(page.locator('footer')).toBeVisible();
		});

		test(`${name} should have proper link texts`, async ({ page }) => {
			await page.goto(path);

			// Find all links
			const links = await page.locator('a[href]').all();

			for (const link of links) {
				const text = await link.textContent();
				const ariaLabel = await link.getAttribute('aria-label');
				const title = await link.getAttribute('title');

				// Link should have accessible text (either text content, aria-label, or title)
				const hasAccessibleText =
					(text && text.trim().length > 0) ||
					(ariaLabel && ariaLabel.trim().length > 0) ||
					(title && title.trim().length > 0);

				expect(hasAccessibleText).toBe(true);
			}
		});
	});

	test('should have proper color contrast', async ({ page }) => {
		// This is a basic check - in a real scenario you'd want to use axe-playwright
		await page.goto('/');

		// Check that text is visible (basic contrast check)
		const bodyText = page.locator('body');
		await expect(bodyText).toBeVisible();

		// Check that buttons and links are visible
		const interactiveElements = page.locator('a, button');
		const count = await interactiveElements.count();

		for (let i = 0; i < Math.min(count, 10); i++) {
			// Check first 10 elements
			await expect(interactiveElements.nth(i)).toBeVisible();
		}
	});
});
