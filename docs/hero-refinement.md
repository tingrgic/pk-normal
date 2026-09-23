# Hero and navigation refinement — 23 September 2026

## Delivered

- Desktop final camera shifts the board right and slightly reduces its scale,
  preserving overlap with the right-hand letters of NORMAL.
- Desktop hero height now reserves enough space for the caption on short laptop
  displays; the red caption no longer sits on the wordmark at 1366×768.
- Small opening-pose images appear during preparation and fade into the live
  scene. Final and opening images have phone, tablet and desktop variants.
- The scene request starts before hydration, alongside the reflection preload.
  Board grain uses a single ImageData upload, and side entry starts in view.
- GSAP has its own shared bundle. Previously the manual Three.js chunk absorbed
  GSAP and was therefore imported eagerly by the rest of the page. The new build
  leaves Three.js deferred; reduced motion and direct tool visits skip it.
- Primary desktop navigation emphasizes the club, team, matches and joining.
  Brojač and Prognoze sit in a keyboard-accessible Alati disclosure; Merchshop
  has a separate visual treatment. Mobile has four primary links plus a smaller
  secondary group, including Sponsors.
- Hero CSS and camera presets now live in dedicated files. Club data, scoring
  rules, fixture data and tool functionality were not changed.

## Verification

`pnpm install --frozen-lockfile`, `pnpm build` and `pnpm test` completed.
All 68 tests passed in the final run (3.1 minutes).

The local headless Chromium run measured 792 ms from navigation to the first
animated phase, with reflection loading starting at 320 ms and the scene module
at 322 ms. Only one reflection request occurred; the map was not requested.
This is a local software-rendered measurement, not a physical-device or public
network benchmark.

Build checks measured initial JavaScript including shared motion/runtime at
151.2 kB gzip (160 kB budget), and the deferred scene at 136.5 kB (175 kB budget).
The build also rejects eager Three.js or map module preloads.

Reviewed 390×844, 430×932, 844×390, 932×430, 768×1024, 1024×768,
1366×768, 1440×900 and 1920×1080. No horizontal overflow was found.
Evidence: `docs/qa/hero-refinement-contact-sheet.webp`, individual hero images,
and `docs/qa/motion-final-{1440,390}-{side,orbit,follow,impact}.png`.
The motion capture script fixes the QA-only replay target to the opening bull.

Checks include delayed imports and early skip without an unexpected replay,
reflection failure, context loss and restored-context recovery, reduced motion,
JavaScript disabled, keyboard disclosure/menu behavior, focus restoration,
translations and accessibility audits. The responsive tests now also guard
the gap between the hero title and caption.

The result is built for static deployment and remains local; no publication was
performed.
