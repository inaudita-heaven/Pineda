import { useNavigate } from 'react-router-dom'
import PassportHeader from '../components/PassportHeader'
import ProgressBar from '../components/ProgressBar'
import StopCard from '../components/StopCard'
import MapView from '../components/MapView'
import { PARADAS } from '../data/paradas'
import { usePassportStore } from '../store/passportStore'
import { checkCouponEligibility } from '../lib/coupon'

export default function Home() {
  const navigate = useNavigate()
  const completedStops = usePassportStore(s => s.completedStops)
  const { eligible } = checkCouponEligibility(completedStops)

  return (
    <div className="page">
      <PassportHeader />

      <section className="home-hero">
        <p className="home-hero__eyebrow">Córdoba · 13 espacios</p>
        <h1 className="home-hero__title">Rafael Pineda<br />Pintor de Córdoba</h1>
        <p className="home-hero__subtitle">
          Visita las 13 paradas, sella tu pasaporte y consigue un 30% de descuento en obra original en La Inaudita.
        </p>

        {eligible ? (
          <button className="btn btn--gold" onClick={() => navigate('/cupon')}>
            Ver mi cupón de descuento ✦
          </button>
        ) : (
          <p className="text-muted" style={{ fontSize: '0.8rem' }}>
            ⭐ Visita Viana, La Casa 12Pb y La Inaudita + 2 paradas más para desbloquear tu descuento
          </p>
        )}
      </section>

      <ProgressBar />

      <MapView />

      <p className="section-title">Tu pasaporte · ⭐ obligatoria</p>
      <div className="stops-grid">
        {PARADAS.map(parada => (
          <StopCard key={parada.id} parada={parada} />
        ))}
      </div>
    </div>
  )
}
