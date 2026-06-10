Monospaced uppercase category chip — for taxonomies, capability tags, and filters.

```jsx
<Tag>Automation</Tag>
<Tag variant="solid">Internal tooling</Tag>
<Tag variant="honey">Product</Tag>
<Tag onRemove={() => drop(id)}>Removable</Tag>
```

Variants: `outline` (default), `solid` (soft fill), `honey` (warm). Pass `onRemove` to show a removable "×". Tags read as metadata — for live status use `Badge` instead.
