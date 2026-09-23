# Final critique and refinements

Reviewed the initial full desktop and mobile renders, then refined the implementation.

| Weakness identified                                         | Action                                                                                                     |
| ----------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Hero word too small relative to its full-width canvas       | Increased display scale with an independent mobile size.                                                   |
| Board looked washed out                                     | Reduced exposure and lighting; restored dark scoring bands and restrained red.                             |
| Barrel looked black/plastic without reflections             | Added a small procedural studio reflection environment to metal only.                                      |
| Dart tip was tapered in the wrong direction                 | Corrected cylinder radii to terminate at a real point.                                                     |
| Phone board touched the headline below it                   | Increased the phone camera distance independently.                                                         |
| Camera follow contained an abrupt distance threshold        | Replaced threshold with a continuously animated target.                                                    |
| Replay could inherit an unfinished text fade                | Made replay reset overwrite previous hero tweens.                                                          |
| Failure of WebGL left no equipment visual                   | Captured transparent desktop/mobile posters from the original scene.                                       |
| Reduced motion unnecessarily initialized WebGL              | It now bypasses the module import and displays the final poster immediately.                               |
| Client-only content was weak for search/no-JS visitors      | Added build-time complete-page prerendering and hydration.                                                 |
| Native dialog could Tab out to browser chrome               | Added explicit first/last focus wrap and restored focus after closing.                                     |
| Two small light-section labels missed AA contrast           | Darkened section index and card metadata; reran axe.                                                       |
| Registry and competition data could easily become conflated | Centralized data and logged exact scope; linked live official competitions rather than inventing a league. |
| Minified authoring style made future work harder            | Formatted source, configuration and scripts for maintenance.                                               |

Second visual review: authored typography, open section rhythm, no generic feature cards, no fake statistics, no copied photographs, no glass panels or gradient blobs. Light roster and single red contact section provide deliberate pacing. Portrait and landscape compositions are both usable; portrait board/type placement is independently tuned.

Remaining honest limitation: headless software-rendered emulation cannot establish frame pacing on physical phones. No award or hardware-performance claim is made.

Performance follow-up: replaced runtime room/PMREM reflection generation with a 90 kB baked CubeUV lighting texture after Lighthouse exposed excessive graphics initialization. Corrected visible-label/accessibility-name correspondence and removed incorrect desktop dimensions from the responsive poster.

Shader warm-up now uses compileAsync before the first cinematic frame; font preloads prioritize the hero display and body face. The wordmark stays visible during preparation; static posters are used for reduced motion, skipped preparation, unavailable WebGL and no-JavaScript access.

Final reading pass increased small interface labels to 12px, expanded the wordmark link to a 44px touch target and applied left/right/bottom safe-area insets. Tablet portrait now has its own camera framing to avoid excessive board cropping.

The final frame review widened the phone side-view camera and shifted its look-at point to the dart body, preserving a readable complete silhouette before the orbit. Early skip now also works while the 3D module is still loading.

## Counter extension review
Resolved: ten-player table widened mobile grid (min-width containment); inherited
roster monogram positioned initials in header (counter-specific class); large active
heading pushed keypad too low (compact game bar); Cricket marks required a long
scroll (current player's marks now sit above keypad). Result, input and handover
remain visible together on a 390×844 emulated viewport, with native scrolling for
the secondary scoreboard. Reviewed 390/430/1440 screenshots. All 32 tests pass.
