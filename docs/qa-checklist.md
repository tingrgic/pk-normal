# QA — final verification

Checked 2026-09-16 against the production build, Chromium 153, Playwright 1.63.

- [x] Fresh frozen-lockfile installation succeeds.
- [x] TypeScript and production build succeed; full HTML is prerendered.
- [x] Desktop hero/full-page and 390/430 hero/full-page screenshots captured and visually reviewed.
- [x] All nine required viewport sizes tested without horizontal overflow.
- [x] Flight enters from right; side silhouette, camera orbit, rear-follow and bull impact inspected as frozen GSAP frames.
- [x] Replay and skip work; only one canvas remains.
- [x] Mobile menu opens/closes, traps focus, handles Escape, restores focus and unlocks scrolling.
- [x] Every internal anchor resolves.
- [x] Phone CTA uses the verified captain number; external profile links all return HTTP 200.
- [x] Keyboard identity controls work; focus styling and AA text contrast checked.
- [x] Reduced-motion skips 3D loading; final poster and full content remain.
- [x] WebGL failure preserves the composition and all useful content.
- [x] Disabled JavaScript preserves prerendered content, roster, contact and navigation.
- [x] No runtime, hydration or missing-asset errors in normal tested operation.
- [x] Every factual claim has a source; no fabricated result or contact.
- [x] Anti-template audit and more than ten refinements documented in self-critique.md.

## Automated results

**18 / 18 Playwright tests pass**, including desktop and mobile axe WCAG A/AA checks with zero violations. Final suite duration: 20.7 seconds on this workstation.

Required viewport matrix:
390×844, 430×932, 844×390, 932×430, 768×1024, 1024×768, 1366×768, 1440×900 and 1920×1080.

## Lighthouse

Mobile simulation against production:

- Performance: **53**
- Accessibility: **100**
- Best practices: **100**
- SEO: **100**
- Cumulative layout shift: **0**

The performance score is not presented as a pass. The headless browser uses SwiftShader software WebGL and simulated mobile CPU/network throttling. This exposes a graphics-driver-heavy blocking period and is not a physical phone measurement. Investigated and removed runtime PMREM processing, baked reflections, added asynchronous shader preparation, preloaded primary fonts and bypassed WebGL entirely for reduced motion. Normal end-to-end load/replay test improved from 11.7s to 5.9s in the same test harness. The 3D scene has no continuous render loop once settled.

**Not verified:** real iPhone/Android GPU frame pacing, actual telephone dialling, or the physical venue. The source-backed phone link is inspected, not dialled. Real-device performance remains a launch validation item; no claim that browser emulation proves hardware smoothness.

## Evidence

Screenshots and source-link status are in docs/qa/. The Lighthouse JSON records the actual run. scripts/inspect.mjs reproduces responsive screenshots; scripts/motion-frames.mjs freezes real animation poses via test-only instrumentation. No debug API is shipped.

## Preview

- Same computer: http://localhost:5173/
- Phone / another computer on this LAN: private development-server address
- Production preview: http://localhost:4173/

The LAN address belongs to the current machine and may change. Keep the development server running while previewing. No public deployment was performed.

## Counter extension — 2026-09-17
- [x] Production build passes; counter lazy chunk approximately 7.5 kB gzip plus separate CSS.
- [x] Full suite: 32 passing tests (14 counter engine/UI checks + 18 landing regressions).
- [x] Setup and scoring checked at all nine required viewport sizes; no page overflow.
- [x] Manually reviewed 390/430 phone setup and 390/1440 active-game screenshots.
- [x] Ten-player Cricket overflow contained within its scrollable matrix.
- [x] Scoring rules: busts, double entry, finishes, cricket marks/penalties, ties and Shanghai.
- [x] Names, identity marks, bull-order moves, random order and ten-player cap.
- [x] Undo, confirmed reset, winning-dart undo, refresh/resume and return navigation.
- [x] Axe: no violations in setup or active X01; native keyboard controls and dialog.
- [x] Sources and supported house variants documented in docs/sources.md and docs/counter.md.
- [x] Preview responds through Tailscale at the private Tailscale development address.
- [ ] Physical iPhone verification remains owner-side; browser emulation is not a hardware test.
- [x] Final additional audit: ten-player Cricket also has zero axe violations; mark groups have explicit accessible roles. All four counter browser flows passed again after this accessibility fix.

## Match atlas — 2026-09-18
- [x] Production build passes. Map SDK/worker/CSS are lazy route chunks.
- [x] Existing 32 landing/counter tests pass; four additional atlas tests pass.
- [x] Fixture integrity: 13 published 2026 entries, 12 league / one cup; seven sourced venues.
- [x] UTC calendar conversion, autumn offset, UTF-8 folding, single/bulk downloads.
- [x] Home/away/cup/month filters, empty reset, unknown venue, official-source links.
- [x] All nine requested viewport dimensions tested without page overflow.
- [x] Real OpenFreeMap rendering inspected at 1440, 390 and 430 widths.
- [x] Marker click selects fixture; 2D/3D toggle and overview work; cup hides other pins.
- [x] Axe: zero violations with real map desktop/phone and unavailable-map phone state.
- [x] External map failure preserves schedule, navigation, addresses and downloads.
- [x] No runtime or console errors in real-map QA. Provider attribution retained.
- [x] Tailscale dev URL returns HTTP 200; no public deployment.
- [ ] Physical phone GPU/frame pacing needs hardware review; emulation is not a hardware test.

