import React from 'react';
import { useTranslation } from 'react-i18next';
import { getObrasByParada } from '../data/catalog';

const PLAYFAIR = '"Playfair Display", "IM Fell English", Georgia, serif';
const SANS = '"Rubik", system-ui, sans-serif';

export default function PantallaCatalogo({ stop, onVolver }) {
  const { t } = useTranslation();
  const obras = getObrasByParada(stop.paradaId ?? stop.id);
  const nombreSala = t(`paradas_nombres.p${stop.id}`);

  return (
    <div style={styles.pantalla}>

      {/* Header */}
      <div style={styles.header}>
        <button onClick={onVolver} style={styles.btnVolver}>
          ← {t('general.atras')}
        </button>
        <div style={styles.headerTexto}>
          <p style={styles.headerEyebrow}>
            {t('catalogo.sala_label', { numero: stop.id })}
          </p>
          <h1 style={styles.headerTitulo}>{nombreSala}</h1>
          <p style={styles.headerCount}>
            {obras.length} {t('catalogo.todas_obras').toLowerCase()}
          </p>
        </div>
        <div style={styles.headerDivisor} />
      </div>

      {/* Grid de obras */}
      <div style={styles.grid}>
        {obras.length === 0 && (
          <p style={styles.sinObras}>Sin obras registradas para esta sala.</p>
        )}
        {obras.map(obra => (
          <TarjetaObra key={obra.id} obra={obra} t={t} />
        ))}
      </div>

    </div>
  );
}

function TarjetaObra({ obra, t }) {
  const [imgError, setImgError] = React.useState(false);

  return (
    <div style={styles.tarjeta}>

      {/* Imagen */}
      <div style={styles.imgWrap}>
        {obra.imageUrl && !imgError ? (
          <img
            src={obra.imageUrl}
            alt={obra.title}
            style={styles.img}
            onError={() => setImgError(true)}
          />
        ) : (
          <div style={styles.imgPlaceholder}>
            <span style={styles.imgPlaceholderTexto}>R.P.</span>
          </div>
        )}
      </div>

      {/* Ficha */}
      <div style={styles.ficha}>
        <p style={styles.fichaNum}>
          {String(obra.num).padStart(3, '0')}
        </p>
        <p style={styles.fichaTitulo}>{obra.title}</p>
        {obra.year && (
          <p style={styles.fichaMeta}>{obra.year}</p>
        )}
        {obra.technique && (
          <p style={styles.fichaMeta}>{obra.technique}</p>
        )}
        {obra.dimensions && (
          <p style={styles.fichaMeta}>{obra.dimensions} cm</p>
        )}
        {obra.price ? (
          <p style={styles.fichaPrecio}>
            {obra.discountEligible
              ? <><span style={styles.precioTachado}>{obra.price} €</span>
                  {' '}<span style={styles.precioDescuento}>{Math.round(obra.price * 0.7)} €</span></>
              : <span>{obra.price} €</span>
            }
          </p>
        ) : (
          <p style={styles.fichaPrecioNull}>
            {t('catalogo.precio_pendiente')}
          </p>
        )}
        {!obra.forSale && (
          <p style={styles.fichaPrivada}>{t('catalogo.coleccion_privada')}</p>
        )}
      </div>

    </div>
  );
}

const styles = {
  pantalla: {
    minHeight: '100dvh',
    backgroundColor: '#fff',
    fontFamily: SANS,
    overflowY: 'auto',
  },
  header: {
    position: 'sticky',
    top: 0,
    backgroundColor: '#fff',
    zIndex: 10,
    padding: '1rem 1.25rem 0',
    borderBottom: '1px solid #e8e6e3',
  },
  btnVolver: {
    fontFamily: SANS,
    fontSize: '0.72rem',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: 'rgba(15,14,13,0.5)',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: '0 0 0.75rem 0',
    display: 'block',
  },
  headerTexto: {
    paddingBottom: '1rem',
  },
  headerEyebrow: {
    fontFamily: SANS,
    fontSize: '0.65rem',
    letterSpacing: '0.16em',
    textTransform: 'uppercase',
    color: 'rgba(15,14,13,0.35)',
    margin: '0 0 0.25rem 0',
  },
  headerTitulo: {
    fontFamily: PLAYFAIR,
    fontSize: 'clamp(1.4rem, 5vw, 2rem)',
    fontWeight: '400',
    color: '#0F0E0D',
    margin: '0 0 0.25rem 0',
    lineHeight: 1.15,
  },
  headerCount: {
    fontFamily: SANS,
    fontSize: '0.75rem',
    color: 'rgba(15,14,13,0.4)',
    margin: 0,
  },
  headerDivisor: {
    height: '1px',
    background: '#e8e6e3',
    margin: '0 -1.25rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
    gap: '1px',
    background: '#e8e6e3',
    padding: '1px',
  },
  sinObras: {
    fontFamily: SANS,
    fontSize: '0.85rem',
    color: 'rgba(15,14,13,0.4)',
    padding: '3rem 1.25rem',
    textAlign: 'center',
    gridColumn: '1/-1',
    background: '#fff',
  },
  tarjeta: {
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'column',
  },
  imgWrap: {
    width: '100%',
    aspectRatio: '3/4',
    overflow: 'hidden',
    backgroundColor: '#f9f8f7',
  },
  img: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
  imgPlaceholder: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9f8f7',
  },
  imgPlaceholderTexto: {
    fontFamily: PLAYFAIR,
    fontStyle: 'italic',
    fontSize: '1.5rem',
    color: 'rgba(15,14,13,0.15)',
    letterSpacing: '0.1em',
  },
  ficha: {
    padding: '0.75rem',
    borderTop: '1px solid #e8e6e3',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.2rem',
  },
  fichaNum: {
    fontFamily: SANS,
    fontSize: '0.6rem',
    letterSpacing: '0.1em',
    color: 'rgba(15,14,13,0.3)',
    margin: 0,
  },
  fichaTitulo: {
    fontFamily: PLAYFAIR,
    fontSize: '0.85rem',
    fontWeight: '400',
    color: '#0F0E0D',
    margin: '0.1rem 0',
    lineHeight: 1.3,
  },
  fichaMeta: {
    fontFamily: SANS,
    fontSize: '0.68rem',
    color: 'rgba(15,14,13,0.5)',
    margin: 0,
    fontWeight: '300',
  },
  fichaPrecio: {
    fontFamily: SANS,
    fontSize: '0.75rem',
    color: '#0F0E0D',
    margin: '0.3rem 0 0 0',
    fontWeight: '500',
  },
  precioTachado: {
    textDecoration: 'line-through',
    color: 'rgba(15,14,13,0.4)',
    fontWeight: '300',
  },
  precioDescuento: {
    color: '#0F0E0D',
    fontWeight: '600',
  },
  fichaPrecioNull: {
    fontFamily: SANS,
    fontSize: '0.65rem',
    color: 'rgba(15,14,13,0.3)',
    margin: '0.3rem 0 0 0',
    fontStyle: 'italic',
  },
  fichaPrivada: {
    fontFamily: SANS,
    fontSize: '0.62rem',
    color: 'rgba(15,14,13,0.35)',
    margin: '0.2rem 0 0 0',
    letterSpacing: '0.04em',
  },
};
