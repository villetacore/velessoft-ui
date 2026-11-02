# @villetacore/velessoft-tokens

Design tokens for **Velessoft UI** by **villetacore**. Version 0.2.0. MIT © 2026 villetacore.

| Import | Contents |
| --- | --- |
| `@villetacore/velessoft-tokens/tokens.css` | CSS variables (`--vs-*`): colors for light/dark/auto themes, spacing, type, radius, motion, density |
| `@villetacore/velessoft-tokens/tokens.scss` | `$vs-*` SCSS variables mapped to the CSS variables |
| `@villetacore/velessoft-tokens` | JS object with types + `cssVar(name)` |
| `@villetacore/velessoft-tokens/tokens.json` | Raw source |
| `@villetacore/velessoft-tokens/tailwind.css` | Tailwind v4 `@theme` (`bg-vs-surface`, `text-vs-muted`…) |
| `@villetacore/velessoft-tokens/tailwind-preset` | Tailwind v3 preset (ESM and CJS) |

```css
@import '@villetacore/velessoft-tokens/tokens.css';
```

Set `data-theme="dark"`, `"light"` or `"auto"` on any element to theme its subtree.
