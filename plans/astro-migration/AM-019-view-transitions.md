# AM-019: View Transitions

**Phase:** 11 — Post-Parity Enhancements | **Size:** S | **Depends on:** AM-017 (coordinate with AM-020)

## Goal

Add Astro's client router for smooth cross-page transitions — restoring some of the SPA feel SvelteKit's client router provided, without a framework runtime.

## Scope / Tasks

1. Add `<ClientRouter />` (from `astro:transitions`) to the `<head>` in `Layout.astro`.
2. **Script re-initialization**: the AM-015 inline scripts (contact dialog, clipboard, feed show-more, image fade-in) run once per full page load. With the client router, wrap their init in a function and re-run on `astro:page-load`:
   ```js
   document.addEventListener('astro:page-load', init);
   ```
   Ensure listeners aren't doubled (idempotent init — AM-015 already structured them as named functions for this).
3. **Feed endpoints**: links to `/rss` etc. from `/feeds` must trigger full navigation, not client-side routing of an XML document. Verify the router's opt-out behavior for non-HTML targets; add `data-astro-reload` on those links if needed (the Astro equivalent of the old `data-sveltekit-reload`).
4. **Persisted elements**: consider `transition:persist` on the header/nav if it visibly flashes; keep defaults unless a flash is observed.
5. **Reduced motion**: Astro's view transitions respect `prefers-reduced-motion` by falling back — verify, and align with AM-020's guards.
6. Run the full parity suite + manual nav pass (back/forward buttons, hash `#contact` navigation across pages, scroll restoration).

## Acceptance Criteria

- [ ] Page-to-page navigation animates; back/forward and scroll restoration behave correctly
- [ ] All AM-015 interactivity works after several client-side navigations (no dead buttons, no duplicated listeners)
- [ ] Feed links from `/feeds` load raw XML correctly
- [ ] With `prefers-reduced-motion: reduce`, navigation is instant (no animation)
- [ ] Parity suite still green

## Notes / Parity traps

- GoatCounter counts page loads — with a client router, SPA-style navigations need manual counting (`window.goatcounter.count()` on `astro:page-load`) or analytics under-reports. Implement the manual count hook.
