import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function PantallaCreditos({ onClose = () => {} }) {
  const { t } = useTranslation();
  const [saliendo, setSaliendo] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => cerrar(), 7000);
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
        style={{
          ...styles.modal,
          transform: saliendo ? 'scale(0.97)' : 'scale(1)',
        }}
        onClick={e => e.stopPropagation()}
      >

        {/* Retrato Pineda */}
        <div style={styles.retratoWrap}>
          <img
            src="/images/autopineda.png"
            alt="Rafael Pineda"
            style={styles.retrato}
          />
        </div>

        {/* Produce */}
        <div style={styles.seccion}>
          <p style={styles.label}>{t('creditos.produce')}</p>
          <div style={styles.logoWrap}>
            <img
              src="/logos/INA_Branding_Negro.png"
              alt="La Inaudita"
              style={styles.logo}
            />
          </div>
        </div>

        <div style={styles.divisor} />

        {/* Colaboran */}
        <div style={styles.seccion}>
          <p style={styles.label}>{t('creditos.colaboran')}</p>
          <div style={styles.logoFila}>
            <img
              src="/logos/logoviana.png"
              alt="Palacio de Viana"
              style={styles.logoSmall}
            />
            <img
              src="/logos/logo-casa12pb.png.png"
              alt="Casa 12PB"
              style={styles.logoSmall}
            />
          </div>
        </div>

        <div style={styles.divisor} />

        {/* Participan */}
        <div style={styles.seccion}>
          <p style={styles.label}>{t('creditos.participan')}</p>
          <div style={styles.listaParticipantes}>
            {participantes.map((nombre, i) => (
              <p key={i} style={styles.participa}>{nombre}</p>
            ))}
          </div>
        </div>

        {/* Botón */}
        <div style={styles.footer}>
          <button onClick={cerrar} style={styles.boton}>
            {t('pantalla_bienvenida.boton_comenzar')}
          </button>
        </div>

      </div>
    </div>
  );
}

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
    fontFamily: '"IM Fell English", "Cormorant Garamond", serif',
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
    paddingBottom: '1.5rem',
    borderBottom: '2px solid #000',
  },
  retrato: {
    width: '140px',
    height: '140px',
    objectFit: 'cover',
    objectPosition: 'center top',
    borderRadius: '50%',
    border: '2px solid #000',
    margin: '0 auto',
    display: 'block',
  },
  seccion: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    alignItems: 'center',
    textAlign: 'center',
  },
  label: {
    fontFamily: 'system-ui, sans-serif',
    fontSize: '0.68rem',
    fontWeight: '700',
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    color: 'rgba(15,14,13,0.4)',
    margin: 0,
  },
  logoWrap: {
    display: 'flex',
    justifyContent: 'center',
  },
  logo: {
    maxHeight: '60px',
    maxWidth: '200px',
    objectFit: 'contain',
  },
  logoFila: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '2rem',
    flexWrap: 'wrap',
  },
  logoSmall: {
    maxHeight: '48px',
    maxWidth: '140px',
    objectFit: 'contain',
  },
  divisor: {
    height: '1px',
    background: '#e8e6e3',
  },
  listaParticipantes: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '0.4rem 1.5rem',
    width: '100%',
  },
  participa: {
    fontFamily: 'system-ui, sans-serif',
    fontSize: '0.82rem',
    margin: 0,
    color: 'rgba(15,14,13,0.6)',
    lineHeight: '1.4',
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
    fontSize: '0.75rem',
    fontWeight: '400',
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    cursor: 'pointer',
    fontFamily: 'system-ui, sans-serif',
  },
};
