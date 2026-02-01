# AGENTS.md

Guidance for AI agents and contributors on HTML/CSS conventions in this repository.

## HTML/CSS conventions

- **CSS nesting:** Use one root per component or page block; nest all selectors under it. Do not use flat sibling blocks that logically belong to the same tree.
- **Class names:** Use short names that do not repeat the parent. Prefer `.card > .header > .title` (DOM and nesting) over `.card-header`, `.card-title`.
- **DOM flatness:** Keep the DOM as flat as possible; avoid extra `div`s or classes used only for “structure” when layout can be achieved with CSS (flex/grid on the parent).
- **Component scope:** Components contain only the minimum styles needed to work generically; usage-specific styles live at the usage site (page/layout).
- **Reusability:** Prefer generic, reusable patterns in components; avoid one-off variants in the component when they can live at the usage site.

## :global

- Use `:global` only when necessary: e.g. rich text (markdown/HTML content) or overriding external library components.
- When `:global` is used, always scope it under a component-owned class so styles do not bleed into the rest of the app. Wrap the target in a component-scoped root and put the wrapper class inside the global selector (Svelte requires `:global` at the start or end of a selector):

  ```css
  .component-root {
  }
  :global(.component-root .child) {
  	/* styles */
  }
  ```

## Reference

A good example of these conventions is [src/lib/components/Entries/EntriesFilter.svelte](src/lib/components/Entries/EntriesFilter.svelte): it uses a scoped wrapper (`.entries-filter`) and `:global(.entries-filter .filter)` for the card, with nested structure (`.selects` → `.wrapper` → `label`, `select`), short class names, and semantic elements.

## Anti-patterns

- **Avoid:** Long repeated names in DOM and flat CSS at the same level, e.g. `div.card > div.card-header > div.card-header-title` with separate `.card {}`, `.card-header {}`, `.card-header-title {}` blocks.
- **Prefer:** Short names and nesting:

  ```html
  <div class="card">
  	<div class="header">
  		<div class="title">...</div>
  	</div>
  </div>
  ```

  ```css
  .card {
  	.header {
  		.title {
  			/* styles */
  		}
  	}
  }
  ```
