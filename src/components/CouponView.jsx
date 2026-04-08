import { useState } from 'react';
import { generateCouponCode, isCouponRedeemableToday } from '../utils/coupon';

const EMAIL_DISMISSED_KEY = 'ruta_expo_email_dismissed';

export default function CouponView({ sessionId, onClose }) {
  const code = generateCouponCode(sessionId);
  const redeemableToday = isCouponRedeemableToday();

  const [showForm] = useState(() => !localStorage.getItem(EMAIL_DISMISSED_KEY));
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [emailState, setEmailState] = useState('idle'); // idle | saved | dismissed

  function handleDismiss() {
    localStorage.setItem(EMAIL_DISMISSED_KEY, '1');
    setEmailState('dismissed');
  }

  function handleSave(e) {
    e.preventDefault();
    if (!email || !consent) return;
    localStorage.setItem('ruta_expo_coupon_email', email);
    setEmailState('saved');
  }

  const showEmailSection = showForm && emailState !== 'dismissed';

  return (
    <div className="coupon-overlay" onClick={onClose}>
      <div className="coupon" onClick={e => e.stopPropagation()}>
        <div className="coupon__header">
          <p className="coupon__eyebrow">Rafael Pineda · Pintor de Córdoba</p>
          <h2 className="coupon__title">30% de descuento</h2>
          <p className="coupon__sub">en obra seleccionada disponible para venta</p>
        </div>

        <div className="coupon__code">{code}</div>

        <div className="coupon__instructions">
          <p>Muestra este código en caja de <strong>La Inaudita</strong></p>
          <p className="coupon__address">C. Rodríguez Marín, 20 · Córdoba</p>
        </div>

        {!redeemableToday && (
          <div className="coupon__warning">
            ⚠️ La Inaudita cierra los domingos. Puedes canjearlo de lunes a sábado,
            de 10:00 a 14:00 y de 18:00 a 20:30.
          </div>
        )}

        <div className="coupon__fine-print">
          Válido hasta el 30 de mayo de 2025 · Un solo uso · No acumulable
        </div>

        {showEmailSection && emailState === 'idle' && (
          <form className="coupon__email-form" onSubmit={handleSave}>
            <p className="coupon__email-label">Guarda tu cupón por email</p>
            <input
              className="coupon__email-input"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
            />
            <label className="coupon__rgpd">
              <input
                type="checkbox"
                checked={consent}
                onChange={e => setConsent(e.target.checked)}
              />
              <span>
                Acepto que <strong>La Inaudita</strong> use mi email para enviarme el cupón
                y comunicaciones culturales. Puedo ejercer mis derechos escribiendo a{' '}
                <a href="mailto:info@lainaudita.es">info@lainaudita.es</a>.
              </span>
            </label>
            <button
              type="submit"
              className="btn btn--primary coupon__email-btn"
              disabled={!email || !consent}
            >
              Guardar por email
            </button>
            <button
              type="button"
              className="btn btn--ghost coupon__dismiss-btn"
              onClick={handleDismiss}
            >
              Lo recuerdo yo
            </button>
          </form>
        )}

        {emailState === 'saved' && (
          <p className="coupon__email-saved">✓ Email guardado.</p>
        )}

        <button className="btn btn--primary coupon__close" onClick={onClose}>
          Volver al pasaporte
        </button>
      </div>
    </div>
  );
}
