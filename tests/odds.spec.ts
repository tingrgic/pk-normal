import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { newGame, play, quote, restore, SAVE_KEY } from '../src/odds/engine';
import { oddsSnapshot } from '../src/data/club';
const neutral = {duelsWon:0,duelsLost:0,legsWon:0,legsLost:0};
const good = {wins:4,losses:0,legsWon:8,legsLost:0};
const poor = {wins:0,losses:4,legsWon:0,legsLost:8};
test('model: symmetric, finite, conservative, complementary and monotonic',()=>{
 const even = quote(undefined,neutral,undefined,neutral);
 expect(even).toEqual({probability:.5,home:2,away:2});
 const a = quote(good,neutral,poor,neutral), b=quote(poor,neutral,good,neutral);
 expect(a.probability).toBeGreaterThan(.5);
 expect(a.probability+b.probability).toBeCloseTo(1);
 expect(1/a.home+1/a.away).toBeCloseTo(1);
 expect(a.probability).toBeLessThanOrEqual(.85);
 expect(quote({wins:400,losses:0,legsWon:800,legsLost:0},neutral,poor,neutral).probability).toBeGreaterThan(a.probability);
});
test('virtual ledger: deterministic payout, no overspending, bounded history and invalid save recovery',()=>{
 const pick = {player:'Tin',opponent:'Matej',team:'PKZ',side:'home' as const,odds:2,probability:.5};
 const win=play(newGame(),pick,20,.1,'win');
 expect(win.balance).toBe(1020); expect(win.history[0].payout).toBe(40);
 const lose=play(win,pick,100,.9,'lose'); expect(lose.balance).toBe(920);
 expect(restore(JSON.stringify(lose))).toEqual(lose);
 for (const stake of [101, 500, 1000]) {
  const game = play(newGame(), pick, stake, .1, 'large');
  expect(game.balance).toBe(1000 + stake);
  expect(restore(JSON.stringify(game))).toEqual(game);
 }
 expect(play(newGame(), pick, 1000, .9, 'all-in').balance).toBe(0);
 const large = play({...newGame(), balance: 100000001}, pick, 100000001, .1, 'large-save');
 expect(restore(JSON.stringify(large))).toEqual(large);
 expect(() => play({...newGame(), balance: Number.MAX_SAFE_INTEGER}, pick, Number.MAX_SAFE_INTEGER, .1, 'overflow')).toThrow();
 for(const stake of [0,9,1001,NaN,Infinity,10.5,Number.MAX_SAFE_INTEGER+1]) expect(()=>play(newGame(),pick,stake,.2,'bad')).toThrow();
 expect(()=>play({...newGame(),balance:10},pick,20,.2,'bad')).toThrow();
 expect(()=>play(newGame(),pick,20,1,'bad')).toThrow();
 expect(restore('{broken')).toEqual(newGame());
 expect(restore(JSON.stringify({...win,balance:-1}))).toEqual(newGame());
 expect(restore(JSON.stringify({...win,history:[{...win.history[0],payout:50000}]}))).toEqual(newGame());
 let game=newGame();for(let i=0;i<25;i++) game=play(game,pick,10,.1,String(i));expect(game.history).toHaveLength(20);
});
test('official snapshot reconciles individual and team duel and leg counts',()=>{
 for(const team of oddsSnapshot.teams){
  const ps=oddsSnapshot.players.filter(p=>p.team===team.name);
  expect(ps.reduce((n,p)=>n+p.wins,0)).toBe(team.duelsWon);
  expect(ps.reduce((n,p)=>n+p.losses,0)).toBe(team.duelsLost);
  expect(ps.reduce((n,p)=>n+p.legsWon,0)).toBe(team.legsWon);
  expect(ps.reduce((n,p)=>n+p.legsLost,0)).toBe(team.legsLost);
 }
});
test('all nine players, selection, play, refresh persistence, empty data and reset',async({page})=>{
 await page.addInitScript(()=>{Object.defineProperty(crypto,'randomUUID',{value:undefined});});
 await page.goto('/#dvoboji');
 await expect(page.locator('.odds-row')).toHaveCount(9);
 await expect(page.locator('.odds-player').filter({hasText:'Bez nastupa'})).toHaveCount(5);
 await page.locator('.odds-row').nth(1).getByRole('button').first().click();
 await page.getByLabel('Ulog u bodovima').fill('1000');
 await page.getByRole('button',{name:'Simuliraj dvoboj'}).click();
 await expect(page.getByRole('status')).toContainText('Simulacija:');
 await expect(page.locator('.odds-history li')).toHaveCount(1);
 const balance=await page.locator('.odds-balance').innerText();
 await page.reload();await expect(page.locator('.odds-balance')).toHaveText(balance);
 await expect(page.locator('.odds-history li')).toHaveCount(1);
 await page.getByLabel('01 / Protivnička ekipa').selectOption('BLACK M');
 await expect(page.getByLabel('02 / Protivnički igrač')).toBeDisabled();
 await expect(page.locator('.odds-row button:disabled')).toHaveCount(18);
 await page.getByLabel('01 / Protivnička ekipa').selectOption('ZAGREB');
 await expect(page.locator('.odds-row button:disabled')).toHaveCount(0);
 await page.getByLabel('02 / Protivnički igrač').selectOption('Goran Chudy');
 await expect(page.locator('#odds-markets-title')).toContainText('Goran Chudy');
 page.once('dialog',d=>d.accept());await page.getByRole('button',{name:'Vrati početnih'}).click();
 await expect(page.locator('.odds-history')).toHaveCount(0);
 expect(await page.evaluate(key=>JSON.parse(localStorage.getItem(key)!).balance,SAVE_KEY)).toBe(1000);
 await page.getByRole('link',{name:'Natrag u klub'}).click();
 await expect(page.locator('#prognoze')).toBeVisible();
 await expect.poll(()=>page.locator('#prognoze').evaluate(el=>Math.abs(el.getBoundingClientRect().top))).toBeLessThan(150);
});
test('storage blocked still allows virtual play',async({page})=>{
 await page.addInitScript(()=>{Storage.prototype.setItem=()=>{throw new Error('blocked');};});
 await page.goto('/#dvoboji');
 await expect(page.getByText('Preglednik ne dopušta spremanje.',{exact:false})).toBeVisible();
 await page.locator('.odds-row button').first().click();
 await page.getByRole('button',{name:'Simuliraj dvoboj'}).click();
 await expect(page.locator('.odds-history li')).toHaveCount(1);
});
test('odds layouts, keyboard access and accessibility',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto('/#dvoboji');
 for(const [width,height] of [[390,844],[430,932],[844,390],[932,430],[768,1024],[1024,768],[1366,768],[1440,900],[1920,1080]]){
  await page.setViewportSize({width,height});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 }
 for(const width of [390,1440]){
  await page.setViewportSize({width,height:900});
  const button=page.locator('.odds-row button').first();await button.focus();await page.keyboard.press('Enter');await expect(button).toHaveAttribute('aria-pressed','true');
  expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()).violations).toEqual([]);
 }
});
