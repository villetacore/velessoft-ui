import { readFileSync, writeFileSync } from "node:fs";
const t = JSON.parse(
  readFileSync(new URL("../packages/tokens/tokens.json", import.meta.url)),
);
const block = (selector, data) =>
  `${selector}{\n${Object.entries(data)
    .map(
      ([k, v]) =>
        `  --vs-${k.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase())}: ${v};`,
    )
    .join("\n")}\n}`;
writeFileSync(
  new URL("../packages/tokens/tokens.css", import.meta.url),
  block(":root", t.light) + "\n" + block('[data-theme="dark"]', t.dark) + "\n",
);
