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

Scale tokens: `--vs-space-1…9` (4–96px), `--vs-font-family`, `--vs-font-mono`, `--vs-font-size-*`, `--vs-radius-*`, `--vs-motion-fast|normal`, `--vs-control-height` (34px, 44px on coarse pointers), `--vs-panel-padding`, `--vs-gap`.

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

Desktop controls: minimum 34px. Coarse pointers: minimum 44px and editable text 16px. Do not shrink text to solve layout issues. Sharp corners and small violet shadows carry the punk character; decorative rotation belongs on marketing graphics.

The design catalog has its own legacy styles and is not a drop-in component stylesheet. Use package CSS in applications.
