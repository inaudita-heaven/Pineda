import { REQUIRED_STOP_IDS, MIN_FREE_STOPS } from '../data/stops';

export function checkCouponEligibility(visitedStopIds) {
  const visited = new Set(visitedStopIds);
  const missingRequired = REQUIRED_STOP_IDS.filter(id => !visited.has(id));
  const freeVisited = [...visited].filter(id => !REQUIRED_STOP_IDS.includes(id)).length;
  const missingFree = Math.max(0, MIN_FREE_STOPS - freeVisited);
  return {
    eligible: missingRequired.length === 0 && freeVisited >= MIN_FREE_STOPS,
    missingRequired,
    missingFree,
    total: visited.size,
  };
}

export function isCouponRedeemableToday() {
  return new Date().getDay() !== 0; // 0 = domingo
}

export function generateCouponCode(sessionId) {
  const suffix = sessionId.replace(/-/g, '').slice(0, 6).toUpperCase();
  return `PINEDA30-${suffix}`;
}

export function getOrCreateSessionId() {
  const key = 'ruta_expo_session_id';
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
}

export function getVisitedStops() {
  const key = 'ruta_expo_visited';
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch {
    return [];
  }
}

export function saveVisitedStops(stopIds) {
  localStorage.setItem('ruta_expo_visited', JSON.stringify(stopIds));
}
