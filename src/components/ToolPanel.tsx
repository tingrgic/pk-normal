import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { useLanguage } from '../i18n/Language';
const Counter = lazy(() => import('../counter/Counter'));
const Atlas = lazy(() => import('../atlas/Atlas'));
const Odds = lazy(() => import('../odds/Odds'));
const Shop = lazy(() => import('../shop/Shop'));
const tools = { brojac: Counter, karta: Atlas, dvoboji: Odds, shop: Shop };
export default function ToolPanel({ name }: { name: keyof typeof tools }) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const panel = useRef<HTMLElement>(null);
  const trigger = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const activate = () => { if (location.hash === '#' + name) setOpen(true); };
    const click = (event: MouseEvent) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element).closest<HTMLAnchorElement>('a[href="#' + name + '"]');
      if (link) {
        event.preventDefault();
        trigger.current = link;
        if (location.hash !== '#' + name) history.pushState(null, '', '#' + name);
        setOpen(true);
        if (open) { panel.current?.scrollIntoView({block:'start'}); panel.current?.focus({preventScroll:true}); }
      }
    };
    activate(); window.addEventListener('hashchange', activate); document.addEventListener('click', click);
    return () => { window.removeEventListener('hashchange', activate); document.removeEventListener('click', click); };
  }, [name, open]);
  useEffect(() => { if (open) { panel.current?.scrollIntoView({ block: 'start' }); panel.current?.focus({ preventScroll: true }); } }, [open]);
  const Tool = tools[name];
  return open ? <section ref={panel} tabIndex={-1} className="inline-tool" aria-label={t({brojac:'Brojač pikada',karta:'Atlas utakmica',dvoboji:'Virtualni dvoboji',shop:'Merchshop'}[name])} data-tool={name}>
    <div className="inline-tool-bar"><span>{t('Sve je ovdje. Skrolaj dalje kad poželiš.')}</span><button onClick={() => { setOpen(false); history.replaceState(null, '', location.pathname + location.search); const target = trigger.current?.checkVisibility() ? trigger.current : document.getElementById(name); target?.scrollIntoView({block:'center'}); target?.focus({preventScroll:true}); }}>{t('Zatvori prikaz')} ×</button></div>
    <Suspense fallback={<p className="counter-loading" role="status">{t('Učitavanje…')}</p>}><Tool /></Suspense>
  </section> : null;
}
