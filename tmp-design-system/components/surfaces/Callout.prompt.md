A noted block for asides, tips, and warnings — icon chip plus a title on a soft tinted surface.

```jsx
<Callout variant="honey" icon={<BulbIcon />} title="A quick note">
  I scope every project before I quote it — no surprises later.
</Callout>

<Callout variant="warning" icon={<AlertIcon />} title="Heads up">…</Callout>
```

Variants: `note` (default, mauve wash), `honey`, `success`, `warning`, `danger`. Pass an inline SVG as `icon` (sits in a circular chip) and a short `title`. Uses a tinted surface, never a colored left-border accent.
