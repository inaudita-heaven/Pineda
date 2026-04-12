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

        {/* 1. Logo La Inaudita — mismo ancho que el retrato */}
        <div style={{ width: '100%', maxWidth: '320px', margin: '0 auto 0' }}>
          <img
            src="/logos/INA_Branding_Negro.png"
            alt="La Inaudita"
            style={{ width: '100%', objectFit: 'contain', opacity: 0.9 }}
          />
        </div>

        {/* 2. Retrato */}
        <div style={styles.retratoWrap}>
          <img src="/images/autopineda.png" alt="Rafael Pineda" style={styles.retrato} />
        </div>

        {/* 3. Título */}
        <p style={styles.titulo}>
          Rafael Pineda,<br />pintor de Córdoba
        </p>

        {/* 4. Fecha */}
        <p style={styles.fecha}>15 abril · 30 mayo</p>

        {/* 5. Texto literario */}
        <div style={styles.textoContenedor}>
          {t('pantalla_bienvenida.texto_pineda')
            .split('\n\n')
            .map((parrafo, i) => (
              <p key={i} style={{ ...styles.parrafo, marginBottom: i < 3 ? '1.2em' : 0 }}>
                {parrafo}
              </p>
            ))}
        </div>

        {/* 6. Colaboran */}
        <div>
          <p style={styles.labelColaboran}>Colaboran</p>
          <div style={styles.logoFila}>
            <img src="/logos/logoviana.png" alt="Palacio de Viana" style={styles.logoSmall} />
            <img src="/logos/logo-casa12pb.png.png" alt="Casa 12PB" style={styles.logoSmall} />
          </div>
        </div>

        <div style={styles.divisor} />

        {/* 7. Participan */}
        <div style={styles.seccionParticipan}>
          <p style={styles.labelParticipan}>{t('creditos.participan')}</p>
          <div style={styles.listaParticipantes}>
            {[
              t('paradas_nombres.p2'),
              t('paradas_nombres.p3'),
              t('paradas_nombres.p5'),
              t('paradas_nombres.p6'),
              t('paradas_nombres.p7'),
              t('paradas_nombres.p8'),
              t('paradas_nombres.p9'),
              t('paradas_nombres.p10'),
              t('paradas_nombres.p11'),
              t('paradas_nombres.p12'),
            ].map((nombre, i) => (
              <p key={i} style={styles.participa}>{nombre}</p>
            ))}
          </div>
        </div>

        {/* 8. Botón */}
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
const SANS = '"Rubik", system-ui, sans-serif';

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
    gap: '1.5rem',
    transition: 'transform 0.4s ease',
    paddingBottom: '3rem',
  },
  retratoWrap: {
    textAlign: 'center',
  },
  retrato: {
    width: '100%',
    maxWidth: '320px',
    height: 'auto',
    objectFit: 'contain',
    display: 'block',
    margin: '0 auto',
  },
  titulo: {
    fontFamily: PLAYFAIR,
    fontSize: 'clamp(1.6rem, 6vw, 2.8rem)',
    fontWeight: '400',
    color: '#0F0E0D',
    textAlign: 'center',
    margin: '1rem 0 0.25rem',
    lineHeight: 1.3,
    textTransform: 'none',
  },
  fecha: {
    fontFamily: SANS,
    fontSize: '0.72rem',
    letterSpacing: '0.12em',
    color: 'rgba(15,14,13,0.45)',
    textAlign: 'center',
    margin: '0 0 1.5rem',
    textTransform: 'uppercase',
  },
  textoContenedor: {
    padding: '0.5rem 0',
    borderTop: '2px solid #0F0E0D',
    borderBottom: '1px solid #e8e6e3',
    paddingTop: '1.5rem',
    paddingBottom: '1.5rem',
  },
  parrafo: {
    fontFamily: PLAYFAIR,
    fontSize: 'clamp(0.95rem, 2.5vw, 1.05rem)',
    lineHeight: '1.85',
    color: 'rgba(15,14,13,0.8)',
    margin: 0,
    fontWeight: '400',
  },
  logoFila: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '3rem',
  },
  logoSmall: {
    width: '120px',
    height: 'auto',
    objectFit: 'contain',
    opacity: 0.85,
  },
  divisor: {
    height: '1px',
    background: '#e8e6e3',
  },
  seccionParticipan: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    alignItems: 'center',
    textAlign: 'center',
  },
  labelParticipan: {
    fontFamily: SANS,
    fontSize: '0.62rem',
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    color: 'rgba(15,14,13,0.4)',
    textAlign: 'center',
    margin: 0,
  },
  listaParticipantes: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '0.5rem 1.5rem',
    width: '100%',
  },
  participa: {
    fontFamily: PLAYFAIR,
    fontSize: '0.78rem',
    fontWeight: '400',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    margin: 0,
    color: 'rgba(15,14,13,0.65)',
    lineHeight: '1.5',
    textAlign: 'left',
  },
  labelColaboran: {
    fontFamily: SANS,
    fontSize: '0.62rem',
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    color: 'rgba(15,14,13,0.4)',
    textAlign: 'center',
    margin: '0 0 0.75rem',
  },
  footer: {
    textAlign: 'center',
    borderTop: '1px solid #e8e6e3',
    paddingTop: '1.5rem',
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
