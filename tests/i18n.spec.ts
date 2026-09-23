import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { translate } from '../src/i18n/translate';
import catalog from '../src/i18n/catalog.json' with {type:'json'};
import { calendarText } from '../src/atlas/calendar';
import { fixtures } from '../src/data/atlas';
const key='pk-normal-language-v1';
test('translation catalogue and calendar exports preserve data and placeholders',()=>{
 for(const [source,entry] of Object.entries(catalog))for(const language of ['en','de'] as const){
  expect(entry[language].trim(),source).not.toBe('');
  expect((entry[language].match(/\{\w+\}/g)||[]).sort(),source).toEqual((source.match(/\{\w+\}/g)||[]).sort());
 }
 expect(translate('Pomakni {name} gore','de',{name:'Tin Grgić'})).toBe('Tin Grgić nach oben verschieben');
 expect(translate('Tin Grgić','en')).toBe('Tin Grgić');
 expect(translate(' Natrag u klub ','en')).toBe(' Back to the club ');
 const unknown=fixtures.find(f=>!f.venueId)!;
 for(const [language,label] of [['en','Venue awaiting confirmation'],['de','Spielort noch unbestätigt']] as const){
  const calendar=calendarText([unknown],language).replace(/\r\n /g,'');
  expect(calendar).toContain('LOCATION:'+label);expect(calendar).toContain(unknown.id+'@pk-normal-calendar');expect(calendar).toContain(unknown.source);
 }
});
test('language toggle covers all routes, metadata, refresh, menus and sponsor labels',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.route('https://tiles.openfreemap.org/**',r=>r.abort());
 await page.setViewportSize({width:390,height:844});await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto('/');await page.getByRole('button',{name:'English',exact:true}).click();
 await expect(page.locator('html')).toHaveAttribute('lang','en');await expect(page).toHaveTitle('Normal darts club — Zagreb');
 await page.getByRole('button',{name:'MENU — open'}).click();await expect(page.getByRole('dialog')).toContainText('Sponsors');
 await page.getByRole('button',{name:'Close menu'}).click();
 await expect(page.locator('#sponzori')).toContainText('Become a sponsor');
 await page.reload();await expect(page.locator('html')).toHaveAttribute('lang','en');
 for(const [route,selector,english,german] of [
  ['#brojac','.counter','Game rules','Spielregeln'],['#karta','.atlas','MATCH ATLAS','SPIELATLAS'],['#dvoboji','.odds-page','How do we calculate?','Wie rechnen wir?']]){
  await page.goto('/'+route);await expect(page.locator(selector)).toContainText(english);
  await page.getByRole('button',{name:'Deutsch',exact:true}).click();await expect(page.locator(selector)).toContainText(german);
  await expect(page.locator('html')).toHaveAttribute('lang','de');await expect(page.getByRole('button',{name:'Deutsch',exact:true})).toHaveAttribute('aria-pressed','true');
  await page.getByRole('button',{name:'English',exact:true}).click();
 }
 expect(errors).toEqual([]);
});
test('counter language switch preserves names, entered darts, rules and saved session',async({page})=>{
 await page.goto('/#brojac');await page.getByRole('button',{name:'English',exact:true}).click();
 await expect(page.getByLabel('Player name 1',{exact:true})).toHaveValue('Player 1');
 await page.getByLabel('Player name 1',{exact:true}).fill('Tin Grgić');
 await page.getByRole('button',{name:'Set the order'}).click();await page.getByRole('button',{name:'Start game'}).click();
 await page.locator('.number-pad button').filter({hasText:/^20$/}).click();
 await expect(page.locator('.current-total strong')).toHaveText('481');
 await page.getByRole('button',{name:'Deutsch',exact:true}).click();
 await expect(page.locator('.current-total strong')).toHaveText('481');await expect(page.locator('.current-player h2')).toHaveText('Tin Grgić');
 await expect(page.locator('.score-list')).toContainText('Spieler 2');
 await page.locator('.counter-rules').first().locator('summary').click();await expect(page.locator('.counter-rules').first()).toContainText('Überwerfen');
 await page.reload();await page.getByRole('button',{name:'Spiel fortsetzen'}).click();await expect(page.locator('.current-total strong')).toHaveText('481');
 await page.getByRole('button',{name:'Hrvatski',exact:true}).click();await expect(page.locator('.current-player h2')).toHaveText('Tin Grgić');await expect(page.locator('.score-list')).toContainText('Igrač 2');
});
test('virtual duel messages and history follow language without resetting points',async({page})=>{
 await page.goto('/#dvoboji');await page.getByRole('button',{name:'English',exact:true}).click();
 await page.locator('.odds-row button').nth(2).click();await page.getByRole('button',{name:'Simulate duel',exact:true}).click();
 await expect(page.getByRole('status')).toContainText('Simulation:');
 const saved=await page.evaluate(()=>localStorage.getItem('pk-normal-virtual-duels-v1'));
 await page.getByRole('button',{name:'Deutsch',exact:true}).click();await expect(page.getByRole('status')).toContainText('Simulation:');
 await expect(page.getByRole('status')).not.toContainText('points');await expect(page.locator('.odds-history')).toContainText('Deine Simulationen.');
 expect(await page.evaluate(()=>localStorage.getItem('pk-normal-virtual-duels-v1'))).toBe(saved);
 page.once('dialog',async dialog=>{expect(dialog.message()).toContain('Simulationsverlauf');await dialog.dismiss();});
 await page.getByRole('button',{name:'Auf 1.000 Startpunkte zurücksetzen'}).click();await expect(page.locator('.odds-history li')).toHaveCount(1);
});
test('blocked preference storage leaves language selection functional',async({page})=>{
 await page.addInitScript(()=>{Storage.prototype.getItem=()=>{throw new Error('blocked');};Storage.prototype.setItem=()=>{throw new Error('blocked');};});
 await page.goto('/');await page.getByRole('button',{name:'Deutsch',exact:true}).click();await expect(page.locator('html')).toHaveAttribute('lang','de');await expect(page.locator('#about-title')).toContainText('NEUER NAME.');
});
for(const language of ['en','de'] as const)test(`all translated views: nine viewports and accessibility ${language}`,async({page})=>{
 await page.addInitScript(({key,language})=>localStorage.setItem(key,language),{key,language});await page.emulateMedia({reducedMotion:'reduce'});
 await page.route('https://tiles.openfreemap.org/**',r=>r.abort());
 for(const route of ['','#brojac','#karta','#dvoboji']){
  await page.goto('/'+route);await expect(page.locator('html')).toHaveAttribute('lang',language);
  if(route)await expect(page.locator({'#brojac':'.counter','#karta':'.atlas','#dvoboji':'.odds-page'}[route]!)).toBeVisible();
  for(const [width,height] of [[390,844],[430,932],[844,390],[932,430],[768,1024],[1024,768],[1366,768],[1440,900],[1920,1080]]){
   await page.setViewportSize({width,height});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${route} ${width}`).toBe(true);
  }
  await page.setViewportSize({width:390,height:844});expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()).violations,route).toEqual([]);
 }
});
