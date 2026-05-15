import { defineConfig } from "astro/config";

// Production (status.raastey.app) uses /. For github.io/raastey-status/ preview: ASTRO_BASE=/raastey-status/
const base = process.env.ASTRO_BASE ?? "/";

export default defineConfig({
  site: "https://status.raastey.app",
  base,
  trailingSlash: "always",
  output: "static",
  build: {
    format: "directory",
  },
});
