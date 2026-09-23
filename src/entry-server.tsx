import { LanguageProvider } from "./i18n/Language";
import { renderToString } from "react-dom/server";
import Root from "./Root";
export function render() {
  return renderToString(<LanguageProvider><Root /></LanguageProvider>);
}
