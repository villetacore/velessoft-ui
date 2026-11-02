# Publishing

[Documentation](README.md) / Releasing

Maintainer: **villetacore**. Four packages are released together with one version:

| Order | Package |
| --- | --- |
| 1 | `@villetacore/velessoft-tokens` |
| 2 | `@villetacore/velessoft-css` |
| 3 | `@villetacore/velessoft-elements` |
| 4 | `@villetacore/velessoft-ui` |

The list lives in [`scripts/packages.mjs`](../scripts/packages.mjs) and drives pack, validation and publish scripts.

## One-time npm setup

npm trusted publishing (OIDC, no tokens) requires that a package already exists. A maintainer publishes the first version from their own logged-in npm account, completing any 2FA challenge themselves:

```sh
npm login
npm run check
npm publish -w @villetacore/velessoft-tokens --access public
npm publish -w @villetacore/velessoft-css --access public
npm publish -w @villetacore/velessoft-elements --access public
npm publish -w @villetacore/velessoft-ui --access public
```

Then connect each package to the workflow (CLI or npmjs.com → package → Settings → Trusted Publisher: owner `villetacore`, repository `velessoft-ui`, workflow `publish.yml`, no environment):

```sh
for p in tokens css elements ui; do
  npm trust github @villetacore/velessoft-$p --repo villetacore/velessoft-ui --file publish.yml --allow-publish
done
```

The `@villetacore` scope must belong to the npm account (a user named `villetacore` or an organization). Never commit a token or paste one in an issue.

## GitHub Pages demo

`.github/workflows/pages.yml` builds the React demo, the HTML example and the design catalog on every push to `main`. Enable it once: repository **Settings → Pages → Source: GitHub Actions**. The site appears at `https://villetacore.github.io/velessoft-ui/`.

## Each release

1. Bump `version` in the root and all four `packages/*/package.json` (and the `^0.x` peer ranges in css/elements), update `CHANGELOG.md`, run `npm install` to refresh the lockfile.
2. Run `npm run check` and `npm run verify:packages`; push.
3. Create a GitHub Release with tag `vMAJOR.MINOR.PATCH` matching the package versions and publish it.
4. `.github/workflows/publish.yml` validates the tag, tests, builds, verifies the archives and publishes to npm with provenance.
5. Check the Actions run and the npm package pages before announcing.

Prereleases do not trigger publication. Existing versions are skipped, so a partially failed run can be retried. A registry error other than 404 stops publication.

## Local package inspection

`npm run pack` writes archives to `artifacts/`. Inspect with `tar -tzf artifacts/villetacore-velessoft-ui-0.2.0.tgz`. Files in `releases/v0.1.0/` are historical archives with the original `@velessoft` scope and stay immutable.

Sources: [npm trusted publishing](https://docs.npmjs.com/trusted-publishers/), [npm trust](https://docs.npmjs.com/cli/v11/commands/npm-trust/).
