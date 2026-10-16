import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { fixtures, venues, ground, localTime, venueFor } from '../src/data/atlas';
import addresses from '../src/data/club-addresses.json' with { type: 'json' };
import { calendarText } from '../src/atlas/calendar';

test('verified fixture integrity and timezone-correct, folded calendar export',()=>{
 expect(fixtures).toHaveLength(21);
 expect(new Set(fixtures.map(f=>f.id)).size).toBe(fixtures.length);
 expect(fixtures.filter(f=>f.kind==='league')).toHaveLength(20);
 expect(fixtures.filter(f=>f.kind==='cup')).toHaveLength(1);
 for(const f of fixtures){expect(/^202[67]-/.test(f.startsAt)).toBe(true);expect([f.home,f.away]).toContain('NORMAL');expect(f.source.startsWith('https://psgz.hr/')).toBe(true);if(f.venueId)expect(venueFor(f)).toBeDefined();}
 expect(fixtures.filter(f=>!f.venueId).map(f=>f.home)).toEqual(['HOLLYWOOD PROMILI','MOZART DIAMANTI']);
 expect(ground(fixtures.find(f=>f.kind==='cup')!)).toBe('neutral');
 expect(localTime(fixtures.find(f=>f.id==='xgjjijwm')!)).toBe('19:00');
 const calendar=calendarText(fixtures);
 expect(calendar).toContain('DTSTART:20260918T170000Z');
 expect(calendar).toContain('DTSTART:20261106T180000Z');
 expect(calendar).toContain('DTSTART:20261011T080000Z');
 expect(calendar.match(/BEGIN:VEVENT/g)).toHaveLength(21);
 expect(calendar).not.toContain('DTEND:');
 for(const line of calendar.split('\r\n'))expect(new TextEncoder().encode(line).length).toBeLessThanOrEqual(75);
 for(const v of venues){expect(v.coordinates[0]).toBeGreaterThan(15.8);expect(v.coordinates[0]).toBeLessThan(16.2);expect(v.coordinates[1]).toBeGreaterThan(45.7);expect(v.coordinates[1]).toBeLessThan(45.9);}
});

test('every opponent has dated federation evidence and home fixtures use the host ground', () => {
 const opponents = new Set(fixtures.map(f => f.home === 'NORMAL' ? f.away : f.home));
 expect(opponents.size).toBe(11);
 for (const name of opponents) {
  const record = addresses.find(a => a.name === name);
  expect(record, name).toBeDefined();
  expect(record!.checked).toBe('2026-10-16');
  expect(record!.corroboratingSource).toBe('https://psgz.hr/hps/' + record!.slug);
 }
 for (const fixture of fixtures.filter(f => f.kind === 'league')) {
  const host = addresses.find(a => a.name === fixture.home)!;
  expect(host).toBeDefined();
  const venue = venueFor(fixture);
  if (host.address) {
   expect(venue?.source).toBe(host.source);
   expect(venue?.checked).toBe(host.checked);
  } else expect(venue).toBeUndefined();
 }
 expect(venueFor(fixtures.find(f => f.kind === 'cup')!)?.id).toBe('pivana');
});

test.describe('atlas interface independent of external map tiles',()=>{
 test.beforeEach(async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.route('https://tiles.openfreemap.org/**',route=>route.abort());
  await page.goto('/#karta');
  await expect(page.locator('#atlas-title')).toContainText('GRAD JE');
 });
 test('home/away/cup and month filtering, missing venue, clear empty state',async({page})=>{
  await page.getByRole('button',{name:'Kup',exact:true}).click();
  await expect(page.locator('.atlas-fixture')).toHaveCount(1);
  await expect(page.locator('.atlas-match-panel')).toContainText('Pivana');
  await expect(page.locator('.atlas-match-actions').getByRole('link',{name:'Upute za dolazak'})).toHaveAttribute('href',/Ilica%20222/);
  await page.getByLabel('Mjesec utakmice').selectOption('12');
  await expect(page.locator('.atlas-empty')).toBeVisible();
  await page.getByRole('button',{name:'Prikaži sve',exact:true}).click();
  await expect(page.locator('.atlas-fixture')).toHaveCount(21);
  await page.getByRole('button',{name:'Gosti',exact:true}).click();
  await expect(page.locator('.atlas-fixture')).toHaveCount(10);
  await page.getByRole('button',{name:/9\. listopada, HOLLYWOOD PROMILI/}).click();
  await expect(page.locator('.atlas-venue')).toContainText('Lokacija čeka potvrdu');
  await expect(page.locator('.atlas-match-actions').getByRole('link',{name:'Upute za dolazak'})).toHaveCount(0);
 });
 test('directory shows every dated report and both federation links without invented directions', async({page}) => {
  const directory = page.locator('.atlas-address-directory');
  await expect(directory.locator('article')).toHaveCount(12);
  await expect(directory.locator('time[datetime="2026-10-16"]')).toHaveCount(12);
  for (const name of ['HOLLYWOOD PROMILI', 'MOZART DIAMANTI']) {
   const row = directory.locator('article').filter({has: page.getByRole('heading', {name, exact:true})});
   await expect(row).toContainText('Adresa nije objavljena');
   await expect(row.getByRole('link')).toHaveCount(2);
   await expect(row.getByRole('link', {name:'Upute za dolazak'})).toHaveCount(0);
  }
  await expect(directory.getByRole('heading', {name:'KOCKA FELGA CVRČAK',exact:true})).toBeVisible();
 });
 test('calendar downloads work even if the map is unavailable; no runtime errors',async({page})=>{
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  await expect(page.getByText('Karta trenutačno nije dostupna.')).toBeVisible();
  const [download]=await Promise.all([page.waitForEvent('download'),page.getByRole('button',{name:'Dodaj u kalendar'}).click()]);
  expect(download.suggestedFilename()).toMatch(/^normal-.*\.ics$/);
  const [all]=await Promise.all([page.waitForEvent('download'),page.getByRole('button',{name:'Preuzmi odabrani raspored'}).click()]);
  expect(all.suggestedFilename()).toBe('pk-normal-2026.ics');
  expect(errors).toEqual([]);
 });
 test('keyboard, accessibility, mobile and landscape layouts',async({page})=>{
  for(const [width,height] of [[390,844],[430,932],[844,390],[932,430],[768,1024],[1024,768],[1366,768],[1440,900],[1920,1080]]){
   await page.setViewportSize({width,height});
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  }
  await page.setViewportSize({width:390,height:844});
  expect((await new AxeBuilder({page}).analyze()).violations).toEqual([]);
  await page.getByRole('button',{name:'Kup',exact:true}).focus();await page.keyboard.press('Enter');
  await expect(page.locator('.atlas-fixture')).toHaveCount(1);
  await page.getByRole('link',{name:'Natrag u klub'}).click();
  await expect(page.locator('#competition-title')).toBeVisible();
 });
});
