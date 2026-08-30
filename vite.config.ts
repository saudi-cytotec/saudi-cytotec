import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";
import { emitVerifiedStats } from "./scripts/emitVerifiedStats";
import { emitSitemap } from "./scripts/emitSitemap";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), viteSingleFile(), emitVerifiedStats(), emitSitemap()],
  server: {
    host: "0.0.0.0",
    // Dev preview only. `server` config does not affect the production build.
    allowedHosts: true,
    // In production the /api/* Vercel functions serve these routes. In local
    // dev they are proxied to scripts/devApi.mjs (see npm run dev:api) so the
    // admin UI can be tested end-to-end.
    proxy: {
      "/api": {
        target: `http://127.0.0.1:${process.env.DEV_API_PORT || 8787}`,
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
