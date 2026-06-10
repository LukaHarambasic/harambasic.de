import { defineConfig } from '@playwright/test';

export default defineConfig({
	webServer: {
		command: 'bun run build && bun run preview',
		port: 4173,
		timeout: 240000,
		reuseExistingServer: !process.env.CI,
		// og:image URLs are build-time-resolved from these; provide stable values so
		// the parity harness works for both the SvelteKit and Astro builds.
		env: {
			DEPLOY_PRIME_URL: 'https://harambasic.de',
			URL: 'https://harambasic.de'
		}
	},

	testDir: 'e2e'
});
