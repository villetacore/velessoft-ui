# Recipes

[Documentation](README.md) / Recipes

## Controlled form with validation

```tsx
import { useState } from 'react';
import { Alert, Button, Input } from '@villetacore/velessoft-ui';

export function ProjectForm() {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  return (
    <form onSubmit={(event) => {
      event.preventDefault();
      if (!name.trim()) {
        setError('Enter a project name.');
        return;
      }
      setError('');
      setSaved(true); // Local example; call your API in a real app.
    }}>
      <Input label="Project name" value={name} error={error}
        onChange={(event) => {
          setName(event.target.value);
          setError('');
          setSaved(false);
        }} />
      <Button type="submit" variant="primary">Create project</Button>
      {saved && <Alert title="Created" tone="success">{name}</Alert>}
    </form>
  );
}
```

For network submission, use loading state, catch errors, preserve input and only show success after the server confirms. Validate again on the server.

## Controlled modal

```tsx
import { useState } from 'react';
import { Button, Dialog } from '@villetacore/velessoft-ui';

export function Details() {
  const [open, setOpen] = useState(false);
  return <>
    <Button onClick={() => setOpen(true)}>Open details</Button>
    <Dialog open={open} onClose={() => setOpen(false)} title="Project details">
      <p>A short focused task belongs in a dialog.</p>
      <Button onClick={() => setOpen(false)}>Done</Button>
    </Dialog>
  </>;
}
```

## Theme switch

```tsx
import { useState } from 'react';
import { Button } from '@villetacore/velessoft-ui';

export function ThemeExample() {
  const [dark, setDark] = useState(false);
  return <div data-theme={dark ? 'dark' : 'light'}
    style={{ background: 'var(--vs-bg)', color: 'var(--vs-text)', padding: 24 }}>
    <Button onClick={() => setDark(!dark)} aria-pressed={dark}>
      Dark theme
    </Button>
  </div>;
}
```

The runnable [dashboard source](../examples/dashboard/main.tsx) combines search, creation, validation and theme switching. The catalog adds a separate local-storage CRUD example.
