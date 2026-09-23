import { LanguageProvider } from "./i18n/Language";
import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "@fontsource/barlow-condensed/latin-600.css";
import "@fontsource/barlow-condensed/latin-ext-600.css";
import "@fontsource/barlow-condensed/latin-700.css";
import "@fontsource/barlow-condensed/latin-ext-700.css";
import "@fontsource/manrope/latin-400.css";
import "@fontsource/manrope/latin-ext-400.css";
import "@fontsource/manrope/latin-600.css";
import "@fontsource/manrope/latin-ext-600.css";
import Root from "./Root";
import "./styles/main.css";
import "./styles/hero.css";
import { prepareHero } from "./sections/heroCinema";
prepareHero();
const root = document.getElementById("root")!;
const app = (
  <React.StrictMode>
    <LanguageProvider><Root /></LanguageProvider>
  </React.StrictMode>
);
if (root.hasChildNodes()) hydrateRoot(root, app);
else createRoot(root).render(app);
