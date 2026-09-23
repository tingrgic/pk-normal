import { chromium } from "@playwright/test";
// Run against the development server; capture hooks never enter the production build.
const browser = await chromium.launch({
  executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE,
  args: ["--no-sandbox", "--enable-unsafe-swiftshader"],
});
for (const [width, height, name] of [
  [1440, 900, "hero-poster"],
  [768, 1024, "hero-poster-tablet"],
  [430, 932, "hero-poster-mobile"],
]) {
  const page = await browser.newPage({
    viewport: { width, height },
    reducedMotion: "no-preference",
    deviceScaleFactor: 1.5,
  });
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
  await page.goto(process.env.QA_BASE_URL || "http://localhost:5173");
  await page.locator('[data-phase="complete"]').waitFor();
  await page.addStyleTag({
    content:
      ".nav,.hero-title,.hero-topline,.hero-caption,.hero-bottom,.impact-ring,.scene-opening{visibility:hidden!important}.hero{background:transparent!important}body{background:transparent!important}",
  });
  await page
    .locator(".scene-frame canvas")
    .screenshot({ path: "docs/qa/" + name + ".png", omitBackground: true });
  {
    // Start the first-flight pose, then freeze its actual first frame.
    await page.evaluate(() => {
      document.querySelector(".replay").click();
      const timeline = window.__qaGsap.globalTimeline.getChildren(false, false, true)
        .find((item) => item.duration() > 3);
      timeline.pause().time(0);
    });
    await page.locator('[data-phase="side"]').waitFor();
    await page.locator(".scene-frame canvas").screenshot({
      path: "docs/qa/" + name.replace("poster", "opening") + ".png",
      omitBackground: true,
    });
  }
  await page.close();
}
await browser.close();
