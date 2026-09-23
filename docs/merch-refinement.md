# Featured merchandise refinement — 2026-09-23

The shop hero and landing-page merch teaser use a transparent robe cutout, avoiding a large cream rectangle against the graphite page. The twelve catalogue photographs and product-detail photographs retain their coherent warm studio backgrounds: these are useful for product comparison and black-fabric visibility. No product facts, prices or commerce behavior changed.

Asset: `public/images/merch/robe-cutout.webp`, 960 × 960, 99,366 bytes, alpha transparency. Created with the built-in `image_gen` tool, then resized and encoded as WebP. The original catalogue asset is preserved.

Input: `public/images/merch/robe.webp`.

Generated source: `exec-bb122d7d-7d13-40d0-85ca-90b24bb2682c.png`.

## Generation prompt

Use case: background-extraction. Image 1 is the edit target: an existing PK NORMAL black terry bathrobe and its pair of slippers. Create a clean, high quality cutout with an ACTUAL transparent alpha background for a website with graphite #090909 background. Remove only the cream studio backdrop and cream floor. Preserve the EXACT product design, camera angle, composition, black terry texture, red belt and piping, slippers, proportions, white embroidered text 'PK NORMAL', and the white/red concentric target symbols. Preserve all product colors; do not redesign anything, do not add objects or text. Keep entire robe and both slippers in frame with a little breathing room. Fine clean edges without pale halos, black fabric detail clearly visible for placement on a very dark webpage. Soft minimal contact shadow is okay only with transparent alpha. Square output. No baked white, grey, black, or checkerboard background. The output must be a transparent-background PNG cutout.

## Return to top

The landing-page top links explicitly scroll within the current document, replace the fragment without routing, move keyboard focus to the header wordmark, and settle any unfinished hero intro. Reduced motion uses an instant scroll; explicit replay remains available.

## Verification

`pnpm build` and all 70 Playwright tests pass. Shop screenshots reviewed at 390×844, 430×932, 844×390, 932×430, 768×1024, 1024×768, 1366×768, 1440×900 and 1920×1080. Featured mobile/desktop and landing teaser captures are in `docs/qa/merch-feature-mobile.png`, `docs/qa/merch-feature-desktop.png` and `docs/qa/merch-invite-desktop.png`. Return-to-top regression tests cover keyboard activation, focus, reduced motion, delayed cinema loading, document/canvas preservation and explicit replay. No publication performed.
