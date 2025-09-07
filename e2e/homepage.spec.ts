import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
	test('should load homepage successfully', async ({ page }) => {
		await page.goto('/');

		// Check that the page loads without error
		await expect(page).toHaveTitle(/Harambasic/i);

		// Check for main navigation elements
		await expect(page.locator('nav')).toBeVisible();
		await expect(page.locator('main')).toBeVisible();
		await expect(page.locator('footer')).toBeVisible();
	});

	test('should have working navigation links', async ({ page }) => {
		await page.goto('/');

		// Test navigation to posts
		await page.getByRole('link', { name: /posts/i }).first().click();
		await expect(page).toHaveURL('/posts');
		await expect(page.locator('h1')).toContainText(/posts/i);

		// Navigate back to home
		await page.goto('/');

		// Test navigation to projects
		await page
			.getByRole('link', { name: /projects/i })
			.first()
			.click();
		await expect(page).toHaveURL('/projects');
		await expect(page.locator('h1')).toContainText(/projects/i);
	});

	test('should be accessible', async ({ page }) => {
		await page.goto('/');

		// Check for skip to content link (may be hidden by default)
		const skipLink = page.locator('a[href="#main"]');

		// If skip link exists, test it works
		if ((await skipLink.count()) > 0) {
			// Focus skip link to make it visible
			await skipLink.focus();
			await skipLink.click();
			await expect(page.locator('#main')).toBeFocused();
		} else {
			// Just check that main content area exists
			await expect(page.locator('#main')).toBeVisible();
		}
	});

	test('should be responsive', async ({ page }) => {
		// Test mobile viewport
		await page.setViewportSize({ width: 375, height: 667 });
		await page.goto('/');

		await expect(page.locator('main')).toBeVisible();
		await expect(page.locator('nav')).toBeVisible();

		// Test desktop viewport
		await page.setViewportSize({ width: 1280, height: 720 });
		await expect(page.locator('main')).toBeVisible();
		await expect(page.locator('nav')).toBeVisible();
	});
});
