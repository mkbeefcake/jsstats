import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./lang/en.json";
import ru from "./lang/ru.json";

// https://github.com/i18next/i18next-browser-languageDetector
// https://www.i18next.com/overview/configuration-options

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: true,
    fallbackLng: "en",
    interpolation: { escapeValue: false },
    resources: { en, ru },
    saveMissing: true,
  });

export default i18n;
