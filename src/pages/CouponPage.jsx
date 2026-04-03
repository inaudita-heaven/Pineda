import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PassportHeader from '../components/PassportHeader'
import CouponDisplay from '../components/CouponDisplay'
import { usePassportStore } from '../store/passportStore'
import { MIN_STOPS_FOR_COUPON } from '../lib/coupon'
import { supabase } from '../lib/supabase'

export default function CouponPage() {
  const navigate = useNavigate()
  const completedStops = usePassportStore(s => s.completedStops)
  const sessionId = usePassportStore(s => s.sessionId)
  const saveContact = usePassportStore(s => s.saveContact)
  const savedContact = usePassportStore(s => s.contact)

  const [email, setEmail] = useState(savedContact?.email ?? '')
  const [phone, setPhone] = useState(savedContact?.phone ?? '')
  const [submitted, setSubmitted] = useState(!!savedContact)
  const [loading, setLoading] = useState(false)

  const hasEnoughStops = completedStops.length >= MIN_STOPS_FOR_COUPON

  async function handleContactSubmit(e) {
    e.preventDefault()
    if (!email && !phone) return

    setLoading(true)
    try {
      // Guardar en Supabase (tabla: ruta_expo_contacts)
      await supabase.from('ruta_expo_contacts').upsert({
        session_id: sessionId,
        email: email || null,
        phone: phone || null,
        completed_stops: completedStops,
        created_at: new Date().toISOString(),
      }, { onConflict: 'session_id' })
    } catch {
      // Supabase fallo silencioso — el cupón sigue visible
    } finally {
      saveContact({ email, phone })
      setSubmitted(true)
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
            Necesitas visitar al menos {MIN_STOPS_FOR_COUPON} paradas para desbloquear tu descuento.
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
            Déjanos tu email o teléfono y te lo enviamos. Completamente opcional.
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
            style={{ marginTop: 12, fontSize: '0.75rem', cursor: 'pointer' }}
            onClick={() => setSubmitted(true)}
          >
            No, gracias
          </p>
        </div>
      ) : (
        <div style={{ marginTop: 24, textAlign: 'center' }}>
          {savedContact?.email || savedContact?.phone ? (
            <p className="text-muted">¡Listo! Te hemos guardado el código.</p>
          ) : null}
          <button className="btn btn--ghost mt-4" onClick={() => navigate('/')}>
            Volver al pasaporte
          </button>
        </div>
      )}
    </div>
  )
}
