# PK Normal — project rules

## PROJECT PURPOSE

An original Croatian one-page darts club website. Static-deployable, accurate and equally considered on phones and desktops.

## DESIGN PRINCIPLES

Dark precision meets oversized editorial typography. Normal is the name; exactness is the visual language. Preserve premium visual quality. No generic UI components without a documented reason.

## VISUAL RULES

Open compositions, hairline rules, radial geometry, square edges. No stock people, fake crests, decorative dashboards or SaaS cards.

## TYPOGRAPHY RULES

Barlow Condensed display; Manrope body. Local font files, Croatian glyphs. Fluid sizes, deliberate mobile breaks, one semantic H1.

## COLOR RULES

Graphite #090909, warm white #f0eee8, muted #a09f9a, signal red #ed382b. Red marks a moment, not every surface.

## SPACING SYSTEM

8px base; 16/24/32/48/64/96/128 progression. Fluid gutters from 20 to 72px. Generous vertical rhythm.

## MOTION RULES

GSAP orchestrates a real Three.js side-to-rear dart flight and impact. Native scrolling. No scroll hijacking. Stop rendering after motion, pause hidden scenes, dispose resources. Replay and skip always accessible.

## ACCESSIBILITY RULES

Semantic sections, visible focus, 44px controls, dialog focus management, reduced-motion static final scene, no hover-only meaning. Content must survive WebGL failure.

## RESPONSIVE RULES

Phone portrait and desktop are separate compositions. Safe area insets, svh, landscape treatment, no horizontal overflow. Inspect nine required viewports.

## DATA INTEGRITY RULES

All facts in src/data/club.ts, source records in docs/sources.md. Owner-provided membership is explicitly distinguished from federation verification. No invented roster, scores, address, contact or founding history.

## PERFORMANCE RULES

Lazy Three.js chunk, capped DPR, procedural geometry, no postprocessing or continuous render loop. Fonts self-hosted. No analytics or tracking.

## CODE QUALITY RULES

TypeScript strict, React functional components, clear cleanup. pnpm install, pnpm build, pnpm test. Do not ship unused scaffolding or TODO sections.

## FACT CHECKING RULES

Official PSGZ/HPS first. Log URL, check date, confidence and source type for every factual statement. Check links before changing data. Federation contact is never club contact.

## ANTI-PATTERNS

No pill grids, generic icons, glass panels, gradients everywhere, fictitious statistics, fake biographies, excessive pinned sections or perpetual motion.

## ACCEPTANCE CRITERIA

Build passes; factual content sourced; mobile/desktop screenshots reviewed; side-entry, camera orbit, rear follow, board and bull impact verified; menu, anchors, keyboard, reduced motion and WebGL fallback tested. Deploy-ready only; no publication without authorization.

## DART COUNTER
`/#brojac` is a lazy-loaded scoring view. Keep rules in `src/counter/engine.ts`,
independent of UI, and test scoring edge cases before changing them. Preserve
versioned local saves, undo, accessible controls and ten-player layouts. Document
format variants in `docs/counter.md` and source any rule changes. Never treat locally
entered names/results as official club data. New styles must not collide with landing-page
classes; namespace counter-specific components.

## MATCH ATLAS
`/#karta` is a lazy map and schedule view. Club facts remain in `src/data/club.ts`;
fixtures and grounded venue data live in `src/data/fixtures-2026.json` and
`src/data/atlas.ts`. Preserve per-event and per-venue provenance, snapshot freshness,
unknown-location handling and Zagreb time-zone correctness. Never guess venues from
legal registration addresses or publish unplayed 0:0 placeholders as results.
Keep the map optional: all match details and calendar actions must work without
WebGL or the external provider. Preserve attribution and the independent mobile
composition. See `docs/atlas.md` before changing map or schedule behavior.
