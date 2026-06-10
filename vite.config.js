import { sveltekit } from '@sveltejs/kit/vite';
import { enhancedImages } from '@sveltejs/enhanced-img';
import { defineConfig } from 'vite';

// Add vitest again
export default defineConfig({
	plugins: [enhancedImages(), sveltekit()],
	// Unit tests live in src/ (*.test.ts). The e2e/ Playwright specs (*.spec.ts) are
	// run by Playwright, not Vitest — keep Vitest from scanning them.
	test: {
		include: ['src/**/*.{test,spec}.ts']
	}
});
