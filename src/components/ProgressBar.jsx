import { usePassportStore } from '../store/passportStore'
import { TOTAL_PARADAS } from '../data/paradas'
import { checkCouponEligibility } from '../lib/coupon'
import { PARADAS } from '../data/paradas'

export default function ProgressBar() {
  const completedStops = usePassportStore(s => s.completedStops)
  const { eligible, missingRequired, remaining } = checkCouponEligibility(completedStops)
  const pct = Math.round((completedStops.length / TOTAL_PARADAS) * 100)

  const missingNames = missingRequired.map(id => PARADAS.find(p => p.id === id)?.nombre).filter(Boolean)

  return (
    <div style={{ marginBottom: 20 }}>
      <div className="progress-bar" title={`${pct}% completado`}>
        <div className="progress-bar__fill" style={{ width: `${pct}%` }} />
      </div>

      {!eligible && (
        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 4 }}>
          {missingNames.length > 0 && (
            <p>⭐ Te faltan las salas: {missingNames.join(', ')}</p>
          )}
          {remaining > 0 && missingNames.length === 0 && (
            <p>Visita {remaining} parada{remaining !== 1 ? 's' : ''} más para desbloquear tu descuento</p>
          )}
          {remaining > 0 && missingNames.length > 0 && (
            <p>Y {remaining} parada{remaining !== 1 ? 's' : ''} más en total</p>
          )}
        </div>
      )}
    </div>
  )
}
