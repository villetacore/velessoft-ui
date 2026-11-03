// Generates every token format from packages/tokens/tokens.json.
import { readFileSync, writeFileSync } from "node:fs";

const dir = new URL("../packages/tokens/", import.meta.url);
const t = JSON.parse(readFileSync(new URL("tokens.json", dir)));
const kebab = (k) => k.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase());
const header =
  "/* Generated from tokens.json by scripts/build-tokens.mjs. Do not edit. */\n";

const colors = (theme) =>
  Object.fromEntries(Object.entries(theme).map(([k, v]) => [kebab(k), v]));
const px = (n) => `${n}px`;
const scale = {
  ...Object.fromEntries(t.space.map((v, i) => [`space-${i + 1}`, px(v)])),
  "radius-control": px(t.radius.control),
  "radius-card": px(t.radius.card),
  "radius-pill": px(t.radius.pill),
  "font-family": `"${t.type.family}", ui-sans-serif, system-ui, sans-serif`,
  "font-mono": `"${t.type.mono}", ui-monospace, SFMono-Regular, Menlo, monospace`,
  "font-size-small": px(t.type.small),
  "font-size-body": px(t.type.body),
  "font-size-h3": px(t.type.h3),
  "font-size-h2": px(t.type.h2),
  "font-size-h1": px(t.type.h1),
  "font-size-display": px(t.type.marketing.display),
  "motion-fast": t.motion.fast,
  "motion-normal": t.motion.normal,
  "motion-slow": t.motion.slow,
  "motion-ease": t.motion.ease,
  "glass-blur": "18px",
  "control-height": px(t.density.desktop.controlHeight),
  "panel-padding": px(t.density.desktop.panelPadding),
  gap: px(t.density.desktop.gap),
  "shadow-offset": "2px 2px 0",
};
const brand = Object.fromEntries(
  Object.entries(t.brand).map(([k, v]) => [`brand-${kebab(k)}`, v]),
);

const block = (selector, data, indent = "") =>
  `${indent}${selector} {\n${Object.entries(data)
    .map(([k, v]) => `${indent}  --vs-${k}: ${v};`)
    .join("\n")}\n${indent}}`;

const light = colors(t.light);
const dark = colors(t.dark);
const css = [
  header.trim(),
  block(":root", { ...brand, ...scale, ...light }),
  ':root,\n[data-theme="light"] {\n  color-scheme: light;\n}',
  block('[data-theme="light"]', light),
  block('[data-theme="dark"]', dark),
  '[data-theme="dark"] {\n  color-scheme: dark;\n}',
  "@media (prefers-color-scheme: dark) {\n" +
    block('[data-theme="auto"]', dark, "  ") +
    '\n  [data-theme="auto"] {\n    color-scheme: dark;\n  }\n}',
  `@media (pointer: coarse) {\n  :root {\n    --vs-control-height: ${px(t.density.touch.controlHeight)};\n  }\n}`,
].join("\n");

const allNames = [
  ...Object.keys(brand),
  ...Object.keys(scale),
  ...Object.keys(light),
];
const scss =
  "// Generated from tokens.json. Values resolve to CSS custom properties, so themes keep working.\n" +
  allNames.map((k) => `$vs-${k}: var(--vs-${k});`).join("\n") +
  "\n" +
  Object.entries(t.brand)
    .map(([k, v]) => `$vs-raw-${kebab(k)}: ${v};`)
    .join("\n") +
  "\n";

const json = JSON.stringify(t, null, 2);
const js = `${header}const tokens = ${json};\nexport default tokens;\nexport const cssVar = (name) => \`var(--vs-\${name})\`;\n`;
const dts = `${header}type Colors = Record<${Object.keys(t.light)
  .map((k) => JSON.stringify(k))
  .join(" | ")}, string>;
declare const tokens: {
  brand: Record<${Object.keys(t.brand)
    .map((k) => JSON.stringify(k))
    .join(" | ")}, string>;
  light: Colors;
  dark: Colors;
  space: number[];
  radius: { control: number; card: number; pill: number };
  type: { family: string; mono: string; body: number; small: number; h1: number; h2: number; h3: number; marketing: { body: number; display: number } };
  motion: { fast: string; normal: string; slow: string; ease: string };
  [key: string]: unknown;
};
export default tokens;
export declare const cssVar: (name: string) => string;
`;

// Tailwind CSS v4: `@import "@villetacore/velessoft-tokens/tailwind.css";`
const twColors = Object.keys(light).map(
  (k) => `  --color-vs-${k}: var(--vs-${k});`,
);
const tailwind = `${header}@theme inline {
${twColors.join("\n")}
  --font-vs: var(--vs-font-family);
  --font-vs-mono: var(--vs-font-mono);
  --radius-vs: var(--vs-radius-control);
}
`;
// Tailwind CSS v3 preset.
const presetObject = {
  theme: {
    extend: {
      colors: {
        vs: Object.fromEntries(
          Object.keys(light).map((k) => [k, `var(--vs-${k})`]),
        ),
      },
      fontFamily: {
        vs: ["var(--vs-font-family)"],
        "vs-mono": ["var(--vs-font-mono)"],
      },
      spacing: Object.fromEntries(
        t.space.map((_, i) => [`vs-${i + 1}`, `var(--vs-space-${i + 1})`]),
      ),
      borderRadius: { vs: "var(--vs-radius-control)" },
    },
  },
};
const preset = JSON.stringify(presetObject, null, 2);

const out = {
  "tokens.css": css + "\n",
  "tokens.scss": scss,
  "tokens.js": js,
  "tokens.d.ts": dts,
  "tailwind.css": tailwind,
  "tailwind-preset.js": `${header}export default ${preset};\n`,
  "tailwind-preset.cjs": `${header}module.exports = ${preset};\n`,
};
for (const [file, content] of Object.entries(out))
  writeFileSync(new URL(file, dir), content);
