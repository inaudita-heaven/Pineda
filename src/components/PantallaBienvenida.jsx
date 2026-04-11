import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * PantallaBienvenida
 * Se muestra tras PantallaCreditos, antes de la app principal.
 *
 * Props:
 *   onComenzar  callback cuando el visitante pulsa "Comenzar la ruta"
 */
export default function PantallaBienvenida({ onComenzar = () => {} }) {
  const { t } = useTranslation();
  const [saliendo, setSaliendo] = useState(false);

  // Hover dinámico — inyectado en useEffect, no a nivel de módulo
  useEffect(() => {
    const style = document.createElement('style');
    style.id = 'bienvenida-hover';
    style.textContent = `
      .bienvenida-boton:hover {
        background-color: #333 !important;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      }
    `;
    if (!document.getElementById('bienvenida-hover')) {
      document.head.appendChild(style);
    }
    return () => {
      const el = document.getElementById('bienvenida-hover');
      if (el) el.remove();
    };
  }, []);

  const comenzar = () => {
    setSaliendo(true);
    setTimeout(() => onComenzar(), 300);
  };

  return (
    <div style={{ ...styles.overlay, opacity: saliendo ? 0 : 1 }}>
      <div
        style={{
          ...styles.contenedor,
          transform: saliendo ? 'translateY(20px)' : 'translateY(0)',
        }}
      >
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.titulo}>{t('pantalla_bienvenida.titulo')}</h1>
          <p style={styles.subtitulo}>{t('app.subtitulo')}</p>
        </div>

        {/* Texto Pineda — multiidioma */}
        <div style={styles.textoContenedor}>
          {t('pantalla_bienvenida.texto_pineda')
            .split('\n\n')
            .map((parrafo, i) => (
              <p key={i} style={{ ...styles.parrafo, marginBottom: i < 3 ? '1.2em' : 0 }}>
                {parrafo}
              </p>
            ))}
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <p style={styles.periodo}>{t('app.subtitulo')}</p>
          <button
            className="bienvenida-boton"
            onClick={comenzar}
            style={styles.boton}
          >
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
    backgroundColor: '#ffffff',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    overflowY: 'auto',
    zIndex: 9999,
    fontFamily: '"IM Fell English", "Cormorant Garamond", Georgia, serif',
    transition: 'opacity 0.4s ease',
    padding: '2rem 1rem',
  },

  contenedor: {
    maxWidth: '680px',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
    transition: 'transform 0.4s ease',
    paddingBottom: '2rem',
  },

  header: {
    textAlign: 'center',
    paddingBottom: '2rem',
    borderBottom: '3px solid #000',
  },

  titulo: {
    fontSize: 'clamp(2rem, 8vw, 3.5rem)',
    fontWeight: '400',
    margin: 0,
    letterSpacing: '2px',
    color: '#000',
    lineHeight: '1',
  },

  subtitulo: {
    fontSize: 'clamp(0.9rem, 3vw, 1.1rem)',
    fontStyle: 'italic',
    color: '#555',
    margin: '0.75rem 0 0 0',
    letterSpacing: '1px',
    fontWeight: '300',
  },

  textoContenedor: {
    padding: '1rem 0',
  },

  parrafo: {
    fontSize: 'clamp(0.95rem, 2.5vw, 1.1rem)',
    lineHeight: '1.8',
    color: '#333',
    margin: 0,
    textAlign: 'justify',
    fontWeight: '300',
    letterSpacing: '0.3px',
  },

  footer: {
    textAlign: 'center',
    borderTop: '3px solid #000',
    paddingTop: '2rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    alignItems: 'center',
  },

  periodo: {
    fontSize: '0.8rem',
    color: '#888',
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    margin: 0,
    fontWeight: '600',
    fontFamily: 'system-ui, sans-serif',
  },

  boton: {
    padding: '1.25rem 3rem',
    backgroundColor: '#000',
    color: '#fff',
    border: 'none',
    fontSize: 'clamp(0.85rem, 2vw, 1rem)',
    fontWeight: '600',
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontFamily: 'system-ui, sans-serif',
  },
};
