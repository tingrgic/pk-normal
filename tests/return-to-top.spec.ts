import { test, expect } from "@playwright/test";

for (const reducedMotion of ["reduce", "no-preference"] as const) {
  test(`return to top preserves the document and settles the hero (${reducedMotion})`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion });
    let release!: () => void;
    const sceneReady = new Promise<void>((resolve) => { release = resolve; });
    if (reducedMotion === "no-preference") {
      await page.route(/\/assets\/three-.*\.js/, async (route) => {
        await sceneReady;
        await route.continue();
      });
    }
    await page.goto("/#shop");
    await page.getByRole("link", { name: "Natrag u klub" }).first().click();
    await expect(page.locator("#merch")).toBeVisible();
    await page.evaluate(() => {
      (window as any).__originalCanvas = document.querySelector(".scene-frame canvas");
      (window as any).__originalTimeOrigin = performance.timeOrigin;
    });
    const top = page.getByRole("link", { name: "Na vrh" });
    await top.scrollIntoViewIfNeeded();
    await top.focus();
    await page.keyboard.press("Enter");
    await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
    await expect(page).toHaveURL(/#pocetak$/);
    await expect(page.locator(".nav .wordmark")).toBeFocused();
    if (reducedMotion === "no-preference") {
      await expect(page.locator(".hero")).toHaveAttribute("data-phase", "fallback");
      await expect(page.locator(".scene-poster")).toBeVisible();
    }
    release();
    await expect(page.locator(".hero")).toHaveAttribute("data-phase", "complete", { timeout: 15000 });
    expect(await page.evaluate(() =>
      (window as any).__originalCanvas === document.querySelector(".scene-frame canvas") &&
      (window as any).__originalTimeOrigin === performance.timeOrigin,
    )).toBe(true);
    if (reducedMotion === "no-preference") {
      await page.getByRole("button", { name: "Ponovi" }).click();
      await expect(page.locator(".hero")).toHaveAttribute("data-phase", "side");
    }
  });
}
