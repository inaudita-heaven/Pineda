/**
 * i18n.js — Configuración de i18next para Ruta Expo Pineda
 *
 * Lazy-loading: solo se descarga el JSON del idioma activo al inicio.
 * Los archivos viven en public/locales/{lng}.json — servidos como assets estáticos.
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'es',
    supportedLngs: ['es', 'en', 'fr', 'de', 'zh', 'ja'],

    backend: {
      loadPath: '/locales/{{lng}}.json',
    },

    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'pineda_lang',
    },

    interpolation: {
      escapeValue: false,
    },

    react: {
      useSuspense: true,
    },

    debug: import.meta.env.DEV,
  });

export default i18n;
