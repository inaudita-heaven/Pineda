import { generateCouponCode, isCouponRedeemableToday } from '../utils/coupon';

export default function CouponView({ sessionId, onClose }) {
  const code = generateCouponCode(sessionId);
  const redeemableToday = isCouponRedeemableToday();

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

        <button className="btn btn--primary coupon__close" onClick={onClose}>
          Volver al pasaporte
        </button>
      </div>
    </div>
  );
}
