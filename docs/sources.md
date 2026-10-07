# Sources and live factual claims

Checked: 2026-09-16. Factual copy must remain short and traceable. Creative headlines express an identity, not historical claims.

| Fact used                                                     | Source                                                                              | Checked    | Confidence                           | Type                                                   |
| ------------------------------------------------------------- | ----------------------------------------------------------------------------------- | ---------- | ------------------------------------ | ------------------------------------------------------ |
| Club name PK Normal; membership in Pikado savez grada Zagreba | https://psgz.hr/pk-normal-novi-clan-psgza                                           | 2026-09-16 | High                                 | Official PSGZ                                          |
| Admitted on 12 August 2026 (NOT founding date)                | https://psgz.hr/pk-normal-novi-clan-psgza                                           | 2026-09-16 | High                                 | Official PSGZ                                          |
| Registry number 21015646; Rikard Milašinović is president     | https://psgz.hr/user-content/zagreb/files/ud2/2026/8/00000224_registar-20262027.pdf | 2026-09-16 | High                                 | Official PSGZ registry                                 |
| Zagreb, Croatia club context                                  | PSGZ admission and owner project brief; further HPS verification recorded below     | 2026-09-16 | High                                 | Official / owner                                       |
| Tin Grgić is a member                                         | Project owner’s explicit brief in this conversation (no public URL supplied)        | 2026-09-16 | High (independently confirmed below) | Owner statement, later verified by official HPS roster |
| PSGZ publishes competition schedules / results                | https://psgz.hr/competitions and https://hps-dart.hr/ps-grad-zagreb                 | 2026-09-16 | High                                 | Official                                               |

## Exclusions / launch data

Do not infer founding date from admission. No full roster, club email, venue address, social profiles, match result, player ranking or trophy is published without corroboration. Federation contacts belong to federation only. Contact component must explicitly explain unavailable club contact and must not pretend to accept submissions.

## Design / asset provenance

MengTo skills inspected at https://github.com/MengTo/skills (cloned for reference, not copied into implementation). Procedural 3D authored for this project. Typographic wordmark is a temporary digital treatment, not an official crest. Font licenses included with local fonts.

## Additional official HPS verification

The HPS text endpoint was accessed directly with HTTPS on 2026-09-16 after the search renderer could not load its detail URL.

| Fact used                                                                                                                                              | Source URL                                   | Checked    | Confidence | Type                      |
| ------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------- | ---------- | ---------- | ------------------------- |
| Active club PK NORMAL; president and registration number above                                                                                         | https://hps-dart.hr/pk-normal                | 2026-09-16 | High       | Official HPS              |
| Nine players: Rikard Milašinović, Tin Grgić, Ivan Štimac, Stjepan Prusac, Franko Čegec, Mihovil Marjanović, Ivan Žugec, Franko Ermakora, Filip Jakelić | https://hps-dart.hr/normal                   | 2026-09-16 | High       | Official HPS roster       |
| Rikard Milašinović is captain; previous public captain contact (removed at owner request)                                                                                       | https://hps-dart.hr/normal                   | 2026-09-16 | High       | Official HPS team contact |
| Team playing address CB QUATTRO, ZAGREBAČKA 26, SESVETE                                                                                                | https://hps-dart.hr/normal                   | 2026-09-16 | High       | Official HPS team address |
| Player profile links                                                                                                                                   | https://hps-dart.hr/normal (links in roster) | 2026-09-16 | High       | Official HPS              |

The later HPS findings supersede the initial missing-roster/contact notes. Tin is now independently verified as well as owner-confirmed. Nine is a count of that published roster, not a claim about every possible club member. Playing address is not represented as the legal club seat. No birthdates or individual license IDs copied. Profile photographs are default HPS placeholders, so none are reused. Exact league/group and upcoming match could not be established; link to current official competition system without implying results.

## Reflection asset

The baked CubeUV studio texture is generated from Three.js RoomEnvironment (MIT) using scripts/reflection-baker.ts; no room rendering or PMREM processing runs on visitors’ devices. The license is included in docs/licenses/Three-MIT.txt. The texture is lighting data, not a photograph of the club.

## Dart counter rules — checked 2026-09-17

These are rules for the public scoring tool, not club results or membership claims.

