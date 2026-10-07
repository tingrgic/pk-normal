import { useLanguage } from "../i18n/Language";
import Arrow from "../components/Arrow";
import { RETURN_TO_TOP } from "../components/returnToTop";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import type { Cinema, CinemaPhase } from "../three/scene";
import { isClubPage, loadCinema, prepareHero } from "./heroCinema";
export default function Hero() {
  const { t } = useLanguage();

  const root = useRef<HTMLElement>(null),
    canvas = useRef<HTMLCanvasElement>(null),
    cinema = useRef<Cinema | null>(null);
  const skipRequested = useRef(false);
  const [phase, setPhase] = useState<CinemaPhase>("loading");
  const [reduced, setReduced] = useState(false);
  const [fallback, setFallback] = useState(false);
  const [requested, setRequested] = useState(false);
  useEffect(() => {
    if (!isClubPage() && !requested) {
      setReduced(matchMedia('(prefers-reduced-motion: reduce)').matches);
      setFallback(true); setPhase('complete');
      gsap.set(root.current?.querySelectorAll('.hero-reveal') || [], {opacity:1,y:0});
      return;
    }
    let cancelled = false;
    const reveals = root.current?.querySelectorAll(".hero-reveal") || [];
    const impactRing = root.current?.querySelector(".impact-ring");
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(media.matches);
    const finish = () => {
      if (cancelled) return;
      gsap.to(reveals, {
        opacity: 1,
        y: 0,
        duration: media.matches ? 0 : 0.6,
        stagger: media.matches ? 0 : 0.07,
        overwrite: true,
      });
    };
    let generation = 0;
    const setup = () => {
      const current = ++generation;
      cinema.current?.dispose();
      cinema.current = null;
      setReduced(media.matches);
      if (media.matches) {
        setFallback(true);
        setPhase("complete");
        finish();
        return;
      }
      setFallback(false);
      setPhase("loading");
      prepareHero();
      loadCinema()
        .then(({ createCinema }) => {
          if (cancelled || current !== generation || !canvas.current) return;
          try {
            cinema.current = createCinema(
              canvas.current,
              false,
              (p) => {
                if (cancelled || current !== generation) return;
                setPhase(p);
                if (p !== "fallback") setFallback(false);
                if (p === "side")
                  gsap.set(
                    reveals,
                    { opacity: 0, y: 8, overwrite: true },
                  );
                if (p === "fallback") setFallback(true);
                if (p === "impact" && impactRing)
                  gsap.fromTo(
                    impactRing,
                    { scale: 0.2, opacity: 0.7 },
                    { scale: 7, opacity: 0, duration: 0.9, ease: "power2.out" },
                  );
              },
              finish,
            );
            if (skipRequested.current) cinema.current.skip();
          } catch {
            setFallback(true);
            setPhase("fallback");
            finish();
          }
        })
        .catch(() => {
          if (cancelled || current !== generation) return;
          setFallback(true);
          setPhase("fallback");
          finish();
        });
    };
    setup();
    const settle = () => {
      skipRequested.current = true;
      if (cinema.current) cinema.current.skip();
      else {
        setFallback(true);
        setPhase(media.matches ? "complete" : "fallback");
        finish();
      }
    };
    window.addEventListener(RETURN_TO_TOP, settle);
    const change = () => setup();
    media.addEventListener("change", change);
    return () => {
      cancelled = true;
      cinema.current?.dispose();
      cinema.current = null;
      media.removeEventListener("change", change);
      window.removeEventListener(RETURN_TO_TOP, settle);
      gsap.killTweensOf(reveals);
      if (impactRing) gsap.killTweensOf(impactRing);
    };
  }, [requested]);
  const complete = phase === "complete" || phase === "fallback";
  return (
    <section
      ref={root}
      className={"hero " + (complete ? "is-complete" : "is-playing")}
      id="pocetak"
      aria-labelledby="hero-title"
      data-phase={phase}
      data-static={fallback}
    >
      <div className="hero-topline mono">
        <span>{t("PIKADO KLUB")}<br />{t("ZAGREB, HRVATSKA")}</span>
        <span className="hero-edition">{t("PRECIZNOST JE STVAR KARAKTERA.")}</span>
        <span className="tiny-target" aria-hidden="true">
          ⌖
        </span>
      </div>
      <h1 id="hero-title" className="hero-title">
        NORMAL<span className="title-dot">.</span>
        <span className="sr-only">{t(" — Pikado klub Zagreb")}</span>
      </h1>
      <div className="scene-frame" aria-hidden="true">
        <picture
          className="scene-poster"
          hidden={!fallback && phase !== "loading"}
        >
          <source
            media="(max-width: 699px)"
            srcSet={import.meta.env.BASE_URL + "hero-poster-mobile.webp"}
          />
          <source
            media="(min-width: 700px) and (max-width: 1099px) and (orientation: portrait)"
            srcSet={import.meta.env.BASE_URL + "hero-poster-tablet.webp"}
          />
          <img src={import.meta.env.BASE_URL + "hero-poster.webp"} alt="" />
        </picture>
        <canvas ref={canvas} />
        <picture className="scene-opening" hidden={fallback || (phase !== "loading" && phase !== "side")}>
          <source media="(max-width: 699px)" srcSet={import.meta.env.BASE_URL + "hero-opening-mobile.webp"} />
          <source media="(min-width: 700px) and (max-width: 1099px) and (orientation: portrait)" srcSet={import.meta.env.BASE_URL + "hero-opening-tablet.webp"} />
          <img src={import.meta.env.BASE_URL + "hero-opening.webp"} alt="" fetchPriority="high" />
        </picture>
      </div>
      <div className="impact-ring" aria-hidden="true" />
      <div className="hero-caption hero-reveal">
        <p className="mono red">{t("NORMAL IME.")}</p>
        <h2>{t("Sve ostalo je")}<br />{t("stvar preciznosti.")}</h2>
        <a className="text-link" href="#o-klubu">{t("Upoznaj klub ")}<Arrow direction="down-right" />
        </a>
      </div>
      <div className="hero-bottom">
        <span className="mono">{t("MIRNA RUKA. JASAN CILJ.")}</span>
        <div className="cinema-controls">
          {!reduced && (
            <button
              onClick={() => {
                if (complete) {
                  skipRequested.current = false;
                  if (cinema.current) cinema.current.replay(); else setRequested(true);
                } else {
                  skipRequested.current = true;
                  if (cinema.current) cinema.current.skip();
                  else {
                    setFallback(true);
                    setPhase("fallback");
                    gsap.set(
                      root.current?.querySelectorAll(".hero-reveal") || [],
                      { opacity: 1, y: 0, overwrite: true },
                    );
                  }
                }
              }}
              className="replay"
            >
              <span aria-hidden="true">{complete ? <svg viewBox="0 0 32 32" fill="none"><path d="M24 8a11 11 0 1 0 3 12" stroke="currentColor" strokeWidth="1.5"/><path d="M13 14L26 3M18 10L21 13M20 8L23 11M22 6L25 9M16 12L9 10L8 15L14 15L15 21L20 20Z" stroke="currentColor" strokeWidth="1.4"/></svg> : <Arrow direction="right" />}</span>
              {complete ? t("Ponovi bacanje") : t("Preskoči uvod")}
            </button>
          )}
        </div>
        <a href="#o-klubu" className="scroll-link" aria-label={t("DALJE — O klubu")}>
          <span className="mono">{t("DALJE")}</span>
          <Arrow direction="down" />
        </a>
      </div>
    </section>
  );
}
