# Harambasic Consulting — Design System

A personal brand system for **Harambasic Consulting** — the independent practice of
**Luka Harambasic**, who helps startups adopt AI, set up automations, build internal
tooling, and provides product-management services.

The defining fact of this brand: **it's one person, and it always will be.** Every
decision here serves that — the logo is literally Luka's face, the voice is first-person
"I", and the system favours the warm, exact, human feeling of working directly with a
single trusted expert rather than an agency.

> **Positioning in one line:** *I help you put AI to work.* Human-centered AI consulting —
> the person stays in the picture.

---

## Sources & provenance

- **Logo / portrait mark:** `uploads/Simplified.png` (provided by the client), a stylised
  portrait of the founder. Copied and processed into `assets/` (see below). The brand's
  two colours were sampled directly from this file.
- No codebase, Figma, or existing brand guide was provided — this system was defined
  collaboratively from the logo and a short brief. Type, colour expansion, spacing,
  components, and collateral are all original to this system.

**Brief (verbatim intent):** warm & human personality; editorial serif + clean sans;
a fuller palette grown from the logo's two colours; first-person voice; refined, textured,
premium-print feel; surfaces needed = proposal/document template, slide deck, and email
signature + simple brand assets. The logo's vibe should remain central; AI services, but
human-centered.

---

## Content fundamentals — how the brand writes

The voice is **Luka, talking.** Plain, direct, and specific. It sells judgement and taste,
not jargon.

