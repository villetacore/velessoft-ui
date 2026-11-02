import { mkdirSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { packages } from "./packages.mjs";
mkdirSync("artifacts", { recursive: true });
for (const { name } of packages)
  execFileSync("npm", ["pack", "-w", name, "--pack-destination", "artifacts"], {
    stdio: "inherit",
  });