| Rule used | Source URL | Confidence | Source type |
|---|---|---|---|
| X01: subtract score, exact zero, double-out, bull 50 as double 25, bust restores turn | https://www.pdc-europe.tv/wiki/rules/ and https://www.pdc.tv/sites/default/files/2020-08/DRA-Rules.pdf | High | Official competition / regulator |
| Open/double entry; open, double or master exit; no-score Cricket | https://help.dartshopper.com/hc/en-us/article_attachments/17450699387805 | High | Manufacturer/retailer product manual, primary |
| Cricket targets 15–20 and bull, three marks to close, scoring against open opponents; cut-throat penalties and low-score win | https://www.dartslive.com/pdf/gameguide/gameguide_en.pdf | High | Official game platform guide |
| Count Up scores every dart; fixed rounds with highest total; 8-round example | https://league.dartslive.com/hk/game_format?co=be519a096ba433ff&di=bf4cc94bde226f1b&gfi=856da6d8eed301d5&li=290c5ad62a5a6e8f | High | Official league game format |
| Around the Clock ordered targets, first to finish; single/double/triple acceptance | https://help.dartshopper.com/hc/en-us/article_attachments/17450699387805 | High | Manufacturer/retailer product manual, primary |
| Shanghai round target, S/D/T in a visit grants instant win | https://docs.autodarts.com/game-modes/party/shanghai/ and https://beskardarts.com/wp-content/uploads/2024/07/Game-Rules.pdf | High | Official scoring product documentation / manufacturer |

Local format choices, explicitly explained in the in-app rules: 1–10 individual players;
one game at a time; Around the Clock finishes on either bull after 20; Shanghai lasts
7/10/20 rounds; Count Up lasts 5/8/10/15/20; tied final high scores share the win.
These are supported app variants, not claims about PSGZ tournament regulations.
Closest-to-bull ordering is manually entered after real throws; the app does not measure
distance or claim to detect dart positions. Random order is a Fisher–Yates shuffle.

## Match atlas — checked 18 September 2026

The live atlas is explicitly a dated snapshot, not a live feed. All dates below
are Zagreb local time. Count claims (13 published fixtures, seven mapped grounds)
are calculated from the sourced entries. Season 2026/27 and 4. liga / skupina B:
https://psgz.hr/ranking-table/831 (official PSGZ, high confidence). Cup A draw:
https://psgz.hr/ranking-table/859 (official PSGZ, high confidence). Public schedule
API used to read the same published data: https://psgz.hr/site/uniondivision/UnionLeagueTable?unionId=2&seasonId=26&leagueId=831
and leagueId=859 for cup. Unplayed 0:0 placeholders are not published as scores.

| Fact: published fixture and start | Source URL | Date checked | Confidence | Type |
|---|---|---|---|---|
| ZAGREB – NORMAL, 2026-09-11T19:00:00+02:00, league round 1; result 9:7 | https://psgz.hr/event/rygexymu | 2026-09-18 | High, published schedule may change | Official PSGZ |
| NORMAL – PKZ VOLTAGE, 2026-09-18T19:00:00+02:00, league round 2 | https://psgz.hr/event/pepuycnd | 2026-09-18 | High, published schedule may change | Official PSGZ |
| BBF BULLY BOYS – NORMAL, 2026-09-25T19:00:00+02:00, league round 3 | https://psgz.hr/event/sshhukuq | 2026-09-18 | High, published schedule may change | Official PSGZ |
| NORMAL – VRAPČE 2, 2026-10-02T19:00:00+02:00, league round 4 | https://psgz.hr/event/lfxviryk | 2026-09-18 | High, published schedule may change | Official PSGZ |
| HOLLYWOOD PROMILI – NORMAL, 2026-10-09T19:00:00+02:00, league round 5 | https://psgz.hr/event/ijotufns | 2026-09-18 | High, published schedule may change | Official PSGZ |
| A1 THRILLER – NORMAL, 2026-10-11T10:00:00+02:00, cup round 1 | https://psgz.hr/event/mrwtxbao/bracket | 2026-09-18 | High, published schedule may change | Official PSGZ |
| NORMAL – MOZART DIAMANTI, 2026-10-30T19:00:00+01:00, league round 7 | https://psgz.hr/event/ylqiwagm | 2026-09-18 | High, published schedule may change | Official PSGZ |
| KOCKA FELGA CVRČAK – NORMAL, 2026-11-06T19:00:00+01:00, league round 8 | https://psgz.hr/event/xgjjijwm | 2026-09-18 | High, published schedule may change | Official PSGZ |
| NORMAL – BLACK M, 2026-11-13T19:00:00+01:00, league round 9 | https://psgz.hr/event/sujvmldw | 2026-09-18 | High, published schedule may change | Official PSGZ |
| EXTERIUM II – NORMAL, 2026-11-20T19:00:00+01:00, league round 10 | https://psgz.hr/event/hgswlsez | 2026-09-18 | High, published schedule may change | Official PSGZ |
| NORMAL – BULLDOG GIANTS, 2026-11-27T19:00:00+01:00, league round 11 | https://psgz.hr/event/kqzcxvqs | 2026-09-18 | High, published schedule may change | Official PSGZ |
| NORMAL – ZAGREB, 2026-12-04T19:00:00+01:00, league round 12 | https://psgz.hr/event/uazauxvk | 2026-09-18 | High, published schedule may change | Official PSGZ |
| PKZ VOLTAGE – NORMAL, 2026-12-11T19:00:00+01:00, league round 13 | https://psgz.hr/event/sfeuffca | 2026-09-18 | High, published schedule may change | Official PSGZ |

