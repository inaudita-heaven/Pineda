import { useNavigate } from 'react-router-dom'
import PassportHeader from '../components/PassportHeader'
import ProgressBar from '../components/ProgressBar'
import StopCard from '../components/StopCard'
import { PARADAS } from '../data/paradas'
import { usePassportStore } from '../store/passportStore'
import { MIN_STOPS_FOR_COUPON } from '../lib/coupon'

export default function Home() {
  const navigate = useNavigate()
  const completedStops = usePassportStore(s => s.completedStops)
  const canGetCoupon = completedStops.length >= MIN_STOPS_FOR_COUPON

  return (
    <div className="page">
      <PassportHeader />

      <section className="home-hero">
        <p className="home-hero__eyebrow">Córdoba · 12 espacios</p>
        <h1 className="home-hero__title">Tu pasaporte<br />de la Ruta Expo</h1>
        <p className="home-hero__subtitle">
          Visita las 12 paradas, sella tu pasaporte y consigue un descuento exclusivo en La Inaudita.
        </p>

        {canGetCoupon ? (
          <button className="btn btn--gold" onClick={() => navigate('/cupon')}>
            Ver mi cupón de descuento ✦
          </button>
        ) : (
          <p className="text-muted">
            Visita al menos {MIN_STOPS_FOR_COUPON} paradas para desbloquear tu descuento
          </p>
        )}
      </section>

      <ProgressBar />

      <p className="section-title">Las paradas</p>
      <div className="stops-grid">
        {PARADAS.map(parada => (
          <StopCard key={parada.id} parada={parada} />
        ))}
      </div>
    </div>
  )
}
