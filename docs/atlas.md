# Atlas utakmica / 2026

`/#karta` is a lazy standalone view, reachable through **Utakmice** and the editorial
map invitation below the club's competition section. Art direction: a restrained
sports broadcast atlas, numbered grounds, editorial fixture cards and a warm neutral
map with signal-red selection. The phone composition places an independently sized
400px map above the match card; native page scrolling is retained.

## Architecture

- `src/data/fixtures-2026.json`: verified fixture snapshot, including source URLs.
- `src/data/atlas.ts`: venue registry, address provenance, coordinates and date helpers.
- `src/atlas/Atlas.tsx`: filters, selection, match detail, calendar and official links.
- `src/atlas/CityMap.tsx`: MapLibre GL JS, OpenFreeMap vector tiles and 3D buildings.
- `src/atlas/calendar.ts`: UTF-8 folded iCalendar export with UTC timestamps.
- `src/components/AtlasTeaser.tsx`: lightweight SVG entry point, no map SDK on landing.

The seven markers represent grounds, not seven club branches. League venues are the
host team's HPS registered playing addresses. Pivana is explicitly named by PSGZ
for the cup. Building/address geocodes are labelled as such; they do not promise an
entrance location. Hollywood Promili has no verified playing address: no pin or
navigation link is fabricated. Google Maps directions use the published address.

## Updating the schedule

1. Open the PSGZ league and cup links in `src/data/atlas.ts`. The public schedule
   renderer also reads `https://psgz.hr/site/uniondivision/UnionLeagueTable?unionId=2&seasonId=26&leagueId=831`
   (league) and the same URL with `leagueId=859` (cup).
2. Compare Normal's fixtures against the snapshot. Preserve official event IDs,
   home/away order and event URL. Include only calendar-year 2026 entries. Do not
   turn unplayed 0:0 source placeholders into results; use `null`.
3. Use ISO start times with the correct Zagreb offset: +02:00 before the autumn
   time change and +01:00 afterwards. Test the ICS UTC exports when changing dates.
4. Resolve venues using HPS playing-address fields, not a club's legal address.
   Add newly confirmed coordinates with their source and precision. Use `null`
   for an unknown venue. Do not reuse a similarly named street's geocode.
5. Update the check date in `atlasMeta`, the visible freshness note, calendar
   DTSTAMP and this project's source log. Review downloads and run `pnpm test`.

This is a curated, dated snapshot, not a live federation integration. The UI says so.
Downloaded calendars are imports, not subscriptions; subsequent changes do not sync.
No match end time is invented. Published scores are snapshots, not live scores.

## Accessibility and performance

All map actions have button alternatives and the complete schedule remains usable
without the map. Pins are keyboard buttons; filters expose pressed state. Reduced
motion disables camera travel. Two-finger mobile gestures avoid scroll trapping.
The map SDK, CSS and worker load only on the atlas route. Device pixel ratio is
capped at 1.5; two workers; no continuous custom render loop or postprocessing.
Resize observers, markers, fetches and the WebGL map are cleaned up on route exit.

MapLibre is BSD-3-Clause; its bundled distribution includes its license. The map
retains provider/OpenStreetMap attribution. Tiles, fonts and sprites require internet
access to OpenFreeMap; no API key is needed. Failed loading shows a retry state while
the entire fixture list, addresses and calendar remain usable. Provider availability,
OSM completeness and actual phone GPU performance are external limitations.

## Verification

`tests/atlas.spec.ts` checks fixture integrity, time zones, calendar folding, filtering,
unknown venues, downloads, keyboard access, nine viewport sizes and accessibility
with external map loading disabled. `scripts/atlas-qa.mjs` separately exercises the
real provider and captures the actual city map for visual review. It requires the
production preview on port 4173 and a Playwright Chromium executable.

## Language support

The shared HR / EN / DE switch translates filters, UI and map accessibility/help
text. Calendar downloads use the selected language for descriptions and unknown
venues while retaining official names, addresses, UIDs and UTC timestamps.
Displayed dates keep Europe/Zagreb time in each locale. See `docs/i18n.md`.

## Readability refinement — 26 September 2026

The map now uses OpenFreeMap's Positron base with warm paper ground, muted blue
water, sage parks and softly lit sandstone buildings. Road labels use dark ink and
light halos. Venue views use a lower 45° pitch; the city overview is a north-up flat
map. A labelled venue selector provides direct access even where markers overlap.
The floating bottom toolbar keeps controls away from venues and adds north reset;
phone maps are 460px tall with 44px minimum control targets. Camera padding resets
when returning to a venue, so the selected marker remains centered after overview.
All new control labels are translated into English and German. Map style changes do
not alter fixture data, venue coordinates, attribution or source freshness.
