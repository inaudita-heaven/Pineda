import React from 'react';
import { useTranslation } from 'react-i18next';
import { stops, isStopOpen, getNextOpenTime } from '../data/stops';
import { getObrasByParada } from '../data/catalog';
import { checkCouponEligibility } from '../lib/coupon';
import ProgresoCupon from './ProgresoCupon';

const PLAYFAIR = '"Playfair Display","IM Fell English",Georgia,serif';
const SANS = '"Rubik",system-ui,sans-serif';

// Logos de las 3 salas principales
const LOGOS = {
  1:  '/logos/logoviana.png',
  4:  '/logos/logo-casa12pb.png.png',
  13: '/logos/INA_Branding_Negro.png',
};

export default function PestañaRuta({ visitedStops, onEscanear, onVerCupon, onVerCatalogoSala = () => {} }) {
  const { t } = useTranslation();
  const ahora = new Date();

  return (
    <div style={styles.wrap}>

      {/* Header */}
      <div style={styles.header}>
        <p style={styles.headerEyebrow}>Rafael Pineda · Pintor de Córdoba</p>
        <h1 style={styles.headerTitulo}>{t('app.titulo')}</h1>
      </div>

      {/* Progreso cupón */}
      <div style={styles.progreso}>
        <ProgresoCupon
          visitedStopIds={visitedStops}
          onVerCupon={onVerCupon}
        />
      </div>

      {/* Lista de paradas */}
      <div style={styles.lista}>
        {stops.map(stop => {
          const sellada   = visitedStops.includes(stop.id);
          const abierta   = isStopOpen(stop, ahora);
          const proxima   = abierta === false ? getNextOpenTime(stop, ahora) : null;
          const obras     = getObrasByParada(stop.id);
          const obraPreview = obras.find(o => o.imageUrl) ?? null;

          return (
            <TarjetaParada
              key={stop.id}
              stop={stop}
              sellada={sellada}
              abierta={abierta}
              proximaApertura={proxima}
              obraPreview={obraPreview}
              onEscanear={() => onEscanear(stop.id)}
              onVerCatalogo={() => onVerCatalogoSala(stop)}
              t={t}
            />
          );
        })}
      </div>

      {/* Espacio para la NavBar */}
      <div style={{ height: '72px' }} />
    </div>
  );
}

