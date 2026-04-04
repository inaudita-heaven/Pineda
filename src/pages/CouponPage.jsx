import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PassportHeader from '../components/PassportHeader'
import CouponDisplay from '../components/CouponDisplay'
import { usePassportStore } from '../store/passportStore'
import { checkCouponEligibility, generateCouponCode } from '../lib/coupon'
import { upsertVisitante, upsertCupon, guardarContacto } from '../lib/supabase'
import { PARADAS } from '../data/paradas'

export default function CouponPage() {
  const navigate = useNavigate()
  const completedStops = usePassportStore(s => s.completedStops)
  const sessionId = usePassportStore(s => s.sessionId)
  const saveContact = usePassportStore(s => s.saveContact)
  const savedContact = usePassportStore(s => s.contact)
  const visitorDbId = usePassportStore(s => s.visitorDbId)

  const { eligible, missingRequired, remaining } = checkCouponEligibility(completedStops)

  const [email, setEmail] = useState(savedContact?.email ?? '')
  const [phone, setPhone] = useState(savedContact?.phone ?? '')
  const [rgpd, setRgpd] = useState(false)
  const [submitted, setSubmitted] = useState(!!savedContact)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!eligible) return
    async function persistCoupon() {
      try {
        const dbId = visitorDbId ?? (await upsertVisitante(sessionId))
        await upsertCupon(dbId, generateCouponCode(sessionId))
      } catch { /* fallo silencioso */ }
    }
    persistCoupon()
  }, [eligible])

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
    } catch {
      setError('No se pudo guardar. Inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  if (!eligible) {
    const missingNames = missingRequired
      .map(id => PARADAS.find(p => p.id === id)?.nombre)
      .filter(Boolean)

    return (
      <div className="page">
        <PassportHeader showBack />
        <div style={{ marginTop: 48, textAlign: 'center' }}>
          <p style={{ fontSize: '2.5rem', marginBottom: 12 }}>🗺️</p>
          <h2 style={{ marginBottom: 8 }}>Aún no está listo</h2>
          {missingNames.length > 0 && (
            <p className="text-muted" style={{ marginBottom: 8 }}>
              ⭐ Te faltan las salas: <strong>{missingNames.join(', ')}</strong>
            </p>
          )}
          {remaining > 0 && (
            <p className="text-muted" style={{ marginBottom: 24 }}>
              Y {remaining} parada{remaining !== 1 ? 's' : ''} más en total ({completedStops.length}/5 mínimo).
            </p>
          )}
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

      <div style={{ marginTop: 16, textAlign: 'center' }}>
        <p style={{ fontSize: '2rem', marginBottom: 8 }}>🎉</p>
        <h1 style={{ marginBottom: 4 }}>¡Lo conseguiste!</h1>
        <p className="text-muted" style={{ marginBottom: 8 }}>
          {completedStops.length} de 12 paradas selladas
        </p>
      </div>

      <CouponDisplay />

      <p className="text-muted text-center" style={{ fontSize: '0.82rem', marginBottom: 24 }}>
        Muestra este código en La Inaudita · C. Rodríguez Marín, 20<br />
        30% de descuento en obra original de Rafael Pineda
      </p>

      {!submitted ? (
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 24 }}>
          <p style={{ fontWeight: 600, marginBottom: 4 }}>¿Quieres guardar tu código?</p>
          <p className="text-muted" style={{ marginBottom: 16, fontSize: '0.85rem' }}>
            Déjanos tu contacto y te lo guardamos por si lo necesitas. Completamente opcional.
          </p>
          <form onSubmit={handleContactSubmit}>
            <div className="form-field">
              <label htmlFor="email">Email (opcional)</label>
              <input id="email" type="email" placeholder="tu@email.com"
                value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" />
            </div>
            <div className="form-field">
              <label htmlFor="phone">Teléfono (opcional)</label>
              <input id="phone" type="tel" placeholder="+34 600 000 000"
                value={phone} onChange={e => setPhone(e.target.value)} autoComplete="tel" />
            </div>
            <label style={{ display: 'flex', gap: 10, marginBottom: 16, fontSize: '0.8rem', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <input type="checkbox" checked={rgpd} onChange={e => setRgpd(e.target.checked)} style={{ marginTop: 2, flexShrink: 0 }} />
              Acepto que La Inaudita almacene mis datos para enviarte el código. Puedes solicitar su eliminación en cualquier momento.
            </label>
            {error && <p style={{ color: '#991b1b', fontSize: '0.82rem', marginBottom: 10 }}>{error}</p>}
            <button className="btn btn--secondary" type="submit" disabled={loading || (!email && !phone)}>
              {loading ? 'Guardando…' : 'Guardar mi código'}
            </button>
          </form>
          <p className="text-muted text-center"
            style={{ marginTop: 14, fontSize: '0.78rem', cursor: 'pointer', textDecoration: 'underline' }}
            onClick={() => setSubmitted(true)}>
            No, gracias
          </p>
        </div>
      ) : (
        <button className="btn btn--ghost mt-4" onClick={() => navigate('/')}>
          Volver al pasaporte
        </button>
      )}
    </div>
  )
}
