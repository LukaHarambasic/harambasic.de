# AM-011: Static Prose Pages + Feeds Page

**Phase:** 5 - Pages: List + Static | **Size:** S | **Depends on:** AM-009, AM-008

## Goal

Port the three fully static pages: `/imprint`, `/data-privacy`, and the `/feeds` HTML index page.

## Scope / Tasks

1. **`src/pages/imprint.astro`** - port prose from `(main)/imprint/+page.svelte` verbatim (German TMG §5 legal notice: address, contact, disclaimers) inside `BaseRichText`. Title "Imprint", description "Imprint, not more, but also not less."
2. **`src/pages/data-privacy.astro`** - port prose from `(main)/data-privacy/+page.svelte` verbatim inside `BaseRichText`. Same title/description as today's `+page.server.ts`.
3. **`src/pages/feeds/index.astro`** - port `(main)/feeds/+page.svelte`:
   - Hero/heading "Feeds" + description (note: today `/feeds` is NOT in the layout's hero list - replicate exactly what production renders, hero-or-heading, per the AM-001 fixture)
   - List of the five feeds with descriptions, in today's order: `/rss`, `/work/rss`, `/projects/rss`, `/uses/rss`, `/posts/rss`
   - Plain `<a>` links - drop `data-sveltekit-reload` (Astro has no client router by default; links to XML endpoints just work)
   - Monospace link styling (`var(--font-family-code)`) and list CSS verbatim
4. All three pages: correct `title`/`description` props to `Layout.astro`; no `isDetailPage`, no hero slot unless production shows one.

## Acceptance Criteria

- [ ] `/imprint`, `/data-privacy`, `/feeds` build and match AM-001 fixtures (title, description, h1, link list)
- [ ] No SvelteKit-specific attributes (`data-sveltekit-*`) anywhere in the output
- [ ] Feed links resolve once AM-014 lands (until then they 404 - acceptable on the branch)

## Notes / Parity traps

- Prose content must be copied character-for-character - legal text.
