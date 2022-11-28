import { defineConfig } from 'astro/config'

// https://astro.build/config
import image from '@astrojs/image'

// https://astro.build/config
import svelte from '@astrojs/svelte'

// https://astro.build/config
export default defineConfig({
	// Enable Vue to support Vue components.
	integrations: [image(), svelte()],
	markdown: {
		rehypePlugins: ['rehype-slug', ['rehype-autolink-headings', { behavior: 'append' }]],
		// Preserve Astro's default plugins: GitHub-flavored Markdown and Smartypants
		// default: false
		extendDefaultPlugins: true,
	},
})
