import { useLanguage } from "./i18n/Language";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Navigation from "./components/Navigation";
import Arrow from "./components/Arrow";
import ToolPanel from "./components/ToolPanel";
import Hero from "./sections/Hero";
import { returnToTop } from "./components/returnToTop";
import Sponsors from "./sections/Sponsors";
import Rhythm from "./sections/Rhythm";
import AtlasTeaser from "./components/AtlasTeaser";
import { club, players } from "./data/club";

function Label({
  number,
  children,
}: {
  number: string;
  children: React.ReactNode;
}) {
  return (
    <div className="section-label mono">
      <span>{number} /</span> {children}
    </div>
  );
}
export default function App() {
  const { t } = useLanguage();

  const main = useRef<HTMLElement>(null);
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return;
    const targets = main.current?.querySelectorAll("[data-reveal]") || [];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            if (media.matches) {
              io.unobserve(e.target);
              return;
            }
            gsap.fromTo(
              e.target,
              { y: 28, opacity: 0.2 },
              { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
            );
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    targets.forEach((el) => io.observe(el));
    return () => {
      io.disconnect();
      targets.forEach((el) => gsap.killTweensOf(el));
    };
  }, []);
  function tilt(e: React.PointerEvent<HTMLAnchorElement>) {
    if (
      e.pointerType !== "mouse" ||
      matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const el = e.currentTarget,
      r = el.getBoundingClientRect();
    el.style.setProperty(
      "--tilt-x",
      ((e.clientY - r.top) / r.height - 0.5) * -3 + "deg",
    );
    el.style.setProperty(
      "--tilt-y",
      ((e.clientX - r.left) / r.width - 0.5) * 3 + "deg",
    );
  }
  return (
    <>
      <Navigation />
      <main id="main" ref={main}>
        <Hero />
        <section
          className="about section"
          id="o-klubu"
          aria-labelledby="about-title"
        >
          <Label number="01">{t("O KLUBU")}</Label>
          <div className="about-main">
            <h2 id="about-title" data-reveal>{t("NOVO IME.")}<br />{t("ISTI ")}<em>{t("GUŠT.")}</em>
            </h2>
            <div className="about-copy" data-reveal>
              <p className="lead">{t("Mi smo PK Normal.")}<br />{t("Zagrebačka ekipa s jasnim ciljem.")}</p>
              <p>{t("Od ")}{t(club.admission)}{t(" dio smo Pikado saveza grada Zagreba. Drugi igraju pikado. Mi ga dišemo, jedemo i živimo. Strelice ipak vadimo iz tanjura.")}</p>
              <a
                className="text-link"
                href={club.sources.admission}
                target="_blank"
                rel="noreferrer"
              >{t("Normal je dio PSGZ-a ")}<Arrow />
              </a>
            </div>
          </div>
          <div className="club-strip">
            <span className="mono">ZAGREB / HR</span>
            <span>{t("Jedna meta. Puno razloga za igru.")}</span>
            <span className="strip-target" aria-hidden="true">
              ⊕
            </span>
          </div>
        </section>
        <Rhythm />
        <section
          className="team section"
          id="ekipa"
          aria-labelledby="team-title"
        >
          <div className="team-heading">
            <Label number="03">{t("EKIPA")}</Label>
            <h2 id="team-title" data-reveal>{t("SVATKO SVOJ.")}<br />{t("ZAJEDNO ")}<em>NORMAL.</em>
            </h2>
            <p>{t("Imena iza svakog bacanja.")}<br />{t("Igrači ekipe Normal.")}</p>
          </div>
          <div className="featured-players">
            {players.slice(0, 2).map((p, i) => (
              <a
                key={p.slug}
                href={"https://hps-dart.hr/" + p.slug}
                target="_blank"
                rel="noreferrer"
                className="player-card"
                onPointerMove={tilt}
                onPointerLeave={(e) => {
                  e.currentTarget.style.setProperty("--tilt-x", "0deg");
                  e.currentTarget.style.setProperty("--tilt-y", "0deg");
                }}
              >
                <div className="player-top mono">
                  <span>PK NORMAL</span>
                  <span>{t(p.role)}</span>
                </div>
                <div className="player-monogram" aria-hidden="true">
                  {p.initials}
                  <i />
                </div>
                <div className="player-bottom">
                  <h3>
                    {p.first}
                    <br />
                    {p.last}
                  </h3>
                  <span className="player-arrow">
                    <Arrow />
                  </span>
                </div>
                <span className="card-index mono" aria-hidden="true">
                  N / 0{i + 1}
                </span>
              </a>
            ))}
          </div>
          <div className="roster">
            {players.slice(2).map((p, i) => (
              <a
                href={"https://hps-dart.hr/" + p.slug}
                key={p.slug}
                target="_blank"
                rel="noreferrer"
              >
                <span className="mono roster-index">N / 0{i + 3}</span><span className="roster-monogram" aria-hidden="true">{p.initials}</span>
                <h3>
                  {p.first} <strong>{p.last}</strong>
                </h3>
                <span className="roster-role">{t(p.role)}</span>
                <Arrow />
              </a>
            ))}
          </div>
          <div className="team-source">
            <p>{t("Ekipa prema službenom registru Hrvatskog pikado saveza.")}</p>
            <a
              className="text-link"
              href={club.sources.team}
              target="_blank"
              rel="noreferrer"
            >{t("Cijeli profil ekipe ")}<Arrow />
            </a>
          </div>
        </section>
        <section
          className="competition section"
          id="natjecanja"
          aria-labelledby="competition-title"
        >
          <Label number="04">{t("NATJECANJA")}</Label>
          <div className="competition-content">
            <h2 id="competition-title" data-reveal>{t("PRATI NAS.")}<br />
              <span className="outline-type">{t("BUDI U IGRI.")}</span>
            </h2>
            <div className="competition-details">
              <p className="lead">{t("Zajedno čekamo sljedeću tekmu.")}<br />{t("Ti prati. Mi ciljamo.")}</p>
              <p>{t("Borimo se za svaki leg.")} <strong>{t(club.competition)}</strong>{t(" je naš teren — službeni raspored, tablicu i rezultate prati na stranicama saveza.")}</p>
              <a
                className="competition-link"
                href={club.sources.competitions}
                target="_blank"
                rel="noreferrer"
              >
                <span>
                  <small className="mono">{t("PIKADO SAVEZ GRADA ZAGREBA")}</small>{t("Raspored i rezultati")}</span>
                <Arrow />
              </a>
              <a
                className="competition-link"
                href={club.sources.team}
                target="_blank"
                rel="noreferrer"
              >
                <span>
                  <small className="mono">{t("HRVATSKI PIKADO SAVEZ")}</small>{t("Ekipa Normal")}</span>
                <Arrow />
              </a>
            </div>
          </div>
        </section>
        <div className="atlas-teaser-section section"><AtlasTeaser /><noscript>{t("Za interaktivnu kartu uključi JavaScript. Službeni raspored nalazi se na stranicama PSGZ-a.")}</noscript></div>
        <ToolPanel name="karta" />
        <section id="brojac" className="counter-invite section" aria-labelledby="counter-invite-title">
          <div><p className="mono">{t("ALAT ZA TVOJU EKIPU / 01–10 IGRAČA")}</p><h2 id="counter-invite-title">{t("TI BACAJ.")}<br /><span>{t("MI BROJIMO.")}</span></h2></div>
          <div className="counter-invite-copy"><p>{t("501, Cricket ili samo zagrijavanje. Složi ekipu, odredi tko prvi baca i prepusti nam računanje.")}</p><a className="text-link" href="#brojac">{t("Otvori brojač ")}<Arrow /></a><small>{t("Bez prijave. Na tvom mobitelu.")}</small><noscript>{t("Za pokretanje brojača uključi JavaScript u pregledniku.")}</noscript></div>
        </section>
        <ToolPanel name="brojac" />
        <section className="odds-invite section" id="prognoze" aria-labelledby="odds-invite-title">
          <div><p className="mono">{t("VIRTUALNI DVOBOJI / PK NORMAL")}</p><h2 id="odds-invite-title">{t("TVOJA")}<br /><em>{t("PROGNOZA.")}</em></h2></div>
          <div className="odds-invite-copy"><p>{t("Naša ekipa protiv tvoje procjene. Usporedi učinak igrača, pogledaj simulirane koeficijente i odigraj virtualni dvoboj.")}</p><a className="text-link" id="dvoboji" href="#dvoboji">{t("Otvori dvoboje ")}<Arrow /></a><small>{t("Podaci saveza. Naš model. Samo virtualni bodovi.")}</small><noscript>{t("Za virtualne dvoboje uključi JavaScript.")}</noscript></div>
        </section>
        <ToolPanel name="dvoboji" />
        <section className="merch-invite section" id="merch" aria-labelledby="merch-invite-title">
          <div><p className="mono">PK NORMAL / MERCHSHOP</p><h2 id="merch-invite-title">{t("NORMALNO.")}<br /><em>{t("ZA NOSITI.")}</em></h2><p>{t("Za igru. Za kauč. Za sve između. Istraži 12 ideja za našu prvu merch kolekciju.")}</p><a className="text-link" id="shop" href="#shop">{t("Istraži kolekciju")} <Arrow /></a><small>{t("Koncept kolekcije · još nije u prodaji")}</small></div>
          <a href="#shop" tabIndex={-1} aria-hidden="true"><img src={import.meta.env.BASE_URL + "images/merch/robe-cutout.webp"} alt="" width="960" height="960" loading="lazy" /></a>
        </section>
        <ToolPanel name="shop" />
        <Sponsors />
        <section
          className="join section"
          id="pridruzi-se"
          aria-labelledby="join-title"
        >
          <Label number="06">{t("PRIDRUŽI SE")}</Label>
          <div className="join-heading" data-reveal>
            <h2 id="join-title">{t("TVOJ SLJEDEĆI")}<br />
              <em>{t("POTEZ.")}</em>
            </h2>
            <a
              className="join-arrow"
              href={club.emailHref}
              aria-label={t("Pošalji e-mail klubu")}
            >
              <Arrow />
            </a>
          </div>
          <div className="join-bottom">
            <p>{t("Imaš dobru ruku?")}<br />{t("Ili samo dobru volju?")}<br />
              <strong>{t("Javi se. Krenimo od toga.")}</strong>
            </p>
            <div>
              <span className="mono">{t("KLUPSKI KONTAKT")}</span>
              <a className="club-email" href={club.emailHref}>
                {club.email}
              </a>
              <a className="club-instagram" href={club.instagramHref} target="_blank" rel="noreferrer">
                <span className="mono">{t("VIŠE IZ KLUBA")}</span>
                {club.instagram}<Arrow />
              </a>
            </div>
            <div className="venue">
              <span className="mono">{t("MJESTO IGRANJA")}</span>
              <p>
                {club.venue}
                <br />
                {club.address}
              </p>
              <a
                className="text-link"
                href="https://www.google.com/maps/search/?api=1&query=CB+Quattro+Zagreba%C4%8Dka+26+Sesvete"
                target="_blank"
                rel="noreferrer"
              >{t("Otvori kartu ")}<Arrow />
              </a>
            </div>
          </div>
        </section>
      </main>
      <footer className="footer">
        <div className="footer-top">
          <a href="#pocetak" className="wordmark" onClick={returnToTop}>
            <span className="mark-target" aria-hidden="true" />
            <span>
              PK NORMAL<small>{t("PIKADO KLUB / ZAGREB")}</small>
            </span>
          </a>
          <span>{t("Normal ime. Jasan cilj.")}</span>
          <a className="text-link" href="#pocetak" onClick={returnToTop}>{t("Na vrh ")}<Arrow direction="up" />
          </a>
        </div>
        <div className="footer-bottom">
          <span>© 2026 PK Normal</span>
          <a href={club.instagramHref} target="_blank" rel="noreferrer">{club.instagram}<Arrow />
          </a>
          <a href={club.sources.club} target="_blank" rel="noreferrer">{t("Službeni podaci / HPS ")}<Arrow />
          </a>
          <span>{t("REG. BR. ")}{club.registration}</span>
        </div>
      </footer>
    </>
  );
}
