import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";
import { emitVerifiedStats } from "./scripts/emitVerifiedStats";
import { emitSitemap } from "./scripts/emitSitemap";
import { emitSeoManifest } from "./scripts/emitSeoManifest";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), viteSingleFile(), emitVerifiedStats(), emitSitemap(), emitSeoManifest()],
  server: {
    host: "0.0.0.0",
    // Dev preview only. `server` config does not affect the production build.
    allowedHosts: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
