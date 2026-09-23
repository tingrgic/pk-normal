import fs from 'node:fs';import {chromium,expect} from '@playwright/test';
const catalog=JSON.parse(fs.readFileSync('src/i18n/catalog.json','utf8'));
const browser=await chromium.launch({args:['--no-sandbox','--enable-unsafe-swiftshader']});
const page=await browser.newPage({reducedMotion:'reduce'});const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.route('https://tiles.openfreemap.org/**',r=>r.abort());
for(const language of ['en','de']){
 await page.goto('http://localhost:4173/');await page.getByRole('button',{name:language==='en'?'English':'Deutsch',exact:true}).click();
 for(const route of ['','#brojac','#karta','#dvoboji']){
  await page.goto('http://localhost:4173/'+route);await expect(page.locator('html')).toHaveAttribute('lang',language);
  if(route)await expect(page.locator({ '#brojac':'.counter','#karta':'.atlas','#dvoboji':'.odds-page'}[route])).toBeVisible();
  const leftovers=await page.evaluate(({catalog,language})=>{const found=new Set();const walk=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);while(walk.nextNode()){const n=walk.currentNode;if(['SCRIPT','STYLE','NOSCRIPT'].includes(n.parentElement?.tagName))continue;const text=n.textContent.replace(/\s+/g,' ').trim();if(catalog[text]&&catalog[text][language]!==text)found.add(text);}for(const el of document.querySelectorAll('[aria-label],[placeholder]'))for(const attr of ['aria-label','placeholder']){const value=el.getAttribute(attr)?.trim();if(catalog[value]&&catalog[value][language]!==value)found.add(value);}return [...found];},{catalog,language});
  expect(leftovers,`${language} ${route}: untranslated interface strings`).toEqual([]);
  for(const [width,height] of [[390,844],[430,932],[844,390],[932,430],[768,1024],[1024,768],[1366,768],[1440,900],[1920,1080]]){
   await page.setViewportSize({width,height});
   const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
   if(overflow)console.log('OVERFLOW',language,route,width,await page.evaluate(()=>[...document.querySelectorAll('h1,h2,h3,nav,p,button,select,span')].filter(el=>{const r=el.getBoundingClientRect();return r.right>innerWidth+1&&r.width>0;}).slice(0,10).map(e=>[e.tagName,e.className,e.textContent.slice(0,50)])));
   expect(overflow,`${language} ${route} ${width}: overflow`).toBe(false);
   if(!route){await page.locator('.sponsors-logo img').scrollIntoViewIfNeeded();await expect(page.locator('.sponsors-logo img')).toHaveJSProperty('complete',true);await page.evaluate(()=>window.scrollTo(0,0));}
   if(width===390||width===1440)await page.screenshot({path:`docs/qa/i18n-${language}-${route.slice(1)||'landing'}-${width}.png`,fullPage:true});
  }
 }
}
expect(errors).toEqual([]);console.log('All routes, both languages, nine sizes: no untranslated catalogue strings, overflow or runtime errors.');await browser.close();
