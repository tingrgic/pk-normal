import { useLanguage } from "../i18n/Language";
import { useEffect, useMemo, useRef, useState } from "react";
import Arrow from "../components/Arrow";
import { MODES, TARGETS, SAVE_KEY, advance, hitLabel, isCricket, parseSession, replay, shuffled } from "./engine";
import type { Config, Player, Session } from "./engine";
import "./counter.css";

const defaultConfig: Config = {
  mode: "x01", start: 501, entry: "open", out: "double", rounds: 8,
  players: [{ id: "p1", name: "Igrač 1", tag: "", generatedName: true }, { id: "p2", name: "Igrač 2", tag: "", generatedName: true }],
};
const initials = (p: Player) => p.tag || p.name.trim().split(/\s+/).map(s => s[0]).join("").slice(0, 2).toLocaleUpperCase("hr");
const modeName = (c: Config) => c.mode === "x01" ? String(c.start) : MODES.find(m => m.id === c.mode)!.name;
function readSaved() { try { return parseSession(localStorage.getItem(SAVE_KEY)); } catch { return null; } }

export default function Counter() {
  const { t } = useLanguage();
  const playerName = (p: Player) => p.generatedName ? t("Igrač") + " " + p.name.split(" ").at(-1) : p.name;

  const [session, setSession] = useState<Session | null>(readSaved);
  const [resume, setResume] = useState(() => !!readSaved());
  const [config, setConfig] = useState<Config>(() => readSaved()?.config || defaultConfig);
  const [step, setStep] = useState<"setup" | "order">("setup");
  const [order, setOrder] = useState<"bull" | "random" | "list">("bull");
  const [ordered, setOrdered] = useState<Player[]>([]);
  const [multiplier, setMultiplier] = useState<1 | 2 | 3>(1);
  const [storageError, setStorageError] = useState(false);
  const confirm = useRef<HTMLDialogElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const game = useMemo(() => session ? replay(session) : null, [session]);
  useEffect(() => {
    heading.current?.focus();
  }, []);
  useEffect(() => {
    if (!session) return;
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(session)); setStorageError(false); }
    catch { setStorageError(true); }
  }, [session]);
  function begin() {
    const clean = ordered.map(p => ({ ...p, name: p.name.trim(), tag: p.tag.trim().toLocaleUpperCase("hr") }));
    setSession({ version: 1, config: { ...config, players: clean }, actions: [] });
    setResume(false); setMultiplier(1); window.scrollTo(0, 0);
  }
  function updatePlayer(id: string, change: Partial<Player>) {
    setConfig(c => ({ ...c, players: c.players.map(p => p.id === id ? { ...p, ...change } : p) }));
  }
  function move(index: number, direction: number) {
    setOrdered(list => {
      const result = [...list];
      [result[index], result[index + direction]] = [result[index + direction], result[index]];
      return result;
    });
  }
  function hit(number: number, fixed?: 1 | 2) {
    if (!session || !game || game.turnOver) return;
    const action = { type: "dart" as const, hit: { number, multiplier: fixed || multiplier } };
    if (advance(game, action, session.config) === game) return;
    setSession({ ...session, actions: [...session.actions, action] });
    setMultiplier(1);
  }
  function newGame() {
    if (session) setConfig(session.config);
    setSession(null); setResume(false); setStep("setup"); setMultiplier(1);
    try { localStorage.removeItem(SAVE_KEY); } catch { setStorageError(true); }
    confirm.current?.close(); window.scrollTo(0, 0); heading.current?.focus();
  }
  const current = game?.players[game.active];
  const playing = session && game && !resume;
  const mode = MODES.find(m => m.id === (playing ? session.config.mode : config.mode))!;
  const rules = <details className="counter-rules"><summary>{t("Pravila igre ")}<span aria-hidden="true">+</span></summary>
    <p>{t(mode.rule)}</p><p>{t("Bull: vanjski 25, unutarnji 50. Promašaj ili ispala strelica: 0. Ovdje svi igraju pojedinačno; do 10 igrača. Nema vremenskog ograničenja.")}</p>
    <p>{t("U X01 unosite stvarno pogođeno polje, čak i kad još niste otvorili igru. Brojač primjenjuje odabrani ulaz i izlaz.")}</p>
  </details>;
  return <div className="counter">
    <header className="counter-header">
      <a href="#pocetak" className="wordmark"><span className="mark-target" aria-hidden="true" /><span>PK NORMAL<small>{t("BROJAČ PIKADA")}</small></span></a>
      <a href="#pocetak" className="counter-back">{t("Natrag u klub ")}<Arrow /></a>
    </header>
    <main id="counter-main" className="counter-main">
      <div className={"counter-heading" + (playing ? " is-session" : "")}>
        <div><p className="mono red">{t("PIKADO / PK NORMAL")}</p><h1 ref={heading} tabIndex={-1}>{playing ? t(modeName(session.config)) : t("TI BACAJ.")}<span>{playing ? t("IGRA JE TU.") : t("MI BROJIMO.")}</span></h1></div>
        <p>{playing ? t("Mirna ruka. Sljedeća strelica.") : t("Od prvog zagrijavanja do zadnjeg doublea. Tvoj rezultat, tvoja ekipa.")}</p>
      </div>
      {storageError && <p role="status" className="counter-alert">{t("Spremanje nije dostupno u ovom pregledniku. Ostavite ovu stranicu otvorenom kako biste sačuvali igru.")}</p>}
      {resume && session && game ? <section className="resume-panel" aria-labelledby="resume-title">
        <p className="mono">{t("SAČUVANO NA OVOM UREĐAJU")}</p>
        <h2 id="resume-title">{t("JOŠ JEDNO BACANJE?")}</h2>
        <p>{t(modeName(session.config))} · {session.config.players.map(p => playerName(p)).join(" / ")}</p>
        <p>{game.winners.length ? t("Završena igra") : t("Krug ") + game.round + t(" · Na redu: ") + playerName(game.players[game.active])}</p>
        <div className="counter-actions"><button className="counter-primary" onClick={() => { setResume(false); window.scrollTo(0, 0); }}>{t("Nastavi igru ")}<Arrow /></button><button className="counter-secondary" onClick={() => confirm.current?.showModal()}>{t("Nova igra")}</button></div>
      </section> : !playing ? <>
        {step === "setup" ? <form onSubmit={e => {
          e.preventDefault();
          setOrdered(order === "random" ? shuffled(config.players) : [...config.players]);
          setStep("order"); window.scrollTo(0, 0);
        }}>
          <div className="counter-setup-grid">
            <section className="setup-mode">
              <h2 className="counter-section-title"><span>01 /</span>{t(" ODABERI IGRU")}</h2>
              <div className="mode-grid">{MODES.map(m => <button key={m.id} type="button" className={"mode-option " + (config.mode === m.id ? "selected" : "")} aria-pressed={config.mode === m.id} onClick={() => setConfig(c => ({ ...c, mode: m.id, rounds: m.id === "shanghai" ? 7 : 8 }))}>
                <span>{m.id === "x01" ? "301 / 501 / …" : t(m.name)}</span><small>{t(m.subtitle)}</small><span className="mode-target" aria-hidden="true" />
              </button>)}</div>
              <div className="game-options">
                {config.mode === "x01" && <>
                  <label>{t("Početni rezultat")}<select value={config.start} onChange={e => setConfig(c => ({ ...c, start: Number(e.target.value) }))}>{[301, 501, 701, 901, 1001].map(n => <option key={n}>{n}</option>)}</select></label>
                  <label>{t("Ulaz")}<select value={config.entry} onChange={e => setConfig(c => ({ ...c, entry: e.target.value as Config["entry"] }))}><option value="open">{t("Open in · bilo koje polje")}</option><option value="double">{t("Double in · dvostruko")}</option></select></label>
                  <label>{t("Izlaz")}<select value={config.out} onChange={e => setConfig(c => ({ ...c, out: e.target.value as Config["out"] }))}><option value="double">{t("Double out · dvostruko")}</option><option value="open">{t("Open out · bilo koje polje")}</option><option value="master">{t("Master out · double ili triple")}</option></select></label>
                </>}
                {(config.mode === "countup" || config.mode === "shanghai") && <label>{t("Broj krugova")}<select value={config.rounds} onChange={e => setConfig(c => ({ ...c, rounds: Number(e.target.value) }))}>{(config.mode === "shanghai" ? [7, 10, 20] : [5, 8, 10, 15, 20]).map(n => <option key={n}>{n}</option>)}</select></label>}
              </div>
              {rules}
            </section>
            <section className="setup-players">
              <h2 className="counter-section-title"><span>02 /</span>{t(" TVOJA EKIPA ")}<small>{config.players.length} / 10</small></h2>
              <p className="counter-muted">{t("Ime i oznaka po želji. Za trening je dovoljan jedan igrač.")}</p>
              <div className="player-edit-list">{config.players.map((p, i) => <div className="player-edit" key={p.id}>
                <span className="counter-player-number">{String(i + 1).padStart(2, "0")}</span>
                <label><span className="sr-only">{t("Ime igrača ")}{i + 1}</span><input required maxLength={24} pattern=".*\S.*" value={playerName(p)} onChange={e => updatePlayer(p.id, { name: e.target.value, generatedName: false })} autoComplete="off" /></label>
                <label className="tag-input"><span className="sr-only">{t("Oznaka igrača ")}{i + 1}</span><input maxLength={3} value={p.tag} placeholder={initials({...p,name:playerName(p)})} onChange={e => updatePlayer(p.id, { tag: e.target.value })} autoComplete="off" /></label>
                <button type="button" className="remove-player" aria-label={t("Ukloni igrača ") + (i + 1)} disabled={config.players.length === 1} onClick={() => setConfig(c => ({ ...c, players: c.players.filter(q => q.id !== p.id) }))}>×</button>
              </div>)}</div>
              <button type="button" className="add-player" disabled={config.players.length === 10} onClick={() => setConfig(c => ({ ...c, players: [...c.players, { id: "p" + Date.now(), name: "Igrač " + (c.players.length + 1), tag: "", generatedName: true }] }))}>{t("+ Dodaj igrača ")}<small>{config.players.length === 10 ? t("Popis je pun") : t("Do 10 igrača")}</small></button>
              <label className="order-label">{t("Tko prvi baca?")}<select value={order} onChange={e => setOrder(e.target.value as typeof order)}><option value="bull">{t("Najbliži bullu")}</option><option value="random">{t("Nasumični redoslijed")}</option><option value="list">{t("Redoslijed s popisa")}</option></select></label>
              <button className="counter-primary setup-submit" type="submit">{t("Dogovori redoslijed ")}<Arrow /></button>
            </section>
          </div>
        </form> : <section className="order-panel">
          <h2>{order === "bull" ? t("TKO JE NAJBLIŽE?") : order === "random" ? t("REDOSLIJED JE TU.") : t("EKIPA JE SPREMNA.")}</h2>
          <p>{order === "bull" ? t("Svatko baca jednu strelicu prema bullu. Strelicama uz imena složite poredak od najbližeg prema najdaljem. Izjednačeni igrači bacaju ponovno.") : t("Prvi na popisu prvi baca. Redoslijed možete prilagoditi prije početka.")}</p>
          <ol className="order-list">{ordered.map((p, i) => <li key={p.id}><span className="mono">{String(i + 1).padStart(2, "0")}</span><strong>{playerName(p)}</strong><button disabled={i === 0} onClick={() => move(i, -1)} aria-label={t("Pomakni {name} gore", {name:playerName(p)})}><Arrow direction="up" /></button><button disabled={i === ordered.length - 1} onClick={() => move(i, 1)} aria-label={t("Pomakni {name} dolje", {name:playerName(p)})}><Arrow direction="down" /></button></li>)}</ol>
          <div className="counter-actions"><button className="counter-primary" onClick={begin}>{t("Počni igru ")}<Arrow /></button>{order === "random" && <button className="counter-secondary" onClick={() => setOrdered(shuffled(ordered))}>{t("Ponovno izvuci")}</button>}<button className="counter-secondary" onClick={() => setStep("setup")}>{t("Uredi postavke")}</button></div>
        </section>}
        <p className="counter-footnote">{t("Bez prijave. Igra se sprema samo u ovom pregledniku. Nazive i rezultate ne šaljemo na poslužitelj.")}</p>
      </> : <>
        <div className="match-bar"><strong className="match-mode">{t(modeName(session.config))}</strong><span className="mono">{t("KRUG ")}{game.round}{["countup", "shanghai"].includes(session.config.mode) ? " / " + session.config.rounds : ""}</span><span>{session.config.mode === "x01" ? (session.config.entry === "double" ? "Double in" : "Open in") + " / " + ({ open: "Open out", double: "Double out", master: "Master out" }[session.config.out]) : t(mode.subtitle)}</span><button onClick={() => confirm.current?.showModal()}>{t("Nova igra")}</button></div>
        <div className="match-grid">
          <section className="throw-station" aria-label={t("Unos rezultata")}>
            {game.winners.length > 0 ? <div className="winner-panel" role="status">
              <span className="mono red">{game.winners.length > 1 ? t("PODIJELJENA POBJEDA") : t("POBJEDNIK")}</span>
              <h2>{game.players.filter(p => game.winners.includes(p.id)).map(p => playerName(p)).join(" / ")}</h2>
              <p>{t(game.notice)}</p><button className="counter-primary" onClick={() => { setSession({ ...session, actions: [] }); setMultiplier(1); }}>{t("Još jedna igra ")}<Arrow /></button>
            </div> : <div className={"current-player " + (game.bust ? "is-bust" : "")}>
              <div><span className="mono red">{t("NA REDU / ")}{String(game.active + 1).padStart(2, "0")}</span><h2>{playerName(current!)}</h2></div>
              <div className="current-total"><strong>{session.config.mode === "clock" ? current!.target === 21 ? "BULL" : current!.target : current!.score}</strong><span className="mono">{session.config.mode === "clock" ? t("SLJEDEĆI CILJ") : session.config.mode === "x01" ? t("PREOSTALO") : t("BODOVA")}</span></div>
              {session.config.mode === "shanghai" && <p className="round-target">{t("U ovom krugu vrijedi samo ")}<strong>{game.round}</strong>.</p>}
              {session.config.mode === "x01" && !current!.opened && <p className="round-target">{t("Za početak pogodi double.")}</p>}
            </div>}
            <div className="dart-slots" aria-label={t("Strelice u ovom potezu")}>{[0, 1, 2].map(i => <div key={i} className={game.hits[i] ? "filled" : ""}><small>0{i + 1}</small><span>{game.hits[i] ? t(hitLabel(game.hits[i])) : "—"}</span></div>)}</div>
            <p className="throw-status" role="status" aria-live="polite">{t(game.notice) || (game.turnOver ? t("Potez završen. Izvadite strelice pa nastavite.") : t("Unesi ") + (game.hits.length + 1) + t(". strelicu · ") + playerName(current!) + (session.config.mode === "x01" ? " · " + current!.score + t(" preostalo") : ""))}</p>
            {!game.winners.length && <>
              {isCricket(session.config.mode) && <div className="current-marks" role="group" aria-label={t("Cricket oznake: ") + playerName(current!)}>{TARGETS.map((n, i) => <div key={n} role="img" className={current!.marks[i] === 3 ? "closed" : ""} aria-label={(n === 25 ? "Bull" : n) + ": " + current!.marks[i] + t(" od 3 oznake")}><small aria-hidden="true">{n === 25 ? "BULL" : n}</small><strong aria-hidden="true">{["—", "/", "×", "⊗"][current!.marks[i]]}</strong></div>)}</div>}
              <fieldset className="score-pad" disabled={game.turnOver}><legend className="sr-only">{t("Pogođeno polje")}</legend>
                <div className="multipliers">{([1, 2, 3] as const).map(m => <button key={m} type="button" aria-pressed={multiplier === m} onClick={() => setMultiplier(m)}>{["", "Single ×1", "Double ×2", "Triple ×3"][m]}</button>)}</div>
                <div className={"number-pad " + (isCricket(session.config.mode) ? "cricket-pad" : "")}>{(isCricket(session.config.mode) ? TARGETS.slice(0, 6) : Array.from({ length: 20 }, (_, i) => 20 - i)).map(n => <button key={n} type="button" onClick={() => hit(n)} aria-label={t(hitLabel({ number: n, multiplier }))}>{n}</button>)}</div>
                <div className="bull-pad"><button onClick={() => hit(25, 1)}>25 <small>BULL</small></button><button onClick={() => hit(25, 2)}>50 <small>BULL</small></button><button onClick={() => hit(0, 1)}>0 <small>{t("PROMAŠAJ")}</small></button></div>
              </fieldset>
              <button className="counter-primary next-player" disabled={!game.turnOver} onClick={() => { setSession({ ...session, actions: [...session.actions, { type: "next" }] }); setMultiplier(1); }}>
                {game.turnOver && game.active === game.players.length - 1 && ["countup", "shanghai"].includes(session.config.mode) && game.round === session.config.rounds ? t("Prikaži rezultat") : t("Sljedeći: ") + playerName(game.players[(game.active + 1) % game.players.length])}<Arrow />
              </button>
            </>}
            <button className="undo-score counter-secondary" disabled={!session.actions.length} onClick={() => { setSession({ ...session, actions: session.actions.slice(0, -1) }); setMultiplier(1); }}>{t("Poništi zadnji unos")}</button>
            <p className="counter-muted pad-hint">{t("Za double ili triple prvo odaberi množitelj, zatim broj. Množitelj se nakon unosa vraća na single. Bull tipke uvijek vrijede 25 / 50.")}</p>
          </section>
          <aside className="match-scoreboard" aria-label={t("Rezultati igrača")}>
            <h2 className="counter-section-title"><span>{t("REZULTAT /")}</span> {game.players.length} {game.players.length === 1 ? t("IGRAČ") : t("IGRAČA")}</h2>
            <ol className="score-list">{game.players.map((p, i) => <li key={p.id} className={i === game.active ? "active" : ""} aria-current={i === game.active ? "true" : undefined}>
              <span className="counter-monogram">{initials({...p,name:playerName(p)})}</span><span className="score-name">{playerName(p)}<small>{p.darts}{t(" strelica ")}{i === game.active && !game.winners.length ? t("· na redu") : ""}</small></span><strong>{session.config.mode === "clock" ? p.target > 20 ? p.target === 21 ? "BULL" : "✓" : p.target : p.score}</strong>
            </li>)}</ol>
            {isCricket(session.config.mode) && <div className="cricket-table-wrap" role="region" aria-label={t("Cricket oznake, tablica se može pomicati vodoravno")} tabIndex={0}><table className="cricket-table"><caption>{t("Polja / tri oznake zatvaraju broj")}</caption><thead><tr><th scope="col">{t("Cilj")}</th>{game.players.map(p => <th key={p.id} scope="col">{playerName(p)}</th>)}</tr></thead><tbody>{TARGETS.map((n, j) => <tr key={n}><th scope="row">{n === 25 ? "BULL" : n}</th>{game.players.map(p => <td key={p.id} className={p.marks[j] === 3 ? "closed" : ""} aria-label={p.marks[j] + t(" od 3 oznake")}><span aria-hidden="true">{["—", "/", "×", "⊗"][p.marks[j]]}</span></td>)}</tr>)}</tbody></table></div>}
            {rules}
            <details className="counter-rules"><summary>{t("Zadnji unosi ")}<span aria-hidden="true">+</span></summary><ol className="throw-history">{session.actions.slice(-18).map((a, i) => <li key={session.actions.length - 18 + i}>{a.type === "next" ? t("Sljedeći igrač") : t(hitLabel(a.hit))}</li>)}</ol>{!session.actions.length && <p>{t("Prva strelica tek dolazi.")}</p>}</details>
            <p className="counter-footnote">{storageError ? t("Igra trenutačno nije spremljena.") : t("Automatski spremljeno na ovom uređaju.")}{t(" Možeš se vratiti u klub i nastaviti kasnije.")}</p>
          </aside>
        </div>
      </>}
    </main>
    <footer className="counter-footer"><span className="mono">{t("PK NORMAL / JEDAN CILJ.")}</span><a href="#pocetak">{t("Povratak na stranicu kluba ")}<Arrow /></a></footer>
    <dialog ref={confirm} className="counter-confirm" aria-labelledby="confirm-title"><h2 id="confirm-title">{t("NOVA IGRA?")}</h2><p>{t("Trenutni rezultat bit će zamijenjen. Želiš li nastaviti?")}</p><div className="counter-actions"><button className="counter-secondary" autoFocus onClick={() => confirm.current?.close()}>{t("Zadrži igru")}</button><button className="counter-primary" onClick={newGame}>{t("Nova igra")}</button></div></dialog>
  </div>;
}
