import {test,expect} from '@playwright/test';
import {rhythm} from '../src/data/rhythm';
import AxeBuilder from '@axe-core/playwright';
test('all tools expand in one document, preserve active scores and keep surrounding sections',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.route('https://tiles.openfreemap.org/**',r=>r.abort());
 await page.goto('/');const origin=await page.evaluate(()=>performance.timeOrigin);
 await page.locator('.counter-invite a[href="#brojac"]').click();
 await page.getByRole('button',{name:'Dogovori redoslijed'}).click();await page.getByRole('button',{name:'Počni igru'}).click();
 await page.getByRole('button',{name:'20',exact:true}).click();await expect(page.locator('.current-total strong')).toHaveText('481');
 for(const name of ['karta','dvoboji','shop']){await page.locator(`a[href="#${name}"]`).first().click();await expect(page.locator(`[data-tool="${name}"]`)).toBeVisible();}
 expect(await page.evaluate(()=>performance.timeOrigin)).toBe(origin);await expect(page.locator('main')).toHaveCount(1);await expect(page.locator('h1')).toHaveCount(1);
 await expect(page.locator('#pridruzi-se')).toBeVisible();
 await page.locator('.counter-invite a').click();await expect(page.locator('[data-tool="brojac"]')).toBeFocused();await expect.poll(()=>page.locator('[data-tool="brojac"]').evaluate(el=>Math.abs(el.getBoundingClientRect().top))).toBeLessThan(150);await expect(page.locator('.current-total strong')).toHaveText('481');
 await page.locator('[data-tool="brojac"] .inline-tool-bar button').click();await page.locator('.counter-invite a').click();
 await page.getByRole('button',{name:'Nastavi igru'}).click();await expect(page.locator('.current-total strong')).toHaveText('481');
});
test('shuffle retains all 180 descriptions, changes order on reload and preserves order when language changes',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');
 const collect=async()=>{await page.locator('.identity-swipe').focus();await page.keyboard.press('Home');const names=[];for(let i=0;i<180;i++){names.push((await page.locator('#identity-title').innerText()).replace(/\s+/g,' '));await page.keyboard.press('ArrowRight');}return names;};
 const first=await collect();expect([...first].sort()).toEqual(rhythm.map(r=>(r.name+'.').toLocaleUpperCase('hr')).sort());await page.reload();const second=await collect();expect(second).not.toEqual(first);
});
test('X01 winning modal, visit table, averages, undo and keyboard focus',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/#brojac');
 await page.getByLabel('Početni rezultat').selectOption('301');await page.getByRole('button',{name:'Ukloni igrača 2'}).click();
 await page.getByRole('button',{name:'Dogovori redoslijed'}).click();await page.getByRole('button',{name:'Počni igru'}).click();
 const hit=async(n:number,m=1)=>{if(m>1)await page.getByRole('button',{name:m===3?'Triple ×3':'Double ×2'}).click();await page.getByRole('button',{name:(m===3?'T':m===2?'D':'')+n,exact:true}).click();};
 await hit(20,3);await hit(20,3);await hit(20,3);await page.locator('.next-player').click();await hit(20,3);await hit(19);await hit(2);await page.locator('.next-player').click();await hit(20,2);
 const dialog=page.locator('.counter-summary');await expect(dialog).toBeVisible();await expect(dialog).toContainText('129');await expect(dialog).toContainText('1/1');await expect(page.locator('.counter-table-scroll tbody tr')).toHaveCount(3);
 expect((await new AxeBuilder({page}).analyze()).violations).toEqual([]);
 await page.keyboard.press('Escape');await expect(dialog).not.toBeVisible();await page.getByRole('button',{name:'Poništi zadnji unos'}).click();await expect(page.locator('.score-name')).toContainText('6 strelica');
 await page.getByRole('button',{name:'Statistika partije'}).click();await expect(dialog).toContainText('0/0');
});

test('mobile menu opens inline tools and close returns to a visible homepage trigger',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');
 await page.getByRole('button',{name:'IZBORNIK — otvori'}).click();await page.getByRole('navigation',{name:'Mobilna navigacija'}).getByRole('link',{name:'Brojač',exact:false}).click();
 await expect(page.locator('[data-tool="brojac"]')).toBeFocused();await expect(page.locator('.counter-heading h2')).toBeVisible();
 await page.locator('[data-tool="brojac"] .inline-tool-bar button').click();await expect(page.locator('[data-tool="brojac"]')).toHaveCount(0);
 await expect.poll(()=>page.locator('.counter-invite').evaluate(el=>{const r=el.getBoundingClientRect();return r.bottom>0&&r.top<innerHeight;})).toBe(true);
});
