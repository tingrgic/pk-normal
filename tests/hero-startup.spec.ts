import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("slow scene loading shows the opening image and early skip cannot restart the flight", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  let release!: () => void;
  const gate = new Promise<void>((resolve) => { release = resolve; });
  await page.route(/\/assets\/three-.*\.js/, async (route) => {
    await gate;
    await route.continue();
  });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.locator(".hero")).toHaveAttribute("data-phase", "loading");
  await expect(page.locator(".scene-opening")).toBeVisible();
  await expect.poll(() => page.locator(".scene-opening img").evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
  await page.screenshot({ path: "test-results/hero-loading-desktop.png" });
  await page.getByRole("button", { name: "Preskoči uvod" }).click();
  await expect(page.locator(".scene-poster")).toBeVisible();
  await expect(page.locator(".hero-caption")).toHaveCSS("opacity", "1");
  const phases: string[] = [];
  await page.exposeFunction("recordHeroPhase", (phase: string) => phases.push(phase));
  await page.evaluate(() => {
    const hero = document.querySelector(".hero")!;
    new MutationObserver(() => (window as any).recordHeroPhase(hero.getAttribute("data-phase")))
      .observe(hero, { attributes: true, attributeFilter: ["data-phase"] });
  });
  release();
  await expect(page.locator(".hero")).toHaveAttribute("data-phase", "complete", { timeout: 15000 });
  expect(phases).not.toContain("side");
});

test("desktop startup loads reflections in parallel and reaches the first frame promptly", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.addInitScript(() => {
    new MutationObserver(() => {
      if (document.querySelector('.hero[data-phase="side"]') && !performance.getEntriesByName("hero-first-frame").length) {
        performance.mark("hero-first-frame");
      }
    }).observe(document, { subtree: true, attributes: true, attributeFilter: ["data-phase"] });
  });
  await page.goto("/");
  await expect(page.locator(".hero")).toHaveAttribute("data-phase", "complete", { timeout: 15000 });
  const timing = await page.evaluate(() => {
    const resources = performance.getEntriesByType("resource") as PerformanceResourceTiming[];
    const scene = resources.find((entry) => /\/assets\/three-.*\.js/.test(entry.name))!;
    const reflections = resources.filter((entry) => entry.name.endsWith("/studio-reflections.webp"));
    return {
      firstFrameMs: Math.round(performance.getEntriesByName("hero-first-frame")[0].startTime),
      sceneStartMs: Math.round(scene.startTime),
      reflectionStartMs: Math.round(reflections[0].startTime),
      reflectionRequests: reflections.length,
      mapRequested: resources.some((entry) => /CityMap-|maplibre/.test(entry.name)),
    };
  });
  console.log("Hero startup (local software-rendered Chromium):", timing);
  expect(timing.firstFrameMs).toBeLessThan(6000);
  expect(timing.reflectionStartMs).toBeLessThanOrEqual(timing.sceneStartMs + 50);
  expect(timing.reflectionRequests).toBe(1);
  expect(timing.mapRequested).toBe(false);
});

test("reduced motion and direct tool routes do not request the cinema", async ({ page }) => {
  const requests: string[] = [];
  page.on("request", (request) => requests.push(request.url()));
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".scene-poster")).toBeVisible();
  await expect(page.locator(".scene-opening")).toBeHidden();
  expect(requests.some((url) => /\/assets\/three-|studio-reflections/.test(url))).toBe(false);
  await page.goto("about:blank");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  requests.length = 0;
  await page.goto("/#brojac");
  await expect(page.locator(".counter")).toBeVisible();
  expect(requests.some((url) => /\/assets\/three-|studio-reflections/.test(url))).toBe(false);
  await page.goto("/");
  await expect(page.locator(".hero")).toHaveAttribute("data-phase", "complete", { timeout: 15000 });
  expect(requests.some((url) => /\/assets\/three-/.test(url))).toBe(true);
});

test("missing reflections still allow the flight and context loss preserves the final poster", async ({ page }) => {
  await page.route("**/studio-reflections.webp", (route) => route.abort());
  await page.goto("/");
  await expect(page.locator(".hero")).toHaveAttribute("data-phase", "complete", { timeout: 15000 });
  await page.locator(".scene-frame canvas").evaluate((canvas: HTMLCanvasElement) => {
    const extension = canvas.getContext("webgl2")!.getExtension("WEBGL_lose_context")!;
    (window as any).__contextExtension = extension;
    extension.loseContext();
  });
  await expect(page.locator(".hero")).toHaveAttribute("data-phase", "fallback");
  await expect(page.locator(".scene-poster")).toBeVisible();
  await expect(page.locator(".scene-frame canvas")).toBeHidden();
  await page.locator(".scene-frame canvas").evaluate((canvas: HTMLCanvasElement) => new Promise<void>((resolve) => {
    canvas.addEventListener("webglcontextrestored", () => resolve(), { once: true });
    (window as any).__contextExtension.restoreContext();
  }));
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".hero")).toHaveAttribute("data-phase", "complete");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(page.locator(".hero")).toHaveAttribute("data-static", "false");
  await expect(page.locator(".hero")).toHaveAttribute("data-phase", "complete", { timeout: 15000 });
  await expect(page.locator(".scene-frame canvas")).toBeVisible();
});

test("desktop tools disclosure supports keyboard, escape, focus exit and navigation", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const trigger = page.locator(".nav-tools summary");
  await trigger.focus();
  await page.keyboard.press("Enter");
  await page.keyboard.press("Tab");
  await expect(page.locator(".nav-tools a").first()).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  await expect(page.locator(".nav-tools")).not.toHaveAttribute("open", "");
  await trigger.click();
  expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);
  await page.locator(".nav-shop").focus();
  await expect(page.locator(".nav-tools")).not.toHaveAttribute("open", "");
  await trigger.click();
  await page.locator(".nav-tools a").first().click();
  await expect(page.locator(".counter")).toBeVisible();
});
