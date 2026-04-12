import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function PantallaCreditos({ onClose = () => {} }) {
  const { t } = useTranslation();
  const [saliendo, setSaliendo] = useState(false);
  const [segundos, setSegundos] = useState(6);

  useEffect(() => {
    const intervalo = setInterval(() => {
      setSegundos(s => {
        if (s <= 1) { clearInterval(intervalo); cerrar(); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(intervalo);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const cerrar = () => {
    if (saliendo) return;
    setSaliendo(true);
    setTimeout(() => {
      localStorage.setItem('creditos_visto', 'true');
      onClose();
    }, 300);
  };

  const participantes = [
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
  ];

  return (
    <div style={{ ...styles.overlay, opacity: saliendo ? 0 : 1 }} onClick={cerrar}>
      <div
        style={{ ...styles.modal, transform: saliendo ? 'scale(0.97)' : 'scale(1)' }}
        onClick={e => e.stopPropagation()}
      >

        {/* 1. Logo La Inaudita — mismo ancho que el retrato */}
        <div style={{ width: '100%', maxWidth: '320px', margin: '0 auto 1rem' }}>
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

        {/* 5. Produce — solo texto */}
        <div style={styles.seccion}>
          <p style={styles.label}>{t('creditos.produce')}</p>
          <p style={styles.produceName}>La Inaudita</p>
        </div>

        <div style={styles.divisor} />

        {/* 6. Colaboran */}
        <div style={styles.seccion}>
          <p style={styles.label}>{t('creditos.colaboran')}</p>
          <div style={styles.logoFila}>
            <img src="/logos/logoviana.png" alt="Palacio de Viana" style={styles.logoSmall} />
            <img src="/logos/logo-casa12pb.png.png" alt="Casa 12PB" style={styles.logoSmall} />
          </div>
        </div>

        <div style={styles.divisor} />

        {/* 7. Participan */}
        <div style={styles.seccion}>
          <p style={styles.label}>{t('creditos.participan')}</p>
          <div style={styles.listaParticipantes}>
            {participantes.map((nombre, i) => (
              <p key={i} style={styles.participa}>{nombre}</p>
            ))}
          </div>
        </div>

        {/* 8. Botón con cuenta atrás */}
        <div style={styles.footer}>
          <button onClick={cerrar} style={styles.boton}>
            {t('pantalla_bienvenida.boton_comenzar')} · {segundos}s
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
    backgroundColor: 'rgba(0,0,0,0.92)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    overflowY: 'auto',
    zIndex: 9998,
    fontFamily: PLAYFAIR,
    transition: 'opacity 0.3s ease',
    padding: '2rem 1rem',
  },
  modal: {
    backgroundColor: '#fff',
    padding: '2.5rem 2rem',
    maxWidth: '540px',
    width: '100%',
    transition: 'transform 0.3s ease',
    marginBottom: '2rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
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
    fontSize: 'clamp(1.1rem, 4vw, 1.4rem)',
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
  seccion: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    alignItems: 'center',
    textAlign: 'center',
  },
  label: {
    fontFamily: PLAYFAIR,
    fontSize: '0.7rem',
    fontWeight: '400',
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    color: 'rgba(15,14,13,0.4)',
    margin: 0,
  },
  produceName: {
    fontFamily: PLAYFAIR,
    fontSize: '1rem',
    fontWeight: '400',
    color: '#0F0E0D',
    margin: 0,
    letterSpacing: '0.05em',
  },
  logoFila: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '3rem',
  },
  logoSmall: {
    height: '60px',
    maxWidth: '160px',
    objectFit: 'contain',
    opacity: 0.85,
  },
  divisor: {
    height: '1px',
    background: '#e8e6e3',
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
  footer: {
    textAlign: 'center',
    paddingTop: '0.5rem',
    borderTop: '1px solid #e8e6e3',
  },
  boton: {
    padding: '0.85rem 2.5rem',
    backgroundColor: '#0F0E0D',
    color: '#fff',
    border: 'none',
    fontSize: '0.72rem',
    fontWeight: '400',
    letterSpacing: '0.16em',
    textTransform: 'uppercase',
    cursor: 'pointer',
    fontFamily: PLAYFAIR,
  },
};
