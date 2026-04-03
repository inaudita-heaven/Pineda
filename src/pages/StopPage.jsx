import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import PassportHeader from '../components/PassportHeader'
import ProgressWarningModal from '../components/ProgressWarningModal'
import QrScanner from '../components/QrScanner'
import { getParadaById, validateQrToken, PARADAS } from '../data/paradas'
import { usePassportStore } from '../store/passportStore'
import ParadaContent from '../paradas'

/**
 * Punto de entrada de una parada. Puede llegar de dos formas:
 *  A) QR escaneado: /parada/3?t=TOKEN_03  → valida token y sella automáticamente
 *  B) Navegación manual desde home: /parada/3 → muestra botón "Escanear QR"
 */
export default function StopPage() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const parada = getParadaById(id)
  const paradaId = Number(id)

  const completeStop = usePassportStore(s => s.completeStop)
  const isCompleted = usePassportStore(s => s.completedStops.includes(paradaId))
  const hasSeenWarning = usePassportStore(s => s.hasSeenWarning)
  const scanLock = usePassportStore(s => s.scanLock)

  const [showWarning, setShowWarning] = useState(false)
  const [showScanner, setShowScanner] = useState(false)
  const [scanFeedback, setScanFeedback] = useState(null) // 'ok' | 'invalid' | 'error'
  const [sealing, setSealing] = useState(false)

  // ── A) QR directo con token en URL ────────────────────────────
  useEffect(() => {
    const token = searchParams.get('t')
    if (token && parada && !isCompleted) {
      handleSealWithToken(token)
    }
  }, [])

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

  // Modo prueba: sella sin QR cuando el token está pendiente de configurar
  const isTestMode = parada?.qrToken?.startsWith('TODO_')

  async function handleSealDirect() {
    await handleSealAfterValidation()
  }

  async function handleSealWithToken(token) {
    if (scanLock || sealing) return

    if (!validateQrToken(paradaId, token)) {
      setScanFeedback('invalid')
      setShowScanner(false)
      return
    }

    await handleSealAfterValidation()
  }

  async function handleSealAfterValidation() {
    if (scanLock || sealing) return

    setSealing(true)
    setShowScanner(false)
    const result = await completeStop(paradaId)
    setSealing(false)

    if (result?.ok === false && result.reason === 'duplicate') return

    setScanFeedback('ok')

    if (paradaId === 1 && !hasSeenWarning) {
      setShowWarning(true)
      return
    }

    if (parada.esFinal) {
      navigate('/cupon')
      return
    }

    const nextParada = PARADAS.find(p => p.id === paradaId + 1)
    if (nextParada) navigate(`/parada/${nextParada.id}`)
    else navigate('/')
  }

  // ── B) QR escaneado desde la cámara in-app ───────────────────
  async function handleQrScan(decodedText) {
    if (scanLock || sealing) return
    // Extraer token de la URL escaneada si viene en formato completo
    let token = decodedText
    try {
      const url = new URL(decodedText)
      token = url.searchParams.get('t') ?? decodedText
    } catch {
      // decodedText ya es el token en bruto
    }
    await handleSealWithToken(token)
  }

  function handleWarningClose() {
    setShowWarning(false)
    navigate('/')
  }

  const isLastStop = parada.esFinal

  return (
    <div className="page">
      <PassportHeader showBack />

      <ParadaContent paradaId={paradaId} parada={parada} />

      {/* Navegación a esta parada */}
      {parada.mapsUrl && !isCompleted && (
        <a
          href={parada.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn--ghost"
          style={{ marginBottom: 12 }}
        >
          🗺 Llévame aquí · Google Maps
        </a>
      )}

      {/* Feedback de escaneo */}
      {scanFeedback === 'invalid' && (
        <div style={{
          background: '#fef2f2', border: '1px solid #fca5a5',
          borderRadius: 'var(--radius-sm)', padding: '12px 14px',
          color: '#991b1b', fontSize: '0.85rem', marginBottom: 12,
        }}>
          QR no válido para esta parada. Escanea el código de la parada {String(paradaId).padStart(2,'0')}.
        </div>
      )}

      {/* CTA principal */}
      <div style={{ marginTop: 12 }}>
        {isCompleted ? (
          <div>
            <div style={{
              background: '#f0fdf4', border: '2px solid #86efac',
              borderRadius: 'var(--radius-sm)', padding: '14px 16px',
              marginBottom: 12, textAlign: 'center', color: '#15803d', fontWeight: 600,
            }}>
              ✓ Parada sellada
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
          <>
            {showScanner ? (
              <div>
                <QrScanner onScan={handleQrScan} onError={() => setScanFeedback('error')} />
                <button className="btn btn--ghost mt-4" onClick={() => setShowScanner(false)}>
                  Cancelar
                </button>
              </div>
            ) : (
              <>
                <button
                  className="btn btn--primary"
                  onClick={() => setShowScanner(true)}
                  disabled={sealing}
                >
                  {sealing ? 'Sellando…' : '📷 Escanear QR de esta parada'}
                </button>

                {/* Botón de prueba — solo visible mientras los tokens son TODO */}
                {isTestMode && (
                  <button
                    className="btn btn--ghost"
                    style={{ marginTop: 10, fontSize: '0.8rem', opacity: 0.6 }}
                    onClick={handleSealDirect}
                    disabled={sealing}
                  >
                    ✎ Sellar sin QR (modo prueba)
                  </button>
                )}
              </>
            )}
          </>
        )}
      </div>

      {showWarning && <ProgressWarningModal onClose={handleWarningClose} />}
    </div>
  )
}