### Playing venues and geocodes

Every entry below was checked **2026-09-18**. Playing addresses: high confidence,
**official primary source** HPS (cup: PSGZ). Coordinates: **secondary geographical
source**, high confidence at the stated venue/building/address level; not surveyed
entrance positions. Neighbourhood labels are geographic context from the same OSM
records, not extra club locations. League fixture placement is an explicit inference
from the host team's registered playing venue, disclosed in the UI.

| Venue/address fact | Official address source | Coordinate / neighbourhood source | Precision |
|---|---|---|---|
| CB Quattro, Zagrebačka 26, Sesvete | https://hps-dart.hr/normal | https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?SingleLine=Zagrebacka%20cesta%2026%2C%20Sesvete%2C%20Croatia&f=json | Exact PointAddress geocode (score 100), 16.1024289 / 45.8285209; address, entrance unconfirmed |
| BBF, Savska cesta 150, Zagreb / Knežija | https://hps-dart.hr/bbf-bully-boys | https://www.openstreetmap.org/node/919803676 | Venue, 15.9555944 / 45.7910847 |
| Pivana, Ilica 222, Zagreb / Črnomerec; cup on 11 October | https://psgz.hr/masters-serija-elektronskog-i-klasicnog-pikada-ekipni-kup | https://www.openstreetmap.org/node/2286844151 | Venue, 15.9473690 / 45.8126659 |
| CB DeGusto, Ilica 506, Vrapče, Zagreb | https://hps-dart.hr/kocka-felga-cvrcak | https://www.openstreetmap.org/way/137405864 | Address building, 15.9027403 / 45.8130519 |
| CB Exterium, Poljačka 52, Zagreb / Donja Kustošija | https://hps-dart.hr/exterium-ii | https://www.openstreetmap.org/node/1473213336 | Venue, 15.9174465 / 45.8102634 |
| PKZ Voltage playing ground, Ulica Dragutina Golika 44, Zagreb / Ljubljanica | https://hps-dart.hr/pkz-voltage | https://www.openstreetmap.org/way/181445818 | Address building, 15.9296678 / 45.7990662 |
| CB X, Lermanova 49, Zagreb / Donja Kustošija | https://hps-dart.hr/zagreb | https://www.openstreetmap.org/way/398164148 | Address building, 15.9201477 / 45.8076789 |

Hollywood Promili's playing address is blank at https://hps-dart.hr/hollywood-promili
(official HPS; checked 2026-09-18; high confidence in missing field). The legal club
address on the separate PK Hollywood page is **not** evidence of its playing venue.
No map position or directions are provided until the venue is confirmed.

### Map implementation sources (not club facts)

- https://openfreemap.org/quick_start/ — official provider setup and attribution.
- https://maplibre.org/maplibre-gl-js/docs/examples/display-buildings-in-3d/ — official 3D building technique.
- https://tiles.openfreemap.org/styles/dark — underlying style and geographic source.
- https://www.openstreetmap.org/copyright — geographic data attribution and licensing.

Checked 2026-09-18. Building heights use available map properties with an 8m visual
fallback; the UI explicitly describes 3D heights as orientation aids, not measurements.

## Sponsors — checked 18 September 2026

