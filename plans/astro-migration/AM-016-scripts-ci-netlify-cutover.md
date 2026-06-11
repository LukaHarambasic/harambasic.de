# AM-016: Scripts, CI Env Vars, Netlify Cutover Config

**Phase:** 9 - Tooling Cutover | **Size:** S | **Depends on:** AM-004, AM-014

## Goal

Make every content/dev script and the CI/CD + Netlify pipeline fully functional against the Astro project; update docs.

## Scope / Tasks

1. **`scripts/generate-post/`** (`bun run newPost`): writes to `src/content/posts/` and creates `static/posts/[slug]/` - update the image-directory path to `public/posts/[slug]/`. Template unchanged.
2. **`scripts/generate-social-media-preview/`** (`socialMedia:auto`/`manual`): update `SOCIAL_PATH` in `util.js` from `static/social` to `public/social`. Verify a dry run generates a PNG for a fake title and `doesImageAlreadyExist` still skips existing ones.
3. **`scripts/validate-content.js` + `validation-runner.js`**: paths unchanged (`src/content/`) - run and confirm green. (Known gap: it doesn't validate `work` entries - out of scope, parity.)
4. **`scripts/fetch-shareable/`**: writes to `src/content/shareables/` - unchanged; confirm output satisfies the dormant collection schema from AM-005.
5. **`scripts/audit-slugs.js`** (from AM-002): keep - it's a useful permanent guard; optionally add to `validate:content`.
6. **Husky post-commit**: still runs `socialMedia:auto` + amend - verify end-to-end with a test commit (images land in `public/social/`).
7. **CI env vars**: `.github/workflows/ci-cd-pipeline.yml` passes `DEPLOY_PRIME_URL`/`URL` - confirm the AM-008 layout picks them up via `process.env` during `astro build` (Netlify sets them natively in production builds; local builds fall back to `https://harambasic.de`).
8. **netlify.toml**: final check - `command = "bun run build"`, `publish = "dist"`, `NODE_VERSION = "24"`.
9. **Docs**: update `README.md` (commands, stack) and rewrite `CLAUDE.md` sections that reference SvelteKit/Svelte (architecture section, enhanced-img notes, svelte-check) to their Astro equivalents. Keep the functional-programming guidelines, CSS standards, and git-hook policy verbatim.

## Acceptance Criteria

- [ ] `bun run newPost` scaffolds a post + `public/posts/[slug]/` directory
- [ ] `bun run socialMedia:auto` generates into `public/social/`; post-commit hook amends correctly
- [ ] `bun run validate:content` passes
- [ ] CI pipeline fully green on the branch; Netlify deploy preview builds and serves the site
- [ ] README/CLAUDE.md contain no stale SvelteKit instructions

## Notes / Parity traps

- `generateCardImages` and `generateFavicons` scripts are referenced in package.json but their directories don't exist - remove the dead script entries (pre-existing rot; removing them is cleanup, not behavior change).
- Netlify branch previews rely on `DEPLOY_PRIME_URL` for og:image URLs - verify a deploy preview's og:image points at the preview domain, as today.
