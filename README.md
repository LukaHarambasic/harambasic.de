# harambasic.de

Luka's personal website and consulting portfolio. Built with SvelteKit, deployed on Netlify.

## Stack

- **Framework:** SvelteKit 5 with static adapter
- **Package manager:** Bun
- **Node:** 24+
- **Deployment:** Netlify

## Local development

```bash
bun install
bun run dev
```

## Quality checks

```bash
bun run validate   # format → typecheck → lint → test → build
```

Run this before pushing. Fix any failures before opening a PR.

## Deploy

Netlify builds automatically on merge to `main`. Build command: `bun run build`, output: `build/`.

---

_Last updated: 2026-04-03_
