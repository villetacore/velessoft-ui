# Theming

[Documentation](README.md) / Theming

| Role | Light | Dark |
| --- | --- | --- |
| Background | `#F7F8F5` | `#171B24` |
| Surface | `#FFFFFF` | `#222834` |
| Text | `#171B24` | `#F7F8F5` |
| Primary | `#B8EF65` | `#B8EF65` |
| Link / focus | `#5845B8` | `#B6AAFF` |

Source: [tokens.json](../packages/tokens/tokens.json). Run `npm run tokens` after editing; commit generated token CSS with the source. The current generator exports theme color roles, not all spacing/type metadata.

```css
.my-app {
  background: var(--vs-bg);
  color: var(--vs-text);
  font: 14px/1.5 system-ui, sans-serif;
}
```

Components use `--vs-bg`, `--vs-surface`, `--vs-text`, `--vs-muted`, `--vs-border`, `--vs-primary`, `--vs-on-primary`, `--vs-link`, `--vs-error` and `--vs-success`. Violet decorative accents remain fixed in this version.

Use `[data-theme="dark"]` on the app root. The stylesheet defaults to light. An inner `data-theme="light"` does not reset a dark ancestor in this version; use separate sibling theme roots when comparing themes.

## Density and identity

Desktop controls: minimum 34px. Coarse pointers: minimum 44px and editable text 16px. Application text should remain readable; do not shrink text to solve layout issues. Sharp corners and small violet shadows carry the punk character; decorative rotation belongs on marketing graphics.

The design catalog has its own legacy styles and is not a drop-in component stylesheet. Use package CSS in applications.
