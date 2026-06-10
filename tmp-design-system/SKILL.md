---
name: harambasic-design
description: Use this skill to generate well-branded interfaces and assets for Harambasic Consulting (the independent AI/automation/product practice of Luka Harambasic), either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the `readme.md` file within this skill, and explore the other available files.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out
and create static HTML files for the user to view. If working on production code, you can
copy assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build
or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_
production code, depending on the need.

## Quick orientation

- **Brand in one line:** *I help you put AI to work.* It's one person — Luka — and always
  will be. Warm, human, first-person "I", editorial, premium-print feel.
- **Two colours, expanded:** aubergine ink `#2d0a2e` + soft pink ground `#ffedf9`. Honey
  `#e0a24a` and clay `#c76b4e` are the only accents. See `tokens/colors.css`.
- **Type:** Newsreader (serif headlines), Hanken Grotesk (sans body/UI), IBM Plex Mono
  (uppercase eyebrows/labels). See `tokens/typography.css`.
- **Signature move:** primary buttons are aubergine filled with pink type. Cards are soft,
  hairline-bordered, optionally grained. No gradients; flat colour grounds + paper grain.
- **The mark is the hero glyph.** Use `assets/logo-mark-transparent.png` on light grounds;
  on dark/ink grounds place it on a small pink rounded tile (never invert it).

## How to build

- Link `styles.css` (the single entry point) and use the semantic tokens.
- For self-contained artifacts (slides, docs, collateral), style directly with the CSS
  custom properties — see `ui_kits/` and `slides/` for working, copy-ready examples.
- For app-style UIs in this design-system project, the React primitives live under
  `components/` and are exposed on `window.HarambasicConsultingDesignSystem_26b27b` via the
  compiled bundle (Design System tab only).
- Match the voice: first person, sentence case, concrete nouns, no buzzwords, no emoji.
  Read the "Content fundamentals" section of `readme.md` before writing any copy.
