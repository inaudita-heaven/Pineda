/**
 * ProgresoCupon.jsx
 * Widget de progreso hacia el cupón PINEDA30.
 * Muestra: paradas selladas, salas completadas, estado del cupón.
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import { checkCouponEligibility } from '../lib/coupon';
import { getSavedCoupon } from '../lib/session';

const SERIF = '"IM Fell English", "Cormorant Garamond", Georgia, serif';
const SANS  = 'system-ui, -apple-system, sans-serif';

const REQUIRED_IDS = [1, 4, 13];

export default function ProgresoCupon({ visitedStopIds, onVerCupon }) {
  const { t }   = useTranslation();
  const eligib  = checkCouponEligibility(visitedStopIds);
  const coupon  = getSavedCoupon();
  const visited = new Set(visitedStopIds);

  if (eligib.eligible || coupon) {
    // Cupón desbloqueado
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

  // En progreso
  const totalVisited   = visitedStopIds.length;
  const salasVisitadas = REQUIRED_IDS.filter(id => visited.has(id)).length;

  return (
    <div style={s.root}>
      {/* Barra progreso */}
      <div style={s.barraWrap}>
        <div style={s.barraTrack}>
          <div style={{ ...s.barraFill, width: `${(totalVisited / 13) * 100}%` }} />
        </div>
        <span style={s.barraLabel}>{totalVisited}/13</span>
      </div>

      {/* Píldoras de salas obligatorias */}
      <div style={s.pillsRow}>
        {REQUIRED_IDS.map(id => {
          const ok = visited.has(id);
          return (
            <span key={id} style={{ ...s.pill, ...(ok ? s.pillOk : s.pillPend) }}>
              {ok ? '✓ ' : ''}{t(`paradas_nombres.p${id}`).split(' ')[0]}
            </span>
          );
        })}
      </div>

      {/* Texto faltante */}
      <p style={s.faltaTexto}>
        {eligib.missingRequired.length > 0 && (
          <>
            {t('cupon.falta_salas', { n: eligib.missingRequired.length })}
            {eligib.missingFree > 0 && ` · `}
          </>
        )}
        {eligib.missingFree > 0 && t('cupon.falta_tabernas', { n: eligib.missingFree })}
      </p>
    </div>
  );
}

const s = {
  root: {
    padding: '1rem 1.25rem',
    border: '1px solid #e8e6e3',
    backgroundColor: '#fafafa',
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
  barraWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    marginBottom: '0.75rem',
  },
  barraTrack: {
    flex: 1,
    height: '3px',
    backgroundColor: '#e0e0e0',
  },
  barraFill: {
    height: '100%',
    backgroundColor: '#000',
    transition: 'width 0.4s ease',
  },
  barraLabel: {
    fontFamily: SANS,
    fontSize: '0.75rem',
    fontWeight: '600',
    color: '#999',
    letterSpacing: '0.5px',
  },
  pillsRow: {
    display: 'flex',
    gap: '0.4rem',
    flexWrap: 'wrap',
    marginBottom: '0.6rem',
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
    backgroundColor: '#000',
    color: '#fff',
    borderColor: '#000',
  },
  pillPend: {
    backgroundColor: '#fff',
    color: '#bbb',
    borderColor: '#ddd',
  },
  faltaTexto: {
    fontFamily: SANS,
    fontSize: '0.75rem',
    color: '#888',
    margin: 0,
    lineHeight: 1.4,
  },
};
