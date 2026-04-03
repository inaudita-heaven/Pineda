import { useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { validateQrToken, getParadaById } from '../data/paradas'

/**
 * Ruta /scan?p=<paradaId>&t=<token>
 * Punto de entrada cuando el visitante escanea el QR físico en la parada.
 * Redirige a /parada/:id?t=<token> para el procesamiento.
 */
export default function ScanLanding() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  useEffect(() => {
    const paradaId = searchParams.get('p')
    const token = searchParams.get('t')

    if (!paradaId || !token) {
      navigate('/', { replace: true })
      return
    }

    const parada = getParadaById(paradaId)
    if (!parada) {
      navigate('/', { replace: true })
      return
    }

    // Redirige a la página de la parada con el token en la URL
    navigate(`/parada/${paradaId}?t=${encodeURIComponent(token)}`, { replace: true })
  }, [])

  return (
    <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100dvh' }}>
      <p className="text-muted">Cargando parada…</p>
    </div>
  )
}
