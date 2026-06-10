A labeled text field with hint and error states — the building block for every form.

```jsx
<Input label="Your name" placeholder="Jane Founder" required />
<Input label="Work email" type="email" hint="I reply within a day." />
<Input label="What are you trying to fix?" multiline />
<Input label="Budget" error="Please enter a number." />
```

Pass `multiline` for a textarea. `required` adds a clay asterisk; `error` (any truthy node) switches to the error style and shows the message in place of `hint`. Focus shows a honey ring. Spreads native input/textarea props (`type`, `value`, `onChange`, …).
