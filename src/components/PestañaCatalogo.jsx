import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { catalog } from '../data/catalog';
import { stops } from '../data/stops';

const PLAYFAIR = '"Playfair Display","IM Fell English",Georgia,serif';
const SANS = '"Rubik",system-ui,sans-serif';

const SALAS_PRINCIPALES = [1, 4, 13];
const LOGOS = {
  1:  '/logos/logoviana.png',
  4:  '/logos/logo-casa12pb.png.png',
  13: '/logos/INA_Branding_Negro.png',
};

export default function PestañaCatalogo({ onVerSala }) {
  const { t } = useTranslation();
  const [filtro, setFiltro] = useState('todas');

  // Agrupar obras por paradaId
  const grupos = stops
    .filter(s => filtro === 'todas' || s.id === parseInt(filtro))
    .map(stop => ({
      stop,
      obras: catalog.filter(o => o.paradaId === stop.id),
    }))
    .filter(g => g.obras.length > 0);

  return (
    <div style={styles.wrap}>

      {/* Header fijo */}
      <div style={styles.header}>
        <p style={styles.eyebrow}>Rafael Pineda · 49 obras</p>
        <h1 style={styles.titulo}>{t('catalogo.titulo')}</h1>

        {/* Filtros por sala */}
        <div style={styles.filtros}>
          <button
            onClick={() => setFiltro('todas')}
            style={{ ...styles.filtroBtn, ...(filtro === 'todas' ? styles.filtroBtnActivo : {}) }}
          >
            Todas
          </button>
          {SALAS_PRINCIPALES.map(id => (
            <button
              key={id}
              onClick={() => setFiltro(String(id))}
              style={{ ...styles.filtroBtn, ...(filtro === String(id) ? styles.filtroBtnActivo : {}) }}
            >
              {t(`paradas_nombres.p${id}`).split(' ').slice(0, 2).join(' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Grupos por sala */}
      <div style={styles.contenido}>
        {grupos.map(({ stop, obras }) => (
          <GrupoSala key={stop.id} stop={stop} obras={obras} t={t} />
        ))}
        <div style={{ height: '72px' }} />
      </div>

    </div>
  );
}

function GrupoSala({ stop, obras, t }) {
  const [imgErrors, setImgErrors] = React.useState({});
  const logo = LOGOS[stop.id];

  return (
    <div style={styles.grupo}>

      {/* Header del grupo */}
      <div style={styles.grupoHeader}>
        <div style={styles.grupoHeaderTexto}>
          <p style={styles.grupoEyebrow}>
            {stop.required ? 'Exposición' : 'Colección'} · Parada {stop.id}
          </p>
          <h2 style={styles.grupoTitulo}>
            {t(`paradas_nombres.p${stop.id}`)}
          </h2>
          <p style={styles.grupoCount}>{obras.length} obras</p>
        </div>
        {logo && (
          <img src={logo} alt="" style={styles.grupoLogo} />
        )}
      </div>

      {/* Grid obras */}
      <div style={styles.grid}>
        {obras.map(obra => (
          <div key={obra.id} style={styles.tarjeta}>
            <div style={styles.imgWrap}>
              {obra.imageUrl && !imgErrors[obra.id] ? (
                <img
                  src={obra.imageUrl}
                  alt={obra.title}
                  style={styles.img}
                  onError={() => setImgErrors(e => ({ ...e, [obra.id]: true }))}
                />
              ) : (
                <div style={styles.placeholder}>
                  <span style={styles.placeholderTxt}>R.P.</span>
                </div>
              )}
            </div>
            <div style={styles.ficha}>
              <p style={styles.fichaNum}>{String(obra.num).padStart(3,'0')}</p>
              <p style={styles.fichaTitulo}>{obra.title}</p>
              {obra.year && <p style={styles.fichaMeta}>{obra.year}</p>}
              {obra.technique && <p style={styles.fichaMeta}>{obra.technique}</p>}
              {obra.dimensions && <p style={styles.fichaMeta}>{obra.dimensions} cm</p>}
              <p style={styles.fichaConsultar}>{t('catalogo.consulta_inaudita')}</p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

const styles = {
  wrap: { backgroundColor: '#fff', minHeight: '100dvh', fontFamily: SANS },
  header: {
    position: 'sticky', top: 0,
    backgroundColor: '#fff',
    borderBottom: '1px solid #e8e6e3',
    padding: '1rem 1.25rem 0',
    zIndex: 10,
  },
  eyebrow: {
    fontFamily: SANS, fontSize: '0.62rem',
    letterSpacing: '0.16em', textTransform: 'uppercase',
    color: 'rgba(15,14,13,0.35)', margin: '0 0 0.2rem',
  },
  titulo: {
    fontFamily: PLAYFAIR, fontSize: 'clamp(1.4rem,5vw,2rem)',
    fontWeight: '400', color: '#0F0E0D', margin: '0 0 0.75rem', lineHeight: 1.15,
  },
  filtros: {
    display: 'flex', gap: '0.5rem',
    overflowX: 'auto', paddingBottom: '0.75rem',
    scrollbarWidth: 'none',
  },
  filtroBtn: {
    fontFamily: SANS, fontSize: '0.65rem',
    letterSpacing: '0.08em', textTransform: 'uppercase',
    padding: '0.35rem 0.75rem', whiteSpace: 'nowrap',
    backgroundColor: 'transparent', color: 'rgba(15,14,13,0.5)',
    border: '1px solid #e8e6e3', cursor: 'pointer', flexShrink: 0,
  },
  filtroBtnActivo: {
    backgroundColor: '#0F0E0D', color: '#fff',
    borderColor: '#0F0E0D',
  },
  contenido: {},
  grupo: { borderBottom: '2px solid #0F0E0D', marginBottom: '0' },
  grupoHeader: {
    display: 'flex', alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1.25rem 1.25rem 0.75rem',
    borderBottom: '1px solid #e8e6e3',
  },
  grupoHeaderTexto: { flex: 1 },
  grupoEyebrow: {
    fontFamily: SANS, fontSize: '0.6rem',
    letterSpacing: '0.14em', textTransform: 'uppercase',
    color: 'rgba(15,14,13,0.35)', margin: '0 0 0.2rem',
  },
  grupoTitulo: {
    fontFamily: PLAYFAIR, fontSize: '1.2rem',
    fontWeight: '400', color: '#0F0E0D', margin: '0 0 0.15rem', lineHeight: 1.2,
  },
  grupoCount: {
    fontFamily: SANS, fontSize: '0.68rem',
    color: 'rgba(15,14,13,0.35)', margin: 0,
  },
  grupoLogo: {
    height: '36px', maxWidth: '90px',
    objectFit: 'contain', opacity: 0.65, flexShrink: 0,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
    gap: '1px', background: '#e8e6e3',
  },
  tarjeta: { backgroundColor: '#fff', display: 'flex', flexDirection: 'column' },
  imgWrap: { width: '100%', aspectRatio: '3/4', overflow: 'hidden', backgroundColor: '#f9f8f7' },
  img: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
  placeholder: {
    width: '100%', height: '100%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  placeholderTxt: {
    fontFamily: PLAYFAIR, fontStyle: 'italic',
    fontSize: '1.4rem', color: 'rgba(15,14,13,0.12)',
  },
  ficha: {
    padding: '0.6rem 0.65rem',
    borderTop: '1px solid #e8e6e3',
    display: 'flex', flexDirection: 'column', gap: '0.15rem',
  },
  fichaNum: {
    fontFamily: SANS, fontSize: '0.58rem',
    letterSpacing: '0.08em', color: 'rgba(15,14,13,0.28)', margin: 0,
  },
  fichaTitulo: {
    fontFamily: PLAYFAIR, fontSize: '0.82rem',
    fontWeight: '400', color: '#0F0E0D', margin: 0, lineHeight: 1.3,
  },
  fichaMeta: {
    fontFamily: SANS, fontSize: '0.65rem',
    color: 'rgba(15,14,13,0.45)', margin: 0, fontWeight: '300',
  },
  fichaPrecio: {
    fontFamily: SANS, fontSize: '0.72rem',
    color: '#0F0E0D', margin: '0.2rem 0 0', fontWeight: '500',
  },
  fichaConsultar: {
    fontFamily: SANS, fontSize: '0.62rem',
    color: 'rgba(15,14,13,0.3)', margin: '0.2rem 0 0', fontStyle: 'italic',
  },
};
