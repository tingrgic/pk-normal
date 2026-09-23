import { build } from "vite";
import react from "@vitejs/plugin-react";
import { readFileSync, writeFileSync, rmSync } from "node:fs";
await build({
  configFile: false,
  base: process.env.SITE_BASE || "/",
  plugins: [react()],
  ssr: { noExternal: ["gsap"] },
  build: {
    ssr: "src/entry-server.tsx",
    outDir: ".prerender",
    emptyOutDir: true,
  },
});
const { render } = await import("../.prerender/entry-server.js");
const html = readFileSync("dist/index.html", "utf8");
writeFileSync(
  "dist/index.html",
  html.replace(
    '<div id="root"></div>',
    '<div id="root">' + render() + "</div>",
  ),
);
rmSync(".prerender", { recursive: true, force: true });
