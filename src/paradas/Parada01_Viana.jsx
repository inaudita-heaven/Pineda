/**
 * Parada 01 — Palacio de Viana
 * Primera parada de la ruta. Inicio del pasaporte.
 * TODO: Completar con contenido real (artista, descripción, imagen)
 */
export default function Parada01_Viana({ parada }) {
  return (
    <div>
      <p className="stop-page__number">Parada 01 · Inicio de la ruta</p>
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

      {/* Nota especial de primera parada */}
      <div style={{
        background: '#fff7ed',
        border: '1px solid #fed7aa',
        borderRadius: 'var(--radius-sm)',
        padding: '12px 14px',
        marginBottom: 16,
        fontSize: '0.85rem',
        color: '#9a3412',
      }}>
        <strong>¡Bienvenido/a a la Ruta Expo!</strong> Sella cada parada y consigue tu descuento en La Inaudita al completar 5 o más.
      </div>
    </div>
  )
}
