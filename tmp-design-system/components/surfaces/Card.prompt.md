The primary container surface — wraps most content blocks.

```jsx
<Card surface="default" padding="lg">
  <h3>Where I start</h3>
  <p>Two workflows, one prototype, a plan you own.</p>
</Card>

<Card surface="ink" grain padding="lg">…</Card>
<Card surface="pink" interactive>…</Card>
<Card surface="outline" padding="sm">…</Card>
```

Surfaces: `default` (white + hairline + soft shadow), `pink` (rose ground), `paper` (warm white), `ink` (aubergine, light type), `outline` (no fill). Padding `sm/md/lg`. `raised` deepens the shadow; `interactive` lifts on hover; `grain` overlays the paper texture. Compose other primitives inside — don't nest a Card directly in a Card.
