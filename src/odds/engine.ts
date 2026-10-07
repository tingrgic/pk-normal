export type RecordStats = { wins: number; losses: number; legsWon: number; legsLost: number };
export type TeamStats = { duelsWon: number; duelsLost: number; legsWon: number; legsLost: number };
export const MODEL_VERSION = '1';
export const SAVE_KEY = 'pk-normal-virtual-duels-v2';
export const LEGACY_SAVE_KEY = 'pk-normal-virtual-duels-v1';
export const normalizeName = (name: string) => name.normalize('NFC').toLocaleLowerCase('hr-HR').replace(/\s+/g, ' ').trim();

// Conservative team prior; zero appearances remain unknown, never recorded losses.
export function strength(player: RecordStats | undefined, team: TeamStats) {
  const teamDuels = (team.duelsWon + 8) / (team.duelsWon + team.duelsLost + 16);
  const teamLegs = (team.legsWon + 16) / (team.legsWon + team.legsLost + 32);
  const duels = player ? (player.wins + 8 * teamDuels) / (player.wins + player.losses + 8) : teamDuels;
  const legs = player ? (player.legsWon + 16 * teamLegs) / (player.legsWon + player.legsLost + 16) : teamLegs;
  return .75 * duels + .25 * legs;
}
export function quote(a: RecordStats | undefined, aTeam: TeamStats, b: RecordStats | undefined, bTeam: TeamStats) {
  const x = strength(a, aTeam), y = strength(b, bTeam);
  const probability = Math.min(.85, Math.max(.15, x * (1-y) / (x*(1-y) + y*(1-x))));
  return { probability, home: 1/probability, away: 1/(1-probability) };
}
export type Pick = { player: string; opponent: string; team: string; side: 'home' | 'away'; probability: number; odds: number };
export type Ticket = Pick & { id: string; stake: number; won: boolean; payout: number };
export type Game = { version: 2; balance: number; history: Ticket[]; lastReset: string | null };
export const newGame = (): Game => ({ version: 2, balance: 1000, history: [], lastReset: null });
export function play(game: Game, pick: Pick, stake: number, random: number, id: string): Game {
  if (!Number.isSafeInteger(stake) || stake <= 0 || stake > game.balance) throw new Error('Ulog mora biti pozitivan cijeli broj unutar tvog salda.');
  if (!Number.isFinite(random) || random < 0 || random >= 1 || !Number.isFinite(pick.probability) || pick.probability <= 0 || pick.probability >= 1 || Math.abs(pick.odds - 1/pick.probability) > .000001) throw new Error('Neispravna procjena.');
  const won = random < pick.probability;
  const payout = won ? Math.round(stake * pick.odds) : 0;
  const balance = game.balance - stake + payout;
  if (!Number.isSafeInteger(payout) || !Number.isSafeInteger(balance)) throw new Error('Broj bodova prelazi podržanu preciznost.');
  return { ...game, version: 2, balance, history: [{ ...pick, id, stake, won, payout }, ...game.history].slice(0, 20) };
}
export function restore(raw: string | null): Game {
  try {
    const value = JSON.parse(raw || 'null');
    if (![1,2].includes(value?.version) || !Number.isSafeInteger(value.balance) || value.balance < 0 || !Array.isArray(value.history) || value.history.length > 20) return newGame();
    for (const t of value.history) {
      if (!['player','opponent','team','id'].every(k => typeof t[k] === 'string' && t[k].length > 0 && t[k].length < 200) || !['home','away'].includes(t.side) || typeof t.won !== 'boolean' || !Number.isSafeInteger(t.stake) || t.stake <= 0 || !Number.isFinite(t.probability) || t.probability < .15-1e-9 || t.probability > .85+1e-9 || !Number.isFinite(t.odds) || Math.abs(t.odds-1/t.probability) > .000001 || !Number.isSafeInteger(t.payout) || t.payout !== (t.won ? Math.round(t.stake*t.odds) : 0)) return newGame();
    }
    if (value.version === 2 && value.lastReset !== null && (typeof value.lastReset !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value.lastReset))) return newGame();
    return { ...value, version: 2, lastReset: value.version === 1 ? null : value.lastReset } as Game;
  } catch { return newGame(); }
}

export const localDay = (now = Date.now()) => new Intl.DateTimeFormat('en-CA', {timeZone:'Europe/Zagreb',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(now));
export const canReset = (game: Game, now = Date.now()) => game.lastReset !== localDay(now);
export function resetDaily(game: Game, now = Date.now()): Game {
  if (!canReset(game, now)) throw new Error('Bodove možeš resetirati jednom dnevno. Novi reset dostupan je nakon ponoći u Zagrebu.');
  return {...newGame(), lastReset:localDay(now)};
}
