# AM-009: Base Components

**Phase:** 4 — Components | **Size:** M | **Depends on:** AM-008

## Goal

Port all shared presentational components from `src/lib/components/` (Svelte) to `src/components/` (`.astro`), with scoped styles verbatim and Svelte snippets/slots replaced by Astro slots. No client JS in any of these — interactive behavior is consolidated in AM-015.

## Scope / Tasks

Port each, keeping file-level CSS identical (Astro scopes `<style>` by default, like Svelte):

1. **`BaseRichText.astro`** — props `element` (default `div`; also `section`/`footer`), `class`, `id`; render via dynamic tag (`const Element = element` then `<Element>`), default `<slot />`. All descendant-markdown styling CSS verbatim. Code-block rules updated for Shiki output (`pre.astro-code`) per AM-007's `code.css` — remove dead `.hljs` selectors.
2. **`BaseCard.astro`** — props `element` (`div`/`a`), `href`, variant classes (`default`, `featured`, `withIcon`, `withLogo`, `row`, `image`, `highlighted`). Dynamic tag; hover transform CSS verbatim.
3. **`BaseCallout.astro`** — props `prefix`, `noCard`; conditional `BaseCard` wrapper + `BaseRichText` slot.
4. **`BaseTag.astro`** — render as `<a>` (today it's a `<button>` with parent-provided onclick used for tag navigation; links match the static-site semantics and `Tag.relativePath` already encodes `?tag=slug` URLs). Props: `tag: Tag`, `selected` (font-weight bold). Visual CSS verbatim.
5. **`BaseMetaList.astro`** — `preText` label + items list.
6. **`BaseHeadlineIcon.astro`** — `<h3>` with `<Icon name="ph:..." />` from `astro-icon/components` + text span.
7. **`BaseStatus.astro`** — `<Icon name="ph:play-circle-bold" />` / `ph:pause-circle-bold` by status prop.
8. **`BaseFootnote.astro`** — `BaseRichText` as footnote section.
9. **`BaseSegmentedButtons.astro`** — pill-group layout wrapper, `<slot />`.
10. **`EntryHeader.astro`** — `<header>` with `<h1>`, named slots `leading` and `meta`, layout modes `block`/`inline` via prop (replaces snippet-presence detection — Astro: `Astro.slots.has('leading')`).
11. **`Entries.astro`** — main column + optional `sidebar` named slot; collapse to single column when `!Astro.slots.has('sidebar')` (replaces `hasSnippet` check).
12. **`TableOfContent.astro`** — recursive `<ol>` over `TocNode[]` using `<Astro.self nodes={node.children} />`; the `<details>` wrapper + summary live in the post detail page (AM-012).

Skipped (handled elsewhere or retired): `BaseModal`/`ContactModal`/`BaseToClipboardButton` → AM-015; `LayoutCookies` (empty file) → delete; `EntriesFilter` → AM-015; `Hero`/Layout components → AM-008.

## Acceptance Criteria

- [ ] Every component compiles, `bun run check` passes with typed Props interfaces
- [ ] A scratch page composing all components renders semantically identical DOM to the Svelte versions (spot-check class names, element types, slot placement)
- [ ] Icons render as build-time inline `<svg>` (no client JS), visually identical to the `@iconify/svelte` Phosphor icons
- [ ] `bun run lint:css` passes on all component styles
- [ ] No `divs-in-divs` regressions: keep the flat DOM of the originals

## Notes / Parity traps

- Svelte `:global()` and Astro `:global()` differ in details — `BaseCard` styles `enhanced-img`/`img` globals and `BaseSegmentedButtons` styles direct children via global selectors; re-verify each `:global` usage renders correctly in Astro (Astro adds class-based scoping attributes rather than Svelte's hash classes).
- `BaseCard` hover scale/translate animation will get a reduced-motion guard later (AM-020) — port as-is for parity now.
- `svelte:element` → dynamic tag variable; there's no `astro:tag` — `const Tag = element as keyof HTMLElementTagNameMap` is the idiom.
