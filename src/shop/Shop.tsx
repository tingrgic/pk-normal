import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../i18n/Language';
import { categories, products, type Category, type Product } from './products';
import './shop.css';
import Arrow from '../components/Arrow';
const SAVE_KEY = 'pk-normal-merch-favourites-v1';
export default function Shop() {
  const { t } = useLanguage();
  const [category, setCategory] = useState<Category>('Sve');
  const [savedOnly, setSavedOnly] = useState(false);
  const [saved, setSaved] = useState<string[]>([]);
  const [selected, setSelected] = useState<Product | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  useEffect(() => { try { const value: unknown = JSON.parse(localStorage.getItem(SAVE_KEY) || '[]'); if (Array.isArray(value)) setSaved(value.filter((id): id is string => typeof id === 'string' && products.some(p => p.id === id))); } catch { /* Favourites remain available in memory. */ } }, []);
  useEffect(() => {
    if (!selected) return;
    dialog.current?.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; opener.current?.focus(); };
  }, [selected]);
  function toggle(id: string) {
    const next = saved.includes(id) ? saved.filter(item => item !== id) : [...saved, id];
    setSaved(next);
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(next)); } catch { /* No storage is required to browse. */ }
  }
  function close() { dialog.current?.close(); setSelected(null); }
  const shown = products.filter(p => (category === 'Sve' || p.category === category) && (!savedOnly || saved.includes(p.id)));
  return <div className="merch-page">
    <a className="skip-link" href="#merch-main" onClick={event => { event.preventDefault(); document.getElementById("merch-main")?.focus(); }}>{t('Preskoči na sadržaj')}</a>
    <header className="merch-header"><a href="#merch"><Arrow direction="left"/> {t('Natrag u klub')}</a><a href="#shop" className="merch-brand">PK NORMAL<span>MERCHSHOP</span></a><button onClick={() => setSavedOnly(!savedOnly)} aria-pressed={savedOnly}>{t('Moj izbor')} <span>{saved.length.toString().padStart(2, '0')}</span></button></header>
    <section id="merch-main" tabIndex={-1}>
      <section className="merch-hero" aria-labelledby="merch-title"><div className="merch-intro"><p className="mono">{t('KOLEKCIJA U NASTAJANJU / 001')}</p><h2 id="merch-title">{t('SASVIM')}<br /><em>{t('NENORMALAN.')}</em><br />MERCH.</h2><p>{t('Za igru. Za kauč. Za sve između.')}<br />{t('Klupski duh koji ne ostaje u klubu.')}</p><button className="merch-cta" onClick={() => { const section = document.getElementById("merch-collection"); section?.scrollIntoView(); section?.focus({ preventScroll: true }); }}>{t('Istraži kolekciju')} <Arrow direction="down"/></button></div><figure className="merch-cover"><img src={import.meta.env.BASE_URL + "images/merch/robe-cutout.webp"} width="960" height="960" alt={t('Double out — koncept crnog klupskog ogrtača i papuča')} fetchPriority="high" /><figcaption><span>01 / AFTER HOURS</span><span>{t('Iz igre. U ogrtač.')}</span></figcaption></figure></section>
      <aside className="merch-notice"><span className="mono">{t('DOBRE IDEJE. JOŠ NE PROIZVODI.')}</span><p>{t('Ovo je koncept službenog PK Normal merchshopa. Svi prikazi su AI mockupovi; artikli, materijali i izvedbe su prijedlozi. Cijene, zalihe i datum prodaje još nisu određeni. Nema naručivanja ni naplate.')}</p></aside>
      <section id="merch-collection" tabIndex={-1} className="merch-collection" aria-labelledby="merch-collection-title"><div className="merch-collection-heading"><h2 id="merch-collection-title">{t('DOBAR ĐIR.')}<br /><span>{t('OD GLAVE DO PETE.')}</span></h2><p className="mono">12 {t('IDEJA / JEDNA EKIPA')}</p></div>
        <div className="merch-filter"><div role="group" aria-label={t('Kategorije proizvoda')}>{categories.map(item => <button key={item} aria-pressed={category === item} onClick={() => setCategory(item)}>{t(item)}</button>)}</div><p aria-live="polite">{shown.length} / 12 {savedOnly && `· ${t('Moj izbor')}`}</p></div>
        {savedOnly && <div className="merch-selection-note"><p>{t('Tvoj izbor ostaje samo u ovom pregledniku. Nije narudžba niti rezervacija.')}</p><button onClick={() => setSavedOnly(false)}>{t('Prikaži sve')}</button></div>}
        <div className="merch-grid">{shown.map((product) => <article key={product.id} className="merch-product"><button className="merch-image-button" onClick={event => { opener.current = event.currentTarget; setSelected(product); }} aria-label={`${t('Pogledaj koncept')}: ${t(product.name)}`}><img src={`${import.meta.env.BASE_URL}images/merch/${product.id}.webp`} alt={t(product.type)} width="1024" height="1024" loading="lazy" /><span className="merch-image-tag">{t('KONCEPT')}</span><span className="merch-expand" aria-hidden="true"><Arrow/></span></button><div className="merch-product-meta"><p className="mono">{t(product.type)}</p><button aria-pressed={saved.includes(product.id)} aria-label={`${t(saved.includes(product.id) ? 'Ukloni iz izbora' : 'Spremi u izbor')}: ${t(product.name)}`} onClick={() => toggle(product.id)}>{saved.includes(product.id) ? '♥' : '♡'}</button></div><h3>{t(product.name)}</h3><p>{t(product.line)}</p></article>)}</div>
        {!shown.length && <p className="merch-empty">{t('Ovdje još nema favorita. Spremi ideju srcem ili odaberi drugu kategoriju.')}</p>}
      </section>
      <section className="merch-signoff"><p className="mono">{t('NORMAL JE IMATI SVOJ ĐIR.')}</p><h2>{t('KLUB SE NE NOSI')}<br /><em>{t('SAMO NA DRESU.')}</em></h2><a href="#merch"><Arrow direction="left"/> {t('Natrag u klub')}</a></section>
    </section>
    <footer className="merch-footer"><span>PK NORMAL / MERCHSHOP</span><span>{t('Koncept kolekcije · još nije u prodaji')}</span></footer>
    <dialog ref={dialog} className="merch-dialog" aria-labelledby="merch-detail-title" onCancel={event => { event.preventDefault(); close(); }} onClick={event => { if (event.target === event.currentTarget) close(); }}>{selected && <><button className="merch-close" onClick={close} autoFocus>{t('Zatvori')} ×</button><div className="merch-detail"><img src={`${import.meta.env.BASE_URL}images/merch/${selected.id}.webp`} alt={t(selected.type)} width="1024" height="1024" /><div><p className="mono">{t('KONCEPT')} / {t(selected.type)}</p><h2 id="merch-detail-title">{t(selected.name)}</h2><p>{t(selected.description)}</p><button className="merch-cta" aria-pressed={saved.includes(selected.id)} onClick={() => toggle(selected.id)}>{t(saved.includes(selected.id) ? 'Ukloni iz izbora' : 'Spremi u izbor')} <span aria-hidden="true">{saved.includes(selected.id) ? '♥' : '♡'}</span></button><small>{t('Koncept kolekcije · još nije u prodaji')}</small></div></div></>}</dialog>
  </div>;
}
