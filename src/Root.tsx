import { useLanguage, LanguageSwitcher } from "./i18n/Language";
import { lazy, Suspense, useEffect, useState } from "react";
import App from "./App";
const Odds = lazy(() => import("./odds/Odds"));
const Atlas = lazy(() => import("./atlas/Atlas"));
const Shop = lazy(() => import("./shop/Shop"));
const Counter = lazy(() => import("./counter/Counter"));
export default function Root() {
  const { t } = useLanguage();

  const [routeName, setRouteName] = useState("");
  useEffect(() => {
    const route = () => {
      const open = ["#brojac", "#karta", "#dvoboji", "#shop"].includes(location.hash);
      setRouteName(open ? location.hash : "");
      if (open) window.scrollTo(0, 0);
    };
    route();
    window.addEventListener("hashchange", route);
    return () => window.removeEventListener("hashchange", route);
  }, []);
  useEffect(() => {
    if (routeName || !location.hash || ["#brojac", "#karta", "#dvoboji", "#shop"].includes(location.hash)) return;
    const frame = requestAnimationFrame(() => document.getElementById(location.hash.slice(1))?.scrollIntoView());
    return () => cancelAnimationFrame(frame);
  }, [routeName]);
  return <><LanguageSwitcher />{routeName === "#shop" ? <Suspense fallback={<main className="counter-loading"><p>{t("Merchshop")}</p></main>}><Shop /></Suspense> : routeName === "#dvoboji" ? <Suspense fallback={<main className="counter-loading"><p>{t("Otvaramo virtualne dvoboje…")}</p><a href="#prognoze">{t("Natrag u klub")}</a></main>}><Odds /></Suspense> : routeName === "#karta" ? <Suspense fallback={<main className="counter-loading"><p>{t("Otvaramo atlas utakmica…")}</p><a href="#natjecanja">{t("Natrag u klub")}</a></main>}><Atlas /></Suspense> : routeName === "#brojac" ? <Suspense fallback={<main className="counter-loading"><p>{t("Otvaramo brojač…")}</p><a href="#pocetak">{t("Natrag u klub")}</a></main>}><Counter /></Suspense> : <App />}</>;
}
