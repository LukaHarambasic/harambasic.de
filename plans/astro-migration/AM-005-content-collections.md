# AM-005: Content Collections + Data Utilities

**Phase:** 2 — Content Layer | **Size:** L | **Depends on:** AM-003, AM-002

## Goal

Replace the custom content architecture (`FileSystemContentService`, `MarkdownProcessor`, `RemarkRehypeProcessor`, `entryConfigs.ts`, `entryTransformer.ts`, `api.server.ts`) with Astro content collections + a thin layer of the existing **pure** utility functions. This is the heart of the migration: after this ticket, `getCollection('posts'|'projects'|'uses'|'work')` plus `src/lib/` utils provide everything pages and feeds need.

## Scope / Tasks

### Collections

1. Create `src/content.config.ts` using `defineCollection` + the `glob` loader (`loader: glob({ pattern: '**/*.md', base: './src/content/posts' })` etc.) for: `posts`, `projects`, `uses`, `work`, and dormant `snippets`, `shareables`.
2. Port the Zod frontmatter schemas from `src/lib/schemas/content.ts` per type. Schema = **frontmatter only** (no `html`, no `toc` — those come from `render()`):
   - `posts`: title, description, image (string — `'TODO'` allowed), published/updated (coerce to Date), tags (string[]), tldr, discussion
   - `projects`: title, description, image, imageAlt, published, updated, prio (number), status (`'active'|'inactive'`), links ({title,url}[]), tags, relatedWork (string[], optional)
   - `uses`: title, description, tags, url, status, image, openSource (boolean), published, updated
   - `work`: title, description, image, published, updated, location, employmentType enum, positions ({title, startDate, endDate (nullable), content}[]), relatedProjects, tags
3. Keep validation strictness equivalent to today's `validateRawEntry` (required fields, date validity). `scripts/validate-content.js` remains as the pre-commit content gate (unchanged, see AM-016).

### Entry view-model layer

4. Create `src/lib/entries.ts` exposing typed accessor functions that wrap `getCollection()` and apply the existing transformation logic (port from `entryTransformer.ts` / `entries.ts` / `api.server.ts`):
   - `getPosts()`, `getProjects()`, `getUses()`, `getWork()` → each returns entries enriched with: `slug` (**`getSlug(data.title)` — title-derived, never the file id**; AM-002 guarantees they match, but title stays the source of truth), `relativePath` (`/posts/{slug}` etc.), `published`/`updated` as `EntryDate` (`{ raw: Date, display: string }` via `getDate`), `tags` as `Tag[]` via `getTag`
   - `getUniqueTags(entries)` ported verbatim (dedupe + counts + synthetic "All" + alphabetical sort)
5. Port pure utilities **verbatim** into `src/lib/` (drop only Svelte/SvelteKit imports; keep tests):
   - `util/helper.ts` → `lib/helper.ts`: `getSlug`, `formatDate`, `formatDateDisplay`, `sortPositionsByDate`, `sortAlphabetical/Date/Number`, `isExternalUrl`, `setParam` (browser-only, used by AM-015 script), validators
   - `util/entries.ts` → merged into `lib/entries.ts`: `getTag`, `getDate`, `filterByTag`, `getUniqueTags`, `findBySlug`, `getTagBySlug`
   - `util/entryHelpers.ts` → `lib/entryHelpers.ts`: `filterByStatus`, `sortByProperty`, `filterAndSort`
   - `util/mergedFeed.ts` → `lib/mergedFeed.ts`: `getMergedFeedEntries`, `getLayoutOrderedEntries`, `getInitialVisibleCount`, `getTargetVisibleCount`, `toMergedEntry`
   - `util/workEntry.ts` → `lib/workEntry.ts`: `workEntryToFullHtml`
   - `src/lib/types/` → keep type aliases (`Entry`, `Tag`, `TocNode`, `Link`, `EntryDate`, sort/status unions); delete `RawEntry` and anything tied to the retired processors

### Markdown specifics

6. `src/lib/markdown.ts`: `renderPositionContent(markdown: string): Promise<string>` — direct port of `processPositionContent` from `entryConfigs.ts` (`remark().use(remarkRehype).use(rehypeStringify)`). Work entry `positions[].content` is markdown inside YAML; render it where work entries are consumed (work detail page, work RSS) — collections store the raw string.
7. `src/lib/toc.ts`: `buildNestedToc(headings: MarkdownHeading[]): TocNode[]` — port the nested-tree stack algorithm from the custom TOC remark plugin, but source data from Astro's native `render()` result (`headings: { depth, slug, text }[]`; map `text` → `value`). Respect the same depth bounds as today's `TocConfig` defaults. The custom remark TOC plugin, `github-slugger` usage for TOC, and `remark-frontmatter`/`remark-parse-frontmatter` are retired.
8. `astro.config.ts` markdown pipeline:
   ```ts
   markdown: {
   	shikiConfig: { theme: 'one-dark-pro' },
   	rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { /* same options as MarkdownProcessor.ts */ }]]
   }
   ```
   (Astro applies `rehype-slug`-compatible heading ids itself, but keep plugin config equivalent to current anchor-link markup — compare rendered heading HTML against the old output and match the autolink behavior/options exactly.)
9. **Retire**: `src/lib/processors/` (MarkdownProcessor, RemarkRehypeProcessor, TocPlugin, ImagePlugin, HtmlSanitizer), `src/lib/services/` (ContentService, FileSystemContentService), `src/lib/data/` (api.server.ts, entryConfigs.ts), `src/lib/util/rss.server.ts` moves in AM-014. Delete their test files; port/keep tests for everything that survives.

### Tests

10. Re-enable the surviving vitest suites: `helper.test.ts`, `entries.test.ts`, `entryHelpers.test.ts`, `mergedFeed.test.ts`, `workEntry.test.ts`, schema tests (adapted to collection schemas), plus a new `toc.test.ts` for `buildNestedToc` (reuse the cases from `TocPlugin.test.ts`).

## Acceptance Criteria

- [ ] `bun run build` loads all collections: 10 posts, 9 projects, 66 uses, 5 work
- [ ] A scratch page can render slug, relativePath, `published.display` (e.g. `Jun 2023`), and Tag objects for every type
- [ ] Work positions render to HTML via `renderPositionContent` (verify one entry end-to-end)
- [ ] `buildNestedToc` output matches the old TOC structure for the longest post (compare against old `toc` JSON)
- [ ] `bun run test` green with the ported suites
- [ ] No imports remain from `src/lib/processors`, `src/lib/services`, `src/lib/data`

## Notes / Parity traps

- **Slug source of truth is the title**, enforced in `getPosts()` etc. — even though AM-002 made filenames match, compute from title so a future title/filename drift doesn't silently change behavior differently than today.
- `image: 'TODO'` appears in real post frontmatter — the schema must allow it (today `getImageFromGlob` returns null for `'TODO'`).
- Date display: `formatDateDisplay` uses `toLocaleDateString('en-US', { year: 'numeric', month: 'short' })` — keep exactly (RSS `pubDate` formatting lives in the RSS util, untouched).
- Heading anchor markup must match the old `rehype-autolink-headings` config or post styles/`:target` behavior change — diff one rendered post against production HTML.
- Dormant collections: `getCollection('shareables')` on an empty dir is fine with the glob loader; define them so `scripts/fetch-shareable` output is immediately valid.
