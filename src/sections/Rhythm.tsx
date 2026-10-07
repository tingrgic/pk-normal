import { useEffect, useRef, useState, type CSSProperties } from "react";
import { rhythm } from "../data/rhythm";
import { useLanguage } from "../i18n/Language";

export default function Rhythm() {
  const { t } = useLanguage();
  const [order, setOrder] = useState(() => rhythm.map((_, i) => i));
  useEffect(() => {
    const next = rhythm.map((_, i) => i);
    for (let i = next.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [next[i], next[j]] = [next[j], next[i]];
    }
    setOrder(next);
  }, []);
  const [index, setIndex] = useState(0);
  const gesture = useRef<{ id: number; x: number; y: number } | null>(null);
  const move = (step: number) => setIndex(current => (current + step + rhythm.length) % rhythm.length);
  const current = rhythm[order[index]];
  const words = t(current.name).split(" ");
  const number = String(index + 1).padStart(3, "0");

  return (
    <section className="identity section" aria-labelledby="rhythm-label">
      <div className="identity-top">
        <h2 id="rhythm-label" className="section-label mono"><span>02 /</span> {t("NAŠ RITAM")}</h2>
        <p className="mono">{t("NORMAL JE IMATI SVOJ ĐIR.")}</p>
      </div>
      <div className="identity-swipe" role="group" aria-roledescription={t("Karusel")}
        aria-label={t("Naš pristup igri")} aria-describedby="rhythm-instructions" tabIndex={0}
        onKeyDown={event => {
          if (event.target !== event.currentTarget) return;
          if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
          event.preventDefault();
          if (event.key === "Home") setIndex(0);
          else if (event.key === "End") setIndex(rhythm.length - 1);
          else move(event.key === "ArrowRight" ? 1 : -1);
        }}
        onPointerDown={event => {
          if (!event.isPrimary || event.button !== 0 || (event.target as HTMLElement).closest("button")) return;
          gesture.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerUp={event => {
          const start = gesture.current;
          gesture.current = null;
          if (!start || start.id !== event.pointerId) return;
          const dx = event.clientX - start.x;
          const dy = event.clientY - start.y;
          if (Math.abs(dx) >= 40 && Math.abs(dx) > Math.abs(dy) * 1.4) move(dx < 0 ? 1 : -1);
        }}
        onPointerCancel={() => { gesture.current = null; }}
        onLostPointerCapture={() => { gesture.current = null; }}>
        <div className="identity-stage">
          <div className="radial-system" aria-hidden="true">
            <div className="radial-core" />
            {Array.from({ length: 20 }, (_, i) => <i key={i} style={{ transform: `rotate(${i * 18}deg)` }} />)}
          </div>
          <span className="identity-side mono" aria-hidden="true">{t("PK NORMAL — U SVOM RITMU —")}</span>
          <h3 id="identity-title" key={index} style={{ "--word-length": Math.max(...words.map(word => word.length)), "--word-lines": words.length } as CSSProperties}>
            {words.map((word, i) => <span className="identity-word" key={i}>{word}{i < words.length - 1 ? " " : ""}{i === words.length - 1 && <span className="red">.</span>}</span>)}
          </h3>
          <span className="identity-cross" aria-hidden="true">+</span>
        </div>
        <div className="identity-bottom">
          <div className="rhythm-index">
            <div className="rhythm-count mono"><span>{number}</span><span>/ 180</span></div>
            <div className="rhythm-progress" aria-hidden="true"><span style={{ width: `${(index + 1) / rhythm.length * 100}%` }} /></div>
            <p className="mono" id="rhythm-instructions">{t("Povuci lijevo / desno. Tipkovnica: ← / →.")}</p>
          </div>
          <div className="principle-copy" aria-live="polite" aria-atomic="true">
            <span className="sr-only">{number} / 180. {t(current.name)}. </span>
            <p>{t(current.text)}</p>
          </div>
        </div>
        <div className="rhythm-access-controls">
          <button type="button" onClick={() => move(-1)}>{t("Prethodni opis")}</button>
          <button type="button" onClick={() => move(1)}>{t("Sljedeći opis")}</button>
        </div>
      </div>
    </section>
  );
}
