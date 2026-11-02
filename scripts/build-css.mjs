// Bundles packages/css/src into framework-agnostic stylesheets.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const root = new URL("../packages/css/", import.meta.url);
const dist = new URL("dist/", root);
const { version } = JSON.parse(readFileSync(new URL("package.json", root)));
// Component order comes from src/index.css so dev and dist builds match.
const parts = [
  ...readFileSync(new URL("src/index.css", root), "utf8").matchAll(
    /@import "\.\/(\w+)\.css";/g,
  ),
].map((m) => m[1]);
const banner = `/*! Velessoft UI CSS v${version} | MIT © 2026 villetacore | Load @villetacore/velessoft-tokens first or use velessoft.full.css. */\n`;
const minify = (css) =>
  css
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s+/g, " ")
    .replace(/\s*([{};,>])\s*/g, "$1")
    .replace(/;}/g, "}")
    .trim();

mkdirSync(new URL("components/", dist), { recursive: true });
const sources = parts.map((name) => {
  const css = readFileSync(new URL(`src/${name}.css`, root), "utf8");
  writeFileSync(new URL(`components/${name}.css`, dist), css);
  return css;
});
const components = sources.join("\n");
const tokens = readFileSync(new URL("../tokens/tokens.css", root), "utf8");
const out = {
  "velessoft.css": banner + components,
  "velessoft.min.css": banner + minify(components) + "\n",
  "velessoft.full.css": banner + tokens + "\n" + components,
  "velessoft.full.min.css": banner + minify(tokens + components) + "\n",
};
for (const [file, css] of Object.entries(out))
  writeFileSync(new URL(file, dist), css);
console.log(
  `Built ${Object.keys(out).length} bundles and ${parts.length} component files`,
);
