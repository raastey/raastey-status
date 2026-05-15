import { defineConfig } from "astro/config";

// GitHub project Pages: /raastey-status/  ·  Custom domain: ASTRO_BASE=/ in Actions
const base = process.env.ASTRO_BASE ?? "/raastey-status/";

export default defineConfig({
  site: "https://status.raastey.app",
  base,
  trailingSlash: "always",
  output: "static",
  build: {
    format: "directory",
  },
});
