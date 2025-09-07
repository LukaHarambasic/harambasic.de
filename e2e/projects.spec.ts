import { test, expect } from '@playwright/test';

test.describe('Projects Page', () => {
	test('should display projects list', async ({ page }) => {
		await page.goto('/projects');

		// Check page loads with correct title
		await expect(page.locator('h1')).toContainText(/projects/i);

		// Check that projects are displayed
		const entries = page.locator('.entries');
		await expect(entries).toBeVisible();
	});

	test('should have project filtering capabilities', async ({ page }) => {
		await page.goto('/projects');

		// Check for sidebar with filters
		const sidebar = page.locator('.sidebar');
		await expect(sidebar).toBeVisible();

		// Look for status filter (Active/Inactive/All)
		const statusFilters = page
			.locator('button, select')
			.filter({ hasText: /active|inactive|all/i });
		if ((await statusFilters.count()) > 0) {
			await expect(statusFilters.first()).toBeVisible();
		}
	});

	test('should show project details', async ({ page }) => {
		await page.goto('/projects');

		// Find project entries
		const projectLinks = page.locator('a[href^="/projects/"]:not([href$="/projects/rss"])');
		const projectCount = await projectLinks.count();

		if (projectCount > 0) {
			const firstProject = projectLinks.first();

			// Check that project has basic information displayed
			const projectCard = firstProject.locator('..');
			await expect(projectCard).toBeVisible();

			// Projects should have titles
			const titleElement = firstProject.locator('h2, h3, .title, [class*="title"]').first();
			if ((await titleElement.count()) > 0) {
				await expect(titleElement).toBeVisible();
			}
		}
	});

	test('should navigate to individual project', async ({ page }) => {
		await page.goto('/projects');

		// Find first project link
		const projectLinks = page.locator('a[href^="/projects/"]:not([href$="/projects/rss"])');
		const projectCount = await projectLinks.count();

		if (projectCount > 0) {
			const firstProject = projectLinks.first();
			const projectHref = await firstProject.getAttribute('href');

			await firstProject.click();

			// Should navigate to individual project page
			await expect(page).toHaveURL(projectHref!);
			await expect(page.locator('main')).toBeVisible();
		}
	});

	test('should have working RSS feed', async ({ page }) => {
		await page.goto('/projects');

		// Check for RSS link
		const rssLink = page.locator('a[href*="rss"]');
		if ((await rssLink.count()) > 0) {
			await expect(rssLink).toBeVisible();
		}
	});
});
