import { useNavigate } from 'react-router-dom'
import { usePassportStore } from '../store/passportStore'

export default function StopCard({ parada }) {
  const navigate = useNavigate()
  const isCompleted = usePassportStore(s => s.completedStops.includes(parada.id))

  function handleClick() {
    navigate(`/parada/${parada.id}`)
  }

  return (
    <button
      className={`stop-card${isCompleted ? ' stop-card--completed' : ''}`}
      onClick={handleClick}
      aria-label={`Parada ${parada.id}: ${parada.nombre}`}
    >
      <span className="stop-card__number">{String(parada.id).padStart(2, '0')}</span>
      <span className="stop-card__name">{parada.nombre}</span>
    </button>
  )
}
