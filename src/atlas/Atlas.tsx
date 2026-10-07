import { useLanguage } from "../i18n/Language";
import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import addresses from '../data/club-addresses.json';
import Arrow from '../components/Arrow';
import { atlasMeta, fixtures, venues, venueFor, opponent, ground, groundLabel, localDate, localTime, nextFixture } from '../data/atlas';
import type { Fixture } from '../data/atlas';
import { downloadCalendar } from './calendar';
import './atlas.css';
const CityMap=lazy(()=>import('./CityMap'));
const months=[['all','Cijela sezona'],['09','Rujan'],['10','Listopad'],['11','Studeni'],['12','Prosinac'],['01','Siječanj'],['02','Veljača'],['03','Ožujak']];
export default function Atlas() {
  const { t, language, locale } = useLanguage();

 const [selected,setSelected]=useState(()=>nextFixture().id);
 const [filter,setFilter]=useState('all'),[month,setMonth]=useState('all'),[upcoming,setUpcoming]=useState(false);
 const heading=useRef<HTMLHeadingElement>(null);
 const [now,setNow]=useState(Date.now);
 useEffect(()=>{const timer=setInterval(()=>setNow(Date.now()),60000);return()=>{clearInterval(timer);};},[]);
 const visible=useMemo(()=>fixtures.filter(f=>(filter==='all'||ground(f)===filter)&&(month==='all'||f.startsAt.slice(5,7)===month)&&(!upcoming||(!f.result&&Date.parse(f.startsAt)>=now))),[filter,month,upcoming,now]);
 const active=visible.find(f=>f.id===selected)||visible.find(f=>!f.result&&Date.parse(f.startsAt)>=now)||visible[0];
 const venue=active?venueFor(active):undefined;
 const visibleVenues=useMemo(()=>[...new Set(visible.flatMap(f=>f.venueId?[f.venueId]:[]))],[visible]);
 const chooseVenue=(id:string)=>{const games=visible.filter(f=>f.venueId===id);const f=games.find(f=>!f.result&&Date.parse(f.startsAt)>=now)||games[0];if(f)setSelected(f.id);};
 const activeIndex=active?visible.findIndex(f=>f.id===active.id):-1;
 const label=(f:Fixture)=>f.result?t("ODIGRANO"):Date.parse(f.startsAt)<now?t("TERMIN PROŠAO"):t("NAJAVLJENO");
 function selectMatch(id:string, scroll=false){setSelected(id);if(scroll && innerWidth<761) document.querySelector('.atlas-stage')?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});}
 return <div className="atlas">
  <header className="atlas-header"><a href="#pocetak" className="wordmark"><span className="mark-target" aria-hidden="true"/><span>PK NORMAL<small>{t("ATLAS UTAKMICA")}</small></span></a><a className="atlas-back" href="#natjecanja">{t("Natrag u klub ")}<Arrow /></a></header>
  <section className="atlas-main">
   <section className="atlas-intro" aria-labelledby="atlas-title"><div><p className="mono red">{t("ZAGREB I SESVETE / SEZONA ")}{atlasMeta.season}</p><h2 id="atlas-title" ref={heading} tabIndex={-1}>{t("GRAD JE")}<br/><span>{t("TEREN.")}</span></h2></div><div className="atlas-intro-right"><span className="atlas-year">{atlasMeta.season}</span><p>{t("Gdje igramo. Kada se vidimo.")}<br/>{t("Normalova godina, na jednoj karti.")}</p><div className="atlas-facts"><span><strong>{fixtures.length}</strong>{t(" objavljenih utakmica")}</span><span><strong>{venues.length}</strong>{t(" lokacija na karti")}</span></div></div></section>
   <div className="atlas-toolbar"><div className="atlas-filters" aria-label={t("Vrsta utakmice")}>{[['all',t("Sve")],['home',t("Domaći")],['away',t("Gosti")],['neutral',t("Kup")]].map(([id,name])=><button key={id} aria-pressed={filter===id} onClick={()=>setFilter(id)}>{t(name)}</button>)}</div><label className="atlas-month"><span className="sr-only">{t("Mjesec utakmice")}</span><select value={month} onChange={e=>setMonth(e.target.value)}>{months.map(([id,name])=><option key={id} value={id}>{t(name)}</option>)}</select></label><label className="atlas-upcoming"><input type="checkbox" checked={upcoming} onChange={e=>setUpcoming(e.target.checked)}/>{t(" Samo nadolazeće")}</label></div>
   <section className="atlas-stage" aria-label={t("Karta i odabrana utakmica")}>
    <div className="atlas-map"><Suspense fallback={<div className="atlas-map-loading" role="status">{t("Učitavamo kartu…")}</div>}><CityMap selected={active?.venueId||null} visibleVenues={visibleVenues} onSelect={chooseVenue}/></Suspense></div>
    <div className="atlas-match-panel" aria-live="polite" aria-atomic="true">
     {active ? <>
      <div className="atlas-match-kicker"><span className="mono">{t(groundLabel(active))}</span><span>{label(active)}</span></div>
      <p className="atlas-round">{active.kind==='cup'?t("PSGZ KUP A / 1. KRUG"):t(atlasMeta.league)+' / '+active.round+t(". KOLO")}</p>
      <div className="atlas-versus"><h2>{active.home}</h2><span>{active.result?active.result.join(' : '):'VS'}</span><h2>{active.away}</h2></div>
      <div className="atlas-match-date"><time dateTime={active.startsAt}>{localDate(active,locale)}</time><strong>{localTime(active,locale)}</strong><small>{active.startsAt.slice(0,4) + t(". · vrijeme u Zagrebu")}</small></div>
      <div className="atlas-venue"><span className="atlas-venue-index">{venue?.number||'—'}</span><div><h3>{t(venue?.name||'Lokacija čeka potvrdu')}</h3><p>{venue?.address||t("Datum i suparnik su objavljeni. Igralište domaćina još nije navedeno u registru.")}</p>{venue?.precision==='address'&&<small>{t("Oznaka je na adresi igrališta; provjeri ulaz.")}</small>}</div></div>
      <div className="atlas-match-actions">{venue&&<a className="atlas-primary" href={'https://www.google.com/maps/dir/?api=1&destination='+encodeURIComponent(venue.address)} target="_blank" rel="noreferrer">{t("Upute za dolazak ")}<Arrow /></a>}<button className="atlas-secondary" onClick={()=>downloadCalendar([active],language)}>{t("Dodaj u kalendar ")}<Arrow direction="down" /></button></div>
      <a className="atlas-official" href={active.source} target="_blank" rel="noreferrer">{t("Prati nas live / PSGZ ")}<Arrow /></a>
      <div className="atlas-match-step"><button disabled={activeIndex===0} onClick={()=>selectMatch(visible[activeIndex-1].id)} aria-label={t("Prethodna utakmica")}><Arrow direction="left"/><span>{t("Prijašnja tekma")}</span></button><span className="mono">{String(activeIndex+1).padStart(2,'0')} / {String(visible.length).padStart(2,'0')}</span><button disabled={activeIndex===visible.length-1} onClick={()=>selectMatch(visible[activeIndex+1].id)} aria-label={t("Sljedeća utakmica")}><span>{t("Iduća tekma")}</span><Arrow direction="right"/></button></div>
     </> : <div className="atlas-empty"><h2>{t("NEMA UTAKMICA")}<br/>{t("U OVOM ODABIRU.")}</h2><p>{t("Pokušaj drugi mjesec ili prikaži cijeli raspored.")}</p><button className="atlas-secondary" onClick={()=>{setFilter('all');setMonth('all');setUpcoming(false);}}>{t("Prikaži sve")}</button></div>}
    </div>
   </section>
   <section className="atlas-schedule" aria-labelledby="schedule-title"><div className="atlas-schedule-heading"><div><p className="mono">{t("KALENDAR / ODABERI UTAKMICU")}</p><h2 id="schedule-title">{t("IZ MEČA U MEČ.")}</h2></div><button className="atlas-secondary" disabled={!visible.length} onClick={()=>downloadCalendar(visible,language)}>{t("Preuzmi odabrani raspored ")}<Arrow direction="down"/></button></div>
    <p className="atlas-schedule-count" role="status">{visible.length}{t(" od ")}{fixtures.length}{t(" objavljenih utakmica · sezona 2026/27.")}</p>
    <div className="atlas-fixtures">{visible.map(f=>{const place=venueFor(f);return <button className={'atlas-fixture '+(active?.id===f.id?'selected':'')} key={f.id} aria-pressed={active?.id===f.id} onClick={()=>selectMatch(f.id,true)} aria-label={localDate(f,locale)+', '+f.home+t(" protiv ")+f.away}>
     <time dateTime={f.startsAt}><strong>{new Intl.DateTimeFormat(locale,{day:'2-digit',timeZone:'Europe/Zagreb'}).format(new Date(f.startsAt))}</strong><span>{t(months.find(([id])=>id===f.startsAt.slice(5,7))?.[1] || '')} / {localTime(f,locale)}</span></time>
     <span className="atlas-fixture-opponent"><small>{t(groundLabel(f))} · {f.kind==='cup'?t("1. krug"):f.round+t(". kolo")}</small><strong>{opponent(f)}</strong></span><span className="atlas-fixture-venue">{t(place?.name||'Lokacija čeka potvrdu')}<small>{place?.area||t("Adresa nije objavljena")}</small></span><span className="atlas-fixture-result">{f.result?f.result.join(' : '):<Arrow/>}</span>
    </button>;})}</div>
   </section>
   <section className="atlas-address-directory"><h2>{t('Sva igrališta. Provjerene adrese.')}</h2><p>{t('Igrališta prema HPS registru. Prazno polje u registru znači da adresa još nije potvrđena.')}</p>{addresses.map(a=><article key={a.slug}><h3>{a.slug.replaceAll('-',' ').toLocaleUpperCase('hr')}</h3><p>{a.address || t('Adresa nije objavljena')}</p><a href={a.source} target="_blank" rel="noreferrer">{t('Službeni podaci / HPS ')}<Arrow/></a>{a.address&&<a href={'https://www.google.com/maps/dir/?api=1&destination='+encodeURIComponent(a.address)} target="_blank" rel="noreferrer">{t('Upute za dolazak ')}<Arrow/></a>}</article>)}</section>
   <section className="atlas-notes" aria-label={t("Izvori i ažurnost")}><div><h2>{t("Raspored, bez nagađanja.")}</h2><p>{t("Prikazane su objavljene utakmice sezone 2026/27. Provjereno ")}<strong>{new Intl.DateTimeFormat(locale,{timeZone:'Europe/Zagreb',day:'numeric',month:'long',year:'numeric'}).format(new Date(atlasMeta.checked+'T12:00:00Z'))}</strong>{t(" Ovo nije prijenos uživo; termini se mogu promijeniti. Preuzeti kalendar ne osvježava se automatski.")}</p><p>{t(atlasMeta.venueNote)}{t(" Kup se igra na neutralnom igralištu. Visine 3D zgrada služe orijentaciji.")}</p></div><div className="atlas-source-links"><a href={atlasMeta.source} target="_blank" rel="noreferrer">{t("Liga / službeni raspored ")}<Arrow/></a><a href={atlasMeta.cupSource} target="_blank" rel="noreferrer">{t("Kup / službeni raspored ")}<Arrow/></a>{venue&&<a href={venue.source} target="_blank" rel="noreferrer">{t("Izvor odabrane adrese ")}<Arrow/></a>}<a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">{t("Karta: OpenFreeMap / OpenStreetMap ")}<Arrow/></a></div></section>
  </section>
  <footer className="atlas-footer"><span className="mono">{t("PK NORMAL / SVAKI KVART, ISTI CILJ.")}</span><a href="#brojac">{t("Prije utakmice? Otvori brojač ")}<Arrow/></a></footer>
 </div>;
}
