import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function TravelScreen({ stop }) {
  const { t } = useTranslation();
  const [count, setCount] = useState(3);
  const intervalRef = useRef(null);

  function openMaps() {
    clearInterval(intervalRef.current);
    window.location.href = stop.mapsUrl;
  }

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCount(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          window.location.href = stop.mapsUrl;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [stop.mapsUrl]);

  return (
    <div className="travel-screen">
      <div className="travel-screen__inner">
        <p className="travel-screen__eyebrow">
          {stop.nombre}
        </p>

        <p className="travel-screen__instruction">
          {t('travel.instruction')}
        </p>

        <div className="travel-screen__maps-row">
          <p className="travel-screen__countdown">
            {count > 0 ? t('travel.countdown', { count }) : t('travel.opening')}
          </p>
          <button className="btn btn--primary travel-screen__now-btn" onClick={openMaps}>
            {t('travel.go_now')}
          </button>
        </div>
      </div>
    </div>
  );
}
