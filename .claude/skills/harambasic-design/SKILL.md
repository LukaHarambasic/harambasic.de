---
name: harambasic-design
description: Use this skill to generate well-branded interfaces and assets for Harambasic Consulting (the independent AI/automation/product practice of Luka Harambasic), either for production or throwaway prototypes/mocks/etc. Contains the essential design guidelines, colors, type, shapes, logo assets, and the dark-theme derivation used on harambasic.de.
user-invocable: true
---

# Harambasic Consulting - design system

A personal brand system for the independent practice of Luka Harambasic (AI adoption,
automations, internal tooling, product management). The defining fact: **it's one person,
and it always will be.** The logo is literally Luka's face, the voice is first-person "I",
and everything favours the warm, exact, human feeling of working with a single trusted
expert - not an agency.

> **Positioning in one line:** _I help you put AI to work._

All design tokens live in `tokens.css` in this skill (self-contained, no imports).
Logo assets live in `assets/`. Read both before designing anything.

## Quick orientation

- **Two hero colours:** aubergine ink `#2d0a2e` + soft pink ground `#ffedf9`. Honey
  `#e0a24a` and clay `#c76b4e` are the only accents - a little goes a long way.
- **Type:** Newsreader (serif headlines, weight 500), Hanken Grotesk (sans body/UI,
  400–700), IBM Plex Mono (uppercase eyebrows/labels only, tracked `0.2em`).
- **Signature move:** primary buttons are aubergine filled with pink type - the logo's
  colour relationship, inverted, as an interaction.
- **Feel:** editorial, warm, premium-print. Flat colour blocks, fine hairline rules,
  generous whitespace. **No gradients, no texture/grain, no emoji.**

## Colour rules

- Use the semantic aliases in `tokens.css` (`--text-body`, `--surface-page`, `--accent`,
  `--focus-ring`…) before raw scale values (`--aub-900`).
- Pink is a full-bleed ground, never a saturated accent. Aubergine is the ink: lines,
  type, dark sections.
- Honey: premium emphasis, CTAs on dark grounds, focus rings, selection. Clay: rare
  secondary warmth (required-field marks).
- Neutrals are warm and faintly mauve; shadows are always aubergine-tinted, never grey.
- On ink (`#2d0a2e`) grounds: body text `--rose-100` `#ffedf9`, muted `#c9a6c4`,
  eyebrows/italics `--honey-400` `#e8b366`.

## Dark theme (site extension)

The original system defines no dark mode; harambasic.de derives one from the ink
surfaces (verified WCAG AAA on `#2d0a2e`):

| Role                             | Value                                  | Contrast |
| -------------------------------- | -------------------------------------- | -------- |
| Page ground                      | `#2d0a2e` (deepest sections `#16041a`) | -        |
| Primary text                     | `#ffedf9`                              | 15.7:1   |
| Muted text                       | `#c9a6c4`                              | 8.2:1    |
| Accent / italic emphasis / links | `#e8b366` (honey-400)                  | 9.3:1    |
| Borders                          | `rgba(255, 237, 249, 0.12)`            | -        |
| Raised surfaces                  | `#3c133d` (aub-800)                    | -        |

## Type rules

- Headlines: Newsreader 500, sentence case, `text-wrap: balance`, tracking
  `-0.022em` (display) / `-0.012em` (headings). Italic segments inside headlines
  colour-shift to `--aub-600` `#653366` on light grounds, `--honey-400` `#e8b366` on ink.
- Body/UI: Hanken Grotesk 400 (max weight 700 - the family has no 900).
- Eyebrows/metadata: IBM Plex Mono, uppercase, `letter-spacing: 0.2em`, size ~12–14px,
  colour `--text-muted`. This is the only uppercase in the brand. A short 2px ink rule
  (54–64px wide) is a recurring accent beneath eyebrows.
- Fonts are **self-hosted woff2** (no CDN). On harambasic.de: `public/fonts/` +
  `src/styles/fonts.css`. Weights: Newsreader 400/400i/500/500i, Hanken Grotesk
  400/400i/500/600/700, IBM Plex Mono 400/500 (also the code font).

## Shape, surface & motion

- Radii: 4 / 8 / 12 / 18 / 28px; `--radius-xl: 28px` echoes the logo card (hero
  surfaces, avatars - avatars are a 26% squircle). Buttons are pills (`999px`).
- Cards: soft `--shadow-sm` + inset hairline (`--ring-hairline`). Hover = small lift
  (`translateY(-2px)`) + deeper shadow. Press = `scale(0.985)`. No bounces.
- Motion: `cubic-bezier(0.22, 1, 0.36, 1)`, 120–220ms.
- Focus: honey ring (`0 0 0 3px rgba(224, 162, 74, 0.45)`).
- Callouts: tinted surface + circular icon chip - never the coloured-left-border trope.
- Icons: Lucide-style 2px rounded-join line icons, `stroke="currentColor"`. Never mix
  filled and stroked sets. Never emoji as iconography.

## The mark (logo)

| File                               | What it is                                                           | Use on                                           |
| ---------------------------------- | -------------------------------------------------------------------- | ------------------------------------------------ |
| `assets/logo.svg`                  | Vector mark: aubergine portrait on pink rounded card, self-contained | anywhere (header, favicon, social) - the default |
| `assets/logo-mark-transparent.png` | Raster mark, ground knocked out                                      | light surfaces (pink, paper, white)              |
| `assets/logo-portrait.png`         | Raster mark with pink ground baked in                                | pink backgrounds                                 |

**One rule: the mark always lives on its pink ground.** On dark/ink surfaces use the
self-contained SVG or place the transparent mark on a small pink rounded tile. Never
invert or recolour the portrait - it reads as uncanny.

The wordmark is always typeset, not a file: Newsreader medium "Harambasic" (or the full
name in context) + optionally IBM Plex Mono uppercase descriptor.

## Voice - how the brand writes

- First person singular - **"I"**, never "we". Address the reader as "you".
- Sentence case everywhere (headlines, buttons, labels). Uppercase only in mono eyebrows.
- Short sentences, concrete nouns ("internal tool", "workflow map" - not "solutions",
  "synergies"). Real, modest numbers ("two or three workflows", "six weeks").
- Warm, candid, understated. Fragments are fine. No em dashes (use commas, colons, or
  periods instead), no buzzwords, no exclamation marks, no emoji.
- Sounds like me: _"I'll find the two workflows worth automating, then build the tooling
  so they actually stick."_ Not me: _"We leverage best-in-class AI solutions to drive
  synergistic transformation."_
