# AM-014: RSS Endpoints + Netlify Headers

**Phase:** 7 — Feeds + SEO | **Size:** M | **Depends on:** AM-005

## Goal

Recreate all six feed endpoints as Astro static endpoints with **identical XML output** to the AM-001 fixtures. The custom generators are ported verbatim — deliberately NOT `@astrojs/rss`, because exact structure (attribute order, whitespace, sort quirks, `content:encoded`, `category`) is the hard requirement and is already encoded in tested pure functions.

## Scope / Tasks

1. Move `src/lib/util/rss.server.ts` → `src/lib/rss.ts` **verbatim** (the `.server` suffix has no meaning in Astro; everything here is build-time). Exports: `generateXml(entries, entryType, htmlOverride?)`, `generateMergedXml(entries)`, the shared response headers constant. Move `rss.server.test.ts` alongside as `rss.test.ts`.
2. Create static endpoints (extensionless routes — `src/pages/rss.ts` builds to `dist/rss` exactly like SvelteKit's prerendered `+server.ts` did):
   - **`src/pages/rss.ts`** — merged feed: all posts + projects + uses + work, sorted `published.raw` **DESC**, `generateMergedXml`. Channel `Luka Harambasic | All`, per-item `<category>` (Posts/Projects/Uses/Work), `content:encoded` for entries carrying html (work via `workEntryToFullHtml`).
   - **`src/pages/feeds/rss.ts`** — same output as `/rss` (port whatever self-link the current `/feeds/rss` emits — match the AM-001 fixture, not an assumption).
   - **`src/pages/posts/rss.ts`** — posts sorted `published` **ASC** via `sortByProperty`, `generateXml(entries, 'post')`. Channel `Luka Harambasic | Posts`, self link `https://harambasic.de/posts/rss`.
   - **`src/pages/projects/rss.ts`** — projects ASC, `generateXml(entries, 'project')`.
   - **`src/pages/uses/rss.ts`** — uses ASC, `generateXml(entries, 'uses')` (folder-name special case `uses` not `usess` lives inside generateXml — untouched).
   - **`src/pages/work/rss.ts`** — work ASC, with `workEntryToFullHtml(entry)` (which must call `renderPositionContent` for positions — wire the async rendering before XML generation) for `<content:encoded>`.
   - Each endpoint:
     ```ts
     import type { APIRoute } from 'astro';
     export const GET: APIRoute = async () => new Response(xml, {
     	headers: { 'Content-Type': 'application/xml; charset=UTF-8', 'Cache-Control': 'max-age=0, s-max-age=600' }
     });
     ```
3. **Entry html for `content:encoded`**: posts/projects need their rendered HTML in feeds. In Astro, get it via the container API (`experimental_AstroContainer` rendering `<Content />`) or — simpler and DRY-acceptable — a small build-time markdown render of `entry.body` using the same remark/rehype config. Pick the simplest approach that reproduces the fixture; document the choice in the endpoint file only if non-obvious.
4. **`public/_headers`** (Netlify) — net improvement; static hosting stripped the response headers before anyway:
   ```
   /rss
     Content-Type: application/xml; charset=UTF-8
   /feeds/rss
     Content-Type: application/xml; charset=UTF-8
   /posts/rss
     Content-Type: application/xml; charset=UTF-8
   /projects/rss
     Content-Type: application/xml; charset=UTF-8
   /uses/rss
     Content-Type: application/xml; charset=UTF-8
   /work/rss
     Content-Type: application/xml; charset=UTF-8
   ```
5. `public/robots.txt` unchanged (still disallows `/cards/`).
6. Run the AM-001 RSS parity tests against the Astro build; iterate until fixtures match (modulo `lastBuildDate`).

## Acceptance Criteria

- [ ] All six endpoints exist in `dist/` as extensionless files at the exact old URLs
- [ ] AM-001 RSS fixtures match byte-for-byte after `<lastBuildDate>` strip — including item order (ASC sections / DESC merged), `<guid>`, `<pubDate>`, `<category>`, `<content:encoded>`
- [ ] `public/_headers` committed
- [ ] `bun run test` green incl. `rss.test.ts`

## Notes / Parity traps

- The ASC sort on section feeds looks like a bug but is current production behavior — **preserve it**.
- `<guid>` values are slugs — AM-002 guaranteed stability; do not regenerate differently.
- If `content:encoded` HTML differs slightly (Shiki vs hljs markup inside post bodies), that is an accepted intentional diff — the AM-001 fixtures should have excluded code-block internals for posts, or the comparison must normalize them; everything else must match.
