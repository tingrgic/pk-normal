import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("cinema completes, replays, skips and has no runtime or hydration errors", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  await page.goto("/");
  await expect(page.locator(".hero")).toHaveAttribute(
    "data-phase",
    "complete",
    { timeout: 20000 },
  );
  await expect(page.getByRole("heading", { level: 1 })).toContainText("NORMAL");
  await page.getByRole("button", { name: "Ponovi bacanje" }).click();
  await expect(page.locator(".hero")).toHaveAttribute("data-phase", "side");
  await page.getByRole("button", { name: "Preskoči uvod" }).click();
  await expect(page.locator(".hero")).toHaveAttribute("data-phase", "complete");
  await expect(page.locator("canvas")).toHaveCount(1);
  expect(errors).toEqual([]);
});
for (const [width, height] of [
  [390, 844],
  [430, 932],
  [844, 390],
  [932, 430],
  [768, 1024],
  [1024, 768],
  [1366, 768],
  [1440, 900],
  [1920, 1080],
]) {
  test("responsive " + width + "×" + height, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await expect(page.locator(".hero")).toHaveAttribute(
      "data-phase",
      "complete",
    );
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBeTruthy();
    await expect(
      page.getByRole("heading", { name: "SVATKO SVOJ. ZAJEDNO NORMAL." }),
    ).toBeVisible();
    await expect(page.locator(".club-email")).toHaveAttribute(
      "href",
      "mailto:pikadonormal@gmail.com",
    );
    const a = await page.locator(".hero-caption").boundingBox();
    const b = await page.locator(".hero-bottom").boundingBox();
    expect(a!.y + a!.height).toBeLessThan(b!.y + 2);
    const title = await page.locator(".hero-title").boundingBox();
    expect(title!.y + title!.height + 16).toBeLessThan(a!.y);
  });
}
test("mobile navigation traps focus, closes with Escape, restores focus and navigates", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "IZBORNIK — otvori" });
  await trigger.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Shift+Tab");
  expect(
    await page.evaluate(() =>
      document.querySelector("dialog")!.contains(document.activeElement),
    ),
  ).toBeTruthy();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await page
    .getByRole("navigation", { name: "Mobilna navigacija" })
    .getByRole("link", { name: "Ekipa" })
    .click();
  await expect(page).toHaveURL(/#ekipa$/);
  await expect(page.getByRole("dialog")).not.toBeVisible();
  expect(await page.evaluate(() => document.body.style.overflow)).toBe("");
});
test("identity controls work with keyboard; reduced motion has no cinematic replay", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".hero")).toHaveAttribute("data-phase", "complete");
  await expect(
    page.getByRole("button", { name: "Ponovi bacanje" }),
  ).toHaveCount(0);
  const rhythm = page.locator(".identity-swipe");
  await rhythm.focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.locator("#identity-title")).not.toBeEmpty();
  await expect(page.locator(".rhythm-count")).toHaveText("002/ 180");
  await page.keyboard.press("Home");
  await page.keyboard.press("ArrowLeft");
  await expect(page.locator(".rhythm-count")).toHaveText("180/ 180");
  await page.keyboard.press("ArrowRight");
  await expect(page.locator(".rhythm-count")).toHaveText("001/ 180");
  await expect(page.locator("#identity-title")).toHaveCSS("animation-name", "none");
});
test("WebGL failure preserves content and static visual", async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (
      type: string,
      ...args: any[]
    ) {
      if (type.includes("webgl")) return null;
      return original.apply(this, [type, ...args] as any);
    } as typeof original;
  });
  await page.goto("/");
  await expect(page.locator(".hero")).toHaveAttribute("data-phase", "fallback");
  await expect(page.locator(".scene-poster")).toBeVisible();
  expect(
    await page
      .locator(".scene-poster img")
      .evaluate(
        (img: HTMLImageElement) => img.complete && img.naturalWidth > 0,
      ),
  ).toBeTruthy();
  await expect(page.locator(".club-email")).toBeVisible();
});
test("no JavaScript still serves full content and poster", async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.locator(".club-email")).toBeVisible();
  await expect(page.locator(".scene-poster")).toBeVisible();
  await expect(page.locator(".roster a")).toHaveCount(7);
  await context.close();
});
for (const width of [390, 1440]) {
  test("accessibility audit " + width, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await expect(page.locator(".hero")).toHaveAttribute(
      "data-phase",
      "complete",
    );
    const result = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(result.violations).toEqual([]);
  });
}
test("every local anchor resolves and roster profiles are official", async ({
  page,
}) => {
  await page.goto("/");
  const missing = await page
    .locator('a[href^="#"]')
    .evaluateAll((links) =>
      links
        .map((a) => a.getAttribute("href")!)
        .filter((href) => !document.getElementById(href.slice(1))),
    );
  expect(missing).toEqual([]);
  await expect(page.locator(".player-card")).toHaveCount(2);
  await expect(page.locator(".roster a")).toHaveCount(7);
});

test("skip works before the 3D module has loaded", async ({ page }) => {
  await page.route(/\/assets\/three-.*\.js/, async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 1200));
    await route.continue();
  });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: "Preskoči uvod" }).click();
  await expect(page.locator(".hero-caption")).toHaveCSS("opacity", "1");
  await expect(page.locator(".hero")).toHaveAttribute(
    "data-phase",
    /fallback|complete/,
  );
  await expect(page.locator(".hero")).toHaveAttribute(
    "data-phase",
    "complete",
    { timeout: 20000 },
  );
});
