// Publishes every workspace to npmjs.org (default) or GitHub Packages (PUBLISH_TARGET=github).
import { readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { packages } from "./packages.mjs";

if (process.env.GITHUB_ACTIONS !== "true")
  throw new Error("Publication runs in GitHub Actions only");

const github = process.env.PUBLISH_TARGET === "github";
const registry = github
  ? "https://npm.pkg.github.com/"
  : "https://registry.npmjs.org/";
const headers = github
  ? { Authorization: `Bearer ${process.env.NODE_AUTH_TOKEN}` }
  : {};

for (const { directory } of packages) {
  const file = `packages/${directory}/package.json`;
  const pkg = JSON.parse(readFileSync(file, "utf8"));
  // publishConfig wins over --registry, so point it at the target in this CI checkout only.
  if (github) {
    pkg.publishConfig = { ...pkg.publishConfig, registry };
    writeFileSync(file, JSON.stringify(pkg, null, 2) + "\n");
  }
  const response = await fetch(`${registry}${pkg.name.replace("/", "%2f")}`, {
    headers,
  });
  if (response.ok) {
    const { versions = {} } = await response.json();
    if (versions[pkg.version]) {
      console.log(
        `${pkg.name}@${pkg.version} already exists on ${registry}; skipping immutable version`,
      );
      continue;
    }
  } else if (response.status !== 404)
    throw new Error(`Registry lookup failed: ${response.status}`);
  const args = ["publish", "-w", pkg.name, "--access", "public"];
  // GitHub Packages does not accept npm provenance statements.
  if (!github) args.push("--provenance");
  execFileSync("npm", args, { stdio: "inherit" });
}
