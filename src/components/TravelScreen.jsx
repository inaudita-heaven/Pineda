import { useEffect } from 'react';

export default function TravelScreen({ stop }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.open(stop.mapsUrl, '_blank', 'noopener,noreferrer');
    }, 600);
    return () => clearTimeout(timer);
  }, [stop.mapsUrl]);

  return (
    <div className="travel-screen">
      <div className="travel-screen__inner">
        <p className="travel-screen__eyebrow">
          {stop.nombre}
        </p>

        <p className="travel-screen__instruction">
          Cuando llegues<br />
          abre la cámara de tu móvil<br />
          y apunta al cartel de Pineda<br />
          que encontrarás en la entrada
        </p>

        <a
          href={stop.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="travel-screen__maps-link"
        >
          Abrir Google Maps →
        </a>
      </div>
    </div>
  );
}
