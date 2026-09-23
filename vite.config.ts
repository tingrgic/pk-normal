import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig(({ mode }) => ({
  base: loadEnv(mode, process.cwd(), "").SITE_BASE || "/",
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // GSAP is used by the page and the scene. Give it its own shared chunk;
        // otherwise manual Three.js grouping pulls it (and Three.js) into startup.
        manualChunks: (id) =>
          id.includes("/gsap/") ? "motion" : id.includes("/three/") ? "three" : undefined,
      },
    },
  },
  server: { port: 5173, strictPort: true },
}));
