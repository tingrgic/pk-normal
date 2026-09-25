# PK Normal website

A complete Croatian landing page for Pikado klub Normal, Zagreb. **Normalno ime. Sve ostalo je stvar preciznosti.** Oversized editorial type, scoring-ring geometry and a cinematic dart flight establish an original identity. This is a digital typographic treatment, not a claimed official club crest.

## Stack

React 19, TypeScript, Vite 8, GSAP and Three.js. Self-hosted Barlow Condensed and Manrope (OFL licenses in `docs/licenses`). Custom CSS tokens instead of a component framework. No backend, trackers, external font requests or cookie storage.

## Installation

Node.js **22.12+** (or a current supported LTS), pnpm **11**.

```sh
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

Development: http://localhost:5173. The server binds to all interfaces for local device testing.

## Build and production preview

```sh
pnpm build
pnpm preview
```

Production preview: http://localhost:4173. Deploy the generated **dist/** directory. The build type-checks, bundles, then prerenders the entire page to HTML and hydrates it in the browser. The temporary server-rendering bundle is removed. There is no production Node server.

## Deployment

GitHub Pages deployment is configured in `.github/workflows/pages.yml`. Enable **Settings → Pages → Source: GitHub Actions** in the repository. Pushes to `main` build and publish `dist/`; the workflow obtains the site URL and base path from GitHub.

| Host                 | Build command       | Publish directory  |
| -------------------- | ------------------- | ------------------ |
| Vercel               | `pnpm build`        | `dist`             |
| Netlify              | `pnpm build`        | `dist`             |
| Cloudflare Pages     | `pnpm build`        | `dist`             |
| Any static HTTP host | upload build output | contents of `dist` |

Set **SITE_URL** to the actual HTTPS URL (including a repository path, when applicable) in the hosting build environment. The metadata step then writes the canonical link, OpenGraph URL and sitemap. Without a real domain those are intentionally omitted; no invented canonical is shipped. `robots.txt`, Croatian metadata, a custom favicon and semantic HTML are already included. Do not set SITE_URL to an example domain. For a local canonical check: `SITE_URL=https://your-owned-domain.hr pnpm build` (replace with the actual domain).

Set `SITE_BASE=/repository-name/` when deploying under a repository path; omit it for domain-root hosting. HTTPS and standard Brotli/gzip compression are recommended. No SPA rewrite is required for this one-page site.

## Architecture

- `src/App.tsx`: page sections and small interactive identity selector.
- `src/components/Navigation.tsx`: desktop links and native modal mobile navigation.
- `src/sections/Hero.tsx`: scene lifecycle, reduced-motion preference, skip/replay and fallback.
- `src/three/scene.ts`: original procedural dart, board texture, lights and camera trajectory.
- `src/three/composition.ts`: named phone, tablet and desktop camera compositions and entrance timing.
- `src/sections/heroCinema.ts`: shared early scene request and reflection preload; bypassed for reduced motion and direct tool routes.
- `src/data/club.ts`: club, contact, sources, roster and typed future results.
- `src/styles/main.css`: shared tokens, navigation and landing-page sections.
- `src/styles/hero.css`: hero layout, loading transition and responsive compositions in one place.
- `scripts/prerender.mjs`, `scripts/metadata.mjs`: build-time static HTML and domain metadata.
- `tests/site.spec.ts`: Playwright/axe functional, responsive and accessibility tests.
- `docs/`: design, sources, storyboard, QA evidence and maintenance rules.

## Motion architecture

GSAP moves the dart along -Z. The camera begins on -X with the dart already entering from screen right. It orbits behind +Z, follows toward the board, reaches the bull at Z=0 and settles into an oblique composition. A short radial wave connects impact to the typography reveal. Phones use a different field of view, distance and shorter timing. Desktop framing leaves more of NORMAL readable while the board overlaps the right-hand letters. Camera settings live together in `src/three/composition.ts`.

On a landing-page visit, module evaluation starts the deferred scene request and preloads its reflection image before hydration. A small transparent capture of the opening pose appears while WebGL prepares, then fades out over the live scene. The board grain uses one ImageData upload. Shader compilation still completes before animation to protect frame pacing. Direct tool routes and reduced-motion visits do not request the scene or reflection image.

The main content never locks scrolling. Replay and skip are explicit controls. A 90 kB precomputed CubeUV studio reflection texture gives the barrel metallic highlights without runtime PMREM passes; there are no shadows, model downloads, particles or post-processing passes.

Rendering occurs only during the GSAP timeline, resize or visibility changes. The timeline pauses when offscreen or in a hidden document. Resource sets are disposed on cleanup. Reduced motion skips the Three.js import entirely and uses a captured original static composition. WebGL failure/context loss uses the same poster. The production HTML also works without JavaScript.

## Data sources

See **docs/sources.md** for every factual claim, source, confidence and check date. PSGZ verifies admission on 12 August 2026 and the registry. The HPS team page verifies all nine displayed players, the captain, public telephone and playing venue. Admission is not represented as the founding date.

### Update the roster

