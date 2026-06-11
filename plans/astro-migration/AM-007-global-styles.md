# AM-007: Global Styles + CSS Architecture

**Phase:** 3 - Styles + Layout | **Size:** S | **Depends on:** AM-004

## Goal

Port all global CSS to `src/styles/` byte-for-byte (design tokens, reset, fonts, base) and establish the code-block styling replacement for the retired `highlight.css`.

## Scope / Tasks

1. Move from `src/lib/styles/` to `src/styles/`, **verbatim, zero edits**:
   - `reset.css`
   - `variables.css` - all design tokens incl. the `@media (prefers-color-scheme: dark)` overrides (dark mode stays pure CSS, no JS toggle)
   - `fonts.css` - `@font-face` for Source Sans 3 (300/400/600/700/900 + italics) and JetBrains Mono (400 + italic), `font-display: swap`, files served from `public/fonts/`
   - `base.css` - smooth scroll, body 125% font-size, antialiasing, link decoration, `scroll-margin`
2. **Do not port `highlight.css`** (One Dark `.hljs-*` rules - retired with rehype-highlight). Instead create `src/styles/code.css` containing only the *container* styling that `highlight.css`/`BaseRichText` provided around code blocks: `pre` padding, border-radius, overflow-x scroll, font-family `var(--font-family-code)`, font size, inline-`code` styling. Shiki's `one-dark-pro` supplies token colors inline; the background color comes from the theme - verify it matches the old `#282c34` close enough, otherwise override `.astro-code { background-color: ... }`.
3. Document the import order for the root layout (AM-008): `reset.css` → `fonts.css` → `variables.css` → `base.css` → `code.css`.
4. Verify PostCSS processes these files (nesting, sorting, autoprefixer; cssnano in prod build) and `bun run lint:css` passes.

## Acceptance Criteria

- [ ] All global CSS files live in `src/styles/`, content identical to `main` except the highlight→code swap
- [ ] `bun run lint:css` and `bun run format:css` pass
- [ ] Production build output contains minified CSS with all custom properties and font-faces
- [ ] Dark-mode token overrides verified by toggling `prefers-color-scheme` in devtools on a scratch page

## Notes / Parity traps

- The old `highlight.css` was **always dark** (not scheme-adaptive) - keep code blocks always dark with `one-dark-pro` for visual parity; do not introduce a dual-theme Shiki config.
- CSS conventions from CLAUDE.md (property ordering via postcss-sorting, colocated media queries) apply to `code.css` too.
