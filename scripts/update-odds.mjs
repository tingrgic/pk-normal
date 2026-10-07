// Run manually after reviewing the official snapshot; never fetch in the client.
import fs from 'node:fs';
import { chromium } from '@playwright/test';
const source = 'https://psgz.hr/ranking-table/831';
const api = 'https://psgz.hr/site/uniondivision/UnionLeagueTable?unionId=2&seasonId=26&leagueId=831';
const response = await fetch(api);
if (!response.ok) throw new Error(`Source returned ${response.status}`);
const payload = await response.json();
if (!payload.isValid) throw new Error('Invalid league response');
const browser = await chromium.launch({args:['--no-sandbox']});
try {
 const page = await browser.newPage();
 await page.setContent(payload.html);
 const data = await page.evaluate(() => {
  const rows = selector => [...document.querySelectorAll(selector)].map(row => [...row.querySelectorAll('td')].map(cell => cell.textContent.trim()));
  const pair = s => s.split('/').map(Number);
  const teams = rows('table.ranking tbody tr').filter(r=>r.length===9).map(r=>({name:r[1],played:Number(r[3]),wins:Number(r[4]),draws:r[5].split("-").reduce((sum,n)=>sum+Number(n),0),losses:Number(r[6]),duelsWon:pair(r[7])[0],duelsLost:pair(r[7])[1],legsWon:pair(r[8])[0],legsLost:pair(r[8])[1]}));
  const players = rows('table.scores tbody tr').filter(r=>r.length===9).map(r=>({name:r[1],team:r[2],played:Number(r[6]),wins:pair(r[7])[0],losses:pair(r[7])[1],legsWon:pair(r[8])[0],legsLost:pair(r[8])[1]}));
  return {teams,players};
 });
 if(data.teams.length!==11 || !data.players.length || data.players.some(p=>p.played!==p.wins+p.losses)) throw new Error('Snapshot structure changed; inspect source');
 const checked = new Date().toISOString();
 const snapshot = {source,api,checked,season:'2026/27',competition:'4. liga · skupina B',...data};
 const path = 'src/data/club.ts';
 const content = fs.readFileSync(path,'utf8').split('// Official league snapshot for the odds simulator.')[0];
 fs.writeFileSync(path,content+'// Official league snapshot for the odds simulator. Derived odds are not official.\nexport const oddsSnapshot = '+JSON.stringify(snapshot,null,2)+';\n');
 fs.mkdirSync('docs/qa',{recursive:true});
 fs.writeFileSync('docs/qa/odds-source.json',JSON.stringify(snapshot,null,2));
 console.log(`${data.teams.length} teams, ${data.players.length} players; ${checked}`);
} finally { await browser.close(); }