Visual/functional critique fixes: zero-height SDK container corrected; year contrast
increased; duplicate provider attribution removed; mobile overview padded away from
controls; overview reframes on viewport changes; geocodes distinguish addresses from
entrances; missing location has no invented navigation; unplayed 0:0 is suppressed;
calendar uses correct autumn offset; source/check-date and non-sync notes remain
visible. Full schedule is usable without loading WebGL.

Artifacts: `docs/qa/atlas-desktop.png`, `atlas-stage-desktop.png`,
`atlas-mobile-390.png`, `atlas-mobile-430.png`, corresponding mobile stage/overview
captures. Real-provider smoke script: `node scripts/atlas-qa.mjs`.

## Sponsor section — 2026-09-18

- `pnpm install` and `pnpm build` pass using the bundled Node runtime.
- Full `pnpm test`: **36 passed (37.6s)**, including landing-page accessibility,
  navigation, reduced motion, WebGL fallback, counter and atlas regression checks.
- Sponsor screenshots captured and reviewed at all nine required viewports:
  `docs/qa/sponsors-{width}x{height}.png`.
- Additional browser checks: logo loads from the local asset, no horizontal
  overflow, desktop navigation does not overlap the wordmark, sponsor CTA uses
  the existing club telephone number, and mobile “Sponzori” navigation reaches
  `#sponzori` and closes the dialog.
- Drinks, equipment and financial support confirmed by the owner; provenance
  recorded in `docs/sources.md`. No contribution amounts or contract terms added.
- Local production build prepared; no publication performed.

## Sponsor refinement and virtual duels — 2026-09-18

- Sponsor white panel and contribution copy/list removed. Original mark is rendered
  in warm white on graphite; company name and sponsor inquiry remain.
- Install and production build pass. Final full suite: **42 passed (44.5s)**.
- Added model/ledger unit tests, official team/player total reconciliation,
  persistence, invalid/blocked storage, no-data team, nine-player coverage,
  keyboard and desktop/mobile accessibility tests. The play flow also passes
  with `crypto.randomUUID` unavailable, as on non-secure LAN HTTP previews.
- All nine required viewport screenshots captured by `scripts/odds-qa.mjs`;
  odds workspace screenshots visually reviewed at each size. Sponsor desktop
  and mobile screenshots reviewed. No horizontal overflow or navigation overlap.
- Fixed selected-odds hover contrast and restored destination scrolling when
  returning from a lazy view to the landing page. Added a phone shortcut to
  the selected duel's stake control.
- Evidence: `docs/qa/odds-full-*.png`, `odds-workspace-*.png`, and
  `sponsors-refined-*.png`. Existing hero, counter and atlas tests still pass.
- Static production build ready locally; no publication performed. Physical
  phone hardware and predictive accuracy of the heuristic are not validated.

## Croatian / English / German — 2026-09-19

- `pnpm install` and production `pnpm build` pass.
- Full regression suite: **49 passed (1.1m)**. After final wording refinements,
  the 13 localization/odds tests passed again (32.2s).
- HR / EN / DE switch is present on every route, uses 44px buttons, exposes
  selected state and lives in a named navigation landmark. Saved preference,
  blocked storage, HTML language, metadata, hydration and reload tested.
- All four views in English and German checked at the nine required viewport
  sizes. No horizontal overflow, runtime errors or untranslated catalogue keys
  in rendered text/accessible attributes. Desktop and phone screenshots captured
  in `docs/qa/i18n-{en|de}-{landing|brojac|karta|dvoboji}-{390|1440}.png` and reviewed.
- Active counter scores, user-entered names and saved sessions survive switching;
  automatic player labels translate. Virtual point balances/history remain
  unchanged and existing result messages translate in place.
- ICS exports translate descriptions and unknown venues while keeping official
  names, UIDs, source URLs and UTC starts. UTF-8 folding tests pass.
- Real external map checked separately: English/German canvas labels update,
  the selected 2D setting survives and only one canvas remains after switching.
- Croatian baseline, nine-view responsiveness, menu keyboard behavior, reduced
  motion, WebGL fallback, counter rules and atlas regression tests pass.
- Translation architecture and maintenance documented in `docs/i18n.md`.
  Deployment-ready local build only; no publication performed.

## GitHub Pages preparation — 2026-09-23
- [x] Production build with `SITE_BASE=/pk-normal/` passes bundle budgets.
- [x] Landing, shop, counter and atlas open under the project subpath without runtime errors or missing local assets.
- [x] Merch images now use Vite's base URL for repository-hosted Pages compatibility.
- [x] Existing Pages workflow derives base path and canonical URL from configure-pages.
- [x] Published to https://tingrgic.github.io/pk-normal/ through successful GitHub Actions run 35915346373; HTTPS returns 200.

## Daylight map refinement — 2026-09-26
- [x] Warm paper terrain, blue water, sage parks and sandstone 3D buildings visually reviewed.
- [x] Desktop 1440 and phone 390/430 screenshots inspected with real map tiles.
- [x] Venue selector, marker selection, north reset, 2D/3D and city overview exercised.
- [x] Eleven atlas/language tests pass, including nine sizes and English/German accessibility.
- [x] Real-provider desktop/mobile axe checks pass without runtime errors.
- [x] Production build passes TypeScript and compressed bundle budgets.
- [x] Mobile toolbar uses two rows of comfortable controls to accommodate translated labels.
