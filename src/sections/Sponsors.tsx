import {useLanguage} from '../i18n/Language';
import {club} from '../data/club';
import Arrow from '../components/Arrow';
export default function Sponsors() {
 const {t}=useLanguage();
 return <section className="sponsors section" id="sponzori" aria-labelledby="sponsors-title">
 <div className="section-label mono"><span>05 /</span>{t(' SPONZORI')}</div>
 <div className="sponsors-heading"><h2 id="sponsors-title">{t('VAŠ BREND.')}<br/><em>{t('NAŠA META.')}</em></h2><p>{t('Mjesto za Vas kao sponzora kluba. Mi gađamo bull, Vi pogodite pravu ekipu.')}</p></div>
 <div className="sponsors-invite"><div><p className="mono">{t('OVDJE MOŽE VAŠ LOGO')}</p><h3>{t('Link na Vašu stranicu, sponzore')}</h3><p>{t('Ovaj prostor čeka partnera. Zasad vodi ravno u naš inbox.')}</p></div><div className="sponsors-invite-copy"><a className="text-link" href={club.emailHref}>{t('Postani sponzor ')}<Arrow/></a><span className="sponsors-contact">{club.email}</span></div></div>
 </section>;
}
