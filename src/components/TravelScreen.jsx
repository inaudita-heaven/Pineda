import { useEffect } from 'react';

export default function TravelScreen({ stop, onClose }) {
  // Auto-open Google Maps after a short delay so the screen renders first
  useEffect(() => {
    const timer = setTimeout(() => {
      window.open(stop.mapsUrl, '_blank', 'noopener,noreferrer');
    }, 600);
    return () => clearTimeout(timer);
  }, [stop.mapsUrl]);

  return (
    <div className="travel-screen">
      <div className="travel-screen__inner">
        <p className="travel-screen__eyebrow">De camino a</p>

        <h2 className="travel-screen__name">{stop.nombre}</h2>
        {stop.direccion && (
          <p className="travel-screen__address">{stop.direccion}</p>
        )}

        <div className="travel-screen__maps-note">
          <p>Google Maps se ha abierto con la ruta a pie.</p>
          <a
            href={stop.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn--outline travel-screen__maps-btn"
          >
            Abrir Google Maps →
          </a>
        </div>

        {stop.anzuelo && (
          <blockquote className="travel-screen__anzuelo">
            {stop.anzuelo}
          </blockquote>
        )}

        <p className="travel-screen__hint">
          Cuando llegues, busca el cartel en la puerta y escanea el QR.
        </p>

        <button className="btn btn--ghost travel-screen__back" onClick={onClose}>
          ← Volver a la ruta
        </button>
      </div>
    </div>
  );
}
