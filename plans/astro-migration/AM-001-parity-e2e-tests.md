# AM-001: Parity E2E Snapshot Tests

**Phase:** 0 - Parity Harness | **Size:** M | **Depends on:** -

## Goal

Establish a Playwright-based parity harness against the **current SvelteKit build** so every later migration step can be validated against a known, committed baseline. These snapshots and fixtures are the acceptance bar for AM-017 (final QA). This ticket touches only `e2e/` and `playwright.config.ts` - no production code.

## Scope / Tasks

1. Create `e2e/parity/pages.spec.ts` covering the full HTML URL inventory:
   - `/` (home)
   - `/posts` and all 10 post detail pages (derive slugs by globbing `src/content/posts/*.md` at test time - do not hardcode)
   - `/projects` and all 9 project detail pages
   - `/work` and all 5 work detail pages
   - `/uses`
   - `/feeds`
   - `/imprint`
   - `/data-privacy`
2. For each HTML page, assert/snapshot (store under `e2e/parity/__snapshots__/` or as JSON fixtures in `e2e/fixtures/pages/`):
   - HTTP status 200
   - `<title>` text (pattern: `{title} | Luka Harambasic`, bare `Luka Harambasic` on home)
   - `<meta name="description">` content
   - `<meta property="og:image">` content (social image URL pattern `{permalink}/social/{slug}.png`)
   - `<h1>` text content
   - Landmark structure: presence of `header`, `nav`, `main#main`, `footer`, skip link
   - Nav link hrefs and footer link hrefs (ordered list)
3. Create `e2e/parity/rss.spec.ts` for all 6 feed endpoints: `/rss`, `/feeds/rss`, `/posts/rss`, `/projects/rss`, `/work/rss`, `/uses/rss`:
   - Fetch raw response body
   - Strip the `<lastBuildDate>...</lastBuildDate>` element (changes every build)
   - Write/compare the remainder as fixture files `e2e/fixtures/rss/{name}.xml` (e.g. `merged.xml`, `posts.xml`, …)
   - Fixtures must capture: item ordering (section feeds published ASC, merged feed published DESC), `<guid>`, `<link>`, `<pubDate>`, `<category>` (merged only), `<content:encoded>` presence, `<atom:link href>` self URL
4. Use the existing `playwright.config.ts` webServer (`bun run build && bun run preview`, port 4173) - keep `baseURL` pointing at the local preview so the harness works for both SvelteKit (now) and Astro (later) builds without modification.
5. Important: snapshot **structure and metadata**, not full-page HTML. Code-block markup will intentionally change (rehype-highlight `.hljs` → Shiki) and image markup will change (`enhanced-img` `<picture>` → astro:assets output), so full-DOM snapshots would produce permanent noise. Do not snapshot `<pre>/<code>` internals or `<picture>/<img>` attributes beyond `alt` text presence.
6. Run the suite against the SvelteKit build and commit all generated fixtures.

## Acceptance Criteria

- [ ] `bun run test:ui` runs the parity suite green against the current SvelteKit build
- [ ] Fixtures for all 6 RSS feeds committed under `e2e/fixtures/rss/`, `<lastBuildDate>` stripped
- [ ] Page metadata fixtures committed for all ~30 HTML URLs
- [ ] Slugs are discovered from `src/content/`, not hardcoded
- [ ] CI quality gate still passes (suite is additive only)

## Notes / Parity traps

- The merged feed (`/rss`, `/feeds/rss`) sorts published **DESC**; the four section feeds sort published **ASC**. The fixtures will encode this - never "fix" it.
- `/feeds/rss` must be byte-identical to `/rss` except the self `atom:link` - verify what the current implementation actually emits for the self link on `/feeds/rss` and capture it as-is.
- The preview server serves prerendered files; extensionless `/rss` may come back without an XML content-type locally - assert on the body, not the header.
