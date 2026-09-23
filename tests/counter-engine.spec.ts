import { test, expect } from "@playwright/test";
import { advance, initialGame, parseSession, replay, shuffled } from "../src/counter/engine";
import type { Config, Game, Hit, Session } from "../src/counter/engine";
const config: Config = { mode: "x01", start: 301, entry: "open", out: "double", rounds: 8, players: [{ id: "a", name: "Ana", tag: "A" }, { id: "b", name: "Tin", tag: "T" }] };
const dart = (game: Game, number: number, multiplier: Hit["multiplier"] = 1, c = config) => advance(game, { type: "dart", hit: { number, multiplier } }, c);
test("X01 bust restores the whole turn; zero on single and remaining one bust", () => {
  let game = initialGame(config);
  game.players[0].score = 60; game.turnStart = 60;
  game = dart(game, 20); expect(game.players[0].score).toBe(40);
  game = dart(game, 20, 3);
  expect(game.players[0].score).toBe(60); expect(game.bust).toBe(true);
  expect(dart(game, 20)).toBe(game);
  for (const start of [20, 21]) {
    game = initialGame(config); game.players[0].score = start; game.turnStart = start;
    game = dart(game, 20); expect(game.bust).toBe(true); expect(game.players[0].score).toBe(start);
  }
});
test("X01 legal double, bull, master and open finishes; double entry", () => {
  for (const [start, number, multiplier, out] of [[40, 20, 2, "double"], [50, 25, 2, "double"], [60, 20, 3, "master"], [20, 20, 1, "open"]] as const) {
    const c = { ...config, out };
    let g = initialGame(c); g.players[0].score = start; g.turnStart = start;
    g = dart(g, number, multiplier, c); expect(g.winners).toEqual(["a"]); expect(g.players[0].score).toBe(0);
  }
  const c = { ...config, entry: "double" as const };
  let g = initialGame(c);
  g = dart(g, 20, 3, c); expect(g.players[0].score).toBe(301);
  g = dart(g, 25, 2, c); expect(g.players[0].score).toBe(251);
  g = dart(g, 20, 3, c); expect(g.players[0].score).toBe(191);
  expect(g.turnOver).toBe(true);
});
test("turn cannot change early; three darts lock scoring and rotate all ten players", () => {
  const c = { ...config, players: Array.from({ length: 10 }, (_, i) => ({ id: String(i), name: "P" + i, tag: "" })) };
  let g = initialGame(c);
  expect(advance(g, { type: "next" }, c)).toBe(g);
  for (let i = 0; i < 10; i++) {
    expect(g.active).toBe(i);
    for (let j = 0; j < 3; j++) g = dart(g, 0, 1, c);
    expect(dart(g, 20, 1, c)).toBe(g);
    g = advance(g, { type: "next" }, c);
  }
  expect(g.active).toBe(0); expect(g.round).toBe(2);
});
test("Cricket closes with extra marks, scores once and never scores against closed opponents", () => {
  const c = { ...config, mode: "cricket" as const };
  let g = initialGame(c);
  g = dart(g, 20, 2, c); g = dart(g, 20, 3, c);
  expect(g.players[0].marks[0]).toBe(3); expect(g.players[0].score).toBe(40);
  g.players[1].marks[0] = 3;
  g = dart(g, 20, 3, c); expect(g.players[0].score).toBe(40);
});
test("Cut-throat penalizes only open opponents, supports ten players and closed leader winning", () => {
  const c = { ...config, mode: "cutthroat" as const, players: [...config.players, { id: "c", name: "C", tag: "" }] };
  let g = initialGame(c); g.players[0].marks[0] = 3; g.players[1].marks[0] = 3;
  g = dart(g, 20, 3, c);
  expect(g.players.map(p => p.score)).toEqual([0, 0, 60]);
  g = initialGame(c); g.players[0].marks[0] = 3; g.players[1].marks = [3,3,3,3,3,3,3]; g.players[1].score = 20;
  g.players[0].score = 40;
  g = dart(g, 20, 2, c);
  expect(g.winners).toEqual(["b"]);
});
test("Cricket requires a leading score, no-score only closure, bull counts one or two marks", () => {
  for (const mode of ["cricket", "no-score"] as const) {
    const c = { ...config, mode }; let g = initialGame(c);
    g.players[0].marks = [3,3,3,3,3,3,0]; g.players[1].score = 100;
    g = dart(g, 25, 1, c); expect(g.players[0].marks[6]).toBe(1);
    g = dart(g, 25, 2, c); expect(g.players[0].marks[6]).toBe(3);
    expect(g.winners).toEqual(mode === "no-score" ? ["a"] : []);
  }
});
test("Count Up gives equal turns, recognizes ties, and undo can reconstruct the result", () => {
  const c = { ...config, mode: "countup" as const, rounds: 5 };
  const s: Session = { version: 1, config: c, actions: [] };
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 3; j++) s.actions.push({ type: "dart", hit: { number: 20, multiplier: 3 } });
    s.actions.push({ type: "next" });
  }
  const game = replay(s);
  expect(game.players.map(p => p.score)).toEqual([900, 900]);
  expect(game.winners).toEqual(["a", "b"]);
  expect(replay({ ...s, actions: s.actions.slice(0, -1) }).winners).toEqual([]);
});
test("Around the Clock advances one target at a time, any bull finishes", () => {
  const c = { ...config, mode: "clock" as const };
  let g = initialGame(c);
  g = dart(g, 2, 3, c); expect(g.players[0].target).toBe(1);
  g = dart(g, 1, 3, c); expect(g.players[0].target).toBe(2);
  g.players[0].target = 21;
  g = dart(g, 25, 1, c); expect(g.winners).toEqual(["a"]);
});
test("Shanghai only scores round target, S/D/T in one turn wins, duplicates do not", () => {
  const c = { ...config, mode: "shanghai" as const, rounds: 7 };
  let g = initialGame(c); g = dart(g, 20, 3, c); expect(g.players[0].score).toBe(0);
  g = initialGame(c);
  for (const m of [3, 1, 2] as const) g = dart(g, 1, m, c);
  expect(g.players[0].score).toBe(6); expect(g.winners).toEqual(["a"]);
  g = initialGame(c);
  for (const m of [1, 2, 2] as const) g = dart(g, 1, m, c);
  expect(g.winners).toEqual([]);
});
test("saved sessions validate input; random order keeps every player exactly once", () => {
  const s: Session = { version: 1, config, actions: [{ type: "dart", hit: { number: 20, multiplier: 3 } }] };
  expect(parseSession(JSON.stringify(s))).toEqual(s);
  for (const raw of ["bad JSON", JSON.stringify({ ...s, version: 2 }), JSON.stringify({ ...s, actions: [{ type: "dart", hit: { number: 25, multiplier: 3 } }] }), JSON.stringify({ ...s, config: { ...config, players: [] } })]) expect(parseSession(raw)).toBeNull();
  const players = Array.from({ length: 10 }, (_, i) => i);
  expect(shuffled(players).sort((a,b) => a-b)).toEqual(players);
  expect(players).toEqual(Array.from({ length: 10 }, (_, i) => i));
});
