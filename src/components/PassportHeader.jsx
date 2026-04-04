import { useNavigate } from 'react-router-dom'
import { usePassportStore } from '../store/passportStore'
import { TOTAL_PARADAS } from '../data/paradas'

export default function PassportHeader({ showBack = false }) {
  const navigate = useNavigate()
  const completedStops = usePassportStore(s => s.completedStops)

  return (
    <header className="passport-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {showBack && (
          <button
            onClick={() => navigate('/')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0 8px 0 0', fontSize: '1.1rem', color: 'var(--text-muted)' }}
            aria-label="Volver al pasaporte"
          >
            ←
          </button>
        )}
        <span className="passport-header__logo">PINEDA · CÓRDOBA</span>
      </div>
      <span className="passport-header__counter">
        {completedStops.length}/{TOTAL_PARADAS} paradas
      </span>
    </header>
  )
}
