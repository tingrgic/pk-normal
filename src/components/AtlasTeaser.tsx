import { useLanguage } from "../i18n/Language";
import { fixtures, venues } from '../data/atlas';
import Arrow from './Arrow';
export default function AtlasTeaser() {
  const { t } = useLanguage();

 const project=([lng,lat]:[number,number])=>[(lng-15.887)/.23*500+30,200-(lat-45.78)/.07*180];
 return <a id="karta" className="atlas-teaser" href="#karta" aria-label={t("Otvori 3D kartu utakmica PK Normal za 2026.")}>
  <div className="atlas-teaser-graphic" aria-hidden="true"><svg viewBox="0 0 560 240"><path d="M20 220H540M20 20V220M140 20V220M260 20V220M380 20V220M500 20V220M20 100H540" stroke="currentColor" opacity=".15" fill="none"/>{venues.map(v=>{const [x,y]=project(v.coordinates);return <g key={v.id} transform={'translate('+x+' '+y+')'}><image href={import.meta.env.BASE_URL+'dart-marker.svg'} x="-16" y="-38" width="32" height="40" style={{filter:v.id==='quattro'?'none':'grayscale(1)'}}/>{v.id==='quattro'&&<><circle r="24" fill="none" stroke="#ed382b" opacity=".5"/><text x="-22" y="-46" fill="#eeeee4" fontSize="13">NORMAL</text></>}</g>;})}<text x="24" y="43" fill="currentColor" fontSize="12" letterSpacing="3">ZAGREB / SESVETE</text></svg></div>
  <div className="atlas-teaser-copy"><span className="mono">{t("NOVO / ATLAS UTAKMICA 2026")}</span><h3>{t("GRAD JE TEREN.")}</h3><p>{fixtures.length}{t(" objavljenih utakmica. Datumi, suparnici i upute za dolazak na jednom mjestu.")}</p><span className="atlas-teaser-link">{t("Istraži 3D kartu ")}<Arrow /></span></div>
 </a>;
}
