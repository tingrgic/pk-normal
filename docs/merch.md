# PK Normal merchshop concepts

`/#shop` opens the lazy-loaded catalogue; the homepage teaser is `/#merch`.

Twelve original proposals: T-shirt, hoodie, bathrobe/slippers, 2027 calendar,
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
catalogue, not a live commerce backend. No publication was performed.

Verified 2026-09-22: production build passed; all 59 Playwright tests passed on
Chromium, including ten shop tests and the existing site, atlas, counter, odds and
language suites. Reviewed shop screenshots at all nine required viewport sizes.
The build environment needed the missing `@types/node` development dependency.
