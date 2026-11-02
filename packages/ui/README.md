# @villetacore/velessoft-ui

React components for **Velessoft UI**, an experimental design system by **villetacore**. 36 typed, accessible components; ESM with TypeScript declarations; `"use client"` for Next.js.

Version 0.2.0. MIT © 2026 villetacore.

```sh
npm install @villetacore/velessoft-ui @villetacore/velessoft-tokens
```

```tsx
import { Button, Input, Tabs, ToastProvider, VelessoftProvider, en } from '@villetacore/velessoft-ui';
import '@villetacore/velessoft-tokens/tokens.css';
import '@villetacore/velessoft-ui/styles.css'; // or '@villetacore/velessoft-ui/full.css' (tokens included)
```

Peer dependencies: React and React DOM 18+.

**Components:** Button, IconButton, ButtonGroup · Input, Textarea, Select, Checkbox, Switch, RadioGroup, Slider · Alert, Badge, Tag, Spinner, Progress, Skeleton, ToastProvider/useToast · Dialog, Drawer, Tooltip, Menu · Tabs, SegmentedControl, Breadcrumbs, Pagination · Card, Table, Accordion, Avatar, AvatarGroup, Stat, EmptyState, Kbd, Divider · Stack, Grid · VelessoftProvider.

Labels default to Russian; use `<VelessoftProvider messages={en}>` for English. Not using React? See `@villetacore/velessoft-css` and `@villetacore/velessoft-elements`.

[Documentation](https://github.com/villetacore/velessoft-ui/blob/main/docs/components.md)
