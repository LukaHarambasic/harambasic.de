Primary action element — a pill button; use for the single most important action in a view.

```jsx
<Button variant="primary" size="md" onClick={start}>
  Book a call
</Button>

<Button variant="secondary" iconRight={<ArrowIcon />}>
  See how I work
</Button>

<Button variant="honey">Start a project</Button>
<Button variant="ghost" size="sm">Maybe later</Button>
```

Variants: `primary` (aubergine fill, pink type — the default CTA), `secondary` (ink outline), `ghost` (quiet, for low-priority actions), `honey` (warm emphasis, use rarely). Sizes: `sm` / `md` / `lg`. Pass `as="a"` with `href` to render a link that looks like a button. `iconLeft` / `iconRight` accept inline SVGs (sized to 1.1em automatically). One primary per view; pair it with a secondary or ghost, never two primaries.
