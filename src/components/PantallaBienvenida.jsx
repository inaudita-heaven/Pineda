import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function PantallaBienvenida({ onComenzar = () => {} }) {
  const { t } = useTranslation();
  const [saliendo, setSaliendo] = useState(false);

  useEffect(() => {
    const style = document.createElement('style');
    style.id = 'bienvenida-hover';
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&display=swap');
      .bienvenida-boton:hover { background-color: #333 !important; }
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
      <div style={{
        ...styles.contenedor,
        transform: saliendo ? 'translateY(20px)' : 'translateY(0)',
      }}>

        {/* Retrato — sin marco */}
        <div style={styles.retratoWrap}>
          <img src="/images/autopineda.png" alt="Rafael Pineda" style={styles.retrato} />
        </div>

        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.titulo}>{t('pantalla_bienvenida.titulo')}</h1>
          <p style={styles.subtitulo}>{t('app.subtitulo')}</p>
        </div>

        {/* Texto Pineda */}
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
          <button className="bienvenida-boton" onClick={comenzar} style={styles.boton}>
            {t('pantalla_bienvenida.boton_comenzar')}
          </button>
        </div>

      </div>
    </div>
  );
}

const PLAYFAIR = '"Playfair Display", "IM Fell English", Georgia, serif';

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
    fontFamily: PLAYFAIR,
    transition: 'opacity 0.4s ease',
    padding: '2rem 1rem',
  },
  contenedor: {
    maxWidth: '620px',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
    transition: 'transform 0.4s ease',
    paddingBottom: '3rem',
  },
  retratoWrap: {
    textAlign: 'center',
    paddingTop: '1rem',
  },
  retrato: {
    width: '180px',
    height: 'auto',
    objectFit: 'contain',
    display: 'block',
    margin: '0 auto',
  },
  header: {
    textAlign: 'center',
    paddingBottom: '2rem',
    borderBottom: '2px solid #0F0E0D',
  },
  titulo: {
    fontFamily: PLAYFAIR,
    fontSize: 'clamp(1.6rem, 6vw, 2.8rem)',
    fontWeight: '400',
    margin: 0,
    letterSpacing: '0.05em',
    color: '#0F0E0D',
    lineHeight: '1.15',
  },
  subtitulo: {
    fontFamily: PLAYFAIR,
    fontSize: '0.9rem',
    fontStyle: 'italic',
    color: 'rgba(15,14,13,0.5)',
    margin: '0.75rem 0 0 0',
    letterSpacing: '0.04em',
  },
  textoContenedor: {
    padding: '0.5rem 0',
  },
  parrafo: {
    fontFamily: PLAYFAIR,
    fontSize: 'clamp(0.95rem, 2.5vw, 1.05rem)',
    lineHeight: '1.85',
    color: 'rgba(15,14,13,0.8)',
    margin: 0,
    fontWeight: '400',
  },
  footer: {
    textAlign: 'center',
    borderTop: '2px solid #0F0E0D',
    paddingTop: '2rem',
  },
  boton: {
    padding: '1.1rem 3rem',
    backgroundColor: '#0F0E0D',
    color: '#fff',
    border: 'none',
    fontSize: '0.72rem',
    fontWeight: '400',
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    cursor: 'pointer',
    fontFamily: PLAYFAIR,
    transition: 'background-color 0.2s ease',
  },
};
