import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
test('merch filters, favourites persistence, dialog focus and club return', async ({ page }) => {
  await page.goto('/#shop');
  await expect(page.locator('.merch-product')).toHaveCount(12);
  await page.getByRole('button', { name: 'Istraži kolekciju' }).click();
  await expect(page).toHaveURL(/#shop$/);
  await expect(page.locator('#merch-collection')).toBeFocused();
  const open = page.getByRole('button', { name: 'Pogledaj koncept: Double out', exact: true });
  await open.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('dialog').getByRole('button', { name: 'Spremi u izbor' }).click();
  await page.keyboard.press('Escape');
  await expect(open).toBeFocused();
  await page.getByRole('button', { name: 'Moj izbor' }).click();
  await expect(page.locator('.merch-product')).toHaveCount(1);
  await page.reload();
  await expect(page.getByRole('button', { name: 'Moj izbor' })).toContainText('01');
  await page.getByRole('button', { name: 'Za igru', exact: true }).click();
  await expect(page.locator('.merch-product')).toHaveCount(1);
  await page.getByRole('button', { name: 'Sve', exact: true }).click();
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
  await page.getByRole('link', { name: 'Natrag u klub' }).first().click();
  await expect(page.locator('#merch')).toBeVisible();
});
for (const [width, height] of [[390,844],[430,932],[844,390],[932,430],[768,1024],[1024,768],[1366,768],[1440,900],[1920,1080]]) {
  test(`merch viewport ${width}x${height}`, async ({ page }) => {
    await page.setViewportSize({width,height});
    await page.emulateMedia({reducedMotion:'reduce'});
    await page.goto('/#shop');
    await expect(page.locator('.merch-product')).toHaveCount(12);
    for (const image of await page.locator('.merch-page img').all()) await image.scrollIntoViewIfNeeded();
    await page.waitForFunction(() => Array.from(document.querySelectorAll<HTMLImageElement>('.merch-page img')).every(i => i.complete && i.naturalWidth > 0));
    await page.evaluate(() => window.scrollTo(0,0));
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
    await expect(page.getByRole('heading',{level:1})).toHaveCount(1);
    await page.screenshot({path:`docs/qa/merch-${width}x${height}.png`,fullPage:true});
    await page.getByRole('button',{name:'English',exact:true}).click();
    await expect(page.getByRole('heading',{level:1})).toContainText('ABNORMAL');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
    await page.getByRole('button',{name:'Deutsch',exact:true}).click();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  });
}
