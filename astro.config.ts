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
// Under dual themes we can't set a flat token color (the per-theme variant merge
// overwrites it), so we write the --shiki-light / --shiki-dark vars directly, each
// tuned for its background. code.css switches between them with light-dark().
const PLACEHOLDER = /\{\{[^}]+\}\}/g;
const URL = /https?:\/\/\S+/g;
type ThemedColor = { light: string; dark: string };
const HONEY: ThemedColor = { light: '#b06f12', dark: '#e0a24a' };
const LINK: ThemedColor = { light: '#3057c9', dark: '#8fc0f0' };
// Under dual themes a token carries its per-theme colors as an htmlStyle object
// ({ '--shiki-light': ..., '--shiki-dark': ... }); overriding that is what sticks
// (a flat `color` gets discarded by the variant merge). code.css reads those vars
// through light-dark().
const recolor = (color: ThemedColor) => ({
	htmlStyle: { '--shiki-light': color.light, '--shiki-dark': color.dark }
});
const highlightPromptTokens: ShikiTransformer = {
	name: 'prompt-tokens',
	tokens(lines) {
		if (this.options.lang !== 'markdown' && this.options.lang !== 'md') return;
		return lines.map((line) =>
			line.flatMap((token) => {
				const text = token.content;
				if (!text.includes('{{') && !text.includes('http')) return [token];
				// Collect [start, end, color) ranges to recolor, sorted by position.
				const ranges: { start: number; end: number; color: ThemedColor }[] = [];
				for (const m of text.matchAll(PLACEHOLDER)) {
					const start = m.index ?? 0;
					ranges.push({ start, end: start + m[0].length, color: HONEY });
				}
				for (const m of text.matchAll(URL)) {
					const start = m.index ?? 0;
					// Drop trailing sentence punctuation so it stays prose, not link.
					const trimmed = m[0].replace(/[.,;:!?)\]]+$/, '');
					ranges.push({ start, end: start + trimmed.length, color: LINK });
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
						offset: token.offset + start,
						...recolor(color)
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
		// Shiki dual themes: light + dark so code blocks follow the page theme.
		// defaultColor: false emits only --shiki-light / --shiki-dark CSS variables
		// (no baked-in color), which code.css switches with light-dark(). one-light
		// pairs with one-dark-pro so token roles map to the same hues per theme.
		// rehype-slug + rehype-autolink-headings (both with default options) reproduce
		// the old MarkdownProcessor's heading-anchor markup exactly:
		// <h2 id="x"><a aria-hidden tabindex="-1" href="#x"><span class="icon icon-link"/></a>…
		shikiConfig: {
			themes: { light: 'one-light', dark: 'one-dark-pro' },
			defaultColor: false,
			transformers: [highlightPromptTokens]
		},
		rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings]
	}
});
