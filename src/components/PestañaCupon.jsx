import React from 'react';
import { useTranslation } from 'react-i18next';
import { checkCouponEligibility, isCouponRedeemableToday } from '../lib/coupon';
import { getSavedCoupon } from '../lib/session';
import { stops } from '../data/stops';

const PLAYFAIR = '"Playfair Display","IM Fell English",Georgia,serif';
const SANS = '"Rubik",system-ui,sans-serif';

const SALAS = [
  { id: 1,  key: 'viana',   logo: '/logos/logoviana.png' },
  { id: 4,  key: 'casa12pb', logo: '/logos/logo-casa12pb.png.png' },
  { id: 13, key: 'inaudita', logo: '/logos/INA_Branding_Negro.png' },
];

const REQUIRED_IDS = [1, 4, 13];
const WHATSAPP_URL = 'https://wa.me/34XXXXXXXXX?text=Hola,%20quiero%20reservar%20la%20cata%20completa%20de%20Montilla%20Moriles';

export default function PestañaCupon({ visitedStops, sessionId }) {
  const { t } = useTranslation();
  const eligib = checkCouponEligibility(visitedStops);
  const couponCode = getSavedCoupon();
  const canjeable = isCouponRedeemableToday();
  const [copiado, setCopiado] = React.useState(false);

  const copiar = () => {
    navigator.clipboard?.writeText(couponCode).then(() => {
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    });
  };

  if (!eligib.eligible) {
    return <EstadoPendiente eligib={eligib} visitedStops={visitedStops} t={t} />;
  }

  return <EstadoDesbloqueado couponCode={couponCode} canjeable={canjeable} copiado={copiado} onCopiar={copiar} t={t} />;
}

function EstadoPendiente({ eligib, visitedStops, t }) {
  const visited = new Set(visitedStops);
  const tabernasVisitadas = visitedStops.filter(id => !REQUIRED_IDS.includes(id)).length;
  const tabernasRestantes = eligib.missingFree;

  return (
    <div style={styles.wrap}>
      <div style={styles.pendienteHeader}>
        <p style={styles.eyebrow}>Tu cupón</p>
        <h1 style={styles.titulo}>Completa la ruta</h1>
        <p style={styles.narrativa}>
          Visita las tres salas de la exposición y dos tabernas de la ruta.
          Al completarlas, desbloqueas una <strong>copa de cata gratis</strong> y
          un <strong>30% de descuento</strong> en obra seleccionada.
        </p>
      </div>

      {/* Salas de exposición */}
      <div style={styles.seccion}>
        <p style={styles.seccionLabel}>Salas de la exposición</p>
        {SALAS.map(sala => {
          const sellada = visited.has(sala.id);
          return (
            <div key={sala.id} style={{ ...styles.salaFila, opacity: sellada ? 1 : 0.45 }}>
              <span style={styles.salaCheck}>{sellada ? '✓' : '○'}</span>
              <img src={sala.logo} alt="" style={styles.salaLogo} />
              <p style={styles.salaNombre}>{t(`paradas_nombres.p${sala.id}`)}</p>
            </div>
          );
        })}
      </div>

      <div style={styles.divisor} />

      {/* Tabernas */}
      <div style={styles.seccion}>
        <p style={styles.seccionLabel}>
          Tabernas visitadas · {Math.min(tabernasVisitadas, 2)}/2 mínimo
        </p>
        <div style={styles.barraWrap}>
          <div style={{
            ...styles.barraFill,
            width: `${Math.min(tabernasVisitadas / 2, 1) * 100}%`,
          }} />
        </div>
        {tabernasRestantes > 0 && (
          <p style={styles.faltaTexto}>
            Te {tabernasRestantes === 1 ? 'falta 1 taberna' : `faltan ${tabernasRestantes} tabernas`}
          </p>
        )}
      </div>

      <div style={{ height: '72px' }} />
    </div>
  );
}

function EstadoDesbloqueado({ couponCode, canjeable, copiado, onCopiar, t }) {
  return (
    <div style={styles.wrap}>

      <div style={styles.desbHeader}>
        <img src="/logos/INA_Branding_Negro.png" alt="La Inaudita" style={styles.logoInaudita} />
        <p style={styles.eyebrow}>Cupón desbloqueado</p>
        <h1 style={styles.titulo}>¡Enhorabuena!</h1>
      </div>

      {/* Código */}
      <div style={styles.codigoWrap} onClick={onCopiar}>
        <p style={styles.codigoLabel}>Tu código</p>
        <p style={styles.codigo}>{couponCode}</p>
        <p style={styles.codigoCta}>{copiado ? '✓ Copiado' : 'Toca para copiar'}</p>
      </div>

      {/* Premio 1 */}
      <div style={styles.premio}>
        <p style={styles.premioLabel}>Premio 1</p>
        <p style={styles.premioTitulo}>Primera copa de cata gratis</p>
        <p style={styles.premioDesc}>
          Muestra este código en la barra de La Inaudita.
          Calle Rodríguez Marín, 20.
        </p>
        {!canjeable && (
          <div style={styles.aviso}>
            ⚠️ La Inaudita cierra los domingos. Puedes canjear tu copa de lunes a sábado.
          </div>
        )}
      </div>

      <div style={styles.divisor} />

      {/* Premio 2 */}
      <div style={styles.premio}>
        <p style={styles.premioLabel}>Premio 2</p>
        <p style={styles.premioTitulo}>30% de descuento en obra seleccionada</p>
        <p style={styles.premioDesc}>
          Válido en obra en papel. Presenta el código en caja.
        </p>
      </div>

      <div style={styles.divisor} />

      {/* CTA cata completa */}
      <div style={styles.cataWrap}>
        <p style={styles.cataTitulo}>¿Quieres la cata completa?</p>
        <p style={styles.cataDesc}>
          5 vinos Montilla Moriles · 12€ sin maridaje · 30€ con maridaje.
          Reserva por WhatsApp o llamada.
        </p>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={styles.btnWhatsapp}
        >
          Reservar cata completa
        </a>
      </div>

      <div style={{ height: '72px' }} />
    </div>
  );
}

