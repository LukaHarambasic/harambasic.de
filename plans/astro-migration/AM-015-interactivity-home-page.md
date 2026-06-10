# AM-015: Interactivity — Home Page, Contact Modal, Clipboard, Status Filter

**Phase:** 8 — Interactivity | **Size:** M | **Depends on:** AM-008, AM-010, AM-012

## Goal

Build the home page and implement the four interactive behaviors as minimal vanilla JS — native `<dialog>`, plain `<script>` tags, progressive enhancement. After this ticket the site has zero framework runtime.

## Scope / Tasks

### Home page (`src/pages/index.astro`, port `(main)/+page.svelte` + `+page.server.ts`)

1. Build-time data: all four collections → `getMergedFeedEntries(posts, projects, uses, work)` → `getLayoutOrderedEntries()` → `getInitialVisibleCount(ordered, 6)` (all pure, ported in AM-005).
2. Render profile `<Image>` (profile.jpeg), "heyho" intro blurb, then the Feed section: **server-render ALL rows**, with rows beyond `initialCount` carrying the `hidden` attribute. Full-width rows (Posts/Projects/Work) vs half-width Uses pairs exactly as the layout-ordering logic dictates; `isExternal` uses entries get external link treatment; `aria-label="View {title}"`; thumbnails via the AM-006 image helpers with the `thumb-loader` pulse placeholder.
3. Show more / Show less buttons (`BaseSegmentedButtons` styling as today):
   - Inline `<script>`: on "Show more", unhide the next batch up to `getTargetVisibleCount` (port the orphan-avoidance math into the script or precompute the step boundaries at build time and emit them as a `data-` attribute — prefer precomputed boundaries: simpler script, logic stays in tested TS)
   - "Show less" re-hides back to `initialCount`; button visibility toggles at bounds (as today)
   - No JS → all-but-initial rows hidden but reachable via... nothing: acceptable degradation matches today's JS-only behavior; alternatively render with `hidden` and let the buttons be the only gate (same as production)
4. Image-load fade-in: small script swapping the `thumb-loader` placeholder on `img` `load` events for visible rows (port the existing behavior).
5. Title: empty string (bare `Luka Harambasic`), description from today's `+page.server.ts`.

### Contact modal (in `Layout.astro`)

6. Add `<dialog id="contact-dialog">` with the full `ContactModal.svelte` content as static HTML: E-Mail (with copy button), Signal, LinkedIn, BlueSky, GitHub, cal.com links; close via `<form method="dialog"><button>` (`ph:x-circle-bold` icon). CSS from `BaseModal.svelte` + `ContactModal.svelte` verbatim (zoom/fade keyframes, `::backdrop`, prefers-color-scheme backdrop).
7. `<script>` in the layout:
   ```js
   const dialog = document.getElementById('contact-dialog');
   const openIfHash = () => { if (location.hash === '#contact') dialog.showModal(); };
   openIfHash();
   window.addEventListener('hashchange', openIfHash);
   dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });
   dialog.addEventListener('close', () => {
   	if (location.hash === '#contact') history.replaceState(null, '', location.pathname + location.search);
   });
   ```
   Footer "Contact" link (`href="#contact"`) now works from any page, matching today.

### Clipboard button

8. Replace `BaseToClipboardButton.svelte`: `<button data-clipboard="luka@harambasic.de">` + script `document.querySelectorAll('[data-clipboard]').forEach((b) => b.addEventListener('click', () => navigator.clipboard.writeText(b.dataset.clipboard)))`. Keep the visual confirmation behavior production has (verify what it does today — `once` semantics).

### Status filter (`EntriesFilter`)

9. First **verify where the filter actually renders in production** (exploration suggests list pages hardcode `'all'` and the sidebar may be dead UI). Replicate exactly what production shows:
   - If rendered: `<select>` reading `?status=` on load and `history.pushState` on change (port `setParam`), plus a small script toggling row visibility by `data-status` attributes
   - If not rendered anywhere: delete it and note the removal in the PR description

## Acceptance Criteria

- [ ] Home feed: initial count, show more/less stepping, orphan avoidance, and uses-pair layout identical to production behavior
- [ ] Navigating to any page with `#contact` opens the dialog; ESC/backdrop/close button close it and remove the hash; focus handling is native `<dialog>` behavior
- [ ] Copy button writes the email to the clipboard
- [ ] With JS disabled the page renders fully (rows beyond initial are hidden; no errors)
- [ ] Total client JS is a few inline scripts — no framework runtime in `dist/`
- [ ] `bun run check`, `bun run lint`, AM-001 home fixtures pass

## Notes / Parity traps

- Astro `<script>` is processed/bundled by default — fine; use `is:inline` only if ordering demands it.
- The old SvelteKit build needed `handleMissingId: 'ignore'` for `#contact`; in Astro there is no such check — nothing to configure.
- Scripts must be idempotent enough to survive View Transitions later (AM-019 re-inits via `astro:page-load`) — write them as small named functions now to ease that.
