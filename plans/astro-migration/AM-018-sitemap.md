# AM-018: Sitemap

**Phase:** 11 - Post-Parity Enhancements | **Size:** S | **Depends on:** AM-017

## Goal

Add an auto-generated sitemap - the site currently has none. Pure SEO win, done only after parity is locked in so it never muddies the 1:1 comparison.

## Scope / Tasks

1. `bunx astro add sitemap` (adds `@astrojs/sitemap` to `integrations` in `astro.config.ts`; `site: 'https://harambasic.de'` already set in AM-003).
2. Configure `filter` to exclude non-page outputs if any get picked up (feed endpoints are not pages, so default behavior should be correct - verify `dist/sitemap-index.xml` contents).
3. Append to `public/robots.txt`:
   ```
   Sitemap: https://harambasic.de/sitemap-index.xml
   ```
4. Extend the AM-001 parity suite with a smoke test: sitemap exists, contains `/`, all post/project/work detail URLs, and none of the `/…/rss` endpoints.

## Acceptance Criteria

- [ ] `dist/sitemap-index.xml` + chunk generated on build, listing every HTML page exactly once
- [ ] robots.txt references the sitemap
- [ ] No feed/asset URLs in the sitemap
- [ ] Deployed and fetchable on production
