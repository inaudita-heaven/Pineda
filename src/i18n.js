/**
 * i18n.js — Configuración de i18next para Ruta Expo Pineda
 *
 * Librería:   i18next + react-i18next + i18next-browser-languagedetector
 * Idiomas:    ES (base) · EN · FR · DE
 * Fallback:   es
 * Detección:  idioma del navegador/móvil → localStorage → fallback es
 *
 * Importar UNA vez en main.jsx: import './i18n'
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Traducciones importadas como módulos estáticos (sin lazy-load: son pequeñas)
import es from './locales/es.json';
import en from './locales/en.json';
import fr from './locales/fr.json';
import de from './locales/de.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    // ── Recursos ────────────────────────────────────────────────────────────
    resources: {
      es: { translation: es },
      en: { translation: en },
      fr: { translation: fr },
      de: { translation: de },
    },

    // ── Idioma por defecto y fallback ────────────────────────────────────────
    fallbackLng: 'es',
    supportedLngs: ['es', 'en', 'fr', 'de'],

    // ── Detección automática ─────────────────────────────────────────────────
    // Orden: localStorage → navigator → html lang attr → fallback
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'pineda_lang',
    },

    // ── Interpolación ────────────────────────────────────────────────────────
    interpolation: {
      escapeValue: false, // React ya escapa por defecto
    },

    // ── Producción: sin logs ──────────────────────────────────────────────────
    debug: import.meta.env.DEV,
  });

export default i18n;
