import { useLanguage } from "../i18n/Language";
import Arrow from "../components/Arrow";
import { club, sponsors } from "../data/club";

export default function Sponsors() {
  const { t } = useLanguage();

  return (
    <section className="sponsors section" id="sponzori" aria-labelledby="sponsors-title">
      <div className="section-label mono"><span>05 /</span>{t(" SPONZORI")}</div>
      <div className="sponsors-heading" data-reveal>
        <h2 id="sponsors-title">{t("UZ NAS.")}<br /><em>{t("ZA IGRU.")}</em></h2>
        <p>{t("Podrška koja stoji iza ekipe.")}<br />{t("Hvala što ste dio naše priče.")}</p>
      </div>
      <div className="sponsors-list">
        {sponsors.map((sponsor) => (
          <a className="sponsors-entry" key={sponsor.id} href={sponsor.website} target="_blank" rel="noreferrer" aria-label={t("{0} — {1}, službena stranica", {0: sponsor.name, 1: sponsor.company})}>
            <div className="sponsors-logo">
              <img src={import.meta.env.BASE_URL + sponsor.logo.replace(/^\//, "")} alt={t("Logotip {0}", {0: sponsor.name})} width="200" height="192" loading="lazy" decoding="async" />
            </div>
            <div className="sponsors-details">
              <h3>{sponsor.name}</h3>
              <p className="sponsors-company">{sponsor.company}</p>
            </div>
            <Arrow />
          </a>
        ))}
      </div>
      <div className="sponsors-invite">
        <div><p className="mono">{t("MJESTO I ZA VAŠ BREND")}</p><h3>{t("Budite dio ekipe.")}</h3></div>
        <div className="sponsors-invite-copy">
          <p>{t("Želite podržati PK Normal? Javite nam se i dogovorimo kako zajedno možemo doprinijeti klubu.")}</p>
          <a className="text-link" href={club.emailHref}>{t("Postani sponzor ")}<Arrow /></a>
          <span className="sponsors-contact">{t("Pišite nam · ")}{club.email}</span>
        </div>
      </div>
    </section>
  );
}
