# Theming

[Documentation](README.md) / Theming

| Role | Token | Light | Dark |
| --- | --- | --- | --- |
| Background | `--vs-bg` | `#F7F8F5` | `#171B24` |
| Surface | `--vs-surface` | `#FFFFFF` | `#222834` |
| Muted surface | `--vs-surface-muted` | `#EEF0EA` | `#2B3240` |
| Text | `--vs-text` | `#171B24` | `#F7F8F5` |
| Muted text | `--vs-muted` | `#545C6B` | `#B8C0CD` |
| Primary | `--vs-primary` | `#B8EF65` | `#B8EF65` |
| Accent | `--vs-accent` | `#8B7CF6` | `#8B7CF6` |
| Link / focus | `--vs-link` | `#5845B8` | `#B6AAFF` |
| Status | `--vs-success`, `--vs-warning`, `--vs-error`, `--vs-info` | | |

Scale tokens: `--vs-space-1…9` (4–96px), `--vs-font-family`, `--vs-font-mono`, `--vs-font-size-*`, `--vs-radius-*`, `--vs-motion-fast|normal`, `--vs-control-height` (36px, 44px on coarse pointers), `--vs-panel-padding`, `--vs-gap`.

Source: [tokens.json](../packages/tokens/tokens.json). Run `npm run tokens` after editing; it regenerates CSS, SCSS, JS, type declarations and Tailwind files. Commit generated files with the source.

## Theme scope

- `data-theme="dark"` / `data-theme="light"` on any element themes its subtree. Nested light inside dark works.
- `data-theme="auto"` follows the OS `prefers-color-scheme`.
- Without an attribute the theme is light.
- `<vs-theme-toggle>` or `setTheme('dark')` from `@villetacore/velessoft-elements` switch `<html>` and remember the choice.

## Customizing

Override tokens on any scope; components read them at runtime:

```css
:root {
  --vs-primary: #ffd84d;
  --vs-accent: #ff5d8f;
  --vs-radius-control: 4px;
  --vs-font-family: "Inter", system-ui, sans-serif;
}
.compact-area { --vs-control-height: 28px; }
```

## Density and identity

Desktop controls: minimum 36px. Coarse pointers: minimum 44px and editable text 16px. Do not shrink text to solve layout issues. Controls and cards use 2px corners. Lime primary actions, violet focus/selection and restrained monospace labels retain the studio identity. Primary buttons have a 2px violet offset shadow; other controls remain flat. See [Open Workshop principles](../design/principles.md) for the visual grammar.

The design catalog has its own legacy styles and is not a drop-in component stylesheet. Use package CSS in applications.

## 0.4 design update

`--vs-border-subtle` separates cards and decorative surfaces; form controls keep the stronger `--vs-border`. Keep important boundaries and focus indicators visible. The default Grid now constrains its minimum column width to the available container, preventing a 280px column from overflowing smaller screens.

## Glass and motion (0.4)

Use glass sparingly for floating headers, overview panels and dialogs. Keep dense tables, editor canvases and forms on solid surfaces. The lime/violet accents remain action and focus colors; glass is a surface material.

```tsx
import { GlassPanel } from '@villetacore/velessoft-ui';

<div data-material="glass" data-motion="normal">
  <GlassPanel animate aria-label="Project overview">Overview</GlassPanel>
</div>
```

`GlassPanel` accepts standard div attributes and a forwarded ref. `animate` defaults to false; when enabled it plays a short entrance on mount. In other frameworks use `.vs-glass-panel` and optionally `.vs-reveal` with the shared stylesheet. `.vs-glass` adds the material without panel padding.

Set `data-material="solid"` on an ancestor to remove blur/transparency from glass panels and dialogs. Set `data-motion="reduced"` to disable the new surface, tab and menu animations and control transitions. Apply preferences to a common ancestor of overlays too. System `prefers-reduced-motion`, `prefers-reduced-transparency` and forced colors take precedence. Without backdrop-filter support, surfaces are opaque.

Customize `--vs-glass-bg`, `--vs-glass-border`, `--vs-glass-highlight`, `--vs-glass-shadow`, `--vs-glass-blur` (18px), `--vs-motion-fast`, `--vs-motion-normal`, `--vs-motion-slow` (280ms) and `--vs-motion-ease`. Avoid animating blur or large backgrounds: use short opacity/transform transitions. Test contrast against the actual content behind translucent panels.

The dashboard includes independent Glass and Animations toggles. These are demonstration preferences held in memory.
