import { chromium, expect } from '@playwright/test';
const browser = await chromium.launch({args:['--no-sandbox']});
const page = await browser.newPage({reducedMotion:'reduce'});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
for(const [width,height] of [[390,844],[430,932],[844,390],[932,430],[768,1024],[1024,768],[1366,768],[1440,900],[1920,1080]]){
 await page.setViewportSize({width,height});
 await page.goto('http://localhost:4173/');
 await expect(page.locator('.hero')).toHaveAttribute('data-phase','complete');
 await page.locator('#sponzori').scrollIntoViewIfNeeded();
 await page.locator('#sponzori').screenshot({path:`docs/qa/sponsors-refined-${width}.png`});
 expect(await page.locator('.sponsors-logo').evaluate(el=>getComputedStyle(el).backgroundColor)).toBe('rgba(0, 0, 0, 0)');
 await expect(page.locator('.sponsors-support')).toHaveCount(0);
 const nav=page.locator('.desktop-nav');
 if(await nav.isVisible()) {const a=await page.locator('.nav .wordmark').boundingBox(),b=await nav.boundingBox();expect(a.x+a.width).toBeLessThan(b.x);}
 await page.goto('http://localhost:4173/#dvoboji');
 await expect(page.locator('.odds-row')).toHaveCount(9);
 await page.locator('.odds-row').nth(1).getByRole('button').first().click();
 await page.mouse.move(0,0);
 await page.screenshot({path:`docs/qa/odds-full-${width}.png`,fullPage:true});
 await page.locator('.odds-workspace').screenshot({path:`docs/qa/odds-workspace-${width}.png`});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 console.log(`${width}x${height} checked`);
}
await page.getByRole('link',{name:'Natrag u klub'}).click();
await expect(page.locator('#prognoze')).toBeVisible();
await expect.poll(()=>page.locator('#prognoze').evaluate(e=>Math.abs(e.getBoundingClientRect().top))).toBeLessThan(150);
expect(errors).toEqual([]);
await browser.close();
