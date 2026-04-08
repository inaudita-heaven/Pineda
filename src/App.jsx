import { useState } from 'react';
import { STOPS, REQUIRED_STOP_IDS, MIN_STOPS_FOR_COUPON } from './data/stops';
import {
  getOrCreateSessionId,
  getVisitedStops,
  saveVisitedStops,
  checkCouponEligibility,
} from './utils/coupon';
import StopCard from './components/StopCard';
import CouponView from './components/CouponView';

const sessionId = getOrCreateSessionId();

export default function App() {
  const [visited, setVisited] = useState(() => new Set(getVisitedStops()));
  const [showCoupon, setShowCoupon] = useState(false);
  const [started, setStarted] = useState(visited.size > 0);

  const eligibility = checkCouponEligibility([...visited]);

  function handleSeal(stopId) {
    const next = new Set(visited);
    next.add(stopId);
    setVisited(next);
    saveVisitedStops([...next]);
  }

  function handleStart() {
    setStarted(true);
    // Sellar parada 1 automáticamente al comenzar
    handleSeal(1);
  }

  const requiredVisited = REQUIRED_STOP_IDS.filter(id => visited.has(id));

  if (!started) {
    return (
      <div className="welcome">
        <div className="welcome__inner">
          <p className="welcome__eyebrow">Córdoba · Abril–Mayo 2025</p>
          <h1 className="welcome__title">
            Rafael Pineda<br />
            <span>Pintor de Córdoba</span>
          </h1>
          <p className="welcome__lead">
            Una ruta por 13 tabernas y espacios históricos del casco antiguo,
            con obra del pintor cordobés Rafael Pineda.
          </p>
          <div className="welcome__salas">
            <div className="sala-badge">
              <span className="sala-badge__num">1</span>
              <span>Palacio de Viana</span>
            </div>
            <div className="sala-badge">
              <span className="sala-badge__num">4</span>
              <span>Casa 12PB</span>
            </div>
            <div className="sala-badge">
              <span className="sala-badge__num">13</span>
              <span>La Inaudita</span>
            </div>
          </div>
          <p className="welcome__prize">
            Completa la ruta y obtén un <strong>30% de descuento</strong> en obra seleccionada.
          </p>
          <button className="btn btn--primary btn--large" onClick={handleStart}>
            Comenzar ruta
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header__inner">
          <div className="header__meta">
            <p className="header__eyebrow">Pasaporte digital</p>
            <h1 className="header__title">Rafael Pineda</h1>
            <p className="header__sub">Pintor de Córdoba</p>
          </div>
          <div className="header__progress">
            <div className="progress-ring">
              <span className="progress-ring__num">{visited.size}</span>
              <span className="progress-ring__total">/13</span>
            </div>
          </div>
        </div>

        <div className="progress-bar">
          <div className="progress-bar__track">
            <div
              className="progress-bar__fill"
              style={{ width: `${(visited.size / 13) * 100}%` }}
            />
          </div>
          <div className="progress-pills">
            {REQUIRED_STOP_IDS.map(id => (
              <span key={id} className={`pill ${visited.has(id) ? 'pill--done' : ''}`}>
                {STOPS.find(s => s.id === id).nombre.split(' ')[0]}
              </span>
            ))}
          </div>
        </div>

        {eligibility.eligible ? (
          <div className="coupon-banner" onClick={() => setShowCoupon(true)}>
            <span>🎉 ¡Tienes tu descuento!</span>
            <span className="coupon-banner__cta">Ver cupón PINEDA30 →</span>
          </div>
        ) : (
          <div className="missing-banner">
            {eligibility.missingRequired.length > 0 && (
              <span>
                Salas pendientes:{' '}
                {eligibility.missingRequired
                  .map(id => STOPS.find(s => s.id === id).nombre)
                  .join(', ')}
              </span>
            )}
            {eligibility.remaining > 0 && eligibility.missingRequired.length === 0 && (
              <span>
                {eligibility.remaining} parada{eligibility.remaining > 1 ? 's' : ''} más para tu cupón
              </span>
            )}
            {eligibility.remaining > 0 && eligibility.missingRequired.length > 0 && (
              <span> · {eligibility.remaining} parada{eligibility.remaining > 1 ? 's' : ''} más</span>
            )}
          </div>
        )}
      </header>

      <main className="passport">
        {STOPS.map(stop => (
          <StopCard
            key={stop.id}
            stop={stop}
            visited={visited.has(stop.id)}
            onSeal={handleSeal}
          />
        ))}
      </main>

      {showCoupon && (
        <CouponView sessionId={sessionId} onClose={() => setShowCoupon(false)} />
      )}
    </div>
  );
}
