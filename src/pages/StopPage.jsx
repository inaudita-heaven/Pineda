import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import PassportHeader from '../components/PassportHeader'
import ProgressWarningModal from '../components/ProgressWarningModal'
import { getParadaById, PARADAS } from '../data/paradas'
import { usePassportStore } from '../store/passportStore'
import ParadaContent from '../paradas'

export default function StopPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const parada = getParadaById(id)

  const completeStop = usePassportStore(s => s.completeStop)
  const isCompleted = usePassportStore(s => s.completedStops.includes(Number(id)))
  const hasSeenWarning = usePassportStore(s => s.hasSeenWarning)
  const completedStops = usePassportStore(s => s.completedStops)

  const [showWarning, setShowWarning] = useState(false)

  if (!parada) {
    return (
      <div className="page">
        <PassportHeader showBack />
        <p style={{ marginTop: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
          Parada no encontrada.
        </p>
        <button className="btn btn--ghost mt-4" onClick={() => navigate('/')}>
          Volver al pasaporte
        </button>
      </div>
    )
  }

  function handleComplete() {
    completeStop(parada.id)

    // Mostrar aviso tras primera parada completada (Viana = id 1)
    const isFirst = parada.id === 1 && !hasSeenWarning
    if (isFirst) {
      setShowWarning(true)
      return
    }

    // Si es la última parada, ir a cupón
    if (parada.esFinal) {
      navigate('/cupon')
      return
    }

    // Ir a la siguiente parada o home
    const nextParada = PARADAS.find(p => p.id === parada.id + 1)
    if (nextParada) {
      navigate(`/parada/${nextParada.id}`)
    } else {
      navigate('/')
    }
  }

  function handleWarningClose() {
    setShowWarning(false)
    navigate('/')
  }

  const stopNumber = String(parada.id).padStart(2, '0')
  const isLastStop = parada.esFinal

  return (
    <div className="page">
      <PassportHeader showBack />

      {/* Contenido específico de la parada (componente propio o genérico) */}
      <ParadaContent paradaId={parada.id} parada={parada} />

      {/* CTA principal */}
      <div style={{ marginTop: 12 }}>
        {isCompleted ? (
          <div>
            <div
              style={{
                background: '#f0fdf4',
                border: '2px solid #86efac',
                borderRadius: 'var(--radius-sm)',
                padding: '14px 16px',
                marginBottom: 12,
                textAlign: 'center',
                color: '#15803d',
                fontWeight: 600,
              }}
            >
              ✓ Parada completada
            </div>
            {isLastStop ? (
              <button className="btn btn--gold" onClick={() => navigate('/cupon')}>
                Ver mi cupón de descuento
              </button>
            ) : (
              <button className="btn btn--ghost" onClick={() => navigate('/')}>
                Volver al pasaporte
              </button>
            )}
          </div>
        ) : (
          <button className="btn btn--primary" onClick={handleComplete}>
            {isLastStop ? 'Completar ruta y ver cupón' : 'Sellar esta parada'}
          </button>
        )}
      </div>

      {showWarning && <ProgressWarningModal onClose={handleWarningClose} />}
    </div>
  )
}
