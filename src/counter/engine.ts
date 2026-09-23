/** Pure scoring engine. Each event is one actual dart or a confirmed handover. */
export const MODES = [
  { id: "x01", name: "X01", subtitle: "Od 301 do nule.", rule: "Oduzimaj pogotke do točno nule. Prebačaj vraća rezultat na početak poteza. Double out traži dvostruko polje (ili bull 50); master out prihvaća i trostruko. Uz te izlaze, ostatak 1 također je prebačaj." },
  { id: "cricket", name: "Cricket", subtitle: "Zatvori. Osvajaj.", rule: "Zatvori 20, 19, 18, 17, 16, 15 i bull s po tri oznake. Višak pogodaka donosi bodove dok barem jedan suparnik nije zatvorio broj. Pobjeđuje igrač koji zatvori sve i ima najmanje jednako bodova kao svaki suparnik." },
  { id: "cutthroat", name: "Cut-throat", subtitle: "Bodovi idu drugima.", rule: "Cricket u kojem višak pogodaka donosi bodove svakom suparniku koji još nije zatvorio broj. Zatvori sve i imaj najmanje bodova. Jednaki bodovi dovoljni su za pobjedu uz sva zatvorena polja." },
  { id: "no-score", name: "Cricket / bez bodova", subtitle: "Samo zatvaranje.", rule: "Tri oznake zatvaraju broj. Prvi zatvori sve brojeve od 15 do 20 i bull. Nema bodova; single, double i triple vrijede jednu, dvije i tri oznake." },
  { id: "countup", name: "Count Up", subtitle: "Svaki pogodak vrijedi.", rule: "Zbrajaj bodove kroz odabrani broj krugova. Svatko ima tri strelice po krugu. Nakon jednakog broja poteza pobjeđuje najveći zbroj. Jednak rezultat znači podijeljenu pobjedu." },
  { id: "clock", name: "Around the Clock", subtitle: "Od 1 do 20. Pa bull.", rule: "Pogodi redom 1–20, zatim vanjski ili unutarnji bull. Dvostruko i trostruko polje pomiču te samo za jedan broj. Prvi koji završi niz pobjeđuje. Tri strelice po potezu." },
  { id: "shanghai", name: "Shanghai", subtitle: "Tri prstena. Jedan broj.", rule: "U svakom krugu gađaj broj kruga, od 1 do odabranog završnog broja. Samo taj broj donosi bodove. Single, double i triple tog broja u istom potezu odmah donose pobjedu. Inače pobjeđuje najveći zbroj nakon svih krugova; izjednačeni dijele pobjedu." },
] as const;
export type Mode = typeof MODES[number]["id"];
export type Player = { id: string; name: string; tag: string; generatedName?: boolean };
export type Config = {
  mode: Mode; start: number; entry: "open" | "double";
  out: "open" | "double" | "master"; rounds: number; players: Player[];
};
export type Hit = { number: number; multiplier: 1 | 2 | 3 };
export type Action = { type: "dart"; hit: Hit } | { type: "next" };
export type Session = { version: 1; config: Config; actions: Action[] };
export type Score = Player & { score: number; marks: number[]; opened: boolean; target: number; darts: number };
export type Game = {
  players: Score[]; active: number; round: number; hits: Hit[]; bust: boolean;
  turnStart: number; openedStart: boolean; turnOver: boolean; winners: string[]; notice: string;
};
export const TARGETS = [20, 19, 18, 17, 16, 15, 25];
export const isCricket = (mode: Mode) => ["cricket", "cutthroat", "no-score"].includes(mode);
export function hitLabel(hit: Hit) {
  if (!hit.number) return "PROMAŠAJ";
  if (hit.number === 25) return hit.multiplier === 2 ? "BULL 50" : "BULL 25";
  return (["", "", "D", "T"][hit.multiplier]) + hit.number;
}
export function initialGame(config: Config): Game {
  const players = config.players.map(p => ({ ...p, score: config.mode === "x01" ? config.start : 0, marks: TARGETS.map(() => 0), opened: config.entry === "open", target: 1, darts: 0 }));
  return { players, active: 0, round: 1, hits: [], bust: false, turnStart: players[0].score, openedStart: players[0].opened, turnOver: false, winners: [], notice: "" };
}
export function validHit(hit: Hit) {
  return Number.isInteger(hit.number) && [1, 2, 3].includes(hit.multiplier) &&
    ((hit.number >= 1 && hit.number <= 20) || (hit.number === 25 && hit.multiplier <= 2) || (hit.number === 0 && hit.multiplier === 1));
}
export function advance(previous: Game, action: Action, config: Config): Game {
  if (previous.winners.length) return previous;
  if (action.type === "next") {
    if (!previous.turnOver) return previous;
    const active = (previous.active + 1) % previous.players.length;
    const round = previous.round + (active === 0 ? 1 : 0);
    if ((config.mode === "countup" || config.mode === "shanghai") && round > config.rounds) {
      const high = Math.max(...previous.players.map(p => p.score));
      return { ...previous, winners: previous.players.filter(p => p.score === high).map(p => p.id), notice: "Gotovo. Svaka strelica se računa." };
    }
    const player = previous.players[active];
    return { ...previous, active, round, hits: [], bust: false, turnOver: false, turnStart: player.score, openedStart: player.opened, notice: "" };
  }
  if (previous.turnOver || !validHit(action.hit)) return previous;
  const game = { ...previous, players: previous.players.map(p => ({ ...p, marks: [...p.marks] })), hits: [...previous.hits, action.hit], notice: "" };
  const p = game.players[game.active], hit = action.hit;
  p.darts++;
  const value = hit.number * hit.multiplier;
  const win = () => { game.winners = [p.id]; game.notice = "Pogodak za pobjedu."; };
  if (config.mode === "x01") {
    if (!p.opened && hit.multiplier === 2) p.opened = true;
    if (p.opened) {
      const remaining = p.score - value;
      const legalOut = config.out === "open" || hit.multiplier === 2 || (config.out === "master" && hit.multiplier === 3);
      if (remaining < 0 || (remaining === 1 && config.out !== "open") || (remaining === 0 && !legalOut)) {
        p.score = game.turnStart;
        p.opened = game.openedStart;
        game.bust = true;
        game.notice = "Prebačaj. Rezultat se vraća na početak poteza.";
      } else {
        p.score = remaining;
        if (remaining === 0) win();
      }
    } else game.notice = "Za ulaz je potrebno dvostruko polje.";
  } else if (isCricket(config.mode)) {
    const index = TARGETS.indexOf(hit.number);
    if (index !== -1) {
      const extra = Math.max(0, p.marks[index] + hit.multiplier - 3);
      p.marks[index] = Math.min(3, p.marks[index] + hit.multiplier);
      if (config.mode === "cutthroat") {
        game.players.forEach((other, i) => { if (i !== game.active && other.marks[index] < 3) other.score += extra * hit.number; });
      } else if (config.mode === "cricket" && game.players.some((other, i) => i !== game.active && other.marks[index] < 3)) p.score += extra * hit.number;
      // A cut-throat penalty can also put an already-closed opponent in the lead.
      const winner = game.players.find(other => other.marks.every(m => m === 3) &&
        (config.mode === "no-score" || game.players.every(q => config.mode === "cutthroat" ? other.score <= q.score : other.score >= q.score)));
      if (winner) { game.winners = [winner.id]; game.notice = "Sva polja zatvorena. Igra je završena."; }
    }
  } else if (config.mode === "clock") {
    if (hit.number === (p.target === 21 ? 25 : p.target)) {
      p.target++;
      if (p.target === 22) win();
    }
  } else if (config.mode === "shanghai") {
    if (hit.number === game.round) p.score += value;
    if ([1, 2, 3].every(m => game.hits.some(h => h.number === game.round && h.multiplier === m))) {
      win(); game.notice = "Shanghai! Tri prstena, jedan broj.";
    }
  } else p.score += value;
  game.turnOver = game.bust || game.hits.length === 3 || game.winners.length > 0;
  return game;
}
export function replay(session: Session) {
  return session.actions.reduce((game, action) => advance(game, action, session.config), initialGame(session.config));
}
export function shuffled<T>(players: T[]): T[] {
  const result = [...players];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
export const SAVE_KEY = "pk-normal-counter-v1";
export function parseSession(raw: string | null): Session | null {
  try {
    if (!raw || raw.length > 2_000_000) return null;
    const s = JSON.parse(raw) as Session, c = s.config;
    if (s.version !== 1 || !c || !MODES.some(m => m.id === c.mode) ||
      ![301, 501, 701, 901, 1001].includes(c.start) || !["open", "double"].includes(c.entry) ||
      !["open", "double", "master"].includes(c.out) || ![5, 7, 8, 10, 15, 20].includes(c.rounds) ||
      !Array.isArray(c.players) || c.players.length < 1 || c.players.length > 10 ||
      c.players.some(p => !p || typeof p.id !== "string" || typeof p.name !== "string" || !p.name.trim() || p.name.length > 24 || typeof p.tag !== "string" || p.tag.length > 3 || (p.generatedName !== undefined && typeof p.generatedName !== "boolean")) ||
      new Set(c.players.map(p => p.id)).size !== c.players.length ||
      !Array.isArray(s.actions) || s.actions.length > 20000 ||
      s.actions.some(a => !a || (a.type !== "next" && (a.type !== "dart" || !a.hit || !validHit(a.hit))))) return null;
    return s;
  } catch { return null; }
}
