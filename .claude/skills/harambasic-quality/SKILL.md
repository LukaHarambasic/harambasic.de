---
name: harambasic-quality
description: Implementation quality standards for harambasic.de. Use this skill whenever writing or reviewing CSS, HTML markup, SEO/meta tags, or client-side JS in this repo, and when deciding whether something belongs in CSS or JS. Complements harambasic-design (brand, colors, type); this skill covers HOW things are built, not how they look.
user-invocable: true
---

# harambasic.de - implementation quality standards

The site is Astro 5, static output, no UI libraries, no Tailwind, no CSS frameworks,
no client-side framework. Functional programming only (pure functions, no classes).
These standards were established in the 2026 modernization pass; hold every change
to them. When in doubt: boring, obvious, semantic, CSS-first.

Browser support policy: only adopt features that are **Baseline Widely Available**
(check caniuse/web.dev baseline). Everything referenced below qualifies.

## 1. CSS

**Theming**

- All theme-dependent colors are `light-dark(lightValue, darkValue)` tokens in
  `src/styles/variables.css`, switched by `color-scheme: light dark` on `html`
  (base.css). Never add a `@media (prefers-color-scheme: dark)` token block.
- `light-dark()` is a COLOR function: inside multi-part values (shadows, borders)
  wrap the color component, never the whole list.
- Derived colors use `color-mix()` over hardcoded variants.
- No hardcoded hex/rgba in components; everything resolves to a `--c-*` token.

**Layout and responsiveness**

- Canonical viewport breakpoints, always as literals in the modern range syntax
  `@media screen and (width <= X)`: **30rem / 48rem / 62rem / 86rem**. Do not
  invent new breakpoints without a strong reason.
- When layout depends on the COMPONENT's width (grids, cards in varying
  containers), use container queries, not viewport queries. Pattern: EntryList
  renders a wrapper div with `container-type: inline-size; container-name:
entry-list` (a container query can never match the container element itself,
  which is why the wrapper exists). Children respond with
  `@container entry-list (width <= ...)`.
- Grid for 2D layout and explicit column counts, flexbox for 1D flow. No
  negative-margin or absolutely-positioned layout hacks; `gap` over spacer
  elements.
- Fluid over stepped: `clamp()` for display/heading sizes (`--fs-display`,
  `--fs-h1`, `--fs-h2`), `min()`/`max()` for constrained widths (e.g. the
  dialog: `width: min(54em, calc(100vw - 2 * var(--l)))`).
- Logical properties for anything written or touched: `margin-inline`,
  `padding-block`, `inset-inline-end`, `border-block-end`, `text-align: end`.

**Shared patterns (reuse, never re-implement)**

- `.golden-ratio` (base.css): the centered 61.8% reading column. Any centered
  narrow section uses this class, never a copied width rule.
- Decorative bar: the short rule under eyebrows/headings is a local `::after`
  built ONLY from the `--deco-bar-*` tokens (width/height/radius/color).
  On inverted/honey surfaces override `--deco-bar-color` on the section, not
  the `::after` background.
- Entry/EntryList/WorkCard are the one list-item system. Entry exposes
  `--entry-muted` and `--entry-line` so slotted content follows the featured
  state; never reach into another component with `:global(.entry...)`.

**Redundancy rules**

- Never declare what already inherits: `font-family: var(--font-family)` (body
  sets it; reset.css gives form controls `font: inherit`), `font-weight: 400`,
  default `flex-wrap`/`justify-content`/`align-content` values.
- BUT `font-size: var(--font-m)` is NOT redundant: body is `font-size: 125%`
  (20px inherited) while `--font-m` is 1rem (16px). Removing it changes rendering.
- Scoped styles by default; `:global()` only for slot content, markdown HTML,
  and astro-icon SVGs, with a comment when it crosses a component boundary.

**Typography and polish**

- base.css sets `text-wrap: balance` on headings and `text-wrap: pretty` on
  paragraphs; don't repeat per component.
- `background-clip: text` gradients only behind
  `@supports (background-clip: text) or (-webkit-background-clip: text)` with
  `color: transparent` inside the guard (never unconditionally).
- Respect the blanket `prefers-reduced-motion` guard in base.css; never add
  per-component motion overrides that bypass it.

