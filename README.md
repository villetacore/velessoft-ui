# Velessoft UI

**Compact interfaces. Open code. Sharp edges.**

An experimental design system and React component library by **[villetacore](https://github.com/villetacore)**. Lime, violet, graphite; compact desktop controls and larger touch targets.

Status: **0.1.0 — experimental**. Packages are prepared locally, not yet published to npm. API may change.

## Run locally

Node.js 22.12+ and npm.

```sh
npm ci
npm run dev
```

Open the URL printed by Vite. The home page is a React example; its documentation link opens the full design catalog.

```sh
npm run check  # type checking, interaction tests, library + demo build
```

## Components

Button · Input · Textarea · Select · Checkbox · Badge · Alert · Dialog.

```tsx
import { Button, Input } from '@velessoft/ui';
import '@velessoft/tokens/tokens.css';
import '@velessoft/ui/styles.css';

<Input label="Project name" required />
<Button variant="primary">Create project</Button>
```

This import example assumes local workspace linking or installation from a future release. Today, clone and build this repository; do not expect `npm install @velessoft/ui` to resolve our release.

## Structure

- `packages/ui`: typed React components and scoped styles.
- `packages/tokens`: JSON source and generated theme variables.
- `apps/docs/public`: offline design catalog, patterns and prototype playground.
- `examples/dashboard`: actual React application using library components.
- `design`: principles, component API and delivery templates.

## Themes and density

Set `data-theme="dark"` on an ancestor, otherwise light tokens apply. Controls use 34px on desktop and 44px for coarse pointers. Import tokens before component styles. Components inherit the application font; the catalog bundles Manrope and JetBrains Mono.

## Readiness

React component tests cover selected interactions, not a full accessibility certification. Native dialog uses the browser modal implementation; test focus and Escape on target browsers. Catalog examples and the React example are separate prototypes; neither connects to a backend. The catalog persists its project demo locally; the React example keeps data in memory. Logo geometry and early generated illustrations are concepts, not final brand masters.

## License and attribution

Code: MIT, © 2026 villetacore (Виллета Корь). See [LICENSE](LICENSE). Third-party fonts and icons retain their own licenses: [notices](THIRD_PARTY_NOTICES.md). Project identity and maintenance: villetacore. No trademark rights are granted by the code license.
