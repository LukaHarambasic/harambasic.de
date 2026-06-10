# AM-004: Tooling — PostCSS, Linting, Husky, CI, Netlify Config

**Phase:** 1 — Scaffold | **Size:** S | **Depends on:** AM-003

## Goal

Wire the full quality-gate toolchain (PostCSS, Prettier, ESLint, Stylelint, Husky, commitlint, GitHub Actions, Netlify) to the Astro project so `bun run validate` is green from day one and every later ticket lands through the same gates as before.

## Scope / Tasks

1. **PostCSS**: keep `postcss.config.mjs` verbatim (postcss-sorting with the property-order config, postcss-nested, autoprefixer, cssnano prod-only, postcss-size). Astro picks up `postcss.config.mjs` automatically for `.astro` `<style>` blocks and imported CSS files — no `lang="postcss"` attribute needed.
2. **Prettier**: remove `prettier-plugin-svelte` from config, add `prettier-plugin-astro` with `overrides: [{ files: '*.astro', options: { parser: 'astro' } }]`.
3. **ESLint** (`eslint.config.js`): drop `eslint-plugin-svelte` blocks, add `eslint-plugin-astro` recommended config; keep the TypeScript rules.
4. **Stylelint**: update file glob to `"src/**/*.{css,astro}"` and add `customSyntax` handling for `.astro` (use `postcss-html` which stylelint supports for astro files). Keep all property-ordering rules.
5. **package.json scripts**:
   - `dev` → `astro dev`, `build` → `astro build`, `preview` → `astro preview`
   - `check` → `astro check` (replaces `svelte-kit sync && svelte-check`)
   - `lint`, `lint:fix`, `lint:css`, `format`, `format:css` updated for the new globs
   - `test`, `test:ui`, `validate`, `validate:content`, `newPost`, `socialMedia:*` unchanged
6. **Husky**: `.husky/pre-commit` keeps the same 7 steps (format → lint:fix → lint → check → test → validate:content → build); only the underlying commands changed via package.json. `.husky/commit-msg` (commitlint) and `.husky/post-commit` (social previews) untouched.
7. **netlify.toml**: `publish = "dist"`, keep `command = "bun run build"` and `NODE_VERSION = "24"`.
8. **GitHub Actions** (`.github/workflows/ci-cd-pipeline.yml`): no structural change — `bun run lint && bun run test && bun run check && bun run build` still works; keep passing `DEPLOY_PRIME_URL`/`URL` env vars (consumed in AM-008).
9. Run `bun run validate` end-to-end on the scaffold.

## Acceptance Criteria

- [ ] `bun run lint`, `bun run check`, `bun run format`, `bun run test`, `bun run build` all pass
- [ ] Stylelint lints `.astro` `<style>` blocks (verify by introducing a deliberate property-order violation, then revert)
- [ ] Pre-commit hook completes on a test commit on the branch
- [ ] `netlify.toml` publishes `dist`
- [ ] CI workflow green on the branch

## Notes / Parity traps

- `vitest` ran without its own config before (via the SvelteKit vite config). After AM-003 there is no `vite.config.ts`; add a minimal `vitest.config.ts` (`defineConfig({ test: { include: ['src/**/*.test.ts'] } })`) so `bun run test` keeps working. Most tests are re-enabled in AM-005; until then the suite may be small/empty — `passWithNoTests: true` temporarily.
- Keep the CSS conventions from CLAUDE.md (property ordering, colocated media queries) — they are toolchain-enforced and carry over unchanged.
