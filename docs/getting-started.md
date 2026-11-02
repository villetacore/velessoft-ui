# Getting started

[Documentation](README.md) / Getting started

## Pick your packages

| You use | Install |
| --- | --- |
| React / Next.js / Remix | `@villetacore/velessoft-ui` + `@villetacore/velessoft-tokens` |
| Vue, Svelte, Angular, Solid, Astro, HTML | `@villetacore/velessoft-css` + `@villetacore/velessoft-tokens` + `@villetacore/velessoft-elements` |
| Only colors/spacing (e.g. with Tailwind) | `@villetacore/velessoft-tokens` |

React and React DOM 18+ are peer dependencies of the React package. JavaScript is ESM with TypeScript declarations.

## React

```tsx
import { Button } from '@villetacore/velessoft-ui';
import '@villetacore/velessoft-tokens/tokens.css';
import '@villetacore/velessoft-ui/styles.css';
```

Load tokens before component styles, or use `@villetacore/velessoft-ui/full.css` which contains both. Add `className="vs-root"` to your app root for the base font, colors and box sizing. Components do not bundle a font; the token `--vs-font-family` prefers Manrope and falls back to the system UI font.

## Other frameworks

See the [framework guide](frameworks.md) for Vue, Svelte, Angular, Solid, Astro, Tailwind and CDN setup.

## Clone and run

```sh
npm ci
npm run dev
npm run check
```

The root page is the React example, `/examples/html/` is the CSS + Web Components example, `/public/index.html` is the design catalog.

## Build and consume locally

```sh
npm run pack
```

Creates four archives in `artifacts/` (`villetacore-velessoft-{tokens,css,elements,ui}-0.2.0.tgz`). From another app, `npm install` the archive paths. `npm run verify:packages` does exactly that in a temporary project.

## Troubleshooting

- **Missing colors:** import token CSS (or `full.css`) and check theme scope.
- **Dark modal uses light colors:** put `data-theme` on an ancestor of the dialog, preferably `<html>`.
- **`<vs-*>` elements do nothing:** import `@villetacore/velessoft-elements` once in the browser; in Vue/Angular register custom elements as described in the framework guide.
- **Labels in Russian:** wrap the React app in `<VelessoftProvider messages={en}>`.
- **No dialog:** use a modern browser supporting `HTMLDialogElement.showModal()`.