const styles = {
  wrap: { backgroundColor: '#fff', minHeight: '100dvh', fontFamily: SANS },
  pendienteHeader: { padding: '1.5rem 1.25rem 1rem', borderBottom: '2px solid #0F0E0D' },
  desbHeader: { padding: '1.5rem 1.25rem 1rem', borderBottom: '2px solid #0F0E0D', textAlign: 'center' },
  logoInaudita: { height: '52px', objectFit: 'contain', marginBottom: '1rem', opacity: 0.85 },
  eyebrow: {
    fontFamily: SANS, fontSize: '0.62rem',
    letterSpacing: '0.16em', textTransform: 'uppercase',
    color: 'rgba(15,14,13,0.35)', margin: '0 0 0.25rem',
  },
  titulo: {
    fontFamily: PLAYFAIR, fontSize: 'clamp(1.4rem,5vw,2rem)',
    fontWeight: '400', color: '#0F0E0D', margin: '0 0 0.75rem', lineHeight: 1.15,
  },
  narrativa: {
    fontFamily: SANS, fontSize: '0.88rem',
    color: 'rgba(15,14,13,0.7)', lineHeight: 1.7,
    fontWeight: '300', margin: 0,
  },
  seccion: { padding: '1.25rem' },
  seccionLabel: {
    fontFamily: SANS, fontSize: '0.62rem',
    letterSpacing: '0.14em', textTransform: 'uppercase',
    color: 'rgba(15,14,13,0.4)', margin: '0 0 0.75rem',
  },
  salaFila: {
    display: 'flex', alignItems: 'center',
    gap: '0.75rem', marginBottom: '0.75rem',
    transition: 'opacity 0.2s',
  },
  salaCheck: {
    fontFamily: SANS, fontSize: '0.85rem',
    color: '#0F0E0D', width: '1.2rem', flexShrink: 0,
  },
  salaLogo: { height: '24px', maxWidth: '70px', objectFit: 'contain', flexShrink: 0 },
  salaNombre: {
    fontFamily: PLAYFAIR, fontSize: '0.9rem',
    color: '#0F0E0D', margin: 0,
  },
  barraWrap: {
    height: '3px', backgroundColor: '#e8e6e3',
    borderRadius: '2px', overflow: 'hidden', marginBottom: '0.5rem',
  },
  barraFill: {
    height: '100%', backgroundColor: '#0F0E0D',
    transition: 'width 0.4s ease',
  },
  faltaTexto: {
    fontFamily: SANS, fontSize: '0.75rem',
    color: 'rgba(15,14,13,0.5)', margin: 0,
  },
  divisor: { height: '1px', background: '#e8e6e3', margin: '0 1.25rem' },
  codigoWrap: {
    margin: '1.25rem',
    border: '1px dashed #0F0E0D',
    padding: '1.25rem',
    textAlign: 'center',
    cursor: 'pointer',
    userSelect: 'all',
  },
  codigoLabel: {
    fontFamily: SANS, fontSize: '0.6rem',
    letterSpacing: '0.14em', textTransform: 'uppercase',
    color: 'rgba(15,14,13,0.4)', margin: '0 0 0.5rem',
  },
  codigo: {
    fontFamily: '"Courier New", monospace',
    fontSize: '1.5rem', fontWeight: '700',
    letterSpacing: '0.12em', color: '#0F0E0D', margin: '0 0 0.25rem',
  },
  codigoCta: {
    fontFamily: SANS, fontSize: '0.65rem',
    color: 'rgba(15,14,13,0.4)', margin: 0,
  },
  premio: { padding: '1.25rem' },
  premioLabel: {
    fontFamily: SANS, fontSize: '0.6rem',
    letterSpacing: '0.14em', textTransform: 'uppercase',
    color: 'rgba(15,14,13,0.35)', margin: '0 0 0.3rem',
  },
  premioTitulo: {
    fontFamily: PLAYFAIR, fontSize: '1.1rem',
    fontWeight: '400', color: '#0F0E0D', margin: '0 0 0.4rem', lineHeight: 1.3,
  },
  premioDesc: {
    fontFamily: SANS, fontSize: '0.82rem',
    color: 'rgba(15,14,13,0.6)', margin: 0, fontWeight: '300', lineHeight: 1.6,
  },
  aviso: {
    marginTop: '0.75rem',
    padding: '0.6rem 0.75rem',
    backgroundColor: '#f9f8f7',
    border: '1px solid #e8e6e3',
    fontFamily: SANS, fontSize: '0.75rem',
    color: 'rgba(15,14,13,0.6)', lineHeight: 1.5,
  },
  cataWrap: { padding: '1.25rem' },
  cataTitulo: {
    fontFamily: PLAYFAIR, fontSize: '1rem',
    fontWeight: '400', color: '#0F0E0D', margin: '0 0 0.4rem',
  },
  cataDesc: {
    fontFamily: SANS, fontSize: '0.82rem',
    color: 'rgba(15,14,13,0.6)', margin: '0 0 1rem',
    fontWeight: '300', lineHeight: 1.6,
  },
  btnWhatsapp: {
    display: 'block', textAlign: 'center',
    padding: '0.85rem',
    backgroundColor: '#0F0E0D', color: '#fff',
    fontFamily: SANS, fontSize: '0.72rem',
    letterSpacing: '0.1em', textTransform: 'uppercase',
    textDecoration: 'none',
  },
};
