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
