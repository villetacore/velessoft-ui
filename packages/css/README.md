# @villetacore/velessoft-css

Framework-agnostic component styles for **Velessoft UI** by **villetacore**: buttons, fields, switches, sliders, alerts, badges, tags, progress, skeletons, toasts, dialogs, drawers, menus, tooltips, tabs, segmented controls, breadcrumbs, pagination, cards, tables, accordion, avatars, stats and layout helpers — all as `vs-*` classes. ~5 kB gzip.

Version 0.2.0. MIT © 2026 villetacore.

```html
<!-- CDN, tokens included -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@villetacore/velessoft-css@0.2/dist/velessoft.full.min.css">
```

```js
// bundler
import '@villetacore/velessoft-tokens/tokens.css';
import '@villetacore/velessoft-css';                     // all components
import '@villetacore/velessoft-css/components/form.css'; // or a single group
```

```html
<button class="vs-button vs-primary">Save</button>
<div class="vs-field">
  <label for="email">Email</label>
  <input id="email" class="vs-input" type="email" aria-describedby="email-hint">
  <small id="email-hint">We never share it.</small>
</div>
```

Add interactivity (tabs, dialog, menu, tooltip, toasts, pagination) with `@villetacore/velessoft-elements`. [Framework guide](https://github.com/villetacore/velessoft-ui/blob/main/docs/frameworks.md)
