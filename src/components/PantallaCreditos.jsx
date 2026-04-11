import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * PantallaCreditos
 * Splash de créditos al primer arranque de la app.
 * Se muestra una sola vez — estado guardado en localStorage.
 *
 * Props:
 *   onClose  callback cuando cierra (auto a los 5s o por click)
 */
export default function PantallaCreditos({ onClose = () => {} }) {
  const { t } = useTranslation();
  const [saliendo, setSaliendo] = useState(false);

  // Auto-cierre a los 5 segundos
  useEffect(() => {
    const timer = setTimeout(() => cerrar(), 5000);
    return () => clearTimeout(timer);
  }, []);

  const cerrar = () => {
    if (saliendo) return;
    setSaliendo(true);
    setTimeout(() => {
      localStorage.setItem('creditos_visto', 'true');
      onClose();
    }, 300);
  };

  // Nombres de los 10 participantes — desde paradas_nombres
  const participantes = [
    t('paradas_nombres.p2'),   // Taberna Santa Marina
    t('paradas_nombres.p3'),   // Taberna La Fuenseca
    t('paradas_nombres.p5'),   // Taberna San Miguel
    t('paradas_nombres.p6'),   // Taberna El Olmo
    t('paradas_nombres.p7'),   // Casa Salinas
    t('paradas_nombres.p8'),   // Posada del Caballo Blanco
    t('paradas_nombres.p9'),   // Puerta de Sevilla
    t('paradas_nombres.p10'),  // Taberna La Viuda
    t('paradas_nombres.p11'),  // La Tasquería
    t('paradas_nombres.p12'),  // La Cazuela de la Espartería
  ];

  return (
    <div style={{ ...styles.overlay, opacity: saliendo ? 0 : 1 }}>
      <div
        style={{
          ...styles.modal,
          transform: saliendo ? 'scale(0.97)' : 'scale(1)',
        }}
      >
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.titulo}>{t('pantalla_bienvenida.titulo')}</h1>
          <p style={styles.subtitulo}>{t('app.subtitulo')}</p>
        </div>

        {/* Cuerpo: créditos */}
        <div style={styles.contenido}>
          <h2 style={styles.h2}>{t('creditos.titulo')}</h2>

          {/* Produce */}
          <div style={styles.seccion}>
            <h3 style={styles.h3}>{t('creditos.produce')}</h3>
            <div style={styles.logos}>
              <div style={styles.logoBox}>
                <span style={styles.logoTexto}>La Inaudita</span>
              </div>
            </div>
          </div>

          {/* Colaboran */}
          <div style={styles.seccion}>
            <h3 style={styles.h3}>{t('creditos.colaboran')}</h3>
            <div style={styles.logos}>
              <div style={styles.logoBox}>
                <span style={styles.logoTexto}>{t('paradas_nombres.p1')}</span>
              </div>
              <div style={styles.logoBox}>
                <span style={styles.logoTexto}>{t('paradas_nombres.p4')}</span>
              </div>
            </div>
          </div>

          {/* Participan */}
          <div style={styles.seccion}>
            <h3 style={styles.h3}>{t('creditos.participan')}</h3>
            <div style={styles.listaParticipantes}>
              {participantes.map((nombre, i) => (
                <p key={i} style={styles.participa}>{nombre}</p>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <p style={styles.periodo}>{t('app.subtitulo')}</p>
          <button onClick={cerrar} style={styles.boton}>
            {t('pantalla_bienvenida.boton_comenzar')}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Estilos — estética Ansorena ───────────────────────────────────────────────
const styles = {
  overlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.9)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    overflowY: 'auto',
    zIndex: 9998,
    fontFamily: '"IM Fell English", "Cormorant Garamond", serif',
    transition: 'opacity 0.3s ease',
    padding: '2rem 1rem',
  },

  modal: {
    backgroundColor: '#fff',
    padding: '3rem',
    maxWidth: '600px',
    width: '100%',
    boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
    transition: 'transform 0.3s ease',
    marginBottom: '2rem',
  },

  header: {
    textAlign: 'center',
    marginBottom: '3rem',
    borderBottom: '2px solid #000',
    paddingBottom: '2rem',
  },

  titulo: {
    fontSize: 'clamp(1.8rem, 6vw, 2.8rem)',
    fontWeight: '400',
    margin: 0,
    letterSpacing: '2px',
    color: '#000',
  },

  subtitulo: {
    fontSize: '1rem',
    fontStyle: 'italic',
    color: '#666',
    margin: '0.5rem 0 0 0',
    letterSpacing: '1px',
  },

  contenido: {
    marginBottom: '2rem',
  },

  h2: {
    fontSize: '1.2rem',
    fontWeight: '400',
    textAlign: 'center',
    marginBottom: '2.5rem',
    color: '#333',
    textTransform: 'uppercase',
    letterSpacing: '2px',
    fontFamily: 'system-ui, sans-serif',
  },

  seccion: {
    marginBottom: '2.5rem',
  },

  h3: {
    fontSize: '0.8rem',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '2px',
    color: '#888',
    margin: '0 0 1rem 0',
    fontFamily: 'system-ui, sans-serif',
  },

  logos: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },

  logoBox: {
    flex: '1',
    minWidth: '140px',
    padding: '1.25rem',
    border: '2px solid #000',
    textAlign: 'center',
  },

  logoTexto: {
    fontSize: '0.95rem',
    fontWeight: '600',
    color: '#000',
    display: 'block',
    fontFamily: 'system-ui, sans-serif',
  },

  listaParticipantes: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '0.5rem 1.5rem',
  },

  participa: {
    fontSize: '0.85rem',
    margin: 0,
    color: '#555',
    lineHeight: '1.4',
    fontFamily: 'system-ui, sans-serif',
  },

  footer: {
    textAlign: 'center',
    borderTop: '2px solid #000',
    paddingTop: '2rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
    alignItems: 'center',
  },

  periodo: {
    fontSize: '0.75rem',
    color: '#999',
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    margin: 0,
    fontFamily: 'system-ui, sans-serif',
  },

  boton: {
    padding: '1rem 2.5rem',
    backgroundColor: '#000',
    color: '#fff',
    border: 'none',
    fontSize: '0.9rem',
    fontWeight: '600',
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontFamily: 'system-ui, sans-serif',
  },
};
