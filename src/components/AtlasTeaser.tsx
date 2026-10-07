import { useLanguage } from "../i18n/Language";
import { fixtures, venues } from '../data/atlas';
import Arrow from './Arrow';

// Shared projection with the local OSM road/river illustration; see docs/atlas.md.
const project = ([lng, lat]: [number, number]) => [(lng - 15.875) * 2000, (45.852 - lat) * 2870];
export default function AtlasTeaser() {
  const { t } = useLanguage();
  return <div className="atlas-teaser-wrap">
    <a id="karta" className="atlas-teaser" href="#karta" aria-label={t("Otvori 3D kartu utakmica PK Normal za sezonu 2026/27.")}>
      <div className="atlas-teaser-graphic" aria-hidden="true">
        <svg viewBox="0 0 560 320">
          <image href={import.meta.env.BASE_URL + 'maps/zagreb-context.svg'} width="560" height="320" />
          <g className="atlas-teaser-map-labels">
            <text x="24" y="28" className="atlas-teaser-map-eyebrow">ZAGREB / SESVETE</text>
            <text x="242" y="130">ZAGREB</text>
            <text x="423" y="40">SESVETE</text>
            <text x="286" y="252" className="atlas-teaser-river-label">SAVA</text>
          </g>
          {venues.map(v => {
            const [x, y] = project(v.coordinates);
            const home = v.id === 'quattro';
            return <g key={v.id} transform={`translate(${x} ${y})`}>
              <circle r={home ? 20 : 3} fill="none" stroke={home ? '#ed382b' : '#a09f9a'} opacity={home ? .6 : .7} />
              <image href={import.meta.env.BASE_URL + 'dart-marker.svg'} x="-13" y="-30.875" width="26" height="32.5" opacity={home ? 1 : .8} />
              {home && <text x="27" y="4" className="atlas-teaser-home-label">NORMAL</text>}
            </g>;
          })}
        </svg>
      </div>
      <div className="atlas-teaser-copy"><span className="mono">{t("ATLAS UTAKMICA / 2026–27")}</span><h3>{t("GRAD JE TEREN.")}</h3><p>{fixtures.length}{t(" objavljenih utakmica. Datumi, suparnici i upute za dolazak na jednom mjestu.")}</p><span className="atlas-teaser-link">{t("Istraži 3D kartu ")}<Arrow /></span></div>
    </a>
    <a className="atlas-teaser-attribution" href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">© OpenStreetMap</a>
  </div>;
}
