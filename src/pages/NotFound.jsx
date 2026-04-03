import { useNavigate } from 'react-router-dom'

export default function NotFound() {
  const navigate = useNavigate()
  return (
    <div className="page" style={{ textAlign: 'center', paddingTop: 80 }}>
      <p style={{ fontSize: '3rem', marginBottom: 12 }}>🗺️</p>
      <h1 style={{ marginBottom: 8 }}>Página no encontrada</h1>
      <p className="text-muted" style={{ marginBottom: 28 }}>
        Esta parada no existe en la ruta.
      </p>
      <button className="btn btn--primary" onClick={() => navigate('/')}>
        Volver al pasaporte
      </button>
    </div>
  )
}
