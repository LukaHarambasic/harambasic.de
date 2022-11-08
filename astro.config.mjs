import { defineConfig } from 'astro/config';
import astroRemark from '@astrojs/markdown-remark';

// https://astro.build/config
import image from '@astrojs/image';

// https://astro.build/config
export default defineConfig({
	// Enable Vue to support Vue components.
	integrations: [, image()],
	markdown: {
		rehypePlugins: [
			'rehype-slug',
			['rehype-autolink-headings', { behavior: 'append' }],
			['rehype-toc', { headings: ['h1', 'h2'] }],
		],
		// Preserve Astro's default plugins: GitHub-flavored Markdown and Smartypants
		// default: false
		extendDefaultPlugins: true,
	},
});
