import { test, expect } from "@playwright/test";
import { rhythm } from "../src/data/rhythm";

test("180 distinct descriptions fit and remain browsable at all nine viewports", async ({ page }) => {
  test.setTimeout(120000);
  expect(rhythm).toHaveLength(180);
  expect(new Set(rhythm.map(entry => entry.name)).size).toBe(180);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const carousel = page.locator(".identity-swipe");
  for (const [width, height] of [[390,844],[430,932],[844,390],[932,430],[768,1024],[1024,768],[1366,768],[1440,900],[1920,1080]]) {
    await page.setViewportSize({ width, height });
    await carousel.focus();
    await page.keyboard.press("Home");
    for (let i = 0; i < rhythm.length; i++) {
      const fits = await page.locator("#identity-title").evaluate(title => {
        const stage = title.parentElement!.getBoundingClientRect();
        const rects = [...title.querySelectorAll(".identity-word")].map(word => { const range = document.createRange(); range.selectNodeContents(word); return range.getBoundingClientRect(); });
        return rects.every(rect => rect.left >= stage.left && rect.right <= stage.right && rect.top >= stage.top && rect.bottom <= stage.bottom) && document.documentElement.scrollWidth <= innerWidth;
      });
      expect(fits, `${width}×${height}: ${rhythm[i].name}`).toBe(true);
      await page.keyboard.press("ArrowRight");
    }
    await page.keyboard.press("ArrowRight");
    await carousel.evaluate(element => (element as HTMLElement).blur());
    await page.locator(".identity").screenshot({ path: `test-results/rhythm-${width}x${height}.png` });
  }
});

test("touch swipes navigate both ways; taps, vertical scroll and cancellation do not", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto("/");
  const stage = page.locator(".identity-stage");
  await stage.scrollIntoViewIfNeeded();
  const box = (await stage.boundingBox())!;
  const x = box.x + box.width / 2, y = box.y + box.height / 2;
  const client = await context.newCDPSession(page);
  const swipe = async (dx: number, dy: number) => {
    await client.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y }] });
    for (let i = 1; i <= 6; i++) await client.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: x + dx * i / 6, y: y + dy * i / 6 }] });
    await client.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  };
  const count = page.locator(".rhythm-count");
  await swipe(-110, 3); await expect(count).toHaveText("002/ 180");
  await swipe(110, 3); await expect(count).toHaveText("001/ 180");
  await page.touchscreen.tap(x, y); await expect(count).toHaveText("001/ 180");
  const scroll = await page.evaluate(() => scrollY);
  await swipe(2, -100); await expect(count).toHaveText("001/ 180");
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(scroll);
  await stage.scrollIntoViewIfNeeded();
  const cancelBox = (await stage.boundingBox())!;
  await client.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: cancelBox.x + 200, y: cancelBox.y + 150 }] });
  await client.send("Input.dispatchTouchEvent", { type: "touchCancel", touchPoints: [] });
  await expect(count).toHaveText("001/ 180");
  await context.close();
});

test("desktop drag and assistive controls navigate without clickable word tabs", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const stage = page.locator(".identity-stage");
  await stage.scrollIntoViewIfNeeded();
  const box = (await stage.boundingBox())!;
  await page.mouse.move(box.x + box.width * .6, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * .3, box.y + box.height / 2, { steps: 8 });
  await page.mouse.up();
  await expect(page.locator(".rhythm-count")).toHaveText("002/ 180");
  await page.getByRole("button", { name: "Prethodni opis" }).focus();
  await page.keyboard.press("Enter");
  await expect(page.locator(".rhythm-count")).toHaveText("001/ 180");
  await expect(page.locator(".principle-tabs")).toHaveCount(0);
});

test("translated adjectives fit on phone and desktop without resetting the selection", async ({ page }) => {
  test.setTimeout(60000);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  for (const language of ["English", "Deutsch"]) {
    await page.getByRole("button", { name: language, exact: true }).click();
    for (const width of [390, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.locator(".identity-swipe").focus();
      await page.keyboard.press("Home");
      for (let i = 0; i < rhythm.length; i++) {
        const fits = await page.locator("#identity-title").evaluate(title => {
          const stage = title.parentElement!.getBoundingClientRect();
          return [...title.querySelectorAll(".identity-word")].every(word => {
            const range = document.createRange(); range.selectNodeContents(word);
            const rect = range.getBoundingClientRect();
            return rect.left >= stage.left && rect.right <= stage.right && rect.top >= stage.top && rect.bottom <= stage.bottom;
          });
        });
        expect(fits, `${language} ${width}: ${rhythm[i].name}`).toBe(true);
        await page.keyboard.press("ArrowRight");
      }
    }
  }
  await page.keyboard.press("End");
  await page.getByRole("button", { name: "Hrvatski", exact: true }).click();
  await expect(page.locator(".rhythm-count")).toHaveText("180/ 180");
  expect(rhythm.map(r => (r.name + ".").toLocaleUpperCase("hr"))).toContain((await page.locator("#identity-title").innerText()).replace(/\s+/g," "));
});
