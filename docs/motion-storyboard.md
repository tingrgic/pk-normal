# Motion storyboard

## September 2026 refinement

The loading view now uses a transparent capture of the actual opening pose,
then fades it out over 180 ms as the live frame starts. Scene loading and the
reflection request begin together before hydration. Grain is applied in one
ImageData upload; asynchronous shader warm-up remains in place.

Timing below the loading stage is measured from the first live frame:

- Desktop/tablet: side entry 0–0.90 s, orbit 0.90–1.95 s, follow 1.95–2.67 s,
  impact at 2.67 s, settle complete at 3.90 s.
- Phone: side entry 0–1.10 s, orbit 1.10–2.02 s, follow 2.02–2.66 s,
  impact at 2.66 s, settle complete at 3.89 s.

The initial dart position is already inside the camera's view. Desktop final
camera is (6.4, 4.25, 15.2), looking at (-4.1, 1.25, 0): a slightly smaller board
and more rightward overlap. Phone and tablet final camera coordinates are
unchanged. All presets are in `src/three/composition.ts`; responsive hero styles
are in `src/styles/hero.css`. Fallback captures have separate phone, tablet and
desktop versions and scale with scene height to match the perspective camera.

`scripts/posters.mjs` captures the final and opening poses as transparent PNGs
under `docs/qa/`, using test-only development-module instrumentation. Convert
these to the corresponding `public/*.webp` files after changing a camera preset.
The original storyboard below records the initial design, not current timings.

| Time                                                                                                                                                                                                                                                                                                                                            | Camera / action                                                                    | Purpose                           |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | --------------------------------- |
| 0–0.4s                                                                                                                                                                                                                                                                                                                                          | Dark hero, navigation and club identity accessible                                 | No blocking loader                |
| 0.4–1.15s                                                                                                                                                                                                                                                                                                                                       | Camera +X, dart moves -Z from screen right; silver barrel and red flights readable | Establish direction and object    |
| 1.15–2.1s                                                                                                                                                                                                                                                                                                                                       | Camera smoothly orbits to +Z behind dart                                           | Genuine spatial perspective shift |
| 2.1–2.85s                                                                                                                                                                                                                                                                                                                                       | Rear follow, board emerges, dart accelerates toward origin                         | Focus                             |
| 2.85s                                                                                                                                                                                                                                                                                                                                           | Tip reaches bull, radial CSS wave                                                  | Impact                            |
| 2.85–3.8s                                                                                                                                                                                                                                                                                                                                       | Camera settles to oblique view, massive NORMAL and support reveal                  | Transition to site                |
| Phones: smaller camera radius, FOV 48 vs 38, shorter flight timing, board centered vertically. No screen-space scaling of desktop scene.                                                                                                                                                                                                        |
| Reduced motion: final camera/dart pose, no cinematic timeline, no scroll reveals. Failed WebGL: render a captured original static poster. Replay is intentional and reuses the renderer. Page scroll remains natural at all times. Hidden tabs pause the timeline, intersection prevents offscreen frames; static scenes render only on resize. |

Final mobile refinement: initial side radius 8.5, look-at Z 16.3 and 1.1s side travel keep the full dart readable. The orbit then brings the radius to 6.5 for the close rear-follow impact. Tablet portrait uses a dedicated 42° field of view and centered final framing.

## Varied replay throws
The opening flight keeps its bullseye landing. Each “Ponovi bacanje” selects
a different wedge, alternating the treble ring and outer single area. The
straight flight and dart orientation aim at that point; the following camera
tracks it before returning to the established hero composition. Adjacent replay
targets are separated by at least five wedges, with no extra render loop or assets.
Skip settles at the current target; reduced motion retains the static bullseye.
