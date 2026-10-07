# Virtualni dvoboji

`/#dvoboji` is a lazy React view. The landing invitation is `/#prognoze`.
This is an entertainment simulator with local virtual points only. It has no
payment, real-money balance, prize, real event settlement or external account.
Every selected pairing is hypothetical, even if the two players have met before.

## Official data and freshness

All factual data are in `src/data/club.ts` (`oddsSnapshot`), retrieved from the
PSGZ 4. liga / skupina B 2026/27 table. The roster of nine Normal players remains
HPS sourced. The snapshot records its exact UTC retrieval time; the UI formats
it in Europe/Zagreb. It is not a live feed. Each of the 11 team rows and 50 player
rows has the shared official source and retrieval date. The initial snapshot
contains one completed league fixture per active team (BLACK M has none).
It includes four Normal players with appearances. Absence from the performance
table is displayed as “Bez nastupa u presjeku”, never as a zero-win record.

`scripts/update-odds.mjs` fetches the official public league renderer, extracts
standings and the individual W/L and leg W/L table, validates the shape, and
replaces only the generated snapshot block in club.ts. Run manually, inspect
changes and run tests before releasing. The script does not infer results from
schedule placeholders or from ongoing fixture scores. The tests reconcile every
team's duel and leg totals with individual totals. The snapshot is archived in
`docs/qa/odds-source.json`; this file is not read by the app.

## Model v1 (project choice, not a federation rule)

For each team, shrink individual-duel and leg win ratios toward 50%:

- Team duel prior = (duels won + 8) / (duels played + 16).
- Team leg prior = (legs won + 16) / (legs played + 32).
- Player duel estimate = (wins + 8 × team duel prior) / (played + 8).
- Player leg estimate = (legs won + 16 × team leg prior) / (legs played + 16).
- Strength = 0.75 × duel estimate + 0.25 × leg estimate.
- Missing player record uses the corresponding team priors, explicitly labelled.
- P(A beats B) = A(1−B) / [A(1−B) + B(1−A)], capped to [0.15, 0.85].
- Fair decimal odds = 1 / probability; complementary outcomes, no margin.

These weights and priors are conservative design choices, not fitted parameters.
The model has not been backtested or calibrated. It does not account for strength
of past opposition, home advantage, actual lineup, injuries, or historical seasons.
Team points (including disciplinary deductions) are not a measure of playing
strength and do not enter the formula. Individual and team data overlap: this is
an explicit heuristic, not independent statistical evidence. Displaying two
odds decimals is a formatting choice, not a claim of predictive precision.
If an opposing team has no recorded players, odds and play are unavailable.

## Virtual game

Start with 1,000 points. Pick either player in one duel, stake an integer of at least 10
up to the full balance (no fixed upper stake cap), and explicitly trigger a simulation. Browser randomness draws
a binary outcome from the selected probability. Payout includes stake and rounds
stake × full-precision odds to the nearest point. The UI discloses rounded odds.
Only the last 20 simulations are retained, with frozen picks, odds and payouts.
They are never mixed with official results, schedules, players or club statistics.
Versioned localStorage key `pk-normal-virtual-duels-v1` stores balance and history.
Malformed or incompatible saves reset to a clean game. Blocked storage displays
a notice and leaves in-memory play available. Reset asks before deleting history.
Random IDs use getRandomValues rather than secure-context-only randomUUID so LAN
HTTP previews work too. A fresh browser or reset is a new local game.

## Tests

`tests/odds.spec.ts`: model symmetry, probability bounds, monotonicity and zero
sample handling; payout math, stakes, save validation, bounded history; source
reconciliation; all nine players, no-data team, selection, persistence, reset,
blocked storage, keyboard operation, nine viewports and desktop/mobile axe audits.

Owner-requested change, 2026-10-07: removed the 100-point stake cap and the
100-million saved-balance cap. Version 1 saves remain compatible. Arithmetic
must remain within JavaScript safe integers; unsafe payouts are rejected.
