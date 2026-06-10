# AM-020: prefers-reduced-motion Pass

**Phase:** 11 — Post-Parity Enhancements | **Size:** S | **Depends on:** AM-017 (coordinate with AM-019)

## Goal

Close a pre-existing accessibility gap: the site has zero `prefers-reduced-motion` handling. Guard every animation and transition so motion-sensitive users get a calm experience.

## Scope / Tasks

1. Inventory all motion (known from the migration; re-grep `animation|transition|transform|scroll-behavior` in `src/`):
   - Dialog `zoom`/`fade` keyframes + backdrop fade (contact modal)
   - Card hover scale/translate (`BaseCard` link variant)
   - Feed thumbnail pulse (`feed-thumb-pulse`) and image fade-in
   - `html { scroll-behavior: smooth }` (base.css)
   - TOC `<details>` caret rotation transition
   - View transitions (AM-019 — verify built-in fallback)
2. Apply guards using the standard pattern, colocated per CLAUDE.md rules:
   ```css
   @media (prefers-reduced-motion: reduce) {
   	/* disable or reduce the specific animation */
   }
   ```
   For global coverage prefer a single rule in `base.css` killing non-essential motion (`*, *::before, *::after { animation-duration 0.01ms; transition-duration 0.01ms; scroll-behavior: auto }` pattern) **plus** the colocated specific overrides where the blanket rule isn't enough — pick one consistent approach and document it in `base.css`.
3. Keep purposeful non-motion feedback (e.g. focus outlines, color changes) untouched — only motion is reduced.
4. Manual test with the OS/devtools reduced-motion toggle across: home feed, card hovers, contact dialog, anchor scrolling, page navigation.

## Acceptance Criteria

- [ ] With reduced motion: no dialog zoom, no card movement, no pulse animation, instant anchor scrolling, instant page transitions
- [ ] Without the preference: everything animates exactly as before
- [ ] `bun run lint:css` passes (property ordering, colocation)
- [ ] No visual regression in the parity suite
