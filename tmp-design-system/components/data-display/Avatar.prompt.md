The human face of the brand — use the portrait mark wherever a person is represented.

```jsx
<Avatar src="assets/logo-mark-transparent.png" name="Harambasic" size="lg" />
<Avatar name="Luka Harambasic" />            {/* initials fallback */}
<Avatar src={photo} shape="circle" ring />
```

Sizes: `xs` 28 · `sm` 36 · `md` 48 · `lg` 64 · `xl` 96. Shapes: `squircle` (default, echoes the logo card) or `circle`. `ring` adds a honey accent ring. With no `src`, renders initials from `name` on aubergine.
