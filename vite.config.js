import { sveltekit } from '@sveltejs/kit/vite';
import { enhancedImages } from '@sveltejs/enhanced-img';
import { defineConfig } from 'vite';

// Add vitest again
export default defineConfig({
	plugins: [
		enhancedImages(),
		sveltekit()
	]
});