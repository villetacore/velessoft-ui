import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { packages } from "./packages.mjs";
if (process.env.GITHUB_ACTIONS !== "true")
  throw new Error("Publication runs in GitHub Actions only");
for (const { directory } of packages) {
  const pkg = JSON.parse(
    readFileSync(`packages/${directory}/package.json`, "utf8"),
  );
  const response = await fetch(
    `https://registry.npmjs.org/${encodeURIComponent(pkg.name)}/${pkg.version}`,
  );
  if (response.ok) {
    console.log(
      `${pkg.name}@${pkg.version} already exists; skipping immutable version`,
    );
    continue;
  }
  if (response.status !== 404)
    throw new Error(`Registry lookup failed: ${response.status}`);
  execFileSync(
    "npm",
    ["publish", "-w", pkg.name, "--access", "public", "--provenance"],
    { stdio: "inherit" },
  );
}
