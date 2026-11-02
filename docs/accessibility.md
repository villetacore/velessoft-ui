# Accessibility

[Documentation](README.md) / Accessibility

The library uses native controls, linked labels/descriptions and WAI-ARIA patterns for tabs, menus, tooltips, switches and progress. Interaction tests cover loading buttons, field descriptions, dialogs, tabs and menu keyboard navigation, tooltips, toasts, pagination, sortable tables, and the Web Components. This is not a full accessibility audit.

Before shipping:

- Navigate every action with Tab and Shift+Tab; check visible focus.
- Open and close dialogs, drawers and menus with keyboard; verify focus return and Escape.
- Do not put essential information only in tooltips.
- Respect `prefers-reduced-motion` (built-in animations already do).
- Confirm field labels and errors in a screen reader.
- Check contrast in both themes, disabled states and custom overrides.
- Check 200% text scaling, 400% zoom, long content and narrow screens.
- Keep essential actions available without hover.
- Announce async errors and preserve input after failures.

The unit-test environment mocks native dialog methods; it does not validate the browser focus trap. Perform browser checks separately.
