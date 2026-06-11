# AM-002 - Audit Results & Decisions

`node scripts/audit-slugs.js` → **0 fatal, 22 warnings**.

## Decision: do NOT rename markdown files

Filenames diverge from title-slugs for many entries (e.g. `corona-warn-app.md` →
`/projects/coronawarnapp`, `greenkayak.md` → `/projects/greenkayak-app`,
`adding-github-actions-…-repositories.md` → `/posts/add-github-actions-…-repository`).

The plan offered two resolutions: rename files, or document an exception. **We document
the exception** because:

1. **AM-003 requires `src/content/` byte-identical to `main`** - renaming would violate it.
2. **AM-005 mandates slugs derive from the title regardless** (`getSlug(data.title)` in the
   accessor layer, never the Astro filename `id`). So URLs/`<guid>`s stay correct without
   any rename or `content.config.ts` slug override.

No collisions exist (title-slugs are unique per type), and all `relatedProjects` /
`relatedWork` cross-references resolve against title-slugs. URLs and RSS guids are stable.

## Pre-existing issue: social image naming (preserved, not fixed)

22 entries' `static/social/{title-slug}.png` are missing. For the 5 affected **posts**, an
image exists under the **filename-stem** name instead (e.g.
`adding-github-actions-…-repositories.png` exists, but the page's og:image points at
`add-github-actions-…-repository.png`). This means the **current production site already
emits a 404-ing og:image** for these posts.

For strict parity we **preserve the exact og:image URL (title-slug based)** captured in the
AM-001 fixtures and do **not** regenerate images (which would change behaviour). `uses`
entries have no detail pages, so their "missing" social images are irrelevant to any
rendered og:image. This is logged as a known pre-existing inconsistency, out of scope for
the 1:1 migration.
