import { useLanguage } from "../i18n/Language";
import Arrow from "./Arrow";
import { returnToTop } from "./returnToTop";
import { useEffect, useRef, useState } from "react";
const primaryLinks = [
  ["O klubu", "o-klubu"],
  ["Ekipa", "ekipa"],
  ["Utakmice", "karta"],
  ["Pridruži se", "pridruzi-se"],
];
const toolLinks = [
  ["Brojač", "brojac"],
  ["Prognoze", "prognoze"],
];
const secondaryLinks = [
  ...toolLinks,
  ["Merchshop", "shop"],
  ["Sponzori", "sponzori"],
];
export default function Navigation() {
  const { t } = useLanguage();

  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const tools = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    const dismiss = (event: PointerEvent) => {
      if (event.target instanceof Node && !tools.current?.contains(event.target)) {
        tools.current?.removeAttribute("open");
      }
    };
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, []);
  useEffect(() => {
    if (open) {
      dialog.current?.showModal();
      dialog.current?.querySelector("button")?.focus();
      document.body.style.overflow = "hidden";
    } else {
      dialog.current?.close();
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);
  function close() {
    dialog.current?.close();
    setOpen(false);
    trigger.current?.focus();
  }
  function trap(e: React.KeyboardEvent<HTMLDialogElement>) {
    if (e.key !== "Tab") return;
    const items = Array.from(
      e.currentTarget.querySelectorAll<HTMLElement>("button,a[href]"),
    );
    const first = items[0],
      last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
  return (
    <>
      <a className="skip-link" href="#main">{t("Preskoči na sadržaj")}</a>
      <header className="nav">
        <a href="#pocetak" className="wordmark" onClick={returnToTop}>
          <span className="mark-target" aria-hidden="true" />
          <span>
            PK NORMAL<small>{t("PIKADO KLUB / ZAGREB")}</small>
          </span>
        </a>
        <nav aria-label={t("Glavna navigacija")} className="desktop-nav">
          {primaryLinks.slice(0, 3).map(([label, id]) => (
            <a key={id} href={"#" + id}>{t(label)}</a>
          ))}
          <details
            ref={tools}
            className="nav-tools"
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) event.currentTarget.open = false;
            }}
            onKeyDown={(event) => {
              if (event.key === "Escape" && event.currentTarget.open) {
                event.preventDefault();
                event.currentTarget.open = false;
                event.currentTarget.querySelector("summary")?.focus();
              }
            }}
          >
            <summary>{t("Alati")} <span aria-hidden="true">＋</span></summary>
            <div className="nav-tools-links">
              {toolLinks.map(([label, id]) => (
                <a key={id} href={"#" + id} onClick={() => { if (tools.current) tools.current.open = false; }}>
                  {t(label)}<Arrow direction="diagonal" />
                </a>
              ))}
            </div>
          </details>
          <a href="#shop" className="nav-shop">{t("Merchshop")}</a>
          <a href="#pridruzi-se" className="nav-join">
            {t("Pridruži se")}<Arrow direction="diagonal" />
          </a>
        </nav>
        <button
          ref={trigger}
          className="menu-toggle"
          aria-label={t("IZBORNIK — otvori")}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen(true)}
        >{t("IZBORNIK ")}<span aria-hidden="true">＋</span>
        </button>
      </header>
      <dialog
        ref={dialog}
        id="mobile-menu"
        className="mobile-menu"
        aria-label={t("Glavni izbornik")}
        onKeyDown={trap}
        onCancel={(e) => {
          e.preventDefault();
          close();
        }}
      >
        <div className="menu-top">
          <span className="mono">PK NORMAL / ZAGREB</span>
          <button onClick={close} aria-label={t("Zatvori izbornik")}>{t("ZATVORI ")}<span aria-hidden="true">×</span>
          </button>
        </div>
        <div className="menu-rings" aria-hidden="true" />
        <nav aria-label={t("Mobilna navigacija")}>
          {primaryLinks.map(([label, id], i) => (
            <a key={id} href={"#" + id} onClick={close}>
              <span className="mono">0{i + 1}</span>
              {t(label)}
              <Arrow direction="diagonal" />
            </a>
          ))}
          <div className="menu-secondary">
            {secondaryLinks.map(([label, id]) => (
              <a key={id} href={"#" + id} onClick={close}>{t(label)}<Arrow direction="diagonal" /></a>
            ))}
          </div>
        </nav>
        <p className="mono menu-bottom">{t("NORMALNO IME. JASAN CILJ.")}</p>
      </dialog>
    </>
  );
}
