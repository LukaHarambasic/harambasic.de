# AM-012: Post Detail Pages

**Phase:** 6 - Pages: Detail | **Size:** M | **Depends on:** AM-009, AM-005

## Goal

Build `/posts/[slug]` with table of contents, TL;DR callout, microformats, and Shiki-highlighted markdown body - visually and structurally matching the SvelteKit `Entry.svelte` + `TableOfContent.svelte`.

## Scope / Tasks

1. **`src/pages/posts/[slug].astro`**:
   - `getStaticPaths()`: map `getPosts()` to `{ params: { slug }, props: { post } }` - slug from the title-derived entry slug (AM-005)
   - `const { Content, headings } = await render(post)` (astro:content render API)
   - `const toc = buildNestedToc(headings)` from `$lib/toc`
   - Layout props: `title`, `description`, `isDetailPage: true`
2. **Article structure** (port `posts/[slug]/Entry.svelte` verbatim):
   - `<article class="h-entry">`
   - `EntryHeader` with title; meta line: author (`p-author h-card` with `rel="author"` link to permalink), published `<time class="dt-published" datetime>`, separators `aria-hidden="true"`
   - TL;DR `BaseCallout` when `post.data.tldr` is set (and not `'TBD'` if that's today's behavior - verify)
   - Collapsible TOC: native `<details>`/`<summary>` wrapping `TableOfContent` component; caret-rotate CSS via `details[open]` - zero JS (port `TableOfContent.svelte` CSS)
   - Body: `<Content />` inside `BaseRichText` with class `e-content`
   - Footer link to `/posts/rss` (the "subscribe" line with `ph:file-text-duotone` icon as today)
3. **Discussion link**: render `post.data.discussion` link if present and not `'TBD'` - mirror current `Entry.svelte` logic exactly.
4. Verify heading anchors: `rehype-slug` + `rehype-autolink-headings` output (AM-005 config) must make TOC `#fragment` links land on headings with `scroll-margin` (base.css) and smooth scroll.
5. Visual check of Shiki `one-dark-pro` code blocks against production One Dark on the most code-heavy post; tweak `code.css` container rules (AM-007) if spacing differs.

## Acceptance Criteria

- [ ] All 10 post URLs build; AM-001 metadata fixtures pass for each
- [ ] TOC tree matches the old nested structure on the longest post; `<details>` opens/closes without JS; anchor links scroll to the right headings
- [ ] Microformat classes present: `h-entry`, `p-author`, `h-card`, `dt-published`, `e-content`
- [ ] Inline post images load from `/posts/{slug}/...` with `loading="lazy"` (Astro markdown defaults) - GIFs render
- [ ] Code blocks: readable, dark, horizontally scrollable on overflow
- [ ] `bun run check` passes

## Notes / Parity traps

- The old pipeline added `loading="lazy" decoding="async"` to markdown images via a custom rehype plugin. Astro adds lazy-loading to optimized images automatically but **not** to plain `public/`-path `<img>` in markdown - if missing, re-add a 5-line rehype plugin in `astro.config.ts` setting those attributes (keep it inline-simple, no abstraction).
- Social image for each post: `${permalink}/social/{slug}.png` - already handled by the layout (AM-008); slug matches because page title === frontmatter title.
