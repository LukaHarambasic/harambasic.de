# AM-002: Slug Parity Audit

**Phase:** 0 — Parity Harness | **Size:** S | **Depends on:** —

## Goal

Current entry slugs (and therefore all URLs and RSS `<guid>`s) derive from the frontmatter **title** via `getSlug(title)` (`src/lib/util/helper.ts`: trim → lowercase → strip non-alphanumeric → spaces to dashes). Astro content collections derive `id` from the **filename**. Before the content layer is built (AM-005), prove that filename stem === `getSlug(title)` for every entry, or resolve mismatches — otherwise the migration silently changes URLs.

## Scope / Tasks

1. Write `scripts/audit-slugs.js` (Node, no new deps — `front-matter` is already in devDependencies):
   - Read all `.md` files from `src/content/posts/`, `src/content/projects/`, `src/content/uses/`, `src/content/work/`
   - Parse `title` from frontmatter
   - Reimplement `getSlug()` inline (copy the 4-line function — the script must run standalone outside the Vite/TS toolchain)
   - Compare `getSlug(title)` to the filename stem
   - Print `OK` per file or `MISMATCH: <file> filename-slug=<x> title-slug=<y>`; exit 1 on any mismatch
2. Run it. For each mismatch, rename the markdown file to the title-derived slug (preferred — keeps "slug derives from title" semantics with zero collection-config special cases). If a rename is undesirable for some entry, record it in the ticket/PR notes as needing an explicit slug override in `content.config.ts` (AM-005).
3. Also audit the cross-reference fields: `relatedWork[]` (projects) and `relatedProjects[]` (work) contain slugs — confirm every referenced slug resolves to an existing entry.
4. Also audit social images: for every post and uses entry, confirm `static/social/{slug}.png` exists (the og:image URL pattern depends on it). Report missing ones (the post-commit hook should regenerate them, but verify).

## Acceptance Criteria

- [ ] `node scripts/audit-slugs.js` runs cleanly and reports per-file results
- [ ] Zero mismatches remain (files renamed if needed), or remaining exceptions are explicitly documented for AM-005
- [ ] All `relatedWork`/`relatedProjects` slugs resolve
- [ ] Missing social images reported (and regenerated via `bun run socialMedia:auto` if any)

## Notes / Parity traps

- `getSlug` strips apostrophes etc. (`"Things I've built"` → `things-ive-built`), so subtle filename divergence is plausible — that's exactly what this gate catches.
- This audit is also the safety net for RSS `<guid>` stability: guids are slugs today; a changed slug would make every feed reader re-deliver the item.
