# Component reference

[Documentation](README.md) / Components

All components are named exports from `@velessoft/ui`. Native props, event handlers and `className` are forwarded except where stated. Field refs are forwarded. Use visible labels and meaningful action text.

| Component | Extra props | Defaults |
| --- | --- | --- |
| Button | `variant?: 'primary' \| 'secondary' \| 'danger'`, `loading?: boolean` | secondary, false, native type=button |
| Input | `label: string`, `hint?: string`, `error?: string` | Native input defaults |
| Textarea | `label`, `hint`, `error` | Native textarea; pass rows as needed |
| Select | `label`, `hint`, `error`, native option children | Native single select |
| Checkbox | `label: string` | Native checkbox |
| Badge | `tone?: 'neutral' \| 'success' \| 'error'` | neutral |
| Alert | `title: string`, `tone?: 'info' \| 'error' \| 'success'` | info |
| Dialog | `open: boolean`, `onClose: () => void`, `title: string`, `children` | Controlled open state |

## Actions and feedback

```tsx
<Button variant="primary" onClick={save}>Save</Button>
<Button variant="danger" onClick={requestDelete}>Delete project</Button>
<Button loading>Save</Button>
<Badge tone="success">Published</Badge>
<Alert title="Saved" tone="success">Your changes are available.</Alert>
```

Loading disables repeated activation and sets `aria-busy`. The current loading label is Russian (`Сохранение…`); localization is planned. Badge is display-only. Alert uses `role="alert"` for errors and `role="status"` otherwise. Only announce messages when their content changes meaningfully.

## Fields

```tsx
<Input label="Email" type="email" required hint="Used for project updates" />
<Textarea label="Description" rows={4} />
<Select label="Visibility" defaultValue="private">
  <option value="private">Private</option>
  <option value="public">Public</option>
</Select>
<Checkbox label="Open source" defaultChecked />
```

The generated ID connects label, hint and error. Caller-provided `aria-describedby` is preserved. An error sets `aria-invalid`; consumers own validation logic and timing. Required fields show an asterisk. Checkbox label wraps the native control; native checked/onChange props support controlled usage.

## Dialog

Use the [controlled modal recipe](recipes.md). `onClose` is a request: the consumer must set `open=false`. Escape and the close button request closing. Native modal behavior provides focus containment; previous focus is restored on close. Backdrop clicks do not dismiss. Nested dialogs and custom portals are not currently supported. The close button label is Russian in this experimental version.

## Keyboard

Buttons use Enter/Space; fields and selects use native keyboard interaction. Tab navigation follows DOM order. Dialog relies on browser modal behavior; validate with keyboard and assistive technology in your product.
