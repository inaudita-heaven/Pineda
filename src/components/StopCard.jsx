import { REQUIRED_STOP_IDS } from '../data/stops';
import { getStopStatus } from '../utils/schedule';

export default function StopCard({ stop, visited, nextStop, onScan, onTravel }) {
  const isRequired = REQUIRED_STOP_IDS.includes(stop.id);
  const status = getStopStatus(stop);
  const isSunday = new Date().getDay() === 0;
  const isInaudita = stop.id === 13;

  return (
    <div className={`stop-card ${visited ? 'stop-card--sealed' : ''} ${status.open === false ? 'stop-card--closed' : ''}`}>
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

        <div className={`stop-card__status ${status.open === true ? 'stop-card__status--open' : status.open === false ? 'stop-card__status--closed' : 'stop-card__status--unknown'}`}>
          {status.open === true && <span className="status-dot status-dot--green" />}
          {status.open === false && <span className="status-dot status-dot--red" />}
          {status.open === null && <span className="status-dot status-dot--gray" />}
          <span>{status.label}</span>
        </div>

        {isInaudita && isSunday && (
          <div className="stop-card__sunday-warning">
            La Inaudita cierra los domingos. El cupón puede canjearse de L–S.
          </div>
        )}
      </div>

      <div className="stop-card__footer">
        {visited ? (
          <div className="stop-card__sealed-row">
            <div className="stop-card__seal">
              <span className="stop-card__seal-icon">✦</span>
              <span>Sellada</span>
            </div>
            {nextStop && (
              <button
                className="btn btn--outline btn--sm"
                onClick={() => onTravel(nextStop)}
              >
                Ir a {nextStop.nombre.split(' ')[0]} →
              </button>
            )}
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
            <button className="btn btn--outline" onClick={() => onScan(stop.id)}>
              Escanear QR
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
