# Component reference

[Documentation](README.md) / Components

All React components are named exports from `@villetacore/velessoft-ui`. Native props, event handlers and `className` are forwarded where the component wraps one native element. Field refs are forwarded. Every component renders the same `vs-*` classes that [`@villetacore/velessoft-css`](frameworks.md) provides, so the markup below is also the HTML contract for other frameworks.

Shared types: `Tone = 'neutral' | 'info' | 'success' | 'warning' | 'error'`, `Size = 'sm' | 'md' | 'lg'`.

## Actions

| Component | Props | Notes |
| --- | --- | --- |
| Button | `variant?: 'primary' \| 'secondary' \| 'danger' \| 'ghost'`, `size?`, `block?`, `loading?`, `loadingText?` | Default `secondary`, native `type="button"`. Loading disables, sets `aria-busy` and shows a spinner. |
| IconButton | `label: string` (accessible name + title), Button props | Square button for icons. |
| ButtonGroup | div props | `role="group"`; pass `aria-label`. |

```tsx
<Button variant="primary" onClick={save}>Save</Button>
<Button loading loadingText="Saving…">Save</Button>
<IconButton label="Settings">⚙</IconButton>
<ButtonGroup aria-label="Alignment"><Button size="sm">Left</Button><Button size="sm">Right</Button></ButtonGroup>
```

## Forms

| Component | Props | Notes |
| --- | --- | --- |
| Input | `label`, `hint?`, `error?`, `startAddon?`, `endAddon?` + input props | Label, hint and error are linked by generated ids. |
| Textarea | `label`, `hint?`, `error?` + textarea props | |
| Select | `label`, `hint?`, `error?`, `<option>` children | Native select with custom arrow. |
| Checkbox | `label: ReactNode` + input props | Native checkbox. |
| Switch | `label: ReactNode` + input props | Native checkbox with `role="switch"`. |
| RadioGroup | `label`, `options: {value, label, disabled?}[]`, `value?`, `defaultValue?`, `onChange?(value)`, `orientation?`, `hint?`, `error?`, `required?`, `disabled?` | Fieldset + legend; native arrow-key behavior. |
| Slider | `label`, `value?`, `defaultValue?`, `onChange?(number)`, `min`, `max`, `step`, `showValue?`, `formatValue?` | Native range input with `<output>` and `aria-valuetext`. |

An error sets `aria-invalid`; consumers own validation logic and timing. Required fields show an asterisk.

## Feedback

| Component | Props | Notes |
| --- | --- | --- |
| Alert | `tone?: 'info' \| 'success' \| 'warning' \| 'error'`, `title?`, `actions?`, children | `role="alert"` for errors, `status` otherwise. |
| Badge | `tone?`, `variant?: 'outline' \| 'solid'`, `dot?` | Display only. |
| Tag | `tone?`, `onRemove?`, `removeLabel?` | Remove button is labelled "Remove {text}". |
| Spinner | `label?`, `size?: 'md' \| 'lg'`, `decorative?` | `role="status"` with hidden text unless decorative. |
| Progress | `value?` (omit for indeterminate), `max?`, `label?`, `showValue?`, `tone?` | `role="progressbar"`. |
| Skeleton | `width?`, `height?`, `circle?`, `lines?` | Hidden from assistive tech. Respects reduced motion. |
| ToastProvider / useToast | provider: `placement?`, `duration?`; `toast({title, description?, tone?, duration?})` → id, `dismiss(id)` | Pauses on hover/focus; `duration: 0` keeps it open. |

```tsx
function SaveButton() {
  const { toast } = useToast();
  return <Button onClick={() => toast({ title: 'Saved', tone: 'success' })}>Save</Button>;
}
// <ToastProvider><SaveButton /></ToastProvider>
```

## Overlays

| Component | Props | Notes |
| --- | --- | --- |
| Dialog | `open`, `onClose`, `title`, `children`, `footer?`, `size?`, `closeLabel?`, `closeOnBackdrop?` | Native modal `<dialog>`: focus containment, Escape, focus return. `onClose` is a request; set `open=false`. |
| Drawer | Dialog props + `side?: 'left' \| 'right'` | Side panel; backdrop click closes by default. |
| Tooltip | `content`, one focusable child, `placement?`, `delay?` | Shows on hover and focus, Escape hides, adds `aria-describedby`. Do not put essential info only in tooltips. |
| Menu | `label`, `items`, `align?`, `variant?`, `triggerLabel?` | Menu button pattern: Arrow keys, Home/End, Escape, Tab, outside click. Uses fixed positioning so tables and scroll containers don't clip it. |

Menu items: `{ label, onSelect?, href?, disabled?, danger?, shortcut?, icon? }`, `{ type: 'separator' }`, `{ type: 'label', label }`.

```tsx
<Menu label="Actions" align="end" items={[
  { label: 'Rename', shortcut: 'F2', onSelect: rename },
  { type: 'separator' },
  { label: 'Delete', danger: true, onSelect: remove },
]} />
```

## Navigation

| Component | Props | Notes |
| --- | --- | --- |
| Tabs | `items: {value, label, content, disabled?}[]`, `value?`, `defaultValue?`, `onChange?`, `label?` | Automatic activation, roving tabindex, Arrow/Home/End. Inactive panels stay mounted but hidden. |
| SegmentedControl | `label`, `options`, `value?`, `defaultValue?`, `onChange?` | Radio group styled as a toggle bar. |
| Breadcrumbs | `items: {label, href?}[]`, `label?` | Last item gets `aria-current="page"`. |
| Pagination | `page`, `pageCount`, `onPageChange`, `siblings?`, `label?` | Controlled. `paginationRange(page, count)` is exported for custom UIs. |

## Display and layout

| Component | Props | Notes |
| --- | --- | --- |
| Card | `title?`, `description?`, `actions?`, `footer?`, `tone?`, `flat?`, `interactive?` | `<article>`; tone colors the top border. |
| Table | `columns: {key, header, render?, align?, sortValue?}[]`, `rows`, `rowKey`, `caption?`, `striped?`, `hover?`, `compact?`, `emptyText?` | Generic; sortable columns set `aria-sort`. Scrolls horizontally on narrow screens. |
| Accordion | `items: {title, content, defaultOpen?}[]`, `exclusive?` | Native `<details>`; exclusive uses the `name` attribute. |
| Avatar / AvatarGroup | `name`, `src?`, `size?`, `round?`, `tone?` / `max?` | Falls back to initials when the image fails. |
| Stat | `label`, `value`, `delta?`, `tone?` | Metric tile. |
| EmptyState | `title`, `description?`, `actions?`, `icon?` | |
| Kbd, Divider | Divider: `label?`, `orientation?` | |
| Stack | `direction?`, `gap?`, `align?`, `justify?`, `wrap?`, `as?` | Flex layout helper. |
| Grid | `min?` (column px), `gap?` | Auto-fill responsive grid. |

## Localization

Built-in labels (close, loading, pagination, remove…) default to Russian. Switch or override them:

```tsx
import { VelessoftProvider, en } from '@villetacore/velessoft-ui';
<VelessoftProvider messages={en}>…</VelessoftProvider>
<VelessoftProvider messages={{ close: 'Schließen' }}>…</VelessoftProvider>
```

## Keyboard

Buttons use Enter/Space; fields and selects use native keyboard interaction. Tabs, menus and segmented controls follow the WAI-ARIA Authoring Practices patterns listed above. Validate with keyboard and assistive technology in your product.
