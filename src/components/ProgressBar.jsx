import { usePassportStore } from '../store/passportStore'
import { TOTAL_PARADAS } from '../data/paradas'
import { MIN_STOPS_FOR_COUPON } from '../lib/coupon'

export default function ProgressBar() {
  const completedStops = usePassportStore(s => s.completedStops)
  const pct = Math.round((completedStops.length / TOTAL_PARADAS) * 100)

  return (
    <div>
      <div className="progress-bar" title={`${pct}% completado`}>
        <div className="progress-bar__fill" style={{ width: `${pct}%` }} />
      </div>
      {completedStops.length < MIN_STOPS_FOR_COUPON && (
        <p className="text-muted" style={{ marginBottom: 12, fontSize: '0.78rem' }}>
          Visita {MIN_STOPS_FOR_COUPON - completedStops.length} parada{MIN_STOPS_FOR_COUPON - completedStops.length !== 1 ? 's' : ''} más para desbloquear tu descuento
        </p>
      )}
    </div>
  )
}
