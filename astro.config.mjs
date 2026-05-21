import { defineConfig } from "astro/config";

// Production (status.roono.app) uses /. For github.io/roono-status/ preview: ASTRO_BASE=/roono-status/
const base = process.env.ASTRO_BASE ?? "/";

export default defineConfig({
  site: "https://status.roono.app",
  base,
  trailingSlash: "always",
  output: "static",
  build: {
    format: "directory",
  },
});
