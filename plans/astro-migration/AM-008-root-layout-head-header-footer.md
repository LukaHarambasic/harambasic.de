# AM-008: Root Layout, Head, Header, Footer, Skip Link

**Phase:** 3 - Styles + Layout | **Size:** M | **Depends on:** AM-007, AM-005

## Goal

Build `src/layouts/Layout.astro`, replacing `(main)/+layout.svelte` + `LayoutHead` + `LayoutHeader` + `LayoutFooter` + `LayoutSkipToContent`. Every page renders through this layout; head metadata, container grid, hero, and golden-ratio handling must match the SvelteKit output captured in AM-001.

## Scope / Tasks

1. **`src/layouts/Layout.astro`** - props: `title?: string` (default `''`), `description: string`, `isDetailPage?: boolean`, optional named slot `hero`.
   Structure (flat, semantic - same DOM as today):
   ```
   <html lang="en"> <head>…</head> <body>
     <a class="skip-link" href="#main">…</a>
     <div class="container">
       <Header />
       <main id="main">
         <slot name="hero" />
         {isDetailPage ? <div class="golden-ratio"><slot /></div> : <slot />}
       </main>
       <Footer />
     </div>
     (contact <dialog> - added in AM-015)
   </body> </html>
   ```
2. **Head** (port `LayoutHead.svelte` verbatim):
   - `<title>`: `{title} | Luka Harambasic`, bare `Luka Harambasic` when title empty
   - viewport, `theme-color #e2ebf0`, `<link rel="icon" href="/favicon.svg">`
   - `name=title`, `name=description`; OG: `og:type=website`, `og:site_name`, `og:url`, `og:title`, `og:description`, `og:image` (+ alt, 1200×630); Twitter: `summary_large_image`, `@luka_harambasic`, url/image/alt
   - GoatCounter script tag (`data-goatcounter="https://luha.goatcounter.com/count"`, `//gc.zgo.at/count.js`, async) - verbatim
   - Social image: `${permalink}/social/${getSlug(title)}.png`, fallback `${permalink}/social/default.png` for empty title (`getSlug` from `$lib/helper`)
3. **Permalink/env**: `const permalink = process.env.DEPLOY_PRIME_URL || process.env.URL || 'https://harambasic.de'` resolved at build time in the layout frontmatter (Netlify sets both; CI passes them - see AM-016). Do not require a `VITE_`/`PUBLIC_` prefix; this is build-time-only server code.
4. **Container grid CSS**: port verbatim from `+layout.svelte` - `grid-template-columns: 1fr var(--layout-xl) 1fr`, breakpoint overrides at `86rem` and `32rem`, `.golden-ratio { max-width: calc(var(--layout-xl) * 0.618) }`. Global styles imported here in the AM-007 order.
5. **`src/components/LayoutHeader.astro`**: nav Home/Work/Projects/Uses/Posts; active state via `Astro.url.pathname.includes(url)` → `is-active` class (exactly today's matching rule, including its loose `includes` behavior). CSS verbatim.
6. **`src/components/LayoutFooter.astro`**: two link rows - LinkedIn/GitHub/BlueSky external; RSS (`/feeds`), Imprint, Data Privacy, Contact (`href="#contact"`). CSS verbatim.
7. **Skip link**: port `LayoutSkipToContent.svelte` (visually hidden, visible on `:focus`, targets `#main`).
8. **`src/components/Hero.astro`**: title + description, fluid `clamp()` font-size, CSS verbatim. Pages opt in by passing it into the `hero` slot - replicating the old `showHero` list-page logic *at the page level* (explicit > route-path sniffing; `/feeds` does not get a hero, matching today).

## Acceptance Criteria

- [ ] A scratch page renders with correct `<title>`, full meta/OG/Twitter set, GoatCounter script, favicon
- [ ] `og:image` URL matches the AM-001 fixture for a sample page (same env vars set)
- [ ] Header active-link underline behaves identically (e.g. `/posts/some-slug` keeps Posts active)
- [ ] Skip link appears on first Tab press and jumps to `#main`
- [ ] Golden-ratio wrapper appears only when `isDetailPage` is passed
- [ ] `bun run check` and `bun run lint` pass

## Notes / Parity traps

- Today `isDetailPage` is computed from the URL (two segments, first ∈ work/posts/projects) and `showHero` from a path list. Moving both to explicit page-level props is a deliberate simplification - verify against AM-001 fixtures that hero/golden-ratio presence per URL is unchanged.
- No `<link rel="canonical">` exists today - don't add one (parity first; could be a follow-up).
- The contact `<dialog>` and its script are explicitly **out of scope** here (AM-015) - but `href="#contact"` in the footer must already be present.
