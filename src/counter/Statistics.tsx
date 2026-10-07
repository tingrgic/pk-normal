import {useEffect,useRef} from 'react';
import {useLanguage} from '../i18n/Language';
import {hitLabel,type PlayerStats,type Session,type Player} from './engine';
type Props={session:Session;stats:PlayerStats[];playerName:(p:Player)=>string};
export function VisitTable({session,stats,playerName}:Props) {
 const {t}=useLanguage();
 const rows=Math.max(1,...stats.map(s=>s.visits.length));
 return <section className="counter-visits"><h2>{t('Svaka ruka. Svaka strelica.')}</h2><p className="counter-muted">{t('Jedan stupac po igraču. Svaki redak je jedna ruka; strelice su zapisane redom.')}</p>
 <div className="counter-table-scroll" tabIndex={0} role="region" aria-label={t('Povijest bacanja, tablica se može pomicati')}><table><caption className="sr-only">{t('Povijest svih ruku')}</caption><thead><tr><th scope="col">{t('Ruka')}</th>{session.config.players.map(p=><th scope="col" key={p.id}>{playerName(p)}<div className="counter-visit-darts">{[1,2,3].map(n=><small key={n}>{n}. {t('bacanje')}</small>)}</div></th>)}</tr></thead><tbody>{Array.from({length:rows},(_,i)=><tr key={i}><th scope="row">{i+1}.</th>{stats.map(p=>{const v=p.visits[i];return <td key={p.id}><div className="counter-visit-darts">{[0,1,2].map(n=><span key={n}>{v?.hits[n]?t(hitLabel(v.hits[n])):'—'}</span>)}</div><small>{v ? v.bust?t('Prebačaj · 0 bodova'): `${v.points} ${t('bodova')}${session.config.mode==='x01'?` · ${v.remaining} ${t('preostalo')}`:''}`:'—'}</small></td>;})}</tr>)}</tbody></table></div></section>;
}
export function MatchSummary({session,stats,playerName,finished}:Props & {finished:boolean}) {
 const {t,locale}=useLanguage(); const dialog=useRef<HTMLDialogElement>(null);const previous=useRef<HTMLElement|null>(null);
 const open=()=>{previous.current=document.activeElement as HTMLElement;dialog.current?.showModal();};
 useEffect(()=>{if(finished)open();else dialog.current?.close();},[finished]);
 const fmt=(n:number)=>n.toLocaleString(locale,{maximumFractionDigits:2,minimumFractionDigits:2});
 return <><button className="counter-secondary" onClick={open}>{t('Statistika partije')}</button><dialog className="counter-summary" ref={dialog} aria-labelledby="counter-summary-title" onClose={()=>previous.current?.isConnected&&previous.current.focus()}>
 <div className="counter-summary-top"><h2 id="counter-summary-title">{t('PARTIJA U BROJKAMA.')}</h2><button autoFocus className="counter-secondary" onClick={()=>dialog.current?.close()}>{t('Zatvori')}</button></div>
 <p>{t('AVG = prosjek na tri stvarno bačene strelice. Detalji izračuna nalaze se u pravilima.')}</p>
 {stats.map((s,i)=><section key={s.id} className="counter-player-summary"><h3>{playerName(session.config.players[i])}</h3><dl><div><dt>{t('Bačene strelice')}</dt><dd>{s.darts}</dd></div><div><dt>{t('Cjelokupni AVG')}</dt><dd>{fmt(s.average)}</dd></div><div><dt>{t('AVG prvih 9')}</dt><dd>{fmt(s.firstNineAverage)} <small>({s.firstNineDarts}/9)</small></dd></div><div><dt>{t('Najveći checkout')}</dt><dd>{session.config.mode==='x01'?s.highestCheckout:'—'}</dd></div><div><dt>{t('Checkout učinak')}</dt><dd>{session.config.mode==='x01'?`${s.checkoutHits}/${s.checkoutAttempts} · ${s.checkoutAttempts?fmt(s.checkoutHits/s.checkoutAttempts*100):'0'} %`:'—'}</dd></div></dl>
 {session.config.mode==='x01'&&<table><caption>{t('Prilike za izlaz jednom strelicom')}</caption><thead><tr><th>{t('Preostali broj')}</th><th>{t('Pogoci / prilike')}</th><th>%</th></tr></thead><tbody>{Object.entries(s.finishes).map(([score,f])=><tr key={score}><th scope="row">{score}</th><td>{f.hits}/{f.attempts}</td><td>{fmt(f.hits/f.attempts*100)} %</td></tr>)}{!s.checkoutAttempts&&<tr><td colSpan={3}>{t('Još nema prilike za izlaz jednom strelicom.')}</td></tr>}</tbody></table>}</section>)}
 </dialog></>;
}
