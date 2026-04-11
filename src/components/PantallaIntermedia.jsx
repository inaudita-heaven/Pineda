import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * PantallaIntermedia
 * Se muestra entre paradas, antes de abrir Google Maps.
 *
 * Props:
 *   fromStop   number  ID parada origen (1–13)
 *   toStop     number  ID parada destino (1–13)
 *   onAbrirMaps  callback cuando se dispara la apertura de Maps
 *   onVolver     callback cuando el visitante cancela
 */
export default function PantallaIntermedia({
  fromStop,
  toStop,
  onAbrirMaps = () => {},
  onVolver   = () => {},
}) {
  const { t } = useTranslation();
  const [countdown, setCountdown] = useState(3);
  const [abriendo, setAbriendo]   = useState(false);

  // Clave del anzuelo: inicio_p1 para la primera parada, pN_pM para el resto
  const anzueloKey =
    fromStop === 0
      ? 'anzuelos.inicio_p1'
      : `anzuelos.p${fromStop}_p${toStop}`;

  // Countdown automático → abre Maps al llegar a 0
  useEffect(() => {
    if (countdown <= 0) {
      dispararMaps();
      return;
    }
    const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const dispararMaps = () => {
    if (abriendo) return;
    setAbriendo(true);
    setTimeout(() => onAbrirMaps(), 300);
  };

  return (
    <div style={styles.overlay}>
      <div style={{ ...styles.modal, opacity: abriendo ? 0 : 1 }}>

        {/* Countdown */}
        <div style={styles.countdown}>
          <div style={styles.numero}>{countdown}</div>
          <p style={styles.countdownLabel}>
            {t('pantalla_intermedia.abriendo', { segundos: countdown })}
          </p>
        </div>

        {/* Anzuelo */}
        <div style={styles.contenido}>
          <p style={styles.anzuelo}>{t(anzueloKey)}</p>
        </div>

        {/* Instrucción de retorno */}
        <div style={styles.instruccion}>
          <p style={styles.instruccionTexto}>
            {t('pantalla_intermedia.instruccion')}
          </p>
        </div>

        {/* Botones */}
        <div style={styles.botones}>
          <button
            onClick={dispararMaps}
            disabled={abriendo}
            style={{ ...styles.botonPrimario, opacity: abriendo ? 0.6 : 1 }}
          >
            {t('pantalla_intermedia.boton_ir_ahora')}
          </button>
          <button onClick={onVolver} style={styles.botonSecundario}>
            {t('pantalla_intermedia.boton_volver')}
          </button>
        </div>

      </div>
    </div>
  );
}

// ── Estilos ───────────────────────────────────────────────────────────────────
const styles = {
  overlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.85)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9997,
    fontFamily: 'system-ui, sans-serif',
    padding: '1rem',
  },

  modal: {
    backgroundColor: '#fff',
    padding: '2rem',
    maxWidth: '500px',
    width: '100%',
    boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
    transition: 'opacity 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },

  countdown: {
    textAlign: 'center',
    paddingBottom: '1.5rem',
    borderBottom: '2px solid #f0f0f0',
  },

  numero: {
    fontSize: '4rem',
    fontWeight: 'bold',
    color: '#000',
    margin: 0,
    lineHeight: '1',
    fontFamily: '"IM Fell English", Georgia, serif',
  },

  countdownLabel: {
    fontSize: '0.85rem',
    color: '#666',
    margin: '0.5rem 0 0 0',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },

  contenido: {
    padding: '0.5rem 0',
  },

  anzuelo: {
    fontSize: '1.1rem',
    lineHeight: '1.7',
    color: '#333',
    fontStyle: 'italic',
    margin: 0,
    textAlign: 'center',
    fontFamily: '"IM Fell English", "Cormorant Garamond", Georgia, serif',
  },

  instruccion: {
    backgroundColor: '#f8f8f8',
    borderLeft: '3px solid #000',
    padding: '1rem',
  },

  instruccionTexto: {
    fontSize: '0.95rem',
    color: '#555',
    margin: 0,
    lineHeight: '1.5',
  },

  botones: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },

  botonPrimario: {
    padding: '1rem',
    backgroundColor: '#000',
    color: '#fff',
    border: 'none',
    fontSize: '1rem',
    fontWeight: '600',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },

  botonSecundario: {
    padding: '1rem',
    backgroundColor: '#fff',
    color: '#333',
    border: '2px solid #000',
    fontSize: '0.95rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
};
