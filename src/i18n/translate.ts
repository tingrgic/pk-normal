import catalog from './catalog.json' with { type: 'json' };
export type Language = 'hr' | 'en' | 'de';
export const locales: Record<Language, string> = { hr: 'hr-HR', en: 'en-GB', de: 'de-DE' };
export const isLanguage = (value: unknown): value is Language => value === 'hr' || value === 'en' || value === 'de';
const messages = catalog as Record<string, { en: string; de: string }>;
export function translate(text: string, language: Language, values: Record<string, string | number> = {}): string {
  const key = text.replace(/\s+/g, ' ').trim();
  let result = language === 'hr' ? text : messages[key]?.[language];
  if (result === undefined) result = text;
  else if (language !== 'hr') result = (text.match(/^\s+/)?.[0] || '') + result + (text.match(/\s+$/)?.[0] || '');
  return result.replace(/\{(\w+)\}/g, (match, name: string) => Object.hasOwn(values, name) ? String(values[name]) : match);
}
