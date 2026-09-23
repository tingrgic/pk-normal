import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
await mkdir("docs/qa", { recursive: true });
const browser = await chromium.launch({
  executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE,
  headless: true,
  args: ["--no-sandbox", "--enable-unsafe-swiftshader"],
});
const page = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
});
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (msg) => {
  if (msg.type() === "error") errors.push(msg.text());
});
await page.goto(process.env.QA_BASE_URL || "http://localhost:4173");
await page.locator('[data-phase="complete"]').waitFor({ timeout: 30000 });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(1100);
await page.screenshot({ path: "docs/qa/desktop-hero.png" });
await page.screenshot({ path: "docs/qa/desktop-full.png", fullPage: true });
for (const [width, height] of [
  [390, 844],
  [430, 932],
  [844, 390],
  [932, 430],
  [768, 1024],
  [1024, 768],
  [1366, 768],
  [1920, 1080],
]) {
  await page.setViewportSize({ width, height });
  await page.waitForTimeout(250);
  const metrics = await page.evaluate(() => ({
    width: innerWidth,
    scroll: document.documentElement.scrollWidth,
    height: document.documentElement.scrollHeight,
  }));
  console.log(width + "x" + height, metrics);
  await page.screenshot({
    path: "docs/qa/" + width + "x" + height + "-hero.png",
  });
  if (width === 390 || width === 430)
    await page.screenshot({
      path: "docs/qa/" + width + "-full.png",
      fullPage: true,
    });
}
await page.setViewportSize({ width: 390, height: 844 });
await page.emulateMedia({ reducedMotion: "reduce" });
await page.locator('[data-phase="complete"]').waitFor();
await page.screenshot({ path: "docs/qa/reduced-motion-mobile.png" });
await page.getByRole("button", { name: "IZBORNIK — otvori" }).click();
await page.screenshot({ path: "docs/qa/mobile-menu.png" });
console.log("ERRORS", errors);
await browser.close();
