# Framework guide

[Documentation](README.md) / Frameworks

Velessoft UI has three layers you can mix:

1. **Tokens** (`@villetacore/velessoft-tokens`) — CSS variables for color, type, spacing and motion.
2. **CSS** (`@villetacore/velessoft-css`) — every component as plain `vs-*` classes. Static components (buttons, fields, badges, cards, tables, alerts, progress, skeletons, accordion, breadcrumbs…) need nothing else.
3. **Behavior** — React components (`@villetacore/velessoft-ui`) or framework-neutral Web Components (`@villetacore/velessoft-elements`) for interactive parts: tabs, dialog, menu, tooltip, toasts, pagination and theme toggle.

The Web Components render in the **light DOM**: your framework's template stays in charge of the markup, global CSS applies, and server rendering outputs ordinary HTML. They communicate through attributes, properties and DOM events (`vs-change`, `vs-select`, `vs-close`, `vs-open`).

| Framework | Use |
| --- | --- |
| React, Next.js, Remix | `@villetacore/velessoft-ui` |
| Vue 3, Nuxt | CSS + elements |
| Svelte, SvelteKit | CSS + elements |
| Angular | CSS + elements |
| Solid, Qwik, Preact, Lit | CSS + elements |
| Astro, Eleventy, Hugo, Django, Rails, Laravel, htmx | CSS + elements (or CDN) |

## Plain HTML / CDN

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@villetacore/velessoft-css@0.2/dist/velessoft.full.min.css">
<script type="module" src="https://cdn.jsdelivr.net/npm/@villetacore/velessoft-elements@0.2/dist/index.js"></script>
```

`velessoft.full.min.css` already contains the tokens. A complete page is in [examples/html/index.html](../examples/html/index.html).

## With a bundler (all non-React frameworks)

```sh
npm install @villetacore/velessoft-tokens @villetacore/velessoft-css @villetacore/velessoft-elements
```

```js
// main.js / main.ts — once per app
import '@villetacore/velessoft-tokens/tokens.css';
import '@villetacore/velessoft-css';            // or '@villetacore/velessoft-css/velessoft.min.css'
import '@villetacore/velessoft-elements';       // registers <vs-*> elements
```

Only need some elements? Import them individually: `import '@villetacore/velessoft-elements/tabs'`.

## Vue 3 / Nuxt

Tell the compiler that `vs-*` tags are custom elements:

```ts
// vite.config.ts
import vue from '@vitejs/plugin-vue';
export default {
  plugins: [vue({ template: { compilerOptions: { isCustomElement: (tag) => tag.startsWith('vs-') } } })],
};
// Nuxt: nuxt.config.ts → vue: { compilerOptions: { isCustomElement: (tag) => tag.startsWith('vs-') } }
```

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { toast } from '@villetacore/velessoft-elements';
const open = ref(false);
const tab = ref(0);
</script>

<template>
  <vs-tabs :selected="tab" @vs-change="tab = $event.detail.index">
    <div role="tablist" aria-label="Settings"><button>Profile</button><button>Billing</button></div>
    <div role="tabpanel">…</div>
    <div role="tabpanel">…</div>
  </vs-tabs>

  <button class="vs-button vs-primary" @click="open = true">Open</button>
  <vs-dialog :open="open || undefined" @vs-close="open = false">
    <dialog aria-labelledby="t">
      <div class="vs-dialog-heading"><h2 id="t">Settings</h2><button class="vs-button" data-close aria-label="Close">×</button></div>
      <div class="vs-field"><label for="n">Name</label><input id="n" class="vs-input" v-model="name" /></div>
    </dialog>
  </vs-dialog>

  <button class="vs-button" @click="toast({ title: 'Saved', tone: 'success' })">Save</button>
</template>
```

For a reusable field, wrap the CSS in a component: `<label :for="id">`, `<input class="vs-input" :aria-invalid="!!error" :aria-describedby="…">`, `<small class="vs-error">`.

With Nuxt, import `@villetacore/velessoft-elements` from a client-only plugin (`plugins/velessoft.client.ts`). The module is SSR-safe to import, but elements only upgrade in the browser.

## Svelte / SvelteKit

```svelte
<script lang="ts">
  import '@villetacore/velessoft-tokens/tokens.css';
  import '@villetacore/velessoft-css';
  import { onMount } from 'svelte';
  import { toast } from '@villetacore/velessoft-elements';
  let open = false;
</script>

<button class="vs-button vs-primary" on:click={() => (open = true)}>Open</button>
<vs-dialog open={open || undefined} on:vs-close={() => (open = false)}>
  <dialog aria-label="Settings">… <button class="vs-button" data-close>Close</button></dialog>
</vs-dialog>

<vs-menu on:vs-select={(e) => toast(`Picked ${e.detail.value}`)}>
  <button class="vs-button">Actions</button>
  <div class="vs-menu"><button data-value="edit">Edit</button><button data-value="delete">Delete</button></div>
</vs-menu>
```

