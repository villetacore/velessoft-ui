<p align="center"><img src="docs/images/banner.svg" alt="Velessoft UI — compact interfaces, open code, sharp edges" width="100%"></p>

<p align="center">
<a href="https://github.com/villetacore/velessoft-ui/actions/workflows/ci.yml"><img src="https://github.com/villetacore/velessoft-ui/actions/workflows/ci.yml/badge.svg" alt="CI"></a>
<a href="https://www.npmjs.com/package/@villetacore/velessoft-ui"><img src="https://img.shields.io/npm/v/@villetacore/velessoft-ui?style=flat-square&labelColor=171B24&color=B8EF65" alt="npm"></a>
<a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-B8EF65?style=flat-square&labelColor=171B24" alt="MIT license"></a>
<img src="https://img.shields.io/badge/status-experimental-8B7CF6?style=flat-square&labelColor=171B24" alt="Experimental">
</p>

<p align="center"><a href="https://villetacore.github.io/velessoft-ui/">Live demo</a> · <a href="docs/README.md">Documentation</a> · <a href="docs/getting-started.md">Quick start</a> · <a href="docs/components.md">Components</a> · <a href="docs/frameworks.md">Frameworks</a> · <a href="README.ru.md">Русский</a></p>

**A compact design system and component library by [villetacore](https://github.com/villetacore) that works in any stack.** Lime, violet and graphite. Sharp geometry, readable working surfaces, native controls.

![Dark workspace built with Velessoft UI](docs/images/dashboard-dark.jpg)

## Packages

| Package | Use it for |
| --- | --- |
| [`@villetacore/velessoft-ui`](packages/ui) | **React 18+** — 35+ typed, accessible components. Works with Next.js (App Router), Remix, Vite. |
| [`@villetacore/velessoft-elements`](packages/elements) | **Web Components** for interactive parts (tabs, dialog, menu, tooltip, toasts, pagination, theme toggle). Works in **Vue, Svelte, Angular, Solid, Astro, Lit, htmx and plain HTML**. No dependencies. |
| [`@villetacore/velessoft-css`](packages/css) | **Framework-agnostic CSS** — every component as `vs-*` classes. ~5 kB gzip. CDN-ready. |
| [`@villetacore/velessoft-tokens`](packages/tokens) | **Design tokens** — CSS variables, SCSS, JSON/JS with types, Tailwind v3 preset and Tailwind v4 theme. |

## Install

```sh
# React
npm install @villetacore/velessoft-ui @villetacore/velessoft-tokens

# Vue / Svelte / Angular / Solid / HTML
npm install @villetacore/velessoft-css @villetacore/velessoft-tokens @villetacore/velessoft-elements
```

> **Registries:** releases publish to [npmjs.org](https://www.npmjs.com/org/villetacore) and to [GitHub Packages](https://github.com/villetacore?tab=packages&repo_name=velessoft-ui). Use npmjs.org for normal installs; GitHub Packages needs an `.npmrc` with a token — see [releasing](docs/releasing.md#github-packages).

### React

```tsx
import { Button, Input, ToastProvider, useToast } from '@villetacore/velessoft-ui';
import '@villetacore/velessoft-tokens/tokens.css';
import '@villetacore/velessoft-ui/styles.css';

export function ProjectForm() {
  return (
    <form onSubmit={(event) => event.preventDefault()}>
      <Input label="Project name" name="name" required />
      <Button type="submit" variant="primary">Create project</Button>
    </form>
  );
}
```

### Any framework or plain HTML (no build step)

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@villetacore/velessoft-css@0.2/dist/velessoft.full.min.css">
<script type="module" src="https://cdn.jsdelivr.net/npm/@villetacore/velessoft-elements@0.2/dist/index.js"></script>

<body class="vs-root" data-theme="dark">
  <button class="vs-button vs-primary">Create project</button>
  <vs-tooltip text="Copy link"><button class="vs-button" aria-label="Copy">⧉</button></vs-tooltip>
</body>
```

Vue, Svelte, Angular, Solid, Astro and Tailwind setup: **[framework guide →](docs/frameworks.md)**

## Components

| Group | React components | CSS classes / Web Components |
| --- | --- | --- |
| **Actions** | Button, IconButton, ButtonGroup | `vs-button`, `vs-icon-button`, `vs-button-group` |
| **Forms** | Input (with addons), Textarea, Select, Checkbox, Switch, RadioGroup, Slider | `vs-field`, `vs-input`, `vs-input-group`, `vs-checkbox`, `vs-switch`, `vs-radio`, `vs-slider` |
| **Feedback** | Alert, Badge, Tag, Spinner, Progress, Skeleton, ToastProvider + useToast | `vs-alert`, `vs-badge`, `vs-tag`, `vs-spinner`, `vs-progress`, `vs-skeleton`, `<vs-toaster>` |
| **Overlays** | Dialog, Drawer, Tooltip, Menu | `<vs-dialog>`, `vs-drawer`, `<vs-tooltip>`, `<vs-menu>`, `vs-popover` |
| **Navigation** | Tabs, SegmentedControl, Breadcrumbs, Pagination | `<vs-tabs>`, `vs-segmented`, `vs-breadcrumbs`, `<vs-pagination>`, `vs-nav-list` |
| **Display** | Card, Table (sortable), Accordion, Avatar, AvatarGroup, Stat, EmptyState, Kbd, Divider | `vs-card`, `vs-table`, `vs-accordion`, `vs-avatar`, `vs-stat`, `vs-empty-state`, `vs-kbd`, `vs-divider` |
| **Layout** | Stack, Grid | `vs-stack`, `vs-grid`, `vs-root` |
| **Theming** | VelessoftProvider (localized labels, `ru`/`en`) | `<vs-theme-toggle>`, `data-theme="light \| dark \| auto"` |

Controls start at 34px on desktop and 44px on coarse pointers. Everything uses `--vs-*` tokens. [API reference →](docs/components.md)

## Explore locally

Use **Node.js 22.12+**, 24 or 26.

```sh
git clone https://github.com/villetacore/velessoft-ui.git
cd velessoft-ui
npm ci
npm run dev
```

The root page is the React workspace; `/examples/html/` is the same system with only CSS + Web Components; `/public/` is the offline design catalog.

```sh
npm run check            # TypeScript, interaction tests, package + demo builds
npm run verify:packages  # pack all packages and import them from a clean consumer
npm run pack             # installable archives in artifacts/
```

## One system, two themes

| Light workspace | Dialog validation |
| --- | --- |
| ![Light workspace](docs/images/dashboard-light.jpg) | ![Dialog showing a field error](docs/images/dialog-validation.jpg) |

[View the full gallery →](docs/gallery.md)

## Repository map

```text
packages/ui/          React components (TypeScript, ESM, "use client")
packages/elements/    Web Components (no dependencies, light DOM)
packages/css/         Framework-agnostic component CSS
packages/tokens/      Token source + generated CSS / SCSS / JS / Tailwind
examples/dashboard/   React example
examples/html/        CSS + Web Components example
apps/docs/public/     Offline design catalog
docs/                 Guides, recipes and screenshots
```

## Contribute

Start with [CONTRIBUTING](CONTRIBUTING.md). Keep changes small, document behavior and include screenshots for visual work. [Roadmap](docs/roadmap.md) · [Changelog](CHANGELOG.md) · [Report an issue](https://github.com/villetacore/velessoft-ui/issues).

## License

MIT © 2026 **villetacore (Виллета Корь)**. Fonts and icons retain their original licenses; see [third-party notices](THIRD_PARTY_NOTICES.md). Early generated branding images are reference concepts. No trademark rights are granted by the code license.

## Next version: 0.3.0

Five additional React components are available in source: **SearchInput, PasswordInput, CopyButton, Stepper, DescriptionList**. See [API and usage](docs/components.md#workflow-components-030) and [screenshot](docs/images/components-030.jpg). This version is prepared in source; registry publication requires a release.
