# AM-013: Project + Work Detail Pages

**Phase:** 6 — Pages: Detail | **Size:** M | **Depends on:** AM-009, AM-005, AM-006

## Goal

Build `/projects/[slug]` and `/work/[slug]` with cross-references (relatedWork / relatedProjects), golden-ratio layouts, and per-position rendered markdown — matching the SvelteKit `Entry.svelte` components.

## Scope / Tasks

### `src/pages/projects/[slug].astro`

1. `getStaticPaths()` from `getProjects()`.
2. Resolve related work: `getWork()` filtered by `project.data.relatedWork` slugs (same as today's `+page.server.ts`).
3. `render(project)` for the markdown body.
4. Structure (port `projects/[slug]/Entry.svelte`):
   - `EntryHeader` with title + meta (status, dates as today)
   - Golden split: image column (0.382fr) with `<Picture>` via `getProjectImage` (`imageAlt` alt), content column (0.618fr) with `<Content />` in `BaseRichText`
   - `<nav aria-label="Project links">` rendering `links[]` with external-link icon (`ph:arrow-square-out-bold`)
   - "Related Work" cards section when `relatedWork` resolves (BaseCard row variant as today)
5. Layout: `title`, `description`, `isDetailPage: true`.

### `src/pages/work/[slug].astro`

6. `getStaticPaths()` from `getWork()`.
7. Resolve related projects via `entry.data.relatedProjects`.
8. Render company description: `render(workEntry)` markdown body.
9. Positions: sort with `sortPositionsByDate` (startDate DESC); render each position's `content` through `renderPositionContent()` from `$lib/markdown` (markdown-in-YAML); position card shows title, date range (`formatDateDisplay`, null endDate → "Present"), employment type. First position styled without divider, the rest with dividers — as today.
10. Structure (port `work/[slug]/Entry.svelte`): `EntryHeader` inline mode with company logo leading (raster via `getWorkImage` + `<Image>`, SVG plain `<img>`), location in meta; description; related-project cards; positions list.
11. Layout: `title`, `description`, `isDetailPage: true`.

## Acceptance Criteria

- [ ] All 9 project and 5 work URLs build; AM-001 metadata fixtures pass
- [ ] Related work ↔ project cross-links navigate correctly in both directions (spot-check one pair)
- [ ] Position HTML renders (links, emphasis, lists inside position content) identically to production
- [ ] Project links nav has `aria-label` and external icons; SVG vs raster logo paths both work
- [ ] `bun run check` passes

## Notes / Parity traps

- `renderPositionContent` is async — render positions in the page frontmatter with `await Promise.all(...)`, not in markup.
- The dark current-employer styling is **only** on the `/work` index card, never on detail pages.
- Date display "Present" / month-year formats must match the AM-001 page fixtures exactly (RSS dates are separate, AM-014).
