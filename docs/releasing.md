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

## GitHub Packages

The same release also publishes all four packages to GitHub Packages (`npm.pkg.github.com`) through the `GitHub Packages` job in `publish.yml`. It uses the built-in `GITHUB_TOKEN`; no setup or secrets are needed, and it does not depend on the npm bootstrap above. The packages then appear in the repository's **Packages** sidebar.

To publish an existing tag again or to one registry only, run **Actions → Publish packages → Run workflow** with the tag and target (`both`, `npm`, `github`).

Installing from GitHub Packages requires authentication even for public packages. Consumers add to their project `.npmrc`:

```ini
@villetacore:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

with a personal access token that has `read:packages`. npmjs.org remains the recommended install source.

## GitHub Pages demo

`.github/workflows/pages.yml` builds the React demo, the HTML example and the design catalog on every push to `main`. Enable it once: repository **Settings → Pages → Source: GitHub Actions**. The site appears at `https://villetacore.github.io/velessoft-ui/`.

## Each release

1. Bump `version` in the root and all four `packages/*/package.json` (and the `^0.x` peer ranges in css/elements), update `CHANGELOG.md`, run `npm install` to refresh the lockfile.
2. Run `npm run check` and `npm run verify:packages`; push.
3. Create a GitHub Release with tag `vMAJOR.MINOR.PATCH` matching the package versions and publish it.
4. `.github/workflows/publish.yml` validates the tag, tests, builds, verifies the archives and publishes to npm with provenance and to GitHub Packages.
5. Check the Actions run, the npm package pages and the repository Packages list before announcing.

Prereleases do not trigger publication. Existing versions are skipped, so a partially failed run can be retried. A registry error other than 404 stops publication.

## Local package inspection

`npm run pack` writes archives to `artifacts/`. Inspect with `tar -tzf artifacts/villetacore-velessoft-ui-0.2.0.tgz`. Files in `releases/v0.1.0/` are historical archives with the original `@velessoft` scope and stay immutable.

Sources: [npm trusted publishing](https://docs.npmjs.com/trusted-publishers/), [npm trust](https://docs.npmjs.com/cli/v11/commands/npm-trust/).

## Download a CI build

Every successful CI run on Node 24 packs all four workspaces and uploads a `velessoft-packages-<commit>` artifact. Open the repository Actions tab, select the CI run, and download it from Artifacts. Archives are retained for 30 days. This is a downloadable build; registry publication still requires the Publish packages workflow.
