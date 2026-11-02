// Publishable workspaces in dependency order. Shared by build, pack, validation and publish scripts.
export const packages = [
  { directory: "tokens", name: "@villetacore/velessoft-tokens" },
  { directory: "css", name: "@villetacore/velessoft-css" },
  { directory: "elements", name: "@villetacore/velessoft-elements" },
  { directory: "ui", name: "@villetacore/velessoft-ui" },
];
