import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import translationEN from "./assets/locales/en/translation.json";
import translationId from "./assets/locales/id/translation.json";

var lng = globalThis.localStorage.getItem('lng');
lng ? lng : globalThis.localStorage.setItem('lng', 'id');

const fallbackLng = [lng];
const availableLanguages = ["id"];

const resources = {
  en: {
    translation: translationEN
  },
  id: {
    translation: translationId
  }
};

i18n
  .use(Backend)
  // .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng,

    detection: {
      checkWhitelist: true
    },

    debug: false,

    whitelist: availableLanguages,

    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
