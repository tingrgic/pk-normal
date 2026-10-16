# PK Normal merchshop concepts

`/#shop` opens the lazy-loaded catalogue; the homepage teaser is `/#merch`.

The original twelve proposals: T-shirt, hoodie, bathrobe/slippers, 2027 calendar,
darts travel set, mug/coaster, tote, candle, socks, cap, umbrella and doormat.
All products and material descriptions are design proposals. There are no prices,
stock claims, ordering, checkout or payment flows. No new club facts are asserted.
The calendar uses a generated fictional adult, not a club member or a real model.

The catalogue uses editorial image tiles to compare tangible product concepts;
these are deliberately image-led, square-edged and without boxed SaaS card chrome.
Filters use pressed buttons. Enlarged product previews use a native modal dialog,
Escape dismissal, background scroll lock and focus restoration. Favourites are
stored only on the device under `pk-normal-merch-favourites-v1`; invalid or blocked
storage does not prevent browsing. Croatian, English and German are supported.

Images were created with the built-in image_gen tool. The exact prompt set and
original file locations are recorded in `docs/merch-image-prompts.json`. Optimized
960px WebP assets live in `public/images/merch/`. Only the robe teaser is referenced
by the homepage; catalogue images lazy-load, and the shop code has its own chunk.
No WebGL, external service or tracking is required by the shop.

Validation: `pnpm build`, `pnpm test`. `tests/merch.spec.ts` covers filters, saved
selection, reload persistence, dialog focus, accessibility, return navigation,
image loading and overflow at the project's nine required viewports. Screenshots
are saved to `docs/qa/merch-{width}x{height}.png`.

Before selling, approve actual product designs, suppliers, specifications, pricing,
stock, fulfilment and the applicable shop terms. Any real calendar production
requires participating adult models' consent. This implementation is an idea
catalogue, not a live commerce backend. Publication uses the existing GitHub Pages workflow when authorized by the owner.

Verified 2026-09-22: production build passed; all 59 Playwright tests passed on
Chromium, including ten shop tests and the existing site, atlas, counter, odds and
language suites. Reviewed shop screenshots at all nine required viewport sizes.
The build environment needed the missing `@types/node` development dependency.


## Owner list expansion — 2026-10-16

Source: owner-provided photo list attached in this conversation, checked 2026-10-16.
Source type: owner design brief; confidence: high for the requested concepts only.
Calendar and mugs were already represented and were skipped. Fifteen additions:
undershirt, pocket prayer book, bullseye bikini, Christmas baubles, beer glass,
Kamagra dart novelty packaging, fever-suppository novelty packaging, stickers,
business cards, membership card, condom wrapper concept, lighter, IQOS sleeve,
tobacco pouch and music manuscript notebook (kajdanka). Total: 27 concepts.

All additions have Croatian, English and German text. Medicine-themed designs
are empty satirical packaging, with no medicine, medical use or efficacy claims.
The condom design uses a printed dart, never a sharp object inside a wrapper.
Cards contain no invented contacts, personal data or membership claims. Cases
have no verified device compatibility or included tobacco/device. No new club
facts or actual product availability are asserted.

Generation: built-in image_gen, separate product-mockup prompt per addition.
Prompt set and original generated paths: `docs/merch-expansion-prompts.json`.
Final optimized images: `public/images/merch/{product-id}.webp`.

Expansion verification: frozen-lockfile install and production build pass; all
82 Playwright tests pass. Reviewed the new imagery and full-page screenshots at
all nine required viewports. Existing favourites, filters, dialog keyboard/focus,
languages, reduced motion and WebGL fallback checks pass. Initial JavaScript
remains within the 160 kB gzip budget; new product translations load with the shop.
Two existing tests were stabilized: unknown-venue coverage uses an explicit test
fixture now that all live venues are known, and cross-tab reset waits for the
second lazy view to mount before exercising storage synchronization.
