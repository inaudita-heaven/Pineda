import React from 'react';
import { useTranslation } from 'react-i18next';

const SERIF = '"Playfair Display","IM Fell English",Georgia,serif';
const SANS  = '"Rubik",system-ui,sans-serif';

/**
 * PantallaIntermedia
 * Se muestra al pulsar "Cómo llegar" entre paradas.
 *
 * Props:
 *   fromStop    number   ID parada origen
 *   toStop      number   ID parada destino
 *   onAbrirMaps callback abre Google Maps (nueva pestaña / app nativa)
 *   onVolver    callback vuelve a la lista de paradas
 */
export default function PantallaIntermedia({
  fromStop,
  toStop,
  onAbrirMaps = () => {},
  onVolver    = () => {},
}) {
  const { t } = useTranslation();

  const anzueloKey = fromStop === 0
    ? 'anzuelos.inicio_p1'
    : `anzuelos.p${fromStop}_p${toStop}`;

  const destino = t(`paradas_nombres.p${toStop}`);

  return (
    <div style={s.overlay}>
      <div style={s.panel}>

        {/* Destino */}
        <div style={s.header}>
          <p style={s.eyebrow}>{t('pantalla_intermedia.siguiente_parada')}</p>
          <h2 style={s.destino}>{destino}</h2>
        </div>

        {/* Anzuelo */}
        <p style={s.anzuelo}>{t(anzueloKey)}</p>

        {/* Instrucción de retorno */}
        <p style={s.instruccion}>{t('pantalla_intermedia.instruccion')}</p>

        {/* Botones */}
        <div style={s.botones}>
          <button onClick={onAbrirMaps} style={s.btnMaps}>
            {t('pantalla_intermedia.boton_maps')}
          </button>
          <button onClick={onVolver} style={s.btnVolver}>
            {t('pantalla_intermedia.boton_volver')}
          </button>
        </div>

      </div>
    </div>
  );
}

const s = {
  overlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9997,
    padding: '2rem 1.5rem',
    overflowY: 'auto',
  },
  panel: {
    width: '100%',
    maxWidth: '480px',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.75rem',
  },
  header: {
    borderBottom: '2px solid #0F0E0D',
    paddingBottom: '1.25rem',
  },
  eyebrow: {
    fontFamily: SANS,
    fontSize: '0.62rem',
    letterSpacing: '0.16em',
    textTransform: 'uppercase',
    color: 'rgba(15,14,13,0.4)',
    margin: '0 0 0.4rem',
  },
  destino: {
    fontFamily: SERIF,
    fontSize: 'clamp(1.5rem, 5vw, 2.2rem)',
    fontWeight: '400',
    color: '#0F0E0D',
    margin: 0,
    lineHeight: 1.15,
  },
  anzuelo: {
    fontFamily: SERIF,
    fontSize: 'clamp(1rem, 3.5vw, 1.2rem)',
    fontStyle: 'italic',
    lineHeight: 1.75,
    color: '#0F0E0D',
    margin: 0,
  },
  instruccion: {
    fontFamily: SANS,
    fontSize: '0.8rem',
    color: 'rgba(15,14,13,0.5)',
    lineHeight: 1.6,
    margin: 0,
    paddingLeft: '0.85rem',
    borderLeft: '2px solid #e8e6e3',
  },
  botones: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.65rem',
    marginTop: '0.5rem',
  },
  btnMaps: {
    fontFamily: SANS,
    fontSize: '0.78rem',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    fontWeight: '500',
    padding: '1rem',
    backgroundColor: '#0F0E0D',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    minHeight: '48px',
  },
  btnVolver: {
    fontFamily: SANS,
    fontSize: '0.75rem',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    padding: '0.9rem',
    backgroundColor: 'transparent',
    color: 'rgba(15,14,13,0.5)',
    border: '1px solid #e8e6e3',
    cursor: 'pointer',
    minHeight: '48px',
  },
};
