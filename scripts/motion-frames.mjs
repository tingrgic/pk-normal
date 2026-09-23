import { chromium } from "@playwright/test";
const browser = await chromium.launch({
  executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE,
  args: ["--no-sandbox", "--enable-unsafe-swiftshader"],
});
for (const [width, height] of [
  [1440, 900],
  [390, 844],
]) {
  const page = await browser.newPage({ viewport: { width, height } });
  // Test-only instrumentation of the dev module; no debug API ships to production.
  await page.route("**/src/three/scene.ts*", async (route) => {
    const response = await route.fetch();
    await route.fulfill({
      response,
      body: (await response.text()).replace(
        'onPhase("side");',
        'onPhase("side"); landing.set(0, 0);',
      ) + "\nwindow.__qaGsap=gsap;",
    });
  });
  await page.goto("http://localhost:5173");
  await page.locator('[data-phase="complete"]').waitFor({ timeout: 30000 });
  await page.getByRole("button", { name: "Ponovi bacanje" }).click();
  const times = width < 700 ? [0.5, 1.65, 2.28, 2.7] : [0.35, 1.45, 2.3, 2.7];
  for (const [i, phase] of ["side", "orbit", "follow", "impact"].entries()) {
    await page.evaluate((time) => {
      const timeline = window.__qaGsap.globalTimeline
        .getChildren(false, false, true)
        .find((t) => t.duration() > 3);
      timeline.pause().time(time);
    }, times[i]);
    await page.screenshot({
      path: "docs/qa/motion-final-" + width + "-" + phase + ".png",
    });
  }
  await page.close();
}
await browser.close();
