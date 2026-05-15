import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://status.raastey.app",
  output: "static",
  build: {
    format: "directory",
  },
});