- **Person:** First person singular — **"I"**, never "we". The whole pitch is that you
  get one person. ("I'll find the two workflows worth automating." "You work with me
  directly.")
- **Address:** Speak to the reader as **"you"**. It reads like a note, not a brochure.
- **Tone:** Warm, candid, a little understated. Confident without hype. Comfortable saying
  what I *won't* do ("No team to manage", "If it isn't, you've lost two weeks").
- **Casing:** Sentence case everywhere — headlines, buttons, labels. The only uppercase is
  the mono **eyebrow/label** treatment (e.g. `HOW I WORK`, `PHASE 01`), used as a typographic
  device, not for emphasis in prose.
- **Sentences:** Short. Concrete nouns over abstractions ("internal tool", "workflow map",
  "backlog" — not "solutions", "synergies", "transformation"). One idea per sentence.
- **Numbers & specifics:** Real and modest — "two or three workflows", "six weeks",
  "€23,000". Specificity is the proof. Avoid invented stats and vanity metrics.
- **Punctuation:** The em-dash is a friend for the aside. Occasional sentence fragments for
  rhythm ("Just me, and the work.").
- **Emoji:** **None.** Not part of the brand.
- **Don'ts:** No "we", no buzzwords (leverage, best-in-class, synergy, transformation), no
  exclamation marks, no promises a solo consultant can't personally keep.

**Sounds like me:** *"I'll find the two workflows worth automating, then build the tooling
so they actually stick."*
**Not me:** *"We leverage best-in-class AI solutions to drive synergistic transformation."*

---

## Visual foundations

The whole system grows from the portrait mark's **two colours**: deep **aubergine**
`#2d0a2e` (the ink — every line, every serif headline, the dark grounds) and soft
**pink** `#ffedf9` (the ground it lives on). The feeling is **editorial, warm, and
print-premium** — like a beautifully set letter from someone who knows their craft.

### Colour
- **Two heroes, expanded.** Aubergine ramps from a near-black `--aub-950` through a mauve
  mid (`--aub-500`, which matches the portrait's midtones) to a pale wash. Pink stays light
  and is used as a full-bleed brand ground, not a saturated accent.
- **Warm accents, used sparingly:** **honey** `#e0a24a` (gold — premium emphasis, CTAs on
  dark grounds, focus rings) and **clay** `#c76b4e` (terracotta — required-field marks,
  occasional warmth). A little goes a long way.
- **Neutrals are warm**, faintly mauve, so greys belong to the family rather than reading
  as cold UI chrome.
- **Semantic** hues (success/warning/danger/info) are muted and warmed to fit; info reuses
  the mauve.
- **Signature move:** primary buttons are **aubergine filled with pink type**
  (`--accent` / `--on-accent`) — the logo's relationship, inverted, as an interaction.

### Type
- **Newsreader** (serif) — the voice. Warm, editorial, with an italic that adds humanity.
  Used for display and headlines, weight 500, tight tracking (`-0.022em` on display).
  Italics colour-shift to `--aub-600` / `--honey-400` for emphasis.
- **Hanken Grotesk** (humanist sans) — the clarity. Body, UI, labels. 400–700.
- **IBM Plex Mono** — the quiet technical signal. Used *only* for eyebrows, metadata,
  and small labels, uppercase with wide tracking (`0.2em`). This is what nods to "AI /
  software" without resorting to gradients or robot tropes.
- Headlines are sentence case and balanced (`text-wrap: balance`); body is `pretty`.

### Space, shape & surface
- **4px grid**; generous whitespace — the pink ground is meant to breathe.
- **Radii** are restrained (xs 4 → lg 18), with one larger `--radius-xl: 28px` that echoes
  the rounded logo card, used on hero surfaces and avatars (a 26% squircle).
- **Shadows** are low, soft, and **aubergine-tinted** (never neutral grey), so elevation
  feels warm. Cards usually carry an inset hairline (`--ring-hairline`) plus a small shadow.
- **Texture:** none. The brand reads clean and flat — colour blocks, fine rules, and
  generous space carry the premium-print feel. (A paper-grain token exists but is disabled
  brand-wide: `--grain-opacity: 0`.)
- **Rules:** fine **hairlines** (`--hairline`) separate editorial sections; a short 2px
  **ink rule** (54–64px) is a recurring accent beneath eyebrows.

### Surfaces, motion & states
- **Cards:** soft, low-shadow, hairline-bordered. Variants for white,
  pink, warm-paper, and ink (aubergine with pink type). **No** colored-left-border callout
  trope — callouts use a tinted surface plus a circular icon chip instead.
- **Backgrounds:** flat brand colours (pink, ink, paper) — **no gradients**. Imagery, when
  present, is the portrait mark; full-bleed colour blocks carry the weight instead.
- **Motion:** quick and gentle. `--ease-out` (cubic-bezier(.22,1,.36,1)), 120–220ms.
  Hover = subtle lift (`translateY(-2px)`) and deeper shadow on cards; colour darken on
  buttons. Press = a tiny scale-down (`scale(.985)`). No bounces, no infinite loops.
- **Focus:** a **honey ring** (`--ring-focus`) — warm, visible, on-brand.
- **Hover/press colours:** buttons darken (`--accent-hover` → `--accent-press`); honey
  buttons deepen and flip their text to pink on hover.

### Imagery vibe
Cool-toned photography is off-brand. The visual world is the **two-colour portrait** —
warm, hand-drawn-feeling line art — on flat aubergine/pink/paper grounds. If photography is
ever introduced, it should be warm and high-contrast, never cold or bluish.

---

## Iconography

- **System:** [**Lucide**](https://lucide.dev) — humanist, rounded-join, **2px** stroke
  line icons. Their warmth and even weight match Hanken Grotesk and the portrait's line
  quality. Use them as inline SVG (`stroke="currentColor"`, `stroke-width="2"`,
  `stroke-linecap/linejoin="round"`), sized to ~1.1em next to text.
  - In React/HTML via CDN: `https://unpkg.com/lucide@latest` (or `lucide-react`).
  - This system **inlines** the few icons it needs (arrow, plus, check, alert, bulb)
    directly in the slide/proposal markup so files stay self-contained — copy those, or
    pull the matching glyph from Lucide.
  - *Substitution note:* Lucide is a deliberate, on-brand choice (no icon set was provided
    in the brief). If you adopt a different set later, keep a single consistent 2px line
    family — do not mix filled and stroked icons.
- **Status dots & chips** (in `Badge`) stand in for icons at small sizes.
- **Emoji:** never used as iconography.
- **The mark** (`assets/logo-mark-transparent.png`) is the one piece of "illustration" —
  treat it as the brand's hero glyph (avatar, signature, slide corner, business-card face).

---

## Assets (`assets/`)

| File | What it is | Use on |
|---|---|---|
| `logo-portrait.png` | Original mark — aubergine card + pink face on a pink ground | pink backgrounds (baked-in ground) |
| `logo-mark-transparent.png` | Mark with the outer ground knocked out to transparency | **any light surface** (pink, paper, white) — the default |

**One rule: the mark always lives on its pink ground.** Use the transparent mark on light
surfaces directly; on **dark / ink** surfaces, place it on a small **pink rounded tile**
(see the slide footers and business-card front) rather than recolouring or inverting it —
inverting the portrait reads as uncanny. Don't recolour the mark by hand.

---

## Index — what's in this system

**Foundations (root)**
- `styles.css` — the single entry point consumers link. `@import`s only.
- `tokens/` — `colors.css`, `typography.css`, `spacing.css`, `elevation.css` (radii,
  shadows, motion), `fonts.css` (Google Fonts), `base.css` (element defaults).

**Specimen cards (`guidelines/`)** — render in the Design System tab
- Colors: brand, aubergine scale, accents, neutrals, semantic.
- Type: display, heading & body scale, sans & mono detail.
- Spacing: scale, radii & elevation, rules & dividers.
- Brand: the mark, lockup, voice.

**Components (`components/`)** — React primitives (`window.HarambasicConsultingDesignSystem_26b27b`)
- `actions/` — **Button** (primary / secondary / ghost / honey)
- `data-display/` — **Badge**, **Tag**, **Avatar**
- `forms/` — **Input** (label, hint, error, textarea)
- `surfaces/` — **Card**, **Callout**

**UI kits (`ui_kits/`)** — self-contained, token-based recreations
- `proposal-doc/` — a printable, first-person **client proposal** (cover, letter, phases,
  deliverables, investment table, next-steps). Also a Starting Point.
- `brand-assets/` — **email signature, business card, profile avatar, letterhead**.

**Slides (`slides/`)**
- `index.html` — a 6-slide **pitch/proposal deck** (deck-stage shell, 1280×720).
- `slides.css` — shared slide visual system.
- `TitleSlide.html`, `StatementSlide.html`, `PhasesSlide.html`, `ClosingSlide.html` —
  standalone slide-type cards for the Design System tab.

**Skill**
- `SKILL.md` — makes this folder usable as an Agent Skill in Claude Code.

---

## Using this system

1. Link the one stylesheet: `<link rel="stylesheet" href="styles.css">`.
2. Reach for **semantic tokens** (`--text-body`, `--surface-card`, `--accent`) before raw
   scale values (`--aub-900`).
3. Headlines = Newsreader; body/UI = Hanken Grotesk; eyebrows/labels = IBM Plex Mono,
   uppercase, tracked.
4. Keep the portrait mark in the picture. Keep the voice first-person. Keep it warm.
