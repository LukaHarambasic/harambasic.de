import { defineConfig } from 'astro/config';
import icon from 'astro-icon';
import sitemap from '@astrojs/sitemap';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import type { ShikiTransformer } from 'shiki';

// Shiki's markdown grammar leaves prose flat: {{placeholders}} and bare URLs stay
// plain tokens, so prompt blocks read colorless. Split those runs out of their
// tokens and recolor them (honey placeholders read as fill-in-the-blanks; bare URLs
// read as links) without touching the copyable prompt text. Markdown blocks only.
const PLACEHOLDER = /\{\{[^}]+\}\}/g;
const URL = /https?:\/\/\S+/g;
const highlightPromptTokens: ShikiTransformer = {
	name: 'prompt-tokens',
	tokens(lines) {
		if (this.options.lang !== 'markdown' && this.options.lang !== 'md') return;
		return lines.map((line) =>
			line.flatMap((token) => {
				const text = token.content;
				if (!text.includes('{{') && !text.includes('http')) return [token];
				// Collect [start, end, color) ranges to recolor, sorted by position.
				const ranges: { start: number; end: number; color: string }[] = [];
				for (const m of text.matchAll(PLACEHOLDER)) {
					const start = m.index ?? 0;
					ranges.push({ start, end: start + m[0].length, color: '#e0a24a' });
				}
				for (const m of text.matchAll(URL)) {
					const start = m.index ?? 0;
					// Drop trailing sentence punctuation so it stays prose, not link.
					const trimmed = m[0].replace(/[.,;:!?)\]]+$/, '');
					ranges.push({ start, end: start + trimmed.length, color: '#8fc0f0' });
				}
				if (ranges.length === 0) return [token];
				ranges.sort((a, b) => a.start - b.start);
				const parts = [];
				let last = 0;
				for (const { start, end, color } of ranges) {
					if (start < last) continue; // skip any overlap
					if (start > last) {
						parts.push({ ...token, content: text.slice(last, start), offset: token.offset + last });
					}
					parts.push({
						...token,
						content: text.slice(start, end),
						color,
						offset: token.offset + start
					});
					last = end;
				}
				if (last < text.length) {
					parts.push({ ...token, content: text.slice(last), offset: token.offset + last });
				}
				return parts;
			})
		);
	}
};

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
		shikiConfig: { theme: 'one-dark-pro', transformers: [highlightPromptTokens] },
		rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings]
	}
});
