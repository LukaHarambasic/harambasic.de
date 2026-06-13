import { defineConfig } from 'astro/config';
import icon from 'astro-icon';
import sitemap from '@astrojs/sitemap';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

// https://astro.build/config
export default defineConfig({
	site: 'https://harambasic.de',
	output: 'static', // pure static output - no adapter needed; Netlify serves dist/
	trailingSlash: 'never',
	// Exclude the extensionless RSS endpoints from the sitemap (HTML pages only).
	// Also exclude /uses (and its detail pages): the section is hidden for now, so it
	// still builds and is reachable by direct URL, just not advertised in the sitemap.
	integrations: [
		icon(),
		sitemap({ filter: (page) => !page.endsWith('/rss') && !/\/uses(\/|$)/.test(page) })
	],
	// Allow access via Tailscale Serve (tailnet-only reverse proxy, see /dev CLAUDE.md).
	vite: { server: { allowedHosts: ['.hornbill-atlas.ts.net'] } },
	markdown: {
		// Shiki one-dark-pro replaces rehype-highlight + highlight.css (always dark).
		// rehype-slug + rehype-autolink-headings (both with default options) reproduce
		// the old MarkdownProcessor's heading-anchor markup exactly:
		// <h2 id="x"><a aria-hidden tabindex="-1" href="#x"><span class="icon icon-link"/></a>…
		shikiConfig: { theme: 'one-dark-pro' },
		rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings]
	}
});
