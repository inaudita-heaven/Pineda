import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PassportHeader from '../components/PassportHeader'
import CouponDisplay from '../components/CouponDisplay'
import { usePassportStore } from '../store/passportStore'
import { MIN_STOPS_FOR_COUPON } from '../lib/coupon'
import { upsertVisitante, upsertCupon, guardarContacto } from '../lib/supabase'
import { generateCouponCode } from '../lib/coupon'

export default function CouponPage() {
  const navigate = useNavigate()
  const completedStops = usePassportStore(s => s.completedStops)
  const sessionId = usePassportStore(s => s.sessionId)
  const saveContact = usePassportStore(s => s.saveContact)
  const savedContact = usePassportStore(s => s.contact)
  const visitorDbId = usePassportStore(s => s.visitorDbId)

  const [email, setEmail] = useState(savedContact?.email ?? '')
  const [phone, setPhone] = useState(savedContact?.phone ?? '')
  const [rgpd, setRgpd] = useState(false)
  const [submitted, setSubmitted] = useState(!!savedContact)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const hasEnoughStops = completedStops.length >= MIN_STOPS_FOR_COUPON

  // Persiste el cupón en DB al entrar a esta pantalla
  useEffect(() => {
    if (!hasEnoughStops) return
    async function persistCoupon() {
      try {
        const dbId = visitorDbId ?? (await upsertVisitante(sessionId))
        const code = generateCouponCode(sessionId)
        await upsertCupon(dbId, code)
      } catch {
        // Fallo silencioso — el cupón sigue visible en pantalla
      }
    }
    persistCoupon()
  }, [hasEnoughStops])

  async function handleContactSubmit(e) {
    e.preventDefault()
    if (!email && !phone) return
    if (!rgpd) { setError('Debes aceptar la política de privacidad para continuar.'); return }

    setLoading(true)
    setError(null)
    try {
      const dbId = visitorDbId ?? (await upsertVisitante(sessionId))
      await guardarContacto(dbId, { email, phone })
      saveContact({ email, phone })
      setSubmitted(true)
    } catch (err) {
      setError('No se pudo guardar el contacto. Inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  if (!hasEnoughStops) {
    return (
      <div className="page">
        <PassportHeader showBack />
        <div style={{ marginTop: 48, textAlign: 'center' }}>
          <p style={{ fontSize: '2.5rem', marginBottom: 12 }}>🗺️</p>
          <h2 style={{ marginBottom: 8 }}>Aún no está listo</h2>
          <p className="text-muted" style={{ marginBottom: 24 }}>
            Necesitas visitar al menos {MIN_STOPS_FOR_COUPON} paradas.
            Llevas {completedStops.length} parada{completedStops.length !== 1 ? 's' : ''}.
          </p>
          <button className="btn btn--primary" onClick={() => navigate('/')}>
            Seguir la ruta
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <PassportHeader showBack />

      <div style={{ marginTop: 16 }}>
        <p style={{ fontSize: '2rem', marginBottom: 8, textAlign: 'center' }}>🎉</p>
        <h1 style={{ textAlign: 'center', marginBottom: 4 }}>¡Lo conseguiste!</h1>
        <p className="text-muted text-center" style={{ marginBottom: 8 }}>
          Visitaste {completedStops.length} de 12 paradas
        </p>
      </div>

      <CouponDisplay />

      {/* Captura de contacto — opcional y suave */}
      {!submitted ? (
        <div style={{ marginTop: 32, borderTop: '1px solid var(--border)', paddingTop: 24 }}>
          <p style={{ fontWeight: 600, marginBottom: 4 }}>¿Quieres guardar tu código?</p>
          <p className="text-muted" style={{ marginBottom: 16, fontSize: '0.85rem' }}>
            Déjanos tu email o teléfono y te lo guardamos por si lo necesitas. Completamente opcional.
          </p>
          <form onSubmit={handleContactSubmit}>
            <div className="form-field">
              <label htmlFor="email">Email (opcional)</label>
              <input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
            <div className="form-field">
              <label htmlFor="phone">Teléfono (opcional)</label>
              <input
                id="phone"
                type="tel"
                placeholder="+34 600 000 000"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                autoComplete="tel"
              />
            </div>

            {/* Consentimiento RGPD — obligatorio si se envía el formulario */}
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 16, fontSize: '0.8rem', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={rgpd}
                onChange={e => setRgpd(e.target.checked)}
                style={{ marginTop: 2, flexShrink: 0 }}
              />
              Acepto que La Inaudita almacene mis datos para enviarte el código de descuento. Puedes solicitar su eliminación en cualquier momento.
            </label>

            {error && (
              <p style={{ color: '#991b1b', fontSize: '0.82rem', marginBottom: 10 }}>{error}</p>
            )}

            <button
              className="btn btn--secondary"
              type="submit"
              disabled={loading || (!email && !phone)}
            >
              {loading ? 'Guardando…' : 'Guardar mi código'}
            </button>
          </form>
          <p
            className="text-muted text-center"
            style={{ marginTop: 14, fontSize: '0.78rem', cursor: 'pointer', textDecoration: 'underline' }}
            onClick={() => setSubmitted(true)}
          >
            No, gracias
          </p>
        </div>
      ) : (
        <div style={{ marginTop: 24, textAlign: 'center' }}>
          {(savedContact?.email || savedContact?.phone) && (
            <p className="text-muted">Código guardado. Muéstralo en caja en La Inaudita.</p>
          )}
          <button className="btn btn--ghost mt-4" onClick={() => navigate('/')}>
            Volver al pasaporte
          </button>
        </div>
      )}
    </div>
  )
}
