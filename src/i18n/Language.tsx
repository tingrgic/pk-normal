import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { isLanguage, locales, translate, type Language } from './translate';
export const LANGUAGE_KEY = 'pk-normal-language-v1';
const LanguageContext = createContext({ language: 'hr' as Language, locale: locales.hr, setLanguage: (_: Language) => {}, t: (text: string, values?: Record<string, string | number>) => translate(text, 'hr', values) });
export function LanguageProvider({ children }: { children: ReactNode }) {
  // The first client render matches Croatian prerendered HTML; restore after hydration.
  const [language, setCurrent] = useState<Language>('hr');
  useEffect(() => { try { const saved = localStorage.getItem(LANGUAGE_KEY); if (isLanguage(saved)) setCurrent(saved); } catch { /* Selection still works in memory. */ } }, []);
  const setLanguage = useCallback((value: Language) => { setCurrent(value); try { localStorage.setItem(LANGUAGE_KEY,value); } catch { /* No storage required for translation. */ } }, []);
  const t = useCallback((text: string, values?: Record<string,string|number>) => translate(text,language,values), [language]);
  useEffect(() => {
    document.documentElement.lang = language;
    function metadata() {
      const title = location.hash === '#shop' ? 'Merchshop | PK Normal' : location.hash === '#brojac' ? 'Brojač pikada | PK Normal' : location.hash === '#karta' ? 'Karta utakmica 2026 | PK Normal' : location.hash === '#dvoboji' ? 'Virtualni dvoboji | PK Normal' : 'Pikado klub Normal | Zagreb';
      document.title = t(title);
      const description = t('Pikado klub Normal iz Zagreba. Upoznaj ekipu, prati utakmice, broji rezultate i istraži virtualne dvoboje.');
      document.querySelector('meta[name="description"]')?.setAttribute('content',description);
      document.querySelector('meta[property="og:title"]')?.setAttribute('content',document.title);
      document.querySelector('meta[property="og:description"]')?.setAttribute('content',description);
      document.querySelector('meta[property="og:locale"]')?.setAttribute('content',locales[language].replace('-','_'));
    }
    metadata();window.addEventListener('hashchange',metadata);return()=>window.removeEventListener('hashchange',metadata);
  },[language,t]);
  return <LanguageContext.Provider value={{language,locale:locales[language],setLanguage,t}}>{children}</LanguageContext.Provider>;
}
export const useLanguage = () => useContext(LanguageContext);
export function LanguageSwitcher() {
  const {language,setLanguage,t} = useLanguage();
  return <nav className="site-language-bar" aria-label={t("Jezik stranice")}><span className="mono">PK NORMAL / ZAGREB</span><div className="site-languages" role="group" aria-label={t('Jezik stranice')}>{(['hr','en','de'] as const).map(code=><button key={code} type="button" lang={code} aria-label={{hr:'Hrvatski',en:'English',de:'Deutsch'}[code]} aria-pressed={language===code} onClick={()=>setLanguage(code)}>{code.toUpperCase()}</button>)}</div></nav>;
}
