import { REQUIRED_STOP_IDS } from '../data/stops';

export default function StopCard({ stop, visited, onSeal }) {
  const isRequired = REQUIRED_STOP_IDS.includes(stop.id);

  return (
    <div className={`stop-card ${visited ? 'stop-card--sealed' : ''}`}>
      <div className="stop-card__number">{String(stop.id).padStart(2, '0')}</div>

      {isRequired && <span className="stop-card__badge">Sala principal</span>}

      <div className="stop-card__body">
        <h3 className="stop-card__name">{stop.nombre}</h3>
        {stop.subtitulo && (
          <p className="stop-card__subtitle">{stop.subtitulo}</p>
        )}
        <p className="stop-card__zone">{stop.zona}</p>
        {stop.direccion && (
          <p className="stop-card__address">{stop.direccion}</p>
        )}
      </div>

      <div className="stop-card__footer">
        {visited ? (
          <div className="stop-card__seal">
            <span className="stop-card__seal-icon">✦</span>
            <span>Sellada</span>
          </div>
        ) : (
          <div className="stop-card__actions">
            <a
              href={stop.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--ghost"
            >
              Cómo llegar
            </a>
            <button className="btn btn--outline" onClick={() => onSeal(stop.id)}>
              Sellar parada
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
