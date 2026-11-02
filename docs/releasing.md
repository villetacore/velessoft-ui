# Releasing

[Documentation](README.md) / Releasing

Maintainer: **villetacore**. Never commit credentials.

## Create packages

```sh
npm ci
npm run check
npm run pack
```

Inspect archives with `tar -tzf artifacts/velessoft-ui-0.1.0.tgz`. Install both archives into a fresh consumer and verify imports and type declarations. The UI package has React/React DOM peer dependencies; fonts and design-catalog images are not included.

## GitHub archive distribution

Versioned archives live in `releases/v0.1.0/` with SHA-256 checksums. Treat released archives as immutable. Future changes get a new package version and directory. These are repository-hosted archives, not a GitHub Release page or npm registry release.

## npm registry publication

Publication requires a logged-in maintainer with rights to the `@velessoft` scope. Authentication and any 2FA challenge must be completed by the maintainer.

```sh
npm whoami
npm publish -w @velessoft/tokens --access public
npm publish -w @velessoft/ui --access public
```

Workspace prepack scripts regenerate/build packages before publication. Verify both package versions in the registry, then update the README installation section. Do not claim npm publication before verification.

## Signed commits

Keep maintainer commits authored and signed by villetacore. GitHub Verified also requires the signing public key to be registered on that account. Contributors retain their own authorship.
