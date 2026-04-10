/**
 * coupon.js — Lógica de elegibilidad del cupón PINEDA30
 * src/lib/coupon.js
 *
 * Regla: 3 salas obligatorias (ids 1, 4, 13) + mínimo 2 tabernas libres = 5 total
 */

const REQUIRED_IDS  = [1, 4, 13];
const MIN_FREE      = 2;

/**
 * @param {number[]} visitedStopIds
 * @returns {{ eligible: boolean, missingRequired: number[], missingFree: number, total: number }}
 */
export function checkCouponEligibility(visitedStopIds) {
  const visited        = new Set(visitedStopIds);
  const missingRequired = REQUIRED_IDS.filter(id => !visited.has(id));
  const freeVisited     = [...visited].filter(id => !REQUIRED_IDS.includes(id)).length;
  const missingFree     = Math.max(0, MIN_FREE - freeVisited);

  return {
    eligible:        missingRequired.length === 0 && freeVisited >= MIN_FREE,
    missingRequired,
    missingFree,
    total:           visited.size,
  };
}

/** Devuelve true si hoy no es domingo (La Inaudita cierra domingos) */
export function isCouponRedeemableToday() {
  return new Date().getDay() !== 0;
}
