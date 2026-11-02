import { readFileSync } from "node:fs";
import { packages } from "./packages.mjs";
const tag = process.env.RELEASE_TAG;
if (!/^v\d+\.\d+\.\d+$/.test(tag || ""))
  throw new Error("Release tag must be vMAJOR.MINOR.PATCH");
for (const { directory, name } of packages) {
  const pkg = JSON.parse(
    readFileSync(`packages/${directory}/package.json`, "utf8"),
  );
  if (`v${pkg.version}` !== tag)
    throw new Error(`${pkg.name}: version does not match ${tag}`);
  if (pkg.name !== name) throw new Error(`Unexpected package name ${pkg.name}`);
  if (pkg.publishConfig?.registry !== "https://registry.npmjs.org/")
    throw new Error("Unexpected registry");
}
console.log(`Validated ${tag}`);
