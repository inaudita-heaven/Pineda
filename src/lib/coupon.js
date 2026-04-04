import { REQUIRED_STOP_IDS } from '../data/paradas'

export const MIN_STOPS_FOR_COUPON = 5

/**
 * Comprueba si el visitante puede recibir el cupón PINEDA30.
 *
 * Condiciones:
 *   1. Ha sellado al menos 5 paradas en total.
 *   2. Entre ellas están las 3 salas obligatorias (Viana, Casa 12Pb, La Inaudita).
 *
 * @param {number[]} visitedStopIds
 * @returns {{ eligible: boolean, missingRequired: number[], remaining: number }}
 */
export function checkCouponEligibility(visitedStopIds) {
  const visited = new Set(visitedStopIds)
  const missingRequired = REQUIRED_STOP_IDS.filter(id => !visited.has(id))
  const remaining = Math.max(0, MIN_STOPS_FOR_COUPON - visited.size)

  return {
    eligible: missingRequired.length === 0 && visited.size >= MIN_STOPS_FOR_COUPON,
    missingRequired,
    remaining,
  }
}

const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

/**
 * Genera un código PINEDA30-XXXXXX determinista a partir del sessionId.
 */
export function generateCouponCode(sessionId) {
  let hash = 0
  for (let i = 0; i < sessionId.length; i++) {
    hash = ((hash << 5) - hash + sessionId.charCodeAt(i)) | 0
  }
  let code = ''
  let n = Math.abs(hash)
  for (let i = 0; i < 6; i++) {
    code += CHARS[n % CHARS.length]
    n = Math.floor(n / CHARS.length) || (n + 7919)
  }
  return `PINEDA30-${code}`
}