Verify the current official HPS roster, update `players` in `src/data/club.ts`, then record the new check date and evidence in the source log. Initials are typographic identities, not invented portraits. Card/list indices are editorial ordering, not player rankings or shirt numbers. Profile URLs must resolve on HPS.

### Update competition data

The live module currently links to official schedules and results. No uncertain league or score is claimed. `CompetitionResult` defines source-backed future records; `results` is intentionally empty. To publish results, populate verified records and replace the link-only module with a dated list. Each record must have an official URL and check date. Do not present old fixtures as a current next match.

### Update contact / location

Edit the centralized `club` object and verify it against the public HPS team profile. The published address is the **playing venue**, not an asserted registered club office.

## Testing

```sh
pnpm exec playwright install chromium
pnpm build
pnpm preview
# in another terminal:
pnpm test
```

If using an existing Chromium binary, set `PLAYWRIGHT_CHROMIUM_EXECUTABLE`. `QA_BASE_URL` overrides the production preview URL. The tests cover nine viewport sizes, cinema/replay/skip, menu focus and anchors, identity controls, reduced motion, unavailable WebGL, disabled JavaScript, hydration errors and axe audits.

`scripts/inspect.mjs` captures responsive screenshots. `scripts/motion-frames.mjs` uses test-only dev-module instrumentation to freeze actual GSAP phases; it does not add a debug API to the shipped site. Both accept `PLAYWRIGHT_CHROMIUM_EXECUTABLE`. QA evidence and review are in `docs/qa/` and `docs/qa-checklist.md`.

## Accessibility

Semantic landmarks and heading hierarchy, skip link, visible keyboard focus, 44px primary touch controls, real anchors, labelled modal navigation with focus trapping and Escape/restore, contrast-tested text and no hover-only essential information. Decorative 3D/initials are hidden from assistive technology. The actual people and phone are real text.

## Performance notes

Three.js is a deferred chunk; the warning about its uncompressed bundle size is expected and investigated. It is approximately 138 kB gzip, separate from the approximately 125 kB application and 27 kB shared GSAP chunk. GSAP has an explicit shared chunk so it cannot pull Three.js into every page visit. The build enforces gzip budgets of 175 kB for the deferred scene and 160 kB for initial JavaScript including GSAP/runtime, using `scripts/check-budgets.mjs`. It also rejects eager scene/map module preloads. Opening-pose WebPs are approximately 3–12 kB; final fallback images are approximately 31–45 kB. Capped DPR (1.35 phone / 1.75 desktop), low-poly reusable geometry, no constant render loop, locally hosted subset fonts and compact WebP fallback posters keep the rest restrained. The contact and roster never depend on WebGL.

`tests/hero-startup.spec.ts` covers a delayed scene request, early skip, parallel reflection loading, a generous six-second local first-frame regression limit, reduced-motion/direct-route request isolation, reflection failure, context loss and the desktop tools disclosure. Its timing is a local software-rendered check, not a physical-device performance claim.

## Known limitations

- Physical iPhone/Android GPU performance has not been measured; browser emulation is not a hardware guarantee.
- No live fixture feed or backend is connected. Official links remain the source of current competition information.
- No licensed club portraits or official crest were available; the site uses original typography and equipment geometry.
- Canonical and sitemap URLs use the configured GitHub Pages address; update SITE_URL if moving to a custom domain.
- Calling opens the visitor's telephone app. This site does not collect membership applications.

## Brojač pikada

Open `/#brojac` or choose **Brojač** in the site navigation. Supports X01
(301/501/701/901/1001), Cricket, cut-throat, no-score Cricket, Count Up, Around the
Clock and Shanghai; up to ten named players with custom initials. Closest-to-bull
ordering is entered manually after real throws; random and list ordering are also available.
Every dart can be undone. The latest game saves on the current browser/device and can
be resumed after a refresh. No data is sent to a server. See [counter architecture and
format choices](docs/counter.md) and [rule sources](docs/sources.md).

Public counter: https://tingrgic.github.io/pk-normal/#brojac.
Desktop preview on this computer: http://localhost:5173/#brojac.
Localhost previews require the dev server; the public GitHub Pages links do not.

## Atlas utakmica

Open `/#karta` or choose **Utakmice**. The 3D Zagreb/Sesvete map connects 13 published
2026 fixtures to seven verified grounds, with home/away/cup and month filters,
upcoming-only selection, official match links, directions and `.ics` calendar exports.
The map can rotate, zoom, switch between 2D and 3D, or show the whole city.

This is a dated snapshot checked 18 September 2026, not a live score service. One
away venue is unconfirmed and intentionally has no marker. External OpenFreeMap
vector tiles supply real streets/buildings; schedule actions remain available if
map loading fails. The SDK and worker are deferred until this route opens.
See [architecture, provenance and update procedure](docs/atlas.md).

Public atlas: https://tingrgic.github.io/pk-normal/#karta

This computer: http://localhost:5173/#karta

## Public hosting

GitHub Pages: https://tingrgic.github.io/pk-normal/

Repository: https://github.com/tingrgic/pk-normal

Push updates to `main` to run `.github/workflows/pages.yml`. The workflow builds
the source and publishes only `dist/`. Local environment files, dependencies and
test reports are excluded from Git.
