/**
 * PantallaBienvenida.jsx
 * Pantalla de bienvenida — se muestra antes de la lista de paradas.
 * Explica la ruta, el premio y presenta las 3 salas obligatorias.
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector';

const SERIF = '"IM Fell English", "Cormorant Garamond", Georgia, serif';
const SANS  = 'system-ui, -apple-system, sans-serif';

export default function PantallaBienvenida({ onComenzar }) {
  const { t } = useTranslation();

  return (
    <div style={s.root}>
      <LanguageSelector variant="floating" />

      <div style={s.inner}>

        <p style={s.eyebrow}>{t('bienvenida.eyebrow')}</p>

        <div style={s.portrait} aria-hidden="true">
          <span style={s.portraitLetras}>R.P.</span>
        </div>

        <h1 style={s.titulo}>
          Rafael Pineda<br />
          <span style={s.tituloSub}>{t('bienvenida.pintor')}</span>
        </h1>

        <p style={s.lead}>{t('bienvenida.lead')}</p>

        {/* Tres salas */}
        <div style={s.salas}>
          {[
            { num: 'I',    key: 'viana' },
            { num: 'IV',   key: 'casa12pb' },
            { num: 'XIII', key: 'inaudita' },
          ].map(({ num, key }) => (
            <div key={key} style={s.sala}>
              <span style={s.salaNum}>{num}</span>
              <span style={s.salaNombre}>{t(`salas.${key}_nombre`)}</span>
            </div>
          ))}
        </div>

        <p style={s.meta}>{t('bienvenida.meta')}</p>

        <div style={s.premioBox}>
          <p style={s.premioTexto}>{t('bienvenida.premio')}</p>
        </div>

        {/* Selector de idioma inline */}
        <div style={s.langWrap}>
          <LanguageSelector variant="buttons" />
        </div>

        <button style={s.boton} onClick={onComenzar}>
          {t('bienvenida.comenzar')}
        </button>

      </div>
    </div>
  );
}

const s = {
  root: {
    minHeight: '100vh',
    backgroundColor: '#fff',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    overflowY: 'auto',
  },
  inner: {
    width: '100%',
    maxWidth: '480px',
    padding: '4rem 2rem 5rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: '1.5rem',
  },
  eyebrow: {
    fontFamily: SANS,
    fontSize: '0.7rem',
    fontWeight: '600',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    color: '#aaa',
    margin: 0,
  },
  portrait: {
    width: '72px',
    height: '72px',
    border: '2px solid #000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  portraitLetras: {
    fontFamily: SERIF,
    fontSize: '1.4rem',
    letterSpacing: '4px',
    color: '#000',
  },
  titulo: {
    fontFamily: SERIF,
    fontSize: 'clamp(1.8rem, 7vw, 2.8rem)',
    fontWeight: '400',
    margin: 0,
    letterSpacing: '1.5px',
    lineHeight: 1.15,
  },
  tituloSub: {
    fontSize: 'clamp(1.1rem, 4vw, 1.6rem)',
    fontStyle: 'italic',
    letterSpacing: '0.5px',
  },
  lead: {
    fontFamily: SERIF,
    fontSize: '1rem',
    fontStyle: 'italic',
    lineHeight: 1.8,
    color: '#444',
    margin: 0,
    maxWidth: '380px',
  },
  salas: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
    borderTop: '2px solid #000',
    borderBottom: '2px solid #000',
    padding: '1rem 0',
  },
  sala: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
  },
  salaNum: {
    fontFamily: SERIF,
    fontSize: '1.1rem',
    color: '#aaa',
    minWidth: '3.5rem',
    textAlign: 'right',
  },
  salaNombre: {
    fontFamily: SERIF,
    fontSize: '1rem',
    color: '#000',
    textAlign: 'left',
  },
  meta: {
    fontFamily: SANS,
    fontSize: '0.78rem',
    color: '#888',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    margin: 0,
  },
  premioBox: {
    border: '1px solid #000',
    padding: '0.85rem 1.25rem',
    width: '100%',
    maxWidth: '380px',
  },
  premioTexto: {
    fontFamily: SERIF,
    fontSize: '0.95rem',
    margin: 0,
    lineHeight: 1.5,
  },
  langWrap: {
    marginTop: '0.5rem',
  },
  boton: {
    fontFamily: SANS,
    fontSize: '0.9rem',
    fontWeight: '600',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    padding: '1.1rem 2.5rem',
    backgroundColor: '#000',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    width: '100%',
    maxWidth: '380px',
    minHeight: '52px',
  },
};