**Tooling decisions (settled, don't relitigate)**

- Keep postcss-nested (stylelint/postcss-sorting toolchain is verified with it);
  no native-nesting migration as a side effect of another change.
- No `@layer`: Astro's scoped styles already win specificity naturally.
- Property order is enforced by postcss-sorting; run `bun run format:css`.

## 2. HTML

- Semantic element first, div last: `nav`, `main`, `article`, `section`,
  `header`, `footer`, `figure`, `address`, `dialog`, `details`/`summary`.
- Label-value pairs (contact channels, job title + dates, stats) are
  `<dl>`/`<dt>`/`<dd>`.
- Every date a machine can read is `<time datetime="YYYY-MM-DD">` (content
  frontmatter dates are already in this format; pass them through).
- Thematic/visual separators are `<hr>` (styled), never an empty styled div.
- Postal/contact info is `<address>` (with `font-style: normal` via BaseRichText).
- Exactly one `<h1>` per page, visible, with sequential heading levels after it.
  Legal/prose pages get their h1 inside BaseRichText.
- Block-link cards (Entry) get `aria-label` when the visible text alone is
  ambiguous ("View project X"); decorative icons get `aria-hidden="true"`.
- `<nav>` elements get `aria-label` when there is more than one nav on a page
  (the header nav is "Main").
- Flat DOM: no wrapper element that exists only to be styled when the parent
  can take the CSS. The two sanctioned wrappers: EntryList's container-query
  div and Layout's `.container` grid.
- Every page passes `slot="hero"` to Hero (never the default slot).

## 3. SEO

- Layout.astro emits per page: `<link rel="canonical">` and og:url/twitter:url
  from `new URL(Astro.url.pathname, getPermalink()).href` (NEVER the bare
  permalink, which is the site root), title, description, og:image with
  social-image fallback, twitter:card/site/creator.
- Posts pass `ogType="article"` and `publishedTime` (ISO) to Layout, which adds
  `article:published_time` and `article:author`.
- JSON-LD: pure builders in `src/lib/jsonld.ts` (Person, WebSite, BlogPosting)
  rendered through `JsonLd.astro` into the Layout `head` slot. Home carries
  Person + WebSite; every post carries BlogPosting. New content types get a
  builder function there, never inline JSON in a page.
- New titled pages need a social image in `public/social/<slug>.png`
  (generated by the post-commit hook / `bun run socialMedia:auto`); the
  fallback is default.png.
- Fonts: exactly the three above-the-fold woff2 files are preloaded in
  Layout.astro (Hanken Grotesk regular + 600, Newsreader 500). Adding a font
  weight does not mean adding a preload.
- `public/_headers` carries the security headers (X-Frame-Options,
  X-Content-Type-Options, Referrer-Policy, Permissions-Policy) and immutable
  caching for `/fonts/*` and `/_astro/*`. NO Content-Security-Policy: Astro's
  ClientRouter injects inline scripts that cannot be nonced in static output,
  so a CSP would either break view transitions or need `unsafe-inline`.
- The 404 page is `src/pages/404.astro`; sitemap and the six RSS feeds are
  generated, do not hand-edit.

## 4. CSS over JS

All client JS lives in ONE `<script>` in `src/layouts/Layout.astro`, re-bound
through a single `astro:page-load` handler with per-element dataset guards.

Sanctioned JS (do not CSS-ify, it was assessed): contact `<dialog>`
open/close/hash handling, clipboard copy, the multi-step feed pagination,
GoatCounter SPA tracking.

Everything else is CSS: hover/focus states, accordion (`details`), grid
collapse (container queries), show/hide tied to element state (`:has()`),
animations (with the reduced-motion guard). Before adding any new JS, write
down why CSS cannot do it.

## 5. Verification checklist (every change)

The pre-commit hook runs all of this; run it yourself first:

1. `bun run format && bun run lint` (Prettier, ESLint, stylelint property order)
2. `bun run check` (astro type check, zero errors)
3. `bun run test` (Vitest unit tests)
4. `bun run build` (must complete; spot-check `dist/` when touching tokens:
   `grep light-dark dist/_astro/*.css`, `grep @container dist/index.html`)
5. `bun run test:ui` (Playwright parity, builds + previews). Parity snapshots
   break ONLY if you change: h1 text, the header/nav/main#main/footer/skip-link
   landmarks, nav or footer hrefs, titles, descriptions. Any other snapshot
   diff means an unintended regression; investigate before `--update-snapshots`.
6. Manual: 320px / 768px / 1280px viewports (no horizontal scroll), forced
   dark mode (devtools), keyboard pass (skip link, dialog, details).

Never bypass git hooks. No em dashes anywhere in this repo.
