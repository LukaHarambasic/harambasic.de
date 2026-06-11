# AM-003: Astro Project Scaffold

**Phase:** 1 - Scaffold | **Size:** M | **Depends on:** AM-001, AM-002

## Goal

Bootstrap a clean Astro project **in place** on the `feat/astro-migration` branch: SvelteKit framework files are removed, Astro takes over the repo root, and everything framework-agnostic (`src/content/`, `src/assets/`, `scripts/`, static assets) survives untouched.

## Scope / Tasks

1. Create branch `feat/astro-migration` from `main`.
2. Remove SvelteKit-specific files: `svelte.config.js`, `vite.config.ts`, `src/app.html`, `src/app.d.ts`, `src/routes/` (the Svelte components inside route folders are ported in later tickets - keep the branch's git history as the reference, nothing else is needed). Keep `src/content/`, `src/assets/`, `src/lib/` (pruned in later tickets), `scripts/`, `e2e/`.
3. Update `package.json`:
   - Remove: `@sveltejs/kit`, `@sveltejs/adapter-static`, `@sveltejs/vite-plugin-svelte`, `@sveltejs/enhanced-img`, `svelte`, `svelte-check`, `@iconify/svelte`, `eslint-plugin-svelte`, `prettier-plugin-svelte`, svelte-specific stylelint config if any
   - Add: `astro`, `@astrojs/check`, `astro-icon`, `@iconify-json/ph`
   - Keep: `zod`, `date-fns`, `github-slugger`, `rehype-slug`, `rehype-autolink-headings`, `remark`, `remark-rehype`, `rehype-stringify`, PostCSS stack, stylelint, prettier, eslint, vitest, playwright, supabase, front-matter
   - Remove now-unused: `remark-frontmatter`, `remark-parse-frontmatter`, `rehype-highlight`, `highlight.js` (Astro collections parse frontmatter; Shiki highlights)
4. Create `astro.config.ts`:
   ```ts
   import { defineConfig } from 'astro/config';
   import icon from 'astro-icon';

   export default defineConfig({
   	site: 'https://harambasic.de',
   	output: 'static', // no adapter needed for pure static output
   	trailingSlash: 'never',
   	integrations: [icon()],
   	markdown: {
   		shikiConfig: { theme: 'one-dark-pro' }
   		// rehypePlugins added in AM-005
   	}
   });
   ```
5. `git mv static public` (Astro convention). Verify `public/` now holds `robots.txt`, `fonts/`, `posts/`, `social/`, `uses/`, `work/`, `favicon.svg`.
6. Replace `tsconfig.json` with Astro's strict base (`astro/tsconfigs/strict`) and add the path alias `"$lib/*": ["src/lib/*"]` so ported utils keep their import style.
7. Create a minimal `src/pages/index.astro` placeholder so the project builds.
8. Add `src/env.d.ts` per Astro convention.
9. Verify: `bun install`, `bun run dev` starts, `bun run build` emits `dist/`.

## Acceptance Criteria

- [ ] `bun run dev` and `bun run build` succeed on the branch
- [ ] `dist/` is produced; `build/` no longer referenced anywhere
- [ ] `src/content/` is byte-identical to `main` (verify with `git diff main -- src/content`)
- [ ] `public/` contains everything formerly in `static/`
- [ ] No `svelte`/`@sveltejs` packages remain in `package.json`
- [ ] `$lib/...` imports resolve in a sample file

## Notes / Parity traps

- Do NOT add `@astrojs/netlify` - a pure static build needs no adapter; Netlify serves `dist/` directly (config updated in AM-004).
- `setting site:` is required later by `@astrojs/sitemap` (AM-018) and harmless now.
- `.gitignore`: swap `.svelte-kit/`, `build/` for `.astro/`, `dist/`.
