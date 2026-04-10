/**
 * CouponUnlockedModal.jsx
 * Modal fullscreen que aparece cuando el visitante desbloquea el cupón PINEDA30.
 * Muestra el código, las condiciones de canje y el formulario RGPD de email.
 */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getSavedCoupon, saveCoupon } from '../lib/session';
import { isCouponRedeemableToday } from '../lib/coupon';

const EMAIL_DISMISSED_KEY = 'pineda_email_dismissed';

const SERIF = '"IM Fell English", "Cormorant Garamond", Georgia, serif';
const SANS  = 'system-ui, -apple-system, sans-serif';

export default function CouponUnlockedModal({ sessionId, onClose }) {
  const { t } = useTranslation();

  const code           = getSavedCoupon() || buildCode(sessionId);
  const redeemableHoy  = isCouponRedeemableToday();
  const emailDismissed = Boolean(localStorage.getItem(EMAIL_DISMISSED_KEY));

  const [email, setEmail]         = useState('');
  const [consent, setConsent]     = useState(false);
  const [emailState, setEmailState] = useState(emailDismissed ? 'dismissed' : 'idle');

  function handleGuardar(e) {
    e.preventDefault();
    if (!email || !consent) return;
    localStorage.setItem('pineda_coupon_email', email);
    setEmailState('saved');
  }

  function handleDismiss() {
    localStorage.setItem(EMAIL_DISMISSED_KEY, '1');
    setEmailState('dismissed');
  }

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

        {/* Formulario email RGPD */}
        {emailState === 'idle' && (
          <form style={s.emailForm} onSubmit={handleGuardar}>
            <p style={s.emailLabel}>{t('cupon.email_label')}</p>
            <input
              type="email"
              style={s.emailInput}
              placeholder="tu@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
            />
            <label style={s.rgpdLabel}>
              <input
                type="checkbox"
                checked={consent}
                onChange={e => setConsent(e.target.checked)}
                style={s.checkbox}
              />
              <span style={s.rgpdTexto}>
                {t('cupon.rgpd_texto_1')}{' '}
                <a href="mailto:info@lainaudita.es" style={s.link}>info@lainaudita.es</a>
                {t('cupon.rgpd_texto_2')}
              </span>
            </label>
            <button
              type="submit"
              style={{ ...s.botonPrimario, opacity: (!email || !consent) ? 0.4 : 1 }}
              disabled={!email || !consent}
            >
              {t('cupon.email_guardar')}
            </button>
            <button type="button" style={s.botonDismiss} onClick={handleDismiss}>
              {t('cupon.email_dismiss')}
            </button>
          </form>
        )}

        {emailState === 'saved' && (
          <p style={s.emailSaved}>{t('cupon.email_saved')}</p>
        )}

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
  // Email form
  emailForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    borderTop: '1px solid #e0e0e0',
    paddingTop: '1rem',
  },
  emailLabel: {
    fontFamily: SERIF,
    fontSize: '0.9rem',
    fontStyle: 'italic',
    margin: 0,
    textAlign: 'center',
  },
  emailInput: {
    fontFamily: SANS,
    fontSize: '0.9rem',
    padding: '0.75rem',
    border: '1px solid #000',
    width: '100%',
    boxSizing: 'border-box',
    outline: 'none',
  },
  rgpdLabel: {
    display: 'flex',
    gap: '0.6rem',
    alignItems: 'flex-start',
    cursor: 'pointer',
  },
  checkbox: {
    marginTop: '3px',
    flexShrink: 0,
    accentColor: '#000',
  },
  rgpdTexto: {
    fontFamily: SANS,
    fontSize: '0.72rem',
    color: '#666',
    lineHeight: 1.5,
  },
  link: {
    color: '#000',
  },
  botonPrimario: {
    fontFamily: SANS,
    fontSize: '0.85rem',
    fontWeight: '600',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    padding: '0.9rem',
    backgroundColor: '#000',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    minHeight: '48px',
  },
  botonDismiss: {
    fontFamily: SANS,
    fontSize: '0.78rem',
    color: '#aaa',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    textAlign: 'center',
    textDecoration: 'underline',
    textUnderlineOffset: '2px',
    padding: '0.25rem',
  },
  emailSaved: {
    fontFamily: SANS,
    fontSize: '0.82rem',
    color: '#333',
    textAlign: 'center',
    margin: 0,
    fontWeight: '600',
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
  },
};
