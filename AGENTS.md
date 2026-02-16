# AGENTS.md

Guidance for AI agents and contributors on HTML/CSS conventions in this repository.

## HTML/CSS conventions

- **CSS nesting:** Use one root per component or page block; nest all selectors under it. Do not use flat sibling blocks that logically belong to the same tree.
- **CSS nesting (extreme):** Every class and every element that can be nested must be on its own line. Never write concatenated selectors like `> li:first-child .archive-item` or `&:has(...) > li:last-child .archive-item`. Break them into separate nesting levels: `.entries` → `> li` → `&:first-child` → `.archive-item`, each in its own block.
- **CSS nesting (per-class):** When multiple classes share the same styles (e.g. `.item` and `.archive-item`), do not write two flat sibling rules that repeat the same declarations. Use one root block per class and nest all descendant selectors inside it (e.g. `.item { &:hover { .external-link { ... } } .external-link { ... } }` and `.archive-item { ... }` with the same structure). Duplication of values is acceptable; structure is one root per class with full nesting inside.

  **Avoid (concatenated selectors):**

  ```css
  .entries > li:first-child .archive-item {
  	border-top-left-radius: var(--border-radius);
  }
  .group.archive .entries:has(> :first-child:nth-last-child(3n)) > li:last-child .archive-item {
  	border-bottom-right-radius: var(--border-radius);
  }
  ```

  **Prefer (one selector part per block):**

  ```css
  .group {
  	.archive {
  		.entries {
  			&:has(> :first-child:nth-last-child(3n)) {
  				> li {
  					&:last-child {
  						.archive-item {
  							border-bottom-right-radius: var(--border-radius);
  						}
  					}
  				}
  			}
  			> li {
  				&:first-child {
  					.archive-item {
  						border-top-left-radius: var(--border-radius);
  					}
  				}
  			}
  		}
  	}
  }
  ```

  **Avoid (flat rules repeating same content):**

  ```css
  .item:hover .external-link {
  	color: var(--c-font);
  }
  .archive-item:hover .external-link {
  	color: var(--c-font);
  }
  ```

  **Prefer (everything nested under each class):**

  ```css
  .item {
  	&:hover {
  		.external-link {
  			color: var(--c-font);
  		}
  	}
  	.external-link {
  		display: flex;
  		/* ... */
  	}
  }
  .archive-item {
  	&:hover {
  		.external-link {
  			color: var(--c-font);
  		}
  	}
  	.external-link {
  		display: flex;
  		/* ... */
  	}
  }
  ```

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
