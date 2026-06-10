# harambasic.de

Personal site of Luka Harambasic — posts, projects, work, and uses. Built with
[Astro](https://astro.build) as a fully static site.

## Stack

- **Astro** (static output, no adapter) — content collections, `astro:assets`, static endpoints
- **TypeScript** + **PostCSS** (postcss-nested, postcss-sorting, autoprefixer, cssnano)
- **Shiki** (`one-dark-pro`) for code highlighting; **astro-icon** (`@iconify-json/ph`) for build-time inline SVG icons
- **Vitest** (unit) + **Playwright** (e2e parity suite)

## Developing

```bash
bun install
bun run dev      # astro dev
```

## Building

```bash
bun run build    # astro build -> dist/
bun run preview  # astro preview --port 4173
```

`og:image` URLs are resolved at build time from `DEPLOY_PRIME_URL` / `URL` (Netlify
sets both; locally they fall back to `https://harambasic.de`).

## Quality gate

```bash
bun run validate     # format + check + lint + test + build
bun run check        # astro check (types)
bun run lint         # prettier + eslint + stylelint
bun run test         # vitest unit tests
bun run test:ui      # playwright parity suite (builds + previews first)
```

Git hooks (Husky) enforce the same gate on every commit. See `CLAUDE.md`.

## Content

Markdown lives in `src/content/` (`posts/`, `projects/`, `uses/`, `work/`; dormant
`snippets/`, `shareables/`). Slugs derive from the frontmatter **title**, not the
filename (`scripts/audit-slugs.js` guards this). Images for projects/uses/work live in
`src/assets/img/`; inline post images and SVG logos are served from `public/`.

```bash
bun run newPost           # scaffold a new post + public/posts/<slug>/
bun run socialMedia:auto  # generate social-preview images into public/social/
bun run validate:content  # validate frontmatter
bun run audit:slugs       # verify slug/cross-reference/social-image integrity
```

## Feeds

Six RSS endpoints with hand-rolled XML for exact-shape stability: `/rss`, `/feeds/rss`,
`/posts/rss`, `/projects/rss`, `/uses/rss`, `/work/rss`. The merged feed sorts newest-first;
section feeds sort oldest-first (intentional).

## Deployment

Netlify builds `bun run build` and serves `dist/` (`netlify.toml`).
