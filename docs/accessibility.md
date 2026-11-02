# Accessibility

[Documentation](README.md) / Accessibility

The library uses native controls and linked labels/descriptions. Four interaction tests currently exercise loading buttons, field descriptions, checkbox labels and controlled dialog behavior. This is not a full accessibility audit.

Before shipping:

- Navigate every action with Tab and Shift+Tab; check visible focus.
- Open and close the dialog with keyboard; verify focus return and Escape.
- Confirm field labels and errors in a screen reader.
- Check contrast in both themes, disabled states and custom overrides.
- Check 200% text scaling, 400% zoom, long content and narrow screens.
- Keep essential actions available without hover.
- Announce async errors and preserve input after failures.

The unit-test environment mocks native dialog methods; it does not validate the browser focus trap. Perform browser checks separately.
