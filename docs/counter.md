# Brojač pikada

Standalone scoring view at `/#brojac`, reached through desktop/mobile navigation and
the “Ti bacaj. Mi brojimo.” section. Same fonts, graphite, warm paper and red identity.
Scoring takes priority over the large editorial heading during active play.

## Supported formats
- X01: 301, 501, 701, 901, 1001; open/double entry; open/double/master exit.
- Standard Cricket, cut-throat Cricket, Cricket without points.
- Count Up: 5/8/10/15/20 rounds; shared winners on a tie.
- Around the Clock: 1–20, then either bull; doubles/triples advance one target.
- Shanghai: 7/10/20 rounds; S/D/T on the round target immediately wins.
- 1–10 individual players; editable names and three-character identity marks.
- Starting order: real closest-to-bull throws followed by accessible reorder buttons,
  random shuffle with review, or original list order. Tied bull throws are repeated.

## Architecture and behavior
`src/Root.tsx` handles the hash route, preserving static-host compatibility. Counter code
and CSS load separately from the landing page. No router package or new dependency.
`src/counter/engine.ts` is an immutable scoring reducer, independent of React. The UI
records one event per dart and one event per confirmed handover. Undo removes the last
event and reconstructs the game, including penalties, busts, winning darts and handovers.
Three darts lock the keypad until the next-player button is pressed; busts end a turn early.
Bull buttons are always 25 and 50 independently of the selected number multiplier.

`src/counter/Counter.tsx` contains setup, reviewed starting order, scoring, scoreboards,
rules, resume and confirmed reset. `counter.css` contains the dedicated layouts.
Scoring uses button elements, labeled fields, keyboard-compatible reorder controls,
native confirmation dialog and live status announcements. Nothing depends on hover.
Cricket's ten-player matrix scrolls inside its own focusable region.

## Persistence / boundaries
One game is saved in localStorage under `pk-normal-counter-v1`, using a versioned config
and validated event log. Reload or return from the club offers a resume screen. Blocked
storage/quota failure leaves the live in-memory game usable and shows a warning.
Names/scores never leave the browser. No accounts, multiplayer synchronization, sensors,
photos, analytics, backend, sets/legs or tournament administration.
A browser-clearing action removes its save. Different origins (localhost, LAN IP,
Tailscale IP, later production URL) have independent saves. Use one scoring tab/device
per game. Offline reload is not promised; no service worker is installed.

## QA
Pure-engine tests cover legal checkouts, double entry, bust restoration, marks/overflow,
closed opponents, cut-throat winner detection, equal turns, ties, Around the Clock,
Shanghai, event replay/undo and malformed saves.
Browser tests cover names/tags, bull ordering, 10 players, randomized ordering, Cricket
scores, undo, handover, refresh/resume, route return, reset cancellation and accessibility.
Screenshot script: `scripts/counter-qa.mjs`; output: `docs/qa/counter-*`.

## Language support

Croatian, English and German UI labels and rules share the site language switch.
Scoring rules are unchanged. Optional `generatedName` metadata localizes automatic
player labels; custom names and older saved names are preserved. Version-1 saves,
undo and active scores survive language changes. See `docs/i18n.md`.

## Inline counter and statistics — 2026-10-07

The counter now expands inside the homepage. One H1 and one main landmark remain.
Tools load on demand and the rest of the document remains scrollable. Closing the
panel retains its versioned local save. Rules are a single collapsed disclosure
below the entire counter, titled “Pravila igre i objašnjenje izračuna”.

The always-expanded visit table has one column per player; each cell has first,
second and third dart in order. Rows are each player's first, second, etc. visit.
Its own horizontal scroll preserves ten-player layouts without page overflow.

Owner-requested statistics are computed by replaying the existing v1 action log;
there is no scoring/save-format migration. Each actual valid dart counts once;
unthrown darts after a bust or finish do not count. X01 AVG = net credited points /
actual darts × 3. A bust zeros all credits for its visit, including early darts in
that visit. Double-in misses score zero. First-nine AVG uses at most the first nine
actual darts with the same rules and displays the actual sample size. Other modes
show raw hit-value averages (not Cricket penalties, marks or Shanghai target score).
Highest checkout = start remainder of the winning visit. One game is one leg;
previous legs are not accumulated into the current game's statistics.

Checkout attempts are **opportunities**, not inferred aiming intent: before each
actual dart, test whether the remainder is legally finishable with one dart under
the current out/entry rules. Record attempts and successful finishes by that
remainder, and aggregate hits/attempts plus percentage. With double out,
112 → T20 → 52 → 2 → 50 → 13 → 37 records 0/1 at 50. 52 has no one-dart double
finish. Normal out allows singles, doubles and triples; master out doubles/triples.
Bull 50 qualifies as double 25; outer bull 25 only for normal out. Undo reconstructs
all statistics. These are explicit local display definitions requested by the owner,
not claims about a federation's averaging conventions.

The end-of-game native modal shows every player and all recorded finish chances;
it can be dismissed, reopened and used with keyboard focus. Normal in/out are UI
names for the existing open in/out behavior; Double in/out remains double-only.
