/**
 * ProgresoCupon.jsx
 * Widget de progreso hacia el cupón PINEDA30.
 * Dos bloques: Exposición (3 salas) + Tabernas (contador X/2).
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import { checkCouponEligibility } from '../lib/coupon';
import { getSavedCoupon } from '../lib/session';

const SERIF = '"IM Fell English", "Cormorant Garamond", Georgia, serif';
const SANS  = 'system-ui, -apple-system, sans-serif';

const REQUIRED_IDS = [1, 4, 13];
const TABERNA_IDS  = [2, 3, 5, 6, 7, 8, 9, 10, 11, 12];

const SALA_LABELS = { 1: 'Viana', 4: '12PB', 13: 'Inaudita' };

export default function ProgresoCupon({ visitedStopIds, onVerCupon }) {
  const { t }   = useTranslation();
  const eligib  = checkCouponEligibility(visitedStopIds);
  const coupon  = getSavedCoupon();
  const visited = new Set(visitedStopIds);

  if (eligib.eligible || coupon) {
    return (
      <div style={s.root} onClick={onVerCupon} role="button" tabIndex={0}
           onKeyDown={e => e.key === 'Enter' && onVerCupon()}>
        <div style={s.couponUnlocked}>
          <div style={s.couponIcon}>✓</div>
          <div>
            <p style={s.couponTitulo}>{t('cupon.desbloqueado')}</p>
            <p style={s.couponCode}>{coupon || 'PINEDA30'}</p>
          </div>
          <span style={s.couponCta}>{t('cupon.ver')} →</span>
        </div>
      </div>
    );
  }

  const tavernasVisitadas = TABERNA_IDS.filter(id => visited.has(id)).length;
  const tavernasOk = tavernasVisitadas >= 2;

  return (
    <div style={s.root}>

      {/* BLOQUE A — Salas de la exposición */}
      <p style={s.eyebrow}>Exposición</p>
      <div style={s.pillsRow}>
        {REQUIRED_IDS.map(id => {
          const ok = visited.has(id);
          return (
            <span key={id} style={{ ...s.pill, ...(ok ? s.pillOk : s.pillPend) }}>
              {ok ? '✓ ' : '○ '}{SALA_LABELS[id]}
            </span>
          );
        })}
      </div>

      <div style={s.divisor} />

      {/* BLOQUE B — Tabernas */}
      <p style={s.eyebrow}>Tabernas</p>
      <div style={s.tavernasRow}>
        <div style={s.miniBarTrack}>
          <div style={{
            ...s.miniBarFill,
            width: `${Math.min(tavernasVisitadas / 2, 1) * 100}%`,
            backgroundColor: tavernasOk ? '#2d6e46' : '#000',
          }} />
        </div>
        <span style={{ ...s.tavernasLabel, color: tavernasOk ? '#2d6e46' : '#888' }}>
          {tavernasOk ? `✓ ${tavernasVisitadas}` : `${tavernasVisitadas}/2`}
        </span>
      </div>

      {/* Texto faltante */}
      {(eligib.missingRequired.length > 0 || eligib.missingFree > 0) && (
        <p style={s.faltaTexto}>
          {eligib.missingRequired.length > 0 && (
            <>{t('cupon.falta_salas', { n: eligib.missingRequired.length })}{eligib.missingFree > 0 && ' · '}</>
          )}
          {eligib.missingFree > 0 && t('cupon.falta_tabernas', { n: eligib.missingFree })}
        </p>
      )}
    </div>
  );
}

const s = {
  root: {
    padding: '0.85rem 1.25rem',
    border: '1px solid #e8e6e3',
    backgroundColor: '#fafafa',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  // Cupón desbloqueado
  couponUnlocked: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    cursor: 'pointer',
  },
  couponIcon: {
    width: '36px',
    height: '36px',
    backgroundColor: '#000',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: SERIF,
    fontSize: '1.1rem',
    flexShrink: 0,
  },
  couponTitulo: {
    fontFamily: SANS,
    fontSize: '0.7rem',
    fontWeight: '700',
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    color: '#000',
    margin: '0 0 2px',
  },
  couponCode: {
    fontFamily: SANS,
    fontSize: '0.85rem',
    fontWeight: '700',
    letterSpacing: '1px',
    color: '#333',
    margin: 0,
  },
  couponCta: {
    fontFamily: SANS,
    fontSize: '0.75rem',
    fontWeight: '600',
    color: '#000',
    marginLeft: 'auto',
    whiteSpace: 'nowrap',
  },
  // En progreso
  eyebrow: {
    fontFamily: SANS,
    fontSize: '0.58rem',
    fontWeight: '700',
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: 'rgba(15,14,13,0.35)',
    margin: '0',
  },
  pillsRow: {
    display: 'flex',
    gap: '0.4rem',
    flexWrap: 'wrap',
    marginBottom: '0.25rem',
  },
  pill: {
    fontFamily: SANS,
    fontSize: '0.65rem',
    fontWeight: '600',
    letterSpacing: '0.8px',
    textTransform: 'uppercase',
    padding: '2px 8px',
    border: '1px solid',
  },
  pillOk: {
    backgroundColor: '#2d6e46',
    color: '#fff',
    borderColor: '#2d6e46',
  },
  pillPend: {
    backgroundColor: '#fff',
    color: '#bbb',
    borderColor: '#ddd',
  },
  divisor: {
    height: '1px',
    backgroundColor: '#e8e6e3',
    margin: '0.25rem 0',
  },
  tavernasRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    marginBottom: '0.25rem',
  },
  miniBarTrack: {
    flex: 1,
    height: '3px',
    backgroundColor: '#e0e0e0',
  },
  miniBarFill: {
    height: '100%',
    transition: 'width 0.4s ease',
  },
  tavernasLabel: {
    fontFamily: SANS,
    fontSize: '0.72rem',
    fontWeight: '700',
    letterSpacing: '0.5px',
    minWidth: '2rem',
    textAlign: 'right',
  },
  faltaTexto: {
    fontFamily: SANS,
    fontSize: '0.72rem',
    color: '#888',
    margin: '0',
    lineHeight: 1.4,
  },
};
