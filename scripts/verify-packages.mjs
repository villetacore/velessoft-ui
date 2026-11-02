// Packs every workspace, installs the archives into a temporary consumer and checks real imports.
import { execFileSync } from "node:child_process";
import {
  mkdtempSync,
  readdirSync,
  rmSync,
  writeFileSync,
  existsSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { packages } from "./packages.mjs";

const out = mkdtempSync(join(tmpdir(), "velessoft-pack-"));
const app = mkdtempSync(join(tmpdir(), "velessoft-consumer-"));
try {
  for (const { name } of packages)
    execFileSync("npm", ["pack", "-w", name, "--pack-destination", out], {
      stdio: "ignore",
    });
  const archives = readdirSync(out).map((file) => resolve(out, file));
  writeFileSync(
    join(app, "package.json"),
    JSON.stringify({ name: "consumer", private: true, type: "module" }),
  );
  execFileSync(
    "npm",
    [
      "install",
      "--no-audit",
      "--no-fund",
      "--ignore-scripts",
      "react@19",
      "react-dom@19",
      ...archives,
    ],
    { cwd: app, stdio: "ignore" },
  );
  const check = `
    const ui = await import('@villetacore/velessoft-ui');
    const el = await import('@villetacore/velessoft-elements');
    const tokens = (await import('@villetacore/velessoft-tokens')).default;
    if (typeof ui.Button !== 'object' || typeof ui.Tabs !== 'function') throw new Error('React exports missing');
    for (const name of ['SearchInput','PasswordInput','CopyButton','Stepper','DescriptionList']) if (!ui[name]) throw new Error('Missing workflow export: '+name);
    if (typeof el.toast !== 'function') throw new Error('Element exports missing');
    if (!tokens.light.primary) throw new Error('Token export missing');
    console.log('React exports:', Object.keys(ui).length, '| elements:', Object.keys(el).length);
  `;
  execFileSync("node", ["--input-type=module", "-e", check], {
    cwd: app,
    stdio: "inherit",
  });
  const files = [
    "node_modules/@villetacore/velessoft-ui/dist/styles.css",
    "node_modules/@villetacore/velessoft-ui/dist/index.d.ts",
    "node_modules/@villetacore/velessoft-css/dist/velessoft.full.min.css",
    "node_modules/@villetacore/velessoft-tokens/tailwind.css",
    "node_modules/@villetacore/velessoft-tokens/tokens.scss",
  ];
  for (const file of files)
    if (!existsSync(join(app, file))) throw new Error(`Missing ${file}`);
  console.log(`Verified ${archives.length} archives in a clean consumer`);
} finally {
  rmSync(out, { recursive: true, force: true });
  rmSync(app, { recursive: true, force: true });
}