| Fact / asset | Source URL or record | Date checked | Confidence | Source type |
|---|---|---|---|---|
| Hidra is the first sponsor of PK Normal | Club owner's request in this project conversation, 2026-09-18 (no public URL) | 2026-09-18 | High: owner-confirmed; not independently federation-verified | Owner-provided |
| Hidra contributes drinks, equipment and financial support | Club owner's follow-up in this conversation: “Drinks, equipment and financial support” (no public URL) | 2026-09-18 | High: owner-confirmed; no amounts, frequency or contract terms asserted | Owner-provided |
| Hidra brand attribution to Zagrebačka pivovara | https://zagrebackapivovara.hr/hidra-pise-novo-poglavlje-osvjezenja/ | 2026-09-18 | High | Official manufacturer |
| Hidra website and logo | https://hidra.hr/ and https://hidra.hr/wp-content/uploads/2024/06/HYDRA_LOGO-small.png | 2026-09-18 | High | Official brand website and original logo asset |

Both official pages and the logo returned HTTP 200 when retrieved. The original
200×192 PNG is hosted locally at `public/sponsors/hidra.png`, without recoloring or
redrawing. Brand pages establish branding only; sponsorship and its contributions
are owner-provided facts, not claims verified by PSGZ/HPS. The sponsorship CTA now uses the owner-provided club email recorded below.

## Virtual duels — checked 18 September 2026

| Fact | Source URL | Checked | Confidence | Type |
|---|---|---|---|---|
| 2026/27 4. liga / skupina B; all 11 team standings, completed-fixture W/L, individual-duel and leg totals | https://psgz.hr/ranking-table/831 | 2026-09-18T18:01:17.723Z | High: official dated snapshot, may change | Official PSGZ |
| All 50 listed players' team, appearances, W/L and leg W/L in this competition | https://psgz.hr/site/uniondivision/UnionLeagueTable?unionId=2&seasonId=26&leagueId=831 | 2026-09-18T18:01:17.723Z | High: public renderer for the same PSGZ table | Official PSGZ |
| Normal's registered nine-player roster | https://hps-dart.hr/normal | 2026-09-18 | High | Official HPS |

Every row of `oddsSnapshot` in `src/data/club.ts` inherits the snapshot's official
source URL and exact retrieval date. Normal's individual rows at this check are
Tin Grgić 3/1 (legs 6/4), Franko Ermakora 2/2 (6/5), Ivan Žugec 2/2 (4/5), and
Ivan Štimac 0/4 (2/8). The other five registered Normal players have no individual
row in this snapshot. The interface labels their modeled odds as a team prior.
The first fixture, ZAGREB–NORMAL 9:7, was also inspected at
https://psgz.hr/event/rygexymu (2026-09-18; official PSGZ; high confidence).
Unplayed schedule 0:0 entries and the ongoing second round are not treated as
completed results. Raw extracted values are archived in `docs/qa/odds-source.json`.

All probabilities, odds, weighting choices and virtual outcomes are project
estimates/simulations, not facts supplied or endorsed by either federation.
See `docs/odds.md` for the complete model and limitations.

### Sponsor presentation revision — 2026-09-18

At the owner's request, contribution text and lists were removed. Sponsor names,
companies and original assets remain sourced as above. The PNG is unchanged;
CSS renders its alpha silhouette in warm white directly on graphite. This
monochrome presentation is a site styling choice, not a claim of an official
brand color variant. The sponsorship inquiry CTA remains available.

## Merch concept collection — 2026-09-22
- Source type: owner-requested creative proposals in the project conversation; no public URL.
- Scope: `/#shop`, homepage merch teaser, `src/shop/products.ts`.
- Confidence: confirmed as design concepts only; no claim of manufactured products, inventory, prices, launch date or actual club-member calendar participation.
- Mockup provenance: built-in image_gen; exact prompts in `docs/merch-image-prompts.json`.
- These proposals introduce no new factual club data and require no federation attribution.

### Map readability update — 2026-09-26

https://tiles.openfreemap.org/styles/positron — official OpenFreeMap base style,
checked 2026-09-26; high confidence, primary technical source. Custom road, water,
park and building colors improve contrast; no geographical or match facts changed.

## Owner contact and copy revision — 2026-10-07

| Fact / change | Source URL or record | Checked | Confidence | Type |
|---|---|---|---|---|
| Club email pikadonormal@gmail.com replaces personal phone in all site contact links | Owner-supplied Photo 1.jpg / Photo 2.jpg in this conversation; no public URL | 2026-10-07 | High: owner-provided, not federation-verified | Owner-provided |

The supplied screenshots explicitly request removing the personal phone and repeated
phrases about “crta”, using dart-shaped map markers, and removing the virtual
100-point stake cap. The mailto target matches the supplied address; no message
was sent and mailbox delivery is not independently verified.