In Svelte 5 use `onvs-close` / `onvs-select` attributes. In SvelteKit import the elements module inside `onMount` or a `+layout.svelte` that only runs in the browser if you disable SSR for it.

## Angular

```ts
// app.component.ts (standalone)
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import '@villetacore/velessoft-elements';

@Component({
  selector: 'app-root',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <vs-tabs [attr.selected]="tab" (vs-change)="tab = $any($event).detail.index">
      <div role="tablist" aria-label="Settings"><button>Profile</button><button>Billing</button></div>
      <div role="tabpanel">…</div><div role="tabpanel">…</div>
    </vs-tabs>
    <vs-pagination [attr.page]="page" count="12" (vs-change)="page = $any($event).detail.page"></vs-pagination>
  `,
})
export class AppComponent { tab = 0; page = 1; }
```

Add the CSS to `angular.json` → `styles`: `node_modules/@villetacore/velessoft-tokens/tokens.css`, `node_modules/@villetacore/velessoft-css/dist/velessoft.css`.

## Solid

```tsx
import '@villetacore/velessoft-elements';
declare module 'solid-js' {
  namespace JSX {
    interface IntrinsicElements {
      'vs-tabs': any; 'vs-menu': any; 'vs-dialog': any; 'vs-tooltip': any; 'vs-pagination': any; 'vs-toaster': any; 'vs-theme-toggle': any;
    }
  }
}

<vs-tooltip text="Copy link"><button class="vs-button" aria-label="Copy">⧉</button></vs-tooltip>
<vs-pagination page={page()} count={10} on:vs-change={(e) => setPage(e.detail.page)} />
```

## React and Next.js

Use the React package. Every module carries `"use client"`, so it works from Server Components pages:

```tsx
// app/layout.tsx
import '@villetacore/velessoft-tokens/tokens.css';
import '@villetacore/velessoft-ui/styles.css';
import { VelessoftProvider, ToastProvider, en } from '@villetacore/velessoft-ui';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark">
      <body className="vs-root">
        <VelessoftProvider messages={en}>
          <ToastProvider>{children}</ToastProvider>
        </VelessoftProvider>
      </body>
    </html>
  );
}
```

`@villetacore/velessoft-ui/full.css` contains tokens + components in one file.

## Tailwind CSS

Tailwind v4:

```css
@import "tailwindcss";
@import "@villetacore/velessoft-tokens/tokens.css";
@import "@villetacore/velessoft-tokens/tailwind.css";
/* → bg-vs-surface, text-vs-muted, border-vs-border, font-vs, rounded-vs … */
```

Tailwind v3:

```js
// tailwind.config.js
import velessoft from '@villetacore/velessoft-tokens/tailwind-preset';
export default { presets: [velessoft], content: ['./src/**/*.{html,js,ts,jsx,tsx,vue,svelte}'] };
// → bg-vs-primary, text-vs-text, p-vs-4 …
```

Both map to CSS variables, so `data-theme` switching keeps working.

## SCSS and JavaScript tokens

```scss
@use '@villetacore/velessoft-tokens/tokens.scss' as *;
.panel { background: $vs-surface; padding: $vs-space-4; }
```

```ts
import tokens, { cssVar } from '@villetacore/velessoft-tokens';
tokens.dark.primary;   // "#B8EF65"
cssVar('link');        // "var(--vs-link)"
```

## Web Component reference

| Element | Markup | API |
| --- | --- | --- |
| `<vs-tabs>` | `[role=tablist] > button` + matching `[role=tabpanel]` children | `selected` attribute/property, `select(i)`, event `vs-change {index}`. Arrow keys, Home/End. |
| `<vs-dialog>` | one `<dialog>` child; `[data-close]` buttons inside | `open` attribute/property, `show()`, `close()`, `close-on-backdrop`; cancelable `vs-close {reason}`, `vs-open`. Restores focus. |
| `<vs-menu>` | trigger `<button>` + `.vs-menu` with `<button data-value>`, `<a>`, `<hr>` | `show()`, `hide()`, `data-align="end"` on the list; event `vs-select {value, item}`. Arrow keys, Escape, outside click. |
| `<vs-tooltip>` | one focusable child | `text`, `placement` (top/bottom/left/right), `delay`. Adds `aria-describedby`. |
| `<vs-toaster>` | render empty | `show({title, description, tone, duration})`, `placement="top"`, `duration`, `close-label`. Helper: `toast()`. |
| `<vs-pagination>` | render empty | `page`, `count`, `siblings`, `label`, `page-label="Page {page}"`, `previous-label`, `next-label`; event `vs-change {page}`. |
| `<vs-theme-toggle>` | a `<button>` child | `target` selector (defaults to `<html>`); stores choice in localStorage; event `vs-change {theme}`. Helpers: `setTheme()`, `getTheme()`. |

Element text defaults are English; pass the label attributes to localize.
