/**
 * PantallaIntermedia.jsx
 * Pantalla de tránsito entre paradas.
 * Muestra el destino, el anzuelo literario, cuenta atrás, y abre Google Maps.
 *
 * ⚠️ NUNCA usar window.location.href — destruye la app React.
 * Maps se abre con window.open (nueva pestaña / app nativa vía OS intent).
 * Después de abrir Maps, la app vuelve a la lista automáticamente.
 */

import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { stops } from '../data/stops';

const SERIF = '"IM Fell English", "Cormorant Garamond", Georgia, serif';
const SANS  = 'system-ui, -apple-system, sans-serif';

export default function PantallaIntermedia({ fromStop, toStop, onAbrirMaps, onVolver }) {
  const { t }      = useTranslation();
  const [count, setCount] = useState(3);
  const timerRef   = useRef(null);

  const stopDest   = stops.find(s => s.id === toStop);
  const nombreDest = stopDest ? t(`paradas_nombres.p${stopDest.id}`) : '';

  // Anzuelo literario: clave en locales basada en la transición fromStop→toStop
  const anzueloKey = `intermedia.anzuelo_${fromStop}_${toStop}`;
  const anzuelo    = t(anzueloKey, { defaultValue: '' });

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCount(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          onAbrirMaps();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function handleIrAhora() {
    clearInterval(timerRef.current);
    onAbrirMaps();
  }

  return (
    <div style={s.root}>
      <div style={s.inner}>

        {/* Nombre destino */}
        <p style={s.destino}>{nombreDest.toUpperCase()}</p>

        {/* Instrucción principal */}
        <p style={s.instruccion}>
          {t('intermedia.instruccion')}
        </p>

        {/* Anzuelo literario */}
        {anzuelo && (
          <p style={s.anzuelo}>{anzuelo}</p>
        )}

        {/* Cuenta atrás + botón */}
        <div style={s.mapsRow}>
          <p style={s.countdown}>
            {count > 0
              ? t('intermedia.countdown', { count })
              : t('intermedia.opening')}
          </p>
          <button style={s.botonAhora} onClick={handleIrAhora}>
            {t('intermedia.go_now')}
          </button>
        </div>

        {/* Enlace volver (discreto) */}
        <button style={s.volver} onClick={onVolver}>
          {t('intermedia.volver')}
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
    alignItems: 'center',
    padding: '2rem 1.5rem',
  },
  inner: {
    width: '100%',
    maxWidth: '420px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: '2rem',
  },
  destino: {
    fontFamily: SANS,
    fontSize: '0.72rem',
    fontWeight: '700',
    letterSpacing: '3px',
    color: '#bbb',
    margin: 0,
  },
  instruccion: {
    fontFamily: SERIF,
    fontSize: 'clamp(1.3rem, 5vw, 1.8rem)',
    fontWeight: '400',
    lineHeight: 1.6,
    color: '#0F0E0D',
    margin: 0,
    whiteSpace: 'pre-line',
  },
  anzuelo: {
    fontFamily: SERIF,
    fontSize: '0.95rem',
    fontStyle: 'italic',
    lineHeight: 1.8,
    color: '#666',
    margin: 0,
    borderLeft: '2px solid #e0e0e0',
    paddingLeft: '1rem',
    textAlign: 'left',
  },
  mapsRow: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.75rem',
    paddingTop: '0.5rem',
    borderTop: '1px solid #eee',
    width: '100%',
  },
  countdown: {
    fontFamily: SANS,
    fontSize: '0.82rem',
    color: '#999',
    margin: 0,
    letterSpacing: '0.5px',
  },
  botonAhora: {
    fontFamily: SANS,
    fontSize: '0.85rem',
    fontWeight: '600',
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    padding: '0.85rem 2rem',
    backgroundColor: '#000',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    minHeight: '48px',
  },
  volver: {
    fontFamily: SANS,
    fontSize: '0.75rem',
    color: '#bbb',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    textDecoration: 'underline',
    textUnderlineOffset: '2px',
    padding: '0.5rem',
    letterSpacing: '0.5px',
  },
};
