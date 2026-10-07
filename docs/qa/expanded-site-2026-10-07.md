# Expanded homepage — 7 October 2026

Previous published version backed up with annotated GitHub tag
`backup-before-expanded-site-2026-10-07` (4767e40).

Implemented: homepage-preserving lazy tools, enlarged circular dart replay,
180 fixed descriptions shuffled on each page load, smaller roster cards, revised
club/competition/footer copy, sponsor invitation, shared dart link icons, refreshed
2026/27 match atlas, and per-dart counter statistics with an accessible result modal.
Virtual stakes use positive whole points up to the balance; reset is once per Zagreb
calendar day. Existing counter saves and virtual-point v1 ledgers are preserved.

Validation:
- Frozen-lockfile installation and production build; initial JS gzip 156.7 kB
  within 160 kB budget, deferred Three.js 136.5 kB within 175 kB.
- Full 79-test Playwright run passed. Additional mobile inline-navigation test
  and repeat-opening/focus check added and run after final navigation polish.
- Counter tests cover ordered 112 → T20 → 52 → 2 → 50 → 13 → 37 (0/1), bust,
  first-nine average, double-in, all exit modes, undo, old saves and modal focus.
- Virtual ledger tests cover stake 1/full balance, migration, midnight in Zagreb,
  repeated reset denial and synchronization between open tabs.
- Keyboard, reduced motion, no JavaScript, WebGL failure, blocked storage,
  HR/EN/DE, one main/H1 and ten-player counter layouts checked.
- Real OpenFreeMap rendering, marker selection, overview, 2D/3D, filters,
  mobile/desktop accessibility, and no horizontal overflow passed.
- Nine viewports: 390×844, 430×932, 844×390, 932×430, 768×1024,
  1024×768, 1366×768, 1440×900, 1920×1080. Reviewed overview/roster contact sheets,
  replay, counter visits/summary, competition and real atlas screenshots.

Evidence: `expanded-*.png`, `expanded-*-nine-viewports.jpg`, `atlas-*.png`,
`merch-*.png`. Sources and known published aggregate discrepancies are recorded
in `docs/sources.md`. Hollywood Promili and Mozart Diamanti have no published
HPS playing address and intentionally have no inferred marker. Results are a
checked snapshot, not an automatic live data feed. One counter game is one leg;
statistics are local and do not represent official club results.
