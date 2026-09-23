# Design brief

1. **Concept** — NORMAL / a study in precision. Monumental letterforms interrupted by a physical dartboard and one crimson dart. Headline: “Normalno ime. Sve ostalo je stvar preciznosti.”
2. **Audience** — Zagreb darts players, prospective members, federation community.
3. **Main message** — A new Zagreb club with a clear identity; people and verifiable facts before claims.
4. **Information architecture** — Intro/hero, O klubu, Naš ritam (experimental radial composition), Ekipa, Natjecanja, Pridruži se, source-aware footer.
5. **Art direction** — Considered cinematic dark precision (strongest spatial impact), Swiss editorial (excellent readability but restrained emotion), radial brutalism (original but risks mobile overload). Choose cinematic precision with Swiss spacing and one radial editorial interruption.
6. **Typography** — Barlow Condensed 600/700, Manrope 400/500/600. Dramatic uppercase display, neutral readable prose. Local Latin/Latin-ext fonts.
7. **Color** — #090909 background, #171717 surfaces, #f0eee8 text, #a09f9a secondary, #ed382b accent. One warm-paper team section creates pacing.
8. **Motion** — Real side-to-rear camera orbit, flight, impact ring, word reveal. Small once-only scroll reveals. No endless effects.
9. **Interaction** — Replay/skip, precise link underlines, pointer-only bounded card tilt, touch feedback, full-screen target menu.
10. **Mobile strategy** — Vertical hero: wordmark, oversized NORMAL, centered board, compact statement. Wider FOV and shorter independent camera path. Team uses editorial rows; landscape uses compact composition. Safe-area padding.
11. **Image treatment** — No unlicensed portraits or invented venue. Procedural 3D dart and board are explicitly requested original assets; no stock photography needed. Wordmark is a digital typographic treatment, not an official crest.
12. **Dart animation** — True 3D, point along -Z. Camera starts at +X, sees dart enter from right; orbits behind +Z, follows toward board at negative Z, hits center, then settles at an oblique editorial view.
13. **Accessibility** — Native anchors, semantic hierarchy, focus-visible, reduced-motion static embedded dart, skip intro, accessible menu dialog, WebGL poster fallback.
14. **Performance** — Vite/React/TS, GSAP, deferred Three.js. DPR 1.35 phones / 1.75 desktop. No shadows or postprocess; stop frames when settled/offscreen. Static hosting.
15. **Anti-patterns** — No fake results, no generic feature grid, no artificial brand partnerships, no hover dependency, no stretched desktop mobile layout.

Headline exploration: Normalno ime; Pogodi bit; Sve na svoje mjesto; Jedan hitac mijenja perspektivu; Malo ime. Jasan cilj; Normalno je ciljati više; U svom ritmu; Nije stvar sreće; Mir prije pogotka; Ime je Normal; Sve ostalo je preciznost; Bez velike priče. S jasnim ciljem. Selected “Normalno ime” is understated and lets the visual contradiction carry the wit. Avoid macho or unverified achievement claims.

## Match atlas extension

Use a sports-broadcast composition: oversized city headline, numbered geographic
markers, warm paper match detail and an editorial fixture index. The olive-gray
cartography remains subordinate to the graphite/cream/red identity. Real city
geometry replaces decorative charts. Desktop pairs the map and match detail;
phone gets a dedicated 400px map and horizontal team-versus composition. Navigation
and a full-width invitation introduce the tool without loading the GIS SDK on the
club landing page. No scores, venues or geographic routes are invented for spectacle.
