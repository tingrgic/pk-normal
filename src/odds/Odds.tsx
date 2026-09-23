import { useLanguage } from "../i18n/Language";
import { useEffect, useState } from 'react';
import { club, oddsSnapshot as data, players } from '../data/club';
import Arrow from '../components/Arrow';
import { newGame, normalizeName, play, quote, restore, SAVE_KEY, type Pick } from './engine';
import './odds.css';

const normal = data.teams.find(t => t.name === 'NORMAL')!;
const opponents = data.teams.filter(t => t.name !== 'NORMAL').sort((a,b)=>a.name.localeCompare(b.name,'hr'));

export default function Odds() {
  const { t, locale } = useLanguage();
  const fmt = (n: number) => n.toLocaleString(locale, {minimumFractionDigits:2, maximumFractionDigits:2});
  const date = new Intl.DateTimeFormat(locale, {timeZone:'Europe/Zagreb',day:'numeric',month:'numeric',year:'numeric',hour:'2-digit',minute:'2-digit'}).format(new Date(data.checked));

  const [teamName, setTeamName] = useState('PKZ VOLTAGE');
  const team = opponents.find(t=>t.name===teamName)!;
  const rivals = data.players.filter(p=>p.team===teamName);
  const [rivalName, setRivalName] = useState(rivals[0]?.name || '');
  const rival = rivals.find(p=>p.name===rivalName);
  const [pick, setPick] = useState<Pick | null>(null);
  const [stake, setStake] = useState('20');
  const [game, setGame] = useState(()=>{try{return restore(localStorage.getItem(SAVE_KEY));}catch{return newGame();}});
  const [storageError, setStorageError] = useState(false);
  const [message, setMessage] = useState<{ key: string; values?: Record<string, string | number> }>({ key: '' });
  useEffect(()=>{try{localStorage.setItem(SAVE_KEY,JSON.stringify(game));}catch{setStorageError(true);}},[game]);
  const amount = Number(stake);
  const valid = Number.isInteger(amount) && amount >= 10 && amount <= 100 && amount <= game.balance;
  function simulate() {
    if (!pick || !valid) return;
    const random = crypto.getRandomValues(new Uint32Array(1))[0] / 4294967296;
    const next = play(game,pick,amount,random,`${Date.now()}-${crypto.getRandomValues(new Uint32Array(1))[0]}`);
    setGame(next); setPick(null);
    setMessage(next.history[0].won ? { key: "Simulacija: pogodak! Povrat {0} bodova, uključujući ulog.", values: {0: next.history[0].payout} } : { key: "Simulacija: promašaj. Uloženo {0} bodova.", values: {0: amount} });
  }
  return (
    <main className="odds-page" id="main">
      <header className="odds-top"><a className="text-link" href="#prognoze"><Arrow direction="diagonal" />{t(" Natrag u klub")}</a><span className="mono">{t("PK NORMAL / VIRTUALNI DVOBOJ")}</span></header>
      <section className="odds-intro" aria-labelledby="odds-title">
        <p className="mono">{t("STATISTIKA SAVEZA. NAŠA PROCJENA.")}</p>
        <h1 id="odds-title">{t("TKO IMA")}<br /><em>{t("BOLJU RUKU?")}</em></h1>
        <div className="odds-intro-bottom"><p>{t("Odaberi suparnika. Usporedi našu ekipu.")}<br />{t("Isprobaj prognozu s virtualnim bodovima.")}</p><p>{t("Bez novca, uplata i nagrada. Simulirani ishodi nisu stvarni rezultati utakmica.")}</p></div>
      </section>
      <div className="odds-snapshot"><span className="mono">{t(data.competition)} / {data.season}</span><p>{t("Presjek: ")}{date}{t(" (Zagreb). Podaci se ne osvježavaju uživo. Mali uzorak — početak sezone.")}</p><a className="text-link" href={data.source} target="_blank" rel="noreferrer">{t("Službena tablica ")}<Arrow /></a></div>
      <section className="odds-controls" aria-label={t("Izbor suparnika")}>
        <label>{t("01 / Protivnička ekipa")}<select value={teamName} onChange={e=>{setTeamName(e.target.value);setRivalName(data.players.find(p=>p.team===e.target.value)?.name || '');setPick(null);setMessage({ key: '' });}}>{opponents.map(t=><option key={t.name}>{t.name}</option>)}</select></label>
        <label>{t("02 / Protivnički igrač")}<select value={rivalName} disabled={!rivals.length} onChange={e=>{setRivalName(e.target.value);setPick(null);setMessage({ key: '' });}}>{rivals.length ? rivals.map(p=><option key={p.name}>{p.name}</option>) : <option value="">{t("Nema zabilježenih nastupa")}</option>}</select></label>
        <p>{t("Prikazani su protivnički igrači sa zabilježenim nastupima u ovoj ligi. Dvoboji su hipotetski, a ne najavljena postava.")}</p>
      </section>
      <div className="odds-team-records"><p><strong>NORMAL</strong><span>{t("{wins} pobjeda / {losses} poraza · susreti {won}:{lost}", {wins:normal.wins, losses:normal.losses, won:normal.duelsWon, lost:normal.duelsLost})}</span></p><p><strong>{team.name}</strong><span>{t("{wins} pobjeda / {losses} poraza · susreti {won}:{lost}", {wins:team.wins, losses:team.losses, won:team.duelsWon, lost:team.duelsLost})}</span></p></div>
      <div className="odds-workspace">
        <section className="odds-markets" aria-labelledby="odds-markets-title">
          <h2 id="odds-markets-title">{t("Naša ekipa ")}<span>×</span> {rival?.name || team.name}</h2>
          {rival ? <p className="odds-rival-record">{t("Suparnik: ")}{t("{wins} pobjeda / {losses} poraza · legovi {won}:{lost}", {wins:rival.wins, losses:rival.losses, won:rival.legsWon, lost:rival.legsLost})}</p> : <p className="odds-rival-record">{t("Za ovu ekipu još nema pojedinačnih podataka. Koeficijenti nisu dostupni.")}</p>}
          <div className="odds-column-head mono"><span>{t("IGRAČ / UČINAK")}</span><span>NORMAL</span><span>{t("SUPARNIK")}</span></div>
          {players.map(player=>{
            const name = `${player.first} ${player.last}`;
            const record = data.players.find(p=>p.team==='NORMAL' && normalizeName(p.name)===normalizeName(name));
            const market = rival ? quote(record,normal,rival,team) : null;
            return <article className="odds-row" key={player.slug}>
              <div className="odds-player"><h3>{name}</h3><p>{record ? t("{0}–{1} u susretima · legovi {2}:{3}", {0: record.wins, 1: record.losses, 2: record.legsWon, 3: record.legsLost}) : t("Bez nastupa u presjeku · timska osnovica")}</p></div>
              {(['home','away'] as const).map(side=><button key={side} disabled={!market} aria-pressed={pick?.player===name && pick.side===side} aria-label={t("{0} pobjeđuje u dvoboju {1} protiv {2}{3}", {0: side==='home' ? name : rival?.name || t("Suparnik"), 1: name, 2: rival?.name || team.name, 3: market ? t(", koeficijent {0}", {0: fmt(market[side])}) : t(", nedostaju podaci")})} onClick={()=>{if(market && rival){setPick({player:name,opponent:rival.name,team:team.name,side,odds:market[side],probability:side==='home'?market.probability:1-market.probability});setMessage({ key: '' });}}}>{market ? fmt(market[side]) : '—'}<small>{market ? `${Math.round(100*(side==='home'?market.probability:1-market.probability))} %` : t("Nema podataka")}</small></button>)}
            </article>;
          })}
        </section>
        <aside id="odds-slip" className="odds-slip" aria-labelledby="odds-slip-title">
          <p className="mono">{t("SAMO VIRTUALNI BODOVI")}</p><h2 id="odds-slip-title">{t("Tvoj dvoboj.")}</h2>
          <p className="odds-balance">{game.balance.toLocaleString(locale)} <span>{t("bodova")}</span></p>
          {pick ? <><p className="odds-slip-pair">{pick.player}<br /><span>{t("protiv ")}{pick.opponent}</span></p><p className="odds-pick">{t("Tvoj izbor: ")}<strong>{pick.side==='home'?pick.player:pick.opponent}</strong><br />{t("Koeficijent ")}{fmt(pick.odds)}</p></> : <p className="odds-slip-hint">{t("Odaberi koeficijent uz igrača. Jedan dvoboj, jedna prognoza.")}</p>}
          <label htmlFor="odds-stake">{t("Ulog u bodovima (10–100)")}</label><input id="odds-stake" type="number" min="10" max={Math.min(100,game.balance)} step="1" inputMode="numeric" value={stake} onChange={e=>setStake(e.target.value)} aria-invalid={!valid} aria-describedby="odds-stake-note" />
          <p id="odds-stake-note" className="odds-note">{!valid ? t("Unesi cijeli broj od 10 do 100, najviše do svog salda.") : pick ? t("Mogući povrat: {0} bodova (s ulogom).", {0: Math.round(amount*pick.odds)}) : t("Početni saldo: 1.000 bodova.")}</p>
          <button className="odds-play" disabled={!pick || !valid} onClick={simulate}>{t("Simuliraj dvoboj ")}<Arrow /></button>
          <p className="odds-note">{t("Ishod se nasumično izvlači prema prikazanoj procjeni. Ne čeka se stvarna utakmica. Izračun koristi puni koeficijent; prikaz je zaokružen.")}</p>
          <p role="status" className="odds-status">{t(message.key, message.values)}</p>
          {storageError && <p className="odds-note">{t("Preglednik ne dopušta spremanje. Bodovi vrijede samo dok je ovaj prikaz otvoren.")}</p>}
          <button className="odds-reset" onClick={()=>{if(window.confirm(t("Obrisati povijest simulacija i vratiti 1.000 virtualnih bodova?"))){setGame(newGame());setPick(null);setMessage({ key: "Nova igra. Saldo je 1.000 bodova." });}}}>{t("Vrati početnih 1.000 bodova")}</button>
        </aside>
      </div>
      {pick && <button className="odds-mobile-pick" onClick={()=>{document.getElementById('odds-slip')?.scrollIntoView();document.getElementById('odds-stake')?.focus({preventScroll:true});}}><span>{pick.side==='home'?pick.player:pick.opponent}<small>{t("Koeficijent ")}{fmt(pick.odds)}</small></span><strong>{t("Odredi ulog ↓")}</strong></button>}
      <section className="odds-method" aria-labelledby="odds-method-title"><h2 id="odds-method-title">{t("Kako računamo?")}</h2><p>{t("Ovo je naš eksperimentalni model, ne koeficijent saveza niti provjerena prognoza. Koristimo pobjede i poraze u pojedinačnim susretima (75 %) te legove (25 %), uz ekipni učinak kao osnovicu. Mali broj nastupa ublažavamo prema toj osnovici; igrači bez nastupa dobivaju samo ekipnu procjenu.")}</p><details><summary>{t("Formula, ograničenja i izvori")}</summary><p>{t("Ekipna osnovica susreta: (pobjede + 8) / (susreti + 16); legova: (dobiveni + 16) / (legovi + 32). Igraču dodajemo 8 susreta i 16 legova te osnovice. Snaga S = 0,75 × omjer susreta + 0,25 × omjer legova. Za A protiv B: p = A(1−B) / [A(1−B) + B(1−A)], ograničeno na 15–85 %. Koeficijent = 1/p, bez marže.")}</p><p>{t("Model nije kalibriran na povijesnim ishodima i ne korigira kvalitetu ranijih protivnika, postavu ni prednost domaćina. Ekipni bodovi i kazne ne ulaze u model. Nule neodigranih utakmica nisu rezultati. Svaki novi presjek može promijeniti procjenu.")}</p><a href={data.source} target="_blank" rel="noreferrer">{t("PSGZ: rezultati ekipa i učinak igrača ↗")}</a><a href={club.sources.team} target="_blank" rel="noreferrer">{t("HPS: registrirana ekipa Normal ↗")}</a></details></section>
      {game.history.length>0 && <section className="odds-history" aria-labelledby="odds-history-title"><h2 id="odds-history-title">{t("Tvoje simulacije.")}</h2><p className="odds-note">{t("Zadnjih 20 dvoboja, spremljeno samo u ovom pregledniku. Ovo nisu službeni rezultati.")}</p><ol>{game.history.map(ticket=><li key={ticket.id}><span>{ticket.player} × {ticket.opponent}<small>{t("Izbor: ")}{ticket.side==='home'?ticket.player:ticket.opponent}{t(" · ulog ")}{ticket.stake}{t(" · koef. ")}{fmt(ticket.odds)}</small></span><strong>{ticket.won?t("Pogodak"):t("Promašaj")}<small>{ticket.won?'+':''}{ticket.payout-ticket.stake}{t(" bodova")}</small></strong></li>)}</ol></section>}
    </main>
  );
}
