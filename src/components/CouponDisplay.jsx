import { usePassportStore } from '../store/passportStore'
import { generateCouponCode } from '../lib/coupon'

export default function CouponDisplay() {
  const sessionId = usePassportStore(s => s.sessionId)
  const code = generateCouponCode(sessionId)

  function handleCopy() {
    navigator.clipboard?.writeText(code).catch(() => {})
  }

  return (
    <div>
      <div className="coupon">
        <p className="coupon__label">Tu código de descuento</p>
        <p className="coupon__code">{code}</p>
        <p className="coupon__discount">30% de descuento en La Inaudita</p>
      </div>
      <button className="btn btn--ghost mt-4" onClick={handleCopy}>
        Copiar código
      </button>
      <p className="text-muted text-center mt-4">
        Muestra este código en La Inaudita para canjear tu descuento.
        Válido hasta fin de la exposición.
      </p>
    </div>
  )
}