function TarjetaParada({ stop, sellada, abierta, proximaApertura, obraPreview, onEscanear, onVerCatalogo, t }) {
  const [imgErr, setImgErr] = React.useState(false);
  const esExposicion = stop.required;
  const logo = LOGOS[stop.id];

  return (
    <div style={{
      ...styles.tarjeta,
      backgroundColor: sellada ? '#f9f8f7' : '#fff',
      borderLeft: esExposicion ? '3px solid #0F0E0D' : '3px solid #e8e6e3',
    }}>

      {/* Fila superior */}
      <div style={styles.tarjetaTop}>

        {/* Número */}
        <span style={styles.tarjetaNum}>{stop.id}</span>

        {/* Info principal */}
        <div style={styles.tarjetaInfo}>
          <div style={styles.tarjetaFila}>
            <p style={styles.tarjetaNombre}>
              {t(`paradas_nombres.p${stop.id}`)}
            </p>
            {esExposicion && (
              <span style={styles.badgeExpo}>Exposición</span>
            )}
          </div>
          <p style={styles.tarjetaDireccion}>{stop.address}</p>

          {/* Estado horario */}
          {stop.hoursUnconfirmed ? (
            <p style={styles.horarioGris}>Horario por confirmar</p>
          ) : abierta === true ? (
            <p style={styles.horarioAbierto}>● Abierta ahora</p>
          ) : abierta === false ? (
            <p style={styles.horarioCerrado}>
              ● Cerrada{proximaApertura ? ` · Abre a las ${proximaApertura}` : ''}
            </p>
          ) : null}
        </div>

        {/* Logo sala o preview obra */}
        {esExposicion && logo && (
          <img
            src={logo}
            alt=""
            style={styles.logoSala}
          />
        )}
      </div>

      {/* Preview obra (solo salas de exposición con obras) */}
      {esExposicion && obraPreview && !imgErr && (
        <div style={styles.previewWrap} onClick={onVerCatalogo}>
          <img
            src={obraPreview.imageUrl}
            alt={obraPreview.title}
            style={styles.previewImg}
            onError={() => setImgErr(true)}
          />
          <div style={styles.previewOverlay}>
            <p style={styles.previewTitulo}>{obraPreview.title}</p>
            <p style={styles.previewCta}>Ver todas las obras →</p>
          </div>
        </div>
      )}

      {/* Botones */}
      <div style={styles.tarjetaBotones}>
        {sellada ? (
          <span style={styles.sellada}>✓ Sellada</span>
        ) : (
          <button onClick={onEscanear} style={styles.btnEscanear}>
            {t('parada.boton_escanear')}
          </button>
        )}
        <a
          href={stop.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={styles.btnMaps}
        >
          {t('parada.ir_aqui')}
        </a>
      </div>

    </div>
  );
}

const styles = {
  wrap: { backgroundColor: '#fff', minHeight: '100dvh' },
  header: {
    padding: '1.5rem 1.25rem 1rem',
    borderBottom: '2px solid #0F0E0D',
  },
  headerEyebrow: {
    fontFamily: SANS,
    fontSize: '0.62rem',
    letterSpacing: '0.16em',
    textTransform: 'uppercase',
    color: 'rgba(15,14,13,0.35)',
    margin: '0 0 0.25rem',
  },
  headerTitulo: {
    fontFamily: PLAYFAIR,
    fontSize: 'clamp(1.2rem,4vw,1.6rem)',
    fontWeight: '400',
    color: '#0F0E0D',
    margin: 0,
    lineHeight: 1.2,
  },
  progreso: { padding: '0.75rem 1.25rem', borderBottom: '1px solid #e8e6e3' },
  lista: { display: 'flex', flexDirection: 'column' },
  tarjeta: {
    padding: '1rem 1.25rem',
    borderBottom: '1px solid #e8e6e3',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  tarjetaTop: { display: 'flex', gap: '0.75rem', alignItems: 'flex-start' },
  tarjetaNum: {
    fontFamily: PLAYFAIR,
    fontSize: '1.4rem',
    fontWeight: '400',
    color: 'rgba(15,14,13,0.2)',
    lineHeight: 1,
    minWidth: '1.8rem',
    flexShrink: 0,
  },
  tarjetaInfo: { flex: 1 },
  tarjetaFila: { display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' },
  tarjetaNombre: {
    fontFamily: PLAYFAIR,
    fontSize: '1rem',
    fontWeight: '400',
    color: '#0F0E0D',
    margin: 0,
    lineHeight: 1.3,
  },
  badgeExpo: {
    fontFamily: SANS,
    fontSize: '0.58rem',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: '#0F0E0D',
    border: '1px solid #0F0E0D',
    padding: '0.1rem 0.45rem',
    flexShrink: 0,
  },
  tarjetaDireccion: {
    fontFamily: SANS,
    fontSize: '0.72rem',
    color: 'rgba(15,14,13,0.45)',
    margin: '0.2rem 0 0',
    fontWeight: '300',
  },
  horarioAbierto: {
    fontFamily: SANS, fontSize: '0.68rem',
    color: '#2d6e46', margin: '0.3rem 0 0',
  },
  horarioCerrado: {
    fontFamily: SANS, fontSize: '0.68rem',
    color: '#8c2525', margin: '0.3rem 0 0',
  },
  horarioGris: {
    fontFamily: SANS, fontSize: '0.68rem',
    color: 'rgba(15,14,13,0.35)', margin: '0.3rem 0 0',
  },
  logoSala: {
    height: '64px',
    maxWidth: '160px',
    objectFit: 'contain',
    flexShrink: 0,
    opacity: 0.9,
  },
  previewWrap: {
    position: 'relative',
    width: '100%',
    height: '140px',
    overflow: 'hidden',
    cursor: 'pointer',
    borderRadius: '1px',
  },
  previewImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
  previewOverlay: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    background: 'linear-gradient(transparent, rgba(15,14,13,0.75))',
    padding: '1rem 0.75rem 0.6rem',
  },
  previewTitulo: {
    fontFamily: PLAYFAIR,
    fontStyle: 'italic',
    fontSize: '0.85rem',
    color: '#fff',
    margin: '0 0 0.1rem',
  },
  previewCta: {
    fontFamily: SANS,
    fontSize: '0.62rem',
    letterSpacing: '0.08em',
    color: 'rgba(255,255,255,0.7)',
    margin: 0,
    textTransform: 'uppercase',
  },
  tarjetaBotones: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap' },
  sellada: {
    fontFamily: SANS,
    fontSize: '0.7rem',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: 'rgba(15,14,13,0.5)',
    display: 'flex',
    alignItems: 'center',
  },
  btnEscanear: {
    fontFamily: SANS,
    fontSize: '0.7rem',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    padding: '0.5rem 1rem',
    backgroundColor: '#0F0E0D',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
  },
  btnMaps: {
    fontFamily: SANS,
    fontSize: '0.7rem',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    padding: '0.5rem 0.9rem',
    backgroundColor: 'transparent',
    color: 'rgba(15,14,13,0.5)',
    border: '1px solid #e8e6e3',
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
  },
};
