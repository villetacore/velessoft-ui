import { defineConfig } from "vite";
import { resolve } from "node:path";
// GitHub Pages serves the site from /velessoft-ui/; set BASE_PATH there.
export default defineConfig({
  base: process.env.BASE_PATH || "/",
  publicDir: "apps/docs",
  build: {
    outDir: "dist",
    rollupOptions: {
      // Library sources keep "use client" for Next.js; the demo bundle does not need it.
      onwarn(warning, warn) {
        if (
          warning.code === "MODULE_LEVEL_DIRECTIVE" ||
          warning.code === "SOURCEMAP_ERROR"
        )
          return;
        warn(warning);
      },
      input: {
        main: resolve(import.meta.dirname, "index.html"),
        html: resolve(import.meta.dirname, "examples/html/index.html"),
      },
    },
  },
});
