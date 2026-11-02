# Changelog

## 0.2.0

### Multi-framework packages

- **New `@villetacore/velessoft-css`**: all components as framework-agnostic `vs-*` classes, split per component group, plus minified and tokens-included bundles for CDN use.
- **New `@villetacore/velessoft-elements`**: dependency-free, SSR-safe Web Components (`vs-tabs`, `vs-dialog`, `vs-menu`, `vs-tooltip`, `vs-toaster`, `vs-pagination`, `vs-theme-toggle`) for Vue, Svelte, Angular, Solid, Astro and plain HTML.
- **Tokens**: new `surfaceMuted`, `accent`, `info`, `overlay` colors; spacing, type, radius, motion and density exported as CSS variables; new SCSS, JS/JSON with types, Tailwind v3 preset and v4 theme outputs; `data-theme="light"` now resets inside dark; `data-theme="auto"` follows the OS.

### React

- 28 new components: IconButton, ButtonGroup, Switch, RadioGroup, Slider, Tag, Spinner, Progress, Skeleton, ToastProvider/useToast, Drawer, Tooltip, Menu, Tabs, SegmentedControl, Breadcrumbs, Pagination, Card, Table, Accordion, Avatar, AvatarGroup, Stat, EmptyState, Kbd, Divider, Stack, Grid.
- Button: `ghost` variant, `size`, `block`, `loadingText`; loading shows a spinner instead of replacing the label.
- Input: `startAddon` / `endAddon`. Alert: `warning` tone, optional title, `actions`. Badge: `info`/`warning` tones, `solid` variant, `dot`. Dialog: `footer`, `size`, `closeLabel`, `closeOnBackdrop`.
- `VelessoftProvider` with `ru` (default) and `en` messages replaces hard-coded labels.
- Source split into modules with `"use client"` for Next.js; ESM output uses explicit `.js` imports so it loads in plain Node.

### Tooling

- Releases publish to npmjs.org and GitHub Packages (manual re-run via workflow dispatch). Release scripts handle all four packages; `npm run verify:packages` installs packed archives into a clean consumer. CI runs on Node 22 and 24. GitHub Pages workflow deploys the demo.
- New `examples/html` page built only with CSS + Web Components.

## 0.1.0

Initial experimental React library, theme tokens, offline design catalog, application example, interaction tests and CI.

### Documentation and distribution

Branded bilingual README, actual browser screenshots, component reference, recipes, theme guidance, release instructions, issue templates and installable GitHub package archives.
