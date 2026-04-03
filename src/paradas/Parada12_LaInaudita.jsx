/**
 * Parada 12 — La Inaudita
 * Última parada de la ruta. Aquí se desbloquea el cupón.
 * TODO: Completar con contenido real (artista, descripción, imagen)
 */
import { usePassportStore } from '../store/passportStore'
import { MIN_STOPS_FOR_COUPON } from '../lib/coupon'

export default function Parada12_LaInaudita({ parada }) {
  const completedCount = usePassportStore(s => s.completedStops.length)
  const canGetCoupon = completedCount >= MIN_STOPS_FOR_COUPON

  return (
    <div>
      <p className="stop-page__number">Parada 12 · Parada final</p>
      <h1 className="stop-page__title">{parada.nombre}</h1>
      <p className="stop-page__location">📍 {parada.ubicacion}</p>

      {/* Imagen */}
      <div className="stop-page__image">
        {parada.imagen
          ? <img src={parada.imagen} alt={parada.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius)' }} />
          : <span>Imagen · TODO</span>
        }
      </div>

      {/* Obra */}
      <div style={{ background: 'var(--border)', borderRadius: 'var(--radius-sm)', padding: '12px 14px', marginBottom: 16 }}>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 2 }}>Obra</p>
        <p style={{ fontWeight: 600 }}>{parada.obra}</p>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{parada.artista}</p>
      </div>

      {/* Descripción */}
      <div className="stop-page__content">
        <p>{parada.descripcion}</p>
      </div>

      {/* Estado del cupón */}
      {canGetCoupon ? (
        <div style={{
          background: 'linear-gradient(135deg, #fff7ed, #fef3c7)',
          border: '2px solid var(--accent-gold)',
          borderRadius: 'var(--radius-sm)',
          padding: '14px 16px',
          marginBottom: 16,
          textAlign: 'center',
        }}>
          <p style={{ fontWeight: 700, color: 'var(--accent-gold)', marginBottom: 4 }}>
            ✦ ¡Cupón desbloqueado!
          </p>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Completa esta parada para ver tu código de descuento.
          </p>
        </div>
      ) : (
        <div style={{
          background: 'var(--border)',
          borderRadius: 'var(--radius-sm)',
          padding: '14px 16px',
          marginBottom: 16,
          textAlign: 'center',
        }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Necesitas {MIN_STOPS_FOR_COUPON - completedCount} parada{(MIN_STOPS_FOR_COUPON - completedCount) !== 1 ? 's' : ''} más para desbloquear el descuento.
          </p>
        </div>
      )}
    </div>
  )
}
