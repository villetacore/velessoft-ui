# @villetacore/velessoft-elements

Dependency-free Web Components for **Velessoft UI** by **villetacore**. Light DOM (no Shadow DOM), so they style with `@villetacore/velessoft-css` and work inside **Vue, Svelte, Angular, Solid, Astro, Lit, htmx** and plain HTML. Safe to import during server rendering.

Version 0.2.0. MIT © 2026 villetacore.

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@villetacore/velessoft-elements@0.2/dist/index.js"></script>
```

```js
import '@villetacore/velessoft-elements';              // registers all elements
import { toast, setTheme } from '@villetacore/velessoft-elements';
import '@villetacore/velessoft-elements/tabs';         // or one element
```

| Element | Purpose | Events |
| --- | --- | --- |
| `<vs-tabs>` | Keyboard-accessible tabs over your tablist/panels | `vs-change` |
| `<vs-dialog>` | Controls a native modal `<dialog>` via `open` | `vs-open`, `vs-close` (cancelable) |
| `<vs-menu>` | Menu button with arrow-key navigation | `vs-select` |
| `<vs-tooltip>` | Hover/focus tooltip with `aria-describedby` | — |
| `<vs-toaster>` | Toast stack; `show()` or `toast()` | — |
| `<vs-pagination>` | Generated page buttons with ellipses | `vs-change` |
| `<vs-theme-toggle>` | Light/dark switch remembered in localStorage | `vs-change` |

```html
<vs-tabs>
  <div role="tablist" aria-label="Settings"><button>Profile</button><button>Billing</button></div>
  <div role="tabpanel">…</div><div role="tabpanel">…</div>
</vs-tabs>
```

[Framework guide and full API](https://github.com/villetacore/velessoft-ui/blob/main/docs/frameworks.md)
