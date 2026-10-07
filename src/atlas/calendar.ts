import { translate, type Language } from "../i18n/translate";
import { atlasMeta, venueFor } from '../data/atlas';
import type { Fixture } from '../data/atlas';
const escape = (s: string) => s.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');
const utc = (date: string) => new Date(date).toISOString().replace(/[-:]/g,'').split('.')[0]+'Z';
/** No invented end time: federation only supplies the start time. */
export function calendarText(games: Fixture[], language: Language = "hr"): string {
  const t = (text: string) => translate(text, language);
  const lines = ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//PK Normal//Atlas utakmica//HR','CALSCALE:GREGORIAN','METHOD:PUBLISH','X-WR-CALNAME:PK Normal / '+atlasMeta.year];
  for (const f of games) {
    const venue = venueFor(f);
    lines.push('BEGIN:VEVENT','UID:'+f.id+'@pk-normal-calendar','DTSTAMP:'+atlasMeta.checked.replaceAll('-','')+'T000000Z','DTSTART:'+utc(f.startsAt),'SUMMARY:'+escape(f.home+' — '+f.away),'LOCATION:'+escape(venue ? t(venue.name)+', '+venue.address : t('Lokacija čeka potvrdu')), 'DESCRIPTION:'+escape((f.kind === 'cup' ? t('PSGZ kup A · 1. krug.') : t(atlasMeta.league)+' · '+f.round+t('. kolo.'))+t(' Provjereno: ')+atlasMeta.checked+t('. Termin se može promijeniti. ')+f.source),'URL:'+f.source,'END:VEVENT');
  }
  lines.push('END:VCALENDAR');
  // RFC 5545 folding counts UTF-8 bytes, not JS code units.
  return lines.map(line => {
    let current='', result='', bytes=0;
    for (const char of line) {
      const count=new TextEncoder().encode(char).length;
      if(bytes+count>74) { result+=current+'\r\n '; current=''; bytes=1; }
      current+=char; bytes+=count;
    }
    return result+current;
  }).join('\r\n')+'\r\n';
}
export function downloadCalendar(games: Fixture[], language: Language = "hr") {
 const url=URL.createObjectURL(new Blob([calendarText(games, language)],{type:'text/calendar;charset=utf-8'}));
 const a=document.createElement('a'); a.href=url; a.download=games.length===1 ? 'normal-'+games[0].id+'.ics' : 'pk-normal-2026.ics'; a.click(); setTimeout(()=>URL.revokeObjectURL(url),1000);
}
