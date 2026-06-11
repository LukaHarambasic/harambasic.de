# AM-010: List/Index Pages (Posts, Projects, Work, Uses)

**Phase:** 5 - Pages: List + Static | **Size:** M | **Depends on:** AM-009, AM-005, AM-006

## Goal

Build the four section index pages as fully static `.astro` pages with identical content, ordering, grouping, and CSS to the SvelteKit versions.

## Scope / Tasks

1. **`src/pages/posts/index.astro`** (port `(main)/posts/+page.svelte`):
   - Data: `getPosts()` sorted `published` DESC (`sortByProperty`)
   - Hero via layout slot: title "Writing about what I build and think", subtitle "Stuff I write", description from `+page.server.ts`
   - Render: bordered list rows - `<a>` per post with `<h2>` title + `<time>` published date + arrow icon, first/last border-radius, `aria-label="View post: {title}"`. CSS verbatim, golden-ratio width constraint as today.
2. **`src/pages/projects/index.astro`** (port `(main)/projects/+page.svelte`):
   - Data: `getProjects()` sorted `prio` DESC via `filterAndSort(..., 'all', 'priority', 'DESC', 'all')`
   - 6-column grid: first 3 entries highlighted (`grid-column: span 2`, top image), rest compact (`span 3`, side image). Cards are `<a>` → `/projects/{slug}`
   - Images via `getProjectImage` + `<Picture widths={[400,640,1280]}>`; `imageAlt` for alt text
   - Hero: "Things I've built and shipped" / "Stuff I do"
3. **`src/pages/work/index.astro`** (port `(main)/work/+page.svelte`):
   - Data: `getWork()` + `getProjects()`; build the `workRelatedProjects` map (work slug → related project titles) exactly as `+page.server.ts` does
   - Current employer (`positions[0].endDate === null` logic as today) as featured dark card at 61.8% width; past employers in 2-col grid. Each card: logo (`getWorkImage` / SVG `<img>`), title, location, positions with date ranges (`formatDateDisplay`, "Present" for null endDate), description, related project names. `aria-label="View details for {title}"`
   - Hero: "Building products..." title from current `+page.server.ts`
4. **`src/pages/uses/index.astro`** (port `(main)/uses/+page.svelte`):
   - Data: `getUses()`; active entries grouped by tag in fixed order `Essentials, Hardware, Software, Development` (then any remaining tags alphabetically - replicate the exact grouping code), 2-col grid per group, `BaseHeadlineIcon` group headings
   - Each item: `<a href={entry.url}>` (external product URL), logo (raster via `<Image>`, SVG via plain `<img src="/uses/...">`), title, description, `openSource` indicator if present today
   - Archive `<section>`: inactive entries, 3-col compact grid
   - Hero: "Tools and gear I actually use" / "Stuff I use"
5. All four pages pass `title`/`description` to `Layout.astro` (head meta) and supply the `hero` slot; **no** `isDetailPage`.
6. CSS ported verbatim per page with media queries colocated per CLAUDE.md.

## Acceptance Criteria

- [ ] `/posts`, `/projects`, `/work`, `/uses` build statically and match AM-001 metadata fixtures (title, description, h1)
- [ ] Ordering parity: posts newest-first; projects by prio; uses grouped in the fixed tag order; work current-vs-past split correct
- [ ] All 66 uses entries render; archive section shows only `status: inactive`
- [ ] Responsive breakpoints behave as before (spot-check 32rem/62rem/86rem widths)
- [ ] Icons inline SVG; images emit avif/webp srcsets

## Notes / Parity traps

- The `EntriesFilter` status `<select>`: confirm where it is actually rendered today before porting - current code defaults everything to `'all'` and the list pages hardcode `'all'`. If it's effectively dead UI, note it in AM-015 and replicate only what production shows.
- Uses entries link **externally** (`entry.url`) - no detail pages for uses; don't invent any.
- The dark "current employer" card colors come from `--c-current-work-bg/text` tokens - already ported in AM-007.
