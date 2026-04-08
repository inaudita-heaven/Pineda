import { useState, useCallback } from 'react';
import { STOPS, REQUIRED_STOP_IDS } from './data/stops';
import {
  getOrCreateSessionId,
  getVisitedStops,
  saveVisitedStops,
  checkCouponEligibility,
} from './utils/coupon';
import StopCard from './components/StopCard';
import CouponView from './components/CouponView';
import QrScanner from './components/QrScanner';
import TravelScreen from './components/TravelScreen';

const sessionId = getOrCreateSessionId();

export default function App() {
  const [visited, setVisited] = useState(() => new Set(getVisitedStops()));
  const [showCoupon, setShowCoupon] = useState(false);
  const [started, setStarted] = useState(visited.size > 0);
  const [showScanner, setShowScanner] = useState(false);
  const [travelStop, setTravelStop] = useState(null); // stop object to travel to
  const [qrError, setQrError] = useState(null);

  const eligibility = checkCouponEligibility([...visited]);

  function handleSeal(stopId) {
    const next = new Set(visited);
    next.add(stopId);
    setVisited(next);
    saveVisitedStops([...next]);
  }

  function handleStart() {
    setStarted(true);
    // Parada 1 se sella automáticamente: el usuario está en Viana al comenzar
    handleSeal(1);
  }

  // Called by QrScanner when it successfully reads a code
  const handleQrScan = useCallback((decodedText) => {
    setShowScanner(false);
    try {
      const url = new URL(decodedText);
      const stopId = parseInt(url.searchParams.get('stop'), 10);
      const token = url.searchParams.get('token');
      const stop = STOPS.find(s => s.id === stopId && s.token === token);
      if (stop) {
        handleSeal(stopId);
        if (!started) setStarted(true);
      } else {
        setQrError('QR no reconocido. Asegúrate de escanear el cartel oficial de la ruta.');
        setTimeout(() => setQrError(null), 4000);
      }
    } catch {
      setQrError('No se pudo leer el QR. Inténtalo de nuevo.');
      setTimeout(() => setQrError(null), 4000);
    }
  }, [started, visited]);

  function handleOpenScanner() {
    setShowScanner(true);
  }

  function handleTravel(nextStop) {
    setTravelStop(nextStop);
  }

  const requiredVisited = REQUIRED_STOP_IDS.filter(id => visited.has(id));

  // ── Welcome screen ────────────────────────────────────────────────────────
  if (!started) {
    return (
      <div className="welcome">
        <div className="welcome__inner">
          <div className="welcome__portrait" aria-hidden="true">
            <div className="welcome__portrait-frame">
              <span className="welcome__portrait-initials">R.P.</span>
            </div>
          </div>

          <p className="welcome__eyebrow">Córdoba · Abril–Mayo 2025</p>
          <h1 className="welcome__title">
            Rafael Pineda<br />
            <span>Pintor de Córdoba</span>
          </h1>

          <p className="welcome__lead">
            Treinta años pintando Córdoba desde dentro. Sus cuadros no son
            postales: son memoria de barrio, luz de patio y la sombra exacta
            que deja un capote al caer. Esta ruta te lleva a las tabernas y
            espacios donde viven sus obras.
          </p>

          <div className="welcome__salas">
            <div className="sala-badge">
              <span className="sala-badge__num">I</span>
              <span>Palacio de Viana</span>
            </div>
            <div className="sala-badge">
              <span className="sala-badge__num">IV</span>
              <span>Casa 12PB</span>
            </div>
            <div className="sala-badge">
              <span className="sala-badge__num">XIII</span>
              <span>La Inaudita</span>
            </div>
          </div>

          <p className="welcome__meta">
            13 paradas · Casco antiguo · ~2 horas a pie
          </p>

          <p className="welcome__prize">
            Completa la ruta y obtén un <strong>30 % de descuento</strong> en obra seleccionada.
          </p>

          <button className="btn btn--primary btn--large" onClick={handleStart}>
            Comenzar la ruta
          </button>
        </div>
      </div>
    );
  }

  // ── Travel screen ─────────────────────────────────────────────────────────
  if (travelStop) {
    return <TravelScreen stop={travelStop} />;
  }

  // ── Main passport view ────────────────────────────────────────────────────
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
            <span>¡Tienes tu descuento!</span>
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

        <div className="header__scanner-row">
          <button className="btn btn--primary btn--scan" onClick={handleOpenScanner}>
            Escanear QR
          </button>
        </div>
      </header>

      {qrError && (
        <div className="qr-error-toast">{qrError}</div>
      )}

      <main className="passport">
        {STOPS.map((stop, idx) => {
          const nextStop = idx < STOPS.length - 1 ? STOPS[idx + 1] : null;
          return (
            <StopCard
              key={stop.id}
              stop={stop}
              visited={visited.has(stop.id)}
              nextStop={nextStop}
              onScan={handleOpenScanner}
              onTravel={handleTravel}
            />
          );
        })}
      </main>

      {showScanner && (
        <QrScanner onScan={handleQrScan} onClose={() => setShowScanner(false)} />
      )}

      {showCoupon && (
        <CouponView sessionId={sessionId} onClose={() => setShowCoupon(false)} />
      )}
    </div>
  );
}
