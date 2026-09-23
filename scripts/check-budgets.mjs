import { readFileSync, readdirSync } from "node:fs";
import { gzipSync } from "node:zlib";

const assets = readdirSync("dist/assets");
for (const [label, pattern, budget] of [
  ["Initial JS (app + shared motion/runtime)", /^(?:index|motion|rolldown-runtime)-.*\.js$/, 160_000],
  ["Deferred scene", /^three-.*\.js$/, 175_000],
]) {
  const files = assets.filter((name) => pattern.test(name));
  if (!files.length) throw new Error(`Missing ${label} JavaScript bundle`);
  const bytes = files.reduce((sum, file) => sum + gzipSync(readFileSync(`dist/assets/${file}`)).length, 0);
  console.log(`${label} gzip: ${(bytes / 1000).toFixed(1)} kB / ${budget / 1000} kB`);
  if (bytes > budget) throw new Error(`${label} exceeds its compressed JavaScript budget`);
}
const html = readFileSync("dist/index.html", "utf8");
if (/<link[^>]+rel="modulepreload"[^>]+href="[^"]*(?:three-|CityMap-)/.test(html)) {
  throw new Error("Scene or map has leaked into the initial module preloads");
}
