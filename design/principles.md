# Design principles

Velessoft balances familiar application UI with an independent studio identity. Compact layouts, readable 14px body text, 36px desktop controls and 44px coarse-pointer targets. Controls use a 6px radius; panels use 12px. Lime highlights primary actions, violet marks selection and identity.

Use neutral surfaces and subtle panel dividers. Reserve strong borders for inputs and meaningful boundaries. Avoid permanent offset shadows, decorative rotation or all-caps text in working screens. Keyboard focus stays clearly visible. Status must include text, not color alone.

Shared CSS is framework-independent. Native React behavior must not be advertised as equivalent Vue/Svelte wrappers until those adapters have been built and tested.
