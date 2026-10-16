// Manual official-source refresh. Review the diff and reconcile map coordinates
// before publishing if an address changed. Never geocode a legal club address.
import fs from 'node:fs';
const path = 'src/data/club-addresses.json';
const previous = JSON.parse(fs.readFileSync(path, 'utf8'));
const checked = new Date().toISOString().slice(0, 10);
const text = value => value.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const rows = await Promise.all(previous.map(async entry => {
  const sources = [entry.source, `https://psgz.hr/hps/${entry.slug}`];
  const reports = await Promise.all(sources.map(async source => {
    const response = await fetch(source);
    if (!response.ok) throw new Error(`${source}: HTTP ${response.status}`);
    const html = await response.text();
    const field = html.match(/<span class="lbl">Adresa<\/span><span class="data">(.*?)<\/span>/s);
    const title = html.match(/<h1[^>]*>(.*?)<\/h1>/s);
    if (!field || !title) throw new Error(`Team/address markup missing: ${source}`);
    return { source, status: response.status, name: text(title[1]), address: text(field[1]) };
  }));
  if (reports[0].address !== reports[1].address || reports[0].name !== reports[1].name)
    throw new Error(`Conflicting federation reports for ${entry.slug}; review manually`);
  const {name, address} = reports[0];
  if (address !== entry.address) console.log(`ADDRESS CHANGED: ${name}: ${entry.address} → ${address}`);
  return { ...entry, name, address, checked, corroboratingSource: sources[1],
    confidence: address ? 'High: published address' : 'High: source field blank' };
}));
fs.writeFileSync(path, JSON.stringify(rows, null, 2) + '\n');
fs.writeFileSync('docs/qa/venue-audit.json', JSON.stringify({ checked,
  sourceType: 'Official HPS team playing-address fields, corroborated by PSGZ team profiles',
  teams: rows.map(({slug, name, address, source, corroboratingSource, confidence}) =>
    ({slug, name, address, source, corroboratingSource, confidence, checked})) }, null, 2) + '\n');
console.log(`${rows.length} teams checked against HPS and PSGZ on ${checked}`);
