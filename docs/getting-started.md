# Getting started

[Documentation](README.md) / Getting started

## Install

Use the two archive URLs in the [root README](../README.md#install-the-library). They install packages named `@velessoft/ui` and `@velessoft/tokens` into your application. React and React DOM are peer dependencies; provide version 18 or newer. React 19 is the version exercised in this repository.

```tsx
import { Button } from '@velessoft/ui';
import '@velessoft/tokens/tokens.css';
import '@velessoft/ui/styles.css';
```

CSS imports need a bundler that supports them, such as Vite. Load tokens before component styles. JavaScript is ESM with TypeScript declarations; a CommonJS build is not provided. Components do not bundle a font. Set a readable application font yourself; the design catalog includes licensed local font files.

## Clone and run

```sh
npm ci
npm run dev
npm run check
```

The development address is printed in the terminal; the port may differ if 5173 is occupied. The root page is the React example, `/public/index.html` is the catalog.

## Build and consume locally

```sh
npm run pack
```

This creates `artifacts/velessoft-ui-0.1.0.tgz` and `artifacts/velessoft-tokens-0.1.0.tgz`. From another app, install both local archive paths with `npm install`.

## Troubleshooting

- **Missing colors:** import token CSS and check theme scope.
- **Dark modal uses light colors:** put `data-theme` on an ancestor of the dialog, preferably the application root.
- **Package name not found in npm:** use the archive URLs; registry publication is pending.
- **No dialog:** use a modern browser supporting `HTMLDialogElement.showModal()`.
- **Demo data disappeared:** the React example intentionally uses in-memory state.
