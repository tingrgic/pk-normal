import { chromium } from "@playwright/test";
const browser = await chromium.launch({
 executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE,
 args: ["--no-sandbox", "--enable-unsafe-swiftshader"],
});
for (const [width,height] of [[390,844],[430,932],[844,390],[932,430],[768,1024],[1024,768],[1366,768],[1440,900],[1920,1080]]) {
 const page = await browser.newPage({viewport:{width,height},reducedMotion:"reduce"});
 await page.goto("http://localhost:4173/#brojac");
 await page.getByRole("heading",{level:1}).filter({hasText:"TI BACAJ"}).waitFor();
 await page.screenshot({path:`docs/qa/counter-setup-${width}.png`,fullPage:true});
 const setupOverflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
 await page.getByLabel("Ime igrača 1",{exact:true}).fill("Tin");
 await page.getByLabel("Ime igrača 2",{exact:true}).fill("Rikard");
 await page.getByRole("button",{name:"Dogovori redoslijed"}).click();
 if(width===390) await page.screenshot({path:"docs/qa/counter-order-390.png",fullPage:true});
 await page.getByRole("button",{name:"Počni igru"}).click();
 await page.getByRole("button",{name:"Triple ×3"}).click();
 await page.getByRole("button",{name:"T20",exact:true}).click();
 await page.screenshot({path:`docs/qa/counter-match-${width}.png`,fullPage:true});
 console.log(width,height,{setupOverflow,matchOverflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)});
 await page.close();
}
await browser.close();
