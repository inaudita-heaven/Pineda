/**
 * Plantilla genérica usada por las paradas que aún no tienen contenido propio.
 * Reemplazar este componente en cada parada con el contenido real.
 */
export default function GenericStop({ parada }) {
  return (
    <div>
      <p className="stop-page__number">Parada {String(parada.id).padStart(2, '0')} · {parada.sector}</p>
      <h1 className="stop-page__title">{parada.nombre}</h1>
      <p className="stop-page__location">📍 {parada.ubicacion}</p>

      {/* Imagen placeholder */}
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
    </div>
  )
}
