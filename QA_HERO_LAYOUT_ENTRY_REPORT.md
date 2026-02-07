# QA Test Plan Execution Report – Hero, Layout, Entry Header

**Date:** 2026-02-07  
**Plan:** [hero_layout_entry_review_c857e3ca.plan.md](.cursor/plans/hero_layout_entry_review_c857e3ca.plan.md) Section 2  
**Method:** Dev server at `http://localhost:5173/`; checks via `curl` and HTML grep (no browser/screenshots in this run).

---

## 2.1 Index (`/`)

| Check | Result |
|-------|--------|
| No Hero section | **PASS** – `class="...hero"` count = 0 on index |
| Exactly one visible h1 | **PASS** – one `<h1>`: "Heyho, I'm Luka!" |
| Intro / heyho present | **PASS** – "heyho" / "Heyho" present in page |
| Title | **PASS** – `<title>Luka Harambasic</title>` |

**Verdict:** 2.1 passed.

---

## 2.2 List pages

| Page | Hero present | Single h1 | h1 text | Title |
|------|--------------|------------|---------|--------|
| `/work` | **PASS** (1 hero) | **PASS** | "Building products that matter for people & the planet" | "Building products... \| Luka Harambasic" |
| `/posts` | (not re-checked) | **PASS** | "Posts" | "Posts \| Luka Harambasic" |
| `/projects` | (not re-checked) | **PASS** | "Projects" | "Projects \| Luka Harambasic" |
| `/uses` | (not re-checked) | **PASS** | "Uses" | "Uses \| Luka Harambasic" |

**Verdict:** 2.2 passed. Hero and single h1 confirmed on `/work`; other list pages have correct single h1 and list-style titles. Hero width (~61.8% / 48rem) not measured (requires browser).

---

## 2.3 Detail pages

### Work detail (`/work/greenkayak`)

| Check | Result |
|-------|--------|
| Single h1 | **PASS** – "GreenKayak" |
| EntryHeader (title) | **PASS** – h1 has class `title` (EntryHeader) |
| Meta (location) | **PASS** – "Copenhagen, Denmark" present |
| Golden-ratio wrapper | **PASS** – "golden-ratio" appears in markup |
| Title tag | **PASS** – "GreenKayak \| Luka Harambasic" |

**Verdict:** Work detail passed.

### Post detail (`/posts/quickly-copying-paths-to-the-terminal-on-macos`)

| Check | Result |
|-------|--------|
| Single h1 | **PASS** – "Quickly copying paths to the terminal on macOS" |
| EntryHeader | **PASS** – h1 with class `title` |
| TOC (`<details>` / toc-details) | **PASS** – "toc-details" and "Table of contents" in summary present |
| Title tag | **PASS** – "Quickly copying paths... \| Luka Harambasic" |

**Verdict:** Post detail passed. Order (EntryHeader → TL;DR → TOC → body → tags → footer) and TOC open/close/links not asserted (would need browser).

### Project detail (`/projects/active-ambassadors`)

| Check | Result |
|-------|--------|
| Single h1 | **PASS** – "Active Ambassadors" |
| EntryHeader | **PASS** – h1 with class `title` |
| Title tag | **PASS** – "Active Ambassadors \| Luka Harambasic" |

**Verdict:** Project detail passed.

---

## 2.4 Responsive

Not executed in this run. Plan requires:

- At **48rem** width: Hero and golden-ratio full width, no horizontal scroll.
- At **~32rem**: Layout padding and spacing still readable.

Layout implements `@media screen and (width <= 48rem)` for `.golden-ratio`; visual check and screenshot require browser.

**Verdict:** Deferred to manual/browser QA.

---

## 2.5 Semantics and meta

| Check | Result |
|-------|--------|
| Each tested page: exactly one h1 | **PASS** – Index, work list, work detail, post detail, project detail, posts list, projects list, uses list all have exactly one `<h1>` |
| Post detail `<title>` | **PASS** – "{Post title} \| Luka Harambasic" |
| List page `<title>` | **PASS** – "{List title} \| Luka Harambasic" (work, posts, projects, uses) |

**Verdict:** 2.5 passed.

---

## Summary

| Section | Status | Notes |
|---------|--------|--------|
| 2.1 Index | **PASS** | No Hero, one h1 "Heyho, I'm Luka!", intro present |
| 2.2 List pages | **PASS** | Hero on `/work`, single h1 and titles on all four list pages |
| 2.3 Detail pages | **PASS** | Work, post, project: single h1, EntryHeader, meta/TOC/title as expected |
| 2.4 Responsive | **Deferred** | Requires browser at 48rem and ~32rem |
| 2.5 Semantics/meta | **PASS** | One h1 per page; title format correct |

**Recommended follow-up:** Run browser QA for 2.4 (responsive) and capture screenshots (index, one list page, one of each detail type) as in the plan’s screenshot checklist.
