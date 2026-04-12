/**
 * CouponUnlockedModal.jsx
 * Modal fullscreen que aparece cuando el visitante desbloquea el cupón PINEDA30.
 * Muestra el código, las condiciones de canje y CTA WhatsApp.
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import { getSavedCoupon, saveCoupon } from '../lib/session';
import { isCouponRedeemableToday } from '../lib/coupon';

const SERIF = '"IM Fell English", "Cormorant Garamond", Georgia, serif';
const SANS  = 'system-ui, -apple-system, sans-serif';

export default function CouponUnlockedModal({ sessionId, onClose }) {
  const { t } = useTranslation();

  const code          = getSavedCoupon() || buildCode(sessionId);
  const redeemableHoy = isCouponRedeemableToday();

  return (
    <div style={s.overlay} onClick={onClose}>
      <div style={s.modal} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={s.header}>
          <div style={s.check}>✓</div>
          <h2 style={s.titulo}>{t('cupon.modal_titulo')}</h2>
          <p style={s.sub}>{t('cupon.modal_sub')}</p>
        </div>

        {/* Código */}
        <div style={s.codeBox}>
          <p style={s.codeLabel}>{t('cupon.codigo_label')}</p>
          <p style={s.code}>{code}</p>
        </div>

        {/* Instrucciones de canje */}
        <div style={s.instrucciones}>
          <p style={s.instruccionTexto}>{t('cupon.instruccion')}</p>
          <p style={s.direccion}>La Inaudita · C. Rodríguez Marín, 20 · Córdoba</p>
          <p style={s.horario}>L–V 10–14h / 18–20:30h · S 10–14h · D cerrado</p>
        </div>

        {/* Aviso domingo */}
        {!redeemableHoy && (
          <div style={s.avisoBox}>
            <p style={s.avisoTexto}>{t('cupon.aviso_domingo')}</p>
          </div>
        )}

        {/* Fine print */}
        <p style={s.finePrint}>{t('cupon.fine_print')}</p>

        {/* WhatsApp CTA */}
        <div style={s.waSection}>
          <p style={{
            fontFamily: SANS, fontSize: '0.75rem',
            color: 'rgba(15,14,13,0.6)', textAlign: 'center',
            margin: '0 0 0.5rem', fontWeight: '300',
          }}>
            ⚠️ Haz una captura de pantalla antes de ir a WhatsApp
          </p>
          <a
            href={`https://wa.me/34636291910?text=Hola%2C%20he%20completado%20la%20Ruta%20Pineda.%20Mi%20c%C3%B3digo%20es%20${encodeURIComponent(code)}.%20Quiero%20reclamar%20mi%20copa%20gratis.`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'block', padding: '0.85rem',
              backgroundColor: '#0F0E0D', color: '#fff',
              fontFamily: SANS, fontSize: '0.72rem',
              letterSpacing: '0.1em', textTransform: 'uppercase',
              textDecoration: 'none', textAlign: 'center',
              marginBottom: '0.75rem',
            }}
          >
            Solicitar mi premio por WhatsApp →
          </a>
        </div>

        {/* Botón cerrar */}
        <button style={s.botonCerrar} onClick={onClose}>
          {t('cupon.cerrar')}
        </button>

      </div>
    </div>
  );
}

function buildCode(sessionId) {
  const clean = (sessionId || '').replace(/-/g, '').substring(0, 6).toUpperCase() || 'XXXXXX';
  const code  = `PINEDA30-${clean}`;
  saveCoupon(code);
  return code;
}

const s = {
  overlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    zIndex: 15000,
    overflowY: 'auto',
    padding: '1rem',
  },
  modal: {
    width: '100%',
    maxWidth: '480px',
    backgroundColor: '#fff',
    padding: '2rem 1.75rem 2.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
    marginTop: '2rem',
    marginBottom: '2rem',
  },
  header: {
    textAlign: 'center',
    borderBottom: '2px solid #000',
    paddingBottom: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.75rem',
  },
  check: {
    fontFamily: SERIF,
    fontSize: '2.5rem',
    lineHeight: 1,
  },
  titulo: {
    fontFamily: SERIF,
    fontSize: 'clamp(1.4rem, 5vw, 2rem)',
    fontWeight: '400',
    margin: 0,
    letterSpacing: '1px',
  },
  sub: {
    fontFamily: SANS,
    fontSize: '0.82rem',
    color: '#666',
    margin: 0,
  },
  codeBox: {
    backgroundColor: '#0F0E0D',
    color: '#fff',
    padding: '1.25rem',
    textAlign: 'center',
  },
  codeLabel: {
    fontFamily: SANS,
    fontSize: '0.65rem',
    fontWeight: '600',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    color: '#888',
    margin: '0 0 0.4rem',
  },
  code: {
    fontFamily: SANS,
    fontSize: '1.35rem',
    fontWeight: '700',
    letterSpacing: '2px',
    color: '#fff',
    margin: 0,
  },
  instrucciones: {
    textAlign: 'center',
  },
  instruccionTexto: {
    fontFamily: SERIF,
    fontSize: '1rem',
    fontStyle: 'italic',
    margin: '0 0 0.4rem',
    lineHeight: 1.5,
  },
  direccion: {
    fontFamily: SANS,
    fontSize: '0.8rem',
    color: '#444',
    margin: '0 0 2px',
    fontWeight: '600',
  },
  horario: {
    fontFamily: SANS,
    fontSize: '0.75rem',
    color: '#888',
    margin: 0,
  },
  avisoBox: {
    border: '1px solid #e0e0e0',
    padding: '0.75rem 1rem',
    backgroundColor: '#fafafa',
  },
  avisoTexto: {
    fontFamily: SANS,
    fontSize: '0.82rem',
    color: '#666',
    margin: 0,
    lineHeight: 1.5,
  },
  finePrint: {
    fontFamily: SANS,
    fontSize: '0.68rem',
    color: '#bbb',
    textAlign: 'center',
    margin: 0,
  },
  waSection: {
    borderTop: '1px solid #e0e0e0',
    paddingTop: '1rem',
  },
  botonCerrar: {
    fontFamily: SANS,
    fontSize: '0.85rem',
    fontWeight: '600',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    padding: '0.9rem',
    backgroundColor: '#fff',
    color: '#000',
    border: '2px solid #000',
    cursor: 'pointer',
    minHeight: '48px',
    width: '100%',
  },
};
