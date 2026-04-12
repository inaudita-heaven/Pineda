/**
 * LanguageSelector.jsx
 * Selector de idioma — estética Ansorena (monocromático, discreto)
 *
 * Tres variantes controladas por la prop `variant`:
 *
 *   'buttons'   — 4 botones inline, el activo con fondo negro
 *   'dropdown'  — select nativo, minimalista, tipografía caps
 *   'floating'  — esquina superior derecha, tipo chiclet compacto
 *
 * Uso recomendado:
 *   <LanguageSelector variant="floating" />   ← en header / App principal
 *   <LanguageSelector variant="buttons" />    ← en PantallaBienvenida / onboarding
 *   <LanguageSelector variant="dropdown" />   ← en ajustes / caja
 *
 * El idioma seleccionado se persiste en localStorage bajo la clave 'pineda_lang'
 * (alineado con la detección configurada en i18n.js).
 */

import React from 'react';
import { useTranslation } from 'react-i18next';

// ── Idiomas disponibles ────────────────────────────────────────────────────────
const LANGS = [
  { code: 'es', label: 'ES', nombre: 'Español' },
  { code: 'en', label: 'EN', nombre: 'English' },
  { code: 'fr', label: 'FR', nombre: 'Français' },
  { code: 'de', label: 'DE', nombre: 'Deutsch' },
  { code: 'zh', label: '中文', nombre: '中文' },
  { code: 'ja', label: '日本語', nombre: '日本語' },
];

// ── Componente principal ───────────────────────────────────────────────────────
export default function LanguageSelector({ variant = 'floating', className = '' }) {
  const { i18n } = useTranslation();
  const current = i18n.language?.slice(0, 2) || 'es';

  const cambiar = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem('pineda_lang', code);
  };

  if (variant === 'buttons') return <ButtonsVariant current={current} onChange={cambiar} className={className} />;
  if (variant === 'dropdown') return <DropdownVariant current={current} onChange={cambiar} className={className} />;
  return <FloatingVariant current={current} onChange={cambiar} className={className} />;
}

// ── Variante 1: Buttons ────────────────────────────────────────────────────────
function ButtonsVariant({ current, onChange, className }) {
  return (
    <div style={s.buttonsWrap} className={className}>
      {LANGS.map(({ code, label }) => (
        <button
          key={code}
          onClick={() => onChange(code)}
          title={LANGS.find(l => l.code === code)?.nombre}
          style={{
            ...s.btn,
            ...(current === code ? s.btnActive : s.btnInactive),
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

// ── Variante 2: Dropdown ───────────────────────────────────────────────────────
function DropdownVariant({ current, onChange, className }) {
  return (
    <select
      value={current}
      onChange={(e) => onChange(e.target.value)}
      style={s.select}
      className={className}
      aria-label="Seleccionar idioma"
    >
      {LANGS.map(({ code, nombre }) => (
        <option key={code} value={code}>{nombre}</option>
      ))}
    </select>
  );
}

// ── Variante 3: Floating (por defecto) ────────────────────────────────────────
// Esquina superior derecha, compacto, sin banderas.
// El componente se posiciona en `fixed` — colocarlo como hijo de <App> o <body>.
function FloatingVariant({ current, onChange, className }) {
  return (
    <div style={s.floatingWrap} className={className} role="navigation" aria-label="Selector de idioma">
      {LANGS.map(({ code, label }, i) => (
        <React.Fragment key={code}>
          <button
            onClick={() => onChange(code)}
            title={LANGS.find(l => l.code === code)?.nombre}
            style={{
              ...s.floatingBtn,
              ...(current === code ? s.floatingBtnActive : {}),
            }}
            aria-current={current === code ? 'true' : undefined}
          >
            {label}
          </button>
          {i < LANGS.length - 1 && <span style={s.floatingSep}>·</span>}
        </React.Fragment>
      ))}
    </div>
  );
}

// ── Estilos — monocromático Ansorena ──────────────────────────────────────────
const FONT_SANS = 'system-ui, -apple-system, sans-serif';

const s = {
  // --- Buttons ---
  buttonsWrap: {
    display: 'flex',
    gap: '4px',
    alignItems: 'center',
  },
  btn: {
    fontFamily: FONT_SANS,
    fontSize: '0.7rem',
    fontWeight: '600',
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    padding: '0.4rem 0.75rem',
    border: '1px solid #000',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    lineHeight: 1,
  },
  btnActive: {
    backgroundColor: '#000',
    color: '#fff',
  },
  btnInactive: {
    backgroundColor: '#fff',
    color: '#000',
  },

  // --- Dropdown ---
  select: {
    fontFamily: FONT_SANS,
    fontSize: '0.75rem',
    fontWeight: '600',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    padding: '0.35rem 0.5rem',
    border: '1px solid #000',
    borderRadius: 0,
    backgroundColor: '#fff',
    color: '#000',
    cursor: 'pointer',
    appearance: 'none',
    WebkitAppearance: 'none',
    backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23000'/%3E%3C/svg%3E\")",
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 0.5rem center',
    paddingRight: '1.5rem',
  },

  // --- Floating ---
  floatingWrap: {
    position: 'fixed',
    top: '12px',
    left: '12px',
    zIndex: 10000,
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    backgroundColor: 'rgba(255,255,255,0.92)',
    backdropFilter: 'blur(4px)',
    WebkitBackdropFilter: 'blur(4px)',
    padding: '5px 8px',
    border: '1px solid rgba(0,0,0,0.12)',
  },
  floatingBtn: {
    fontFamily: FONT_SANS,
    fontSize: '0.65rem',
    fontWeight: '600',
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    padding: '2px 4px',
    border: 'none',
    backgroundColor: 'transparent',
    color: '#888',
    cursor: 'pointer',
    transition: 'color 0.15s ease',
    lineHeight: 1,
  },
  floatingBtnActive: {
    color: '#000',
    textDecoration: 'underline',
    textUnderlineOffset: '2px',
  },
  floatingSep: {
    color: '#ccc',
    fontSize: '0.6rem',
    userSelect: 'none',
  },
};
