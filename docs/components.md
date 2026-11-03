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

## Workflow components (0.3.0)

| Component | Props | Behavior |
| --- | --- | --- |
| SearchInput | Input props except type/value/defaultValue/onChange/endAddon; value?, defaultValue?, onValueChange?, clearLabel | Controlled or uncontrolled text. Clear reports an empty string and restores input focus. Disabled/readOnly respected. |
| PasswordInput | Input props except type/endAddon; showLabel, hideLabel | Starts hidden. Toggle changes visibility without changing the value. Override autoComplete for new passwords. |
| CopyButton | Button props except onClick/children/loading/loadingText; value, label, copiedLabel, errorLabel, onCopied? | HTTPS/localhost Clipboard API. Announces success/failure; prevents concurrent copies. New value resets feedback. |
| Stepper | items: {id,label,description?,disabled?}[], current, label, onStepChange?, className? | Ordered list with aria-current=step. Informational by default; optional native navigation buttons. Caller validates transitions. IDs must be unique. |
| DescriptionList | items: {id,term,description}[]; native dl props | Semantic dt/dd pairs; wraps and stacks on narrow screens. IDs must be unique. |

Labels are explicit props so applications can translate them. Search is synchronous; consumers own debounce and cancellation. CopyButton does not use legacy clipboard fallbacks or retain copied content. Stepper does not hide panels or validate a form.

```tsx
<SearchInput label="Search projects" clearLabel="Clear search"
  value={query} onValueChange={setQuery} />
<PasswordInput label="Password" showLabel="Show" hideLabel="Hide" />
<CopyButton value="npm install @villetacore/velessoft-ui"
  label="Copy" copiedLabel="Copied" errorLabel="Copy failed" />
<Stepper label="Setup" current="review" items={[
  {id:'details',label:'Details'}, {id:'review',label:'Review'}
]} />
<DescriptionList items={[{id:'owner',term:'Owner',description:'villetacore'}]} />
```

These five React components are exported from the UI package. Their CSS is also available via `@villetacore/velessoft-css/components/workflow.css`. Equivalent new Web Component custom elements are not included in this release.

## Application kit (0.4.0)

| Component | Required / notable props | Behavior |
| --- | --- | --- |
| NumberInput | label; native min, max, step | Native numeric editing. onChange receives the native event; empty/partial values remain strings. |
| DateInput | label; native min, max | Native calendar field; YYYY-MM-DD values, no timezone conversion. |
| TimeInput | label; native step | Native time field; HH:mm or native seconds format. |
| FileInput | label; onFilesChange?, multiple?, accept? | Reports File[]. No upload or file-content reading. accept is a hint; validate on server. |
| MultiSelect | label, options, searchLabel, emptyText; value?, defaultValue?, onValueChange?, name?, hint?, error?, disabled? | Searchable native checkbox list. Selected values remain when filtered. name emits repeated hidden form values. Unique option values required. |
| Toggle | Button props; pressed?, defaultPressed?, onPressedChange? | aria-pressed button, Enter/Space, no default form submission. |
| ToggleGroup | label, options; value?, defaultValue?, onValueChange?, disabled? | Multiple independently pressed buttons; native Tab order. |
| Collapsible | title, children; open?, defaultOpen?, onOpenChange?, disabled? | Linked button and hidden panel; controlled and uncontrolled. |
| Timeline | label, items: {id,title,description?,dateTime?,time?}[] | Semantic ordered history with optional time elements. Caller formats dates. |
| Toolbar | label, native div props | Labelled group for mixed controls. Not ARIA toolbar; uses ordinary Tab order. |
| PageHeader | title; description?, eyebrow?, actions?, level? | Responsive page title/actions; heading level 1 or 2. |
| NavList | label, items: {id,label,href,badge?}[]; current? | Real links with aria-current=page; no router dependency. |
| CodeBlock | code, label, copyLabel, copiedLabel, errorLabel | Escaped plain code, scrollable keyboard-focusable region and copy feedback. No syntax-highlighting dependency. |

All five native field wrappers and choices use the same light/dark styling. The application CSS group can be imported separately through `@villetacore/velessoft-css/components/application.css`. React implementations above are not new custom elements; Vue/Svelte can use shared CSS and native HTML with their own state bindings.

```tsx
const [members, setMembers] = useState<string[]>([]);
<MultiSelect label="Members" searchLabel="Find member" emptyText="No matches"
  options={[{value:'alice',label:'Alice'},{value:'bob',label:'Bob'}]}
  value={members} onValueChange={setMembers} name="members" />
<NumberInput label="Seats" min={1} max={100} defaultValue={5} />
<DateInput label="Launch date" />
<TimeInput label="Reminder time" />
<FileInput label="Attachments" multiple onFilesChange={setFiles} />
```

Native date/time/file appearance depends on the browser and OS. This release does not claim custom date-range pickers, drag-and-drop upload, virtualization or remote-search support.

### GlassPanel

Opt-in frosted panel with standard div props, forwarded ref and `animate?: boolean` (false by default). Use it for short summaries and floating surfaces. Shared CSS: `vs-glass-panel`; optional entrance: `vs-reveal`. See [material tokens, accessibility and fallbacks](theming.md#glass-and-motion-04).
