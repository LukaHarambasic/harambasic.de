# AM-017: Full Parity QA + Production Cutover

**Phase:** 10 — QA + Cutover | **Size:** M | **Depends on:** AM-001 … AM-016 (all)

## Goal

Prove the Astro build is a drop-in replacement using the AM-001 harness plus manual checks, then merge `feat/astro-migration` → `main` and verify the production deploy.

## Scope / Tasks

1. **Automated parity**: run the AM-001 Playwright suite against the Astro build (`bun run build && bun run preview` — same baseURL config, no suite changes needed):
   - All ~30 HTML URLs: status, title, description, og:image, h1, landmarks, nav/footer links
   - All 6 RSS fixtures match (lastBuildDate stripped)
   - Fix discrepancies until green; any *intentional* diff (Shiki markup, image `<picture>` output) must already be outside the snapshot scope — if a fixture needs changing, justify it in the commit message
2. **Manual checks** (laptop + mobile width, light + dark scheme):
   - `#contact` dialog open/close from footer on several pages
   - Home feed show more/less incl. orphan avoidance at the boundaries
   - Post TOC `<details>` + anchor scrolling; code-block visuals vs production (Shiki one-dark-pro)
   - Fonts load (no FOUT beyond `swap`), favicon, GoatCounter request fires
   - 404 behavior for an unknown URL on the Netlify preview
   - Keyboard pass: Tab order, skip link, dialog focus trap (native), all interactive elements reachable
3. **Performance/a11y gate**: Lighthouse on `/`, one post, `/projects` — scores ≥ current production (capture production numbers first). HTML weight and JS payload should *drop* (no framework runtime); flag any regression.
4. **Cleanup sweep**: no leftover Svelte files, no `$app/`/`@sveltejs` imports, no dead deps in package.json, `bun run validate` green.
5. **Cutover**: PR `feat/astro-migration` → `main` with a summary of intentional diffs; merge; watch the Netlify production deploy; smoke-test all six feed URLs and a handful of pages on harambasic.de; confirm feed readers still accept `/rss` (fetch with curl, check `_headers` content-type applied).
6. Keep the parity suite as a permanent regression suite (`bun run test:ui`).

## Acceptance Criteria

- [ ] Parity suite 100% green against the Astro build
- [ ] RSS fixtures byte-identical (modulo lastBuildDate / documented code-block normalization)
- [ ] Lighthouse perf/a11y/SEO/best-practices ≥ production baseline on the three sampled pages
- [ ] Production deploy live, all URLs and feeds verified on harambasic.de
- [ ] `bun run validate` green on `main` post-merge

## Notes / Parity traps

- Compare a production HTML page and the Astro one side-by-side in a diff tool once — cheap way to catch forgotten meta tags or attribute drift the snapshots don't cover.
- After merge, the old `build/` publish dir setting must not linger anywhere (Netlify UI overrides can shadow netlify.toml — check the site settings).
