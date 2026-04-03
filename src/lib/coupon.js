const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // sin O/0/I/1 para evitar confusión

/**
 * Genera un código PINEDA30-XXXXXX determinista a partir del sessionId.
 * No requiere base de datos para generarse; se puede validar en Supabase
 * almacenando el sessionId cuando el usuario llega a la parada 12.
 */
export function generateCouponCode(sessionId) {
  // Hash simple del sessionId para producir 6 caracteres
  let hash = 0
  for (let i = 0; i < sessionId.length; i++) {
    hash = ((hash << 5) - hash + sessionId.charCodeAt(i)) | 0
  }
  // Convertir a 6 caracteres del alfabeto seguro
  let code = ''
  let n = Math.abs(hash)
  for (let i = 0; i < 6; i++) {
    code += CHARS[n % CHARS.length]
    n = Math.floor(n / CHARS.length) || (n + 7919) // primo para variar
  }
  return `PINEDA30-${code}`
}

export const MIN_STOPS_FOR_COUPON = 5
