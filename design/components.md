# Component API

All field components accept native HTML props and forwarded refs. `label` is required; `hint` and `error` provide linked descriptions. Consumers own validation timing and values.

| Component | Additional props | Behavior |
|---|---|---|
| Button | variant: primary/secondary/danger, loading | Defaults to type=button. Loading disables repeated action. |
| Input | label, hint, error | Native input; label and descriptions linked. |
| Textarea | label, hint, error | Native textarea; consumer sets rows. |
| Select | label, hint, error | Native options as children; native keyboard behavior. |
| Checkbox | label | Native input; controlled or uncontrolled. |
| Badge | tone: neutral/success/error | Noninteractive status text. |
| Alert | title, tone: info/error/success | Error uses alert, other tones status. |
| Dialog | open, onClose, title | Controlled native modal; Escape requests close, previous focus restored. |

Dialog requires a modern browser supporting showModal. No nested modal support is promised. Consumer should handle unsaved edits and supply meaningful action labels. These components are starting primitives, not a complete data-grid or form framework.
