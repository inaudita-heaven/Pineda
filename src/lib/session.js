/**
 * Gestión de sesión anónima en localStorage.
 * El session_id se usa como clave en la tabla `visitantes` de Supabase.
 * El usuario nunca ve este ID — es transparente.
 */
const KEY = 'rutaexpo_session'

function generateSessionId() {
  // Prefijo + timestamp + random para unicidad práctica
  return 'ses_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 9)
}

export function loadSession() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function saveSession(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    // localStorage no disponible (modo privado extremo, etc.)
  }
}

export function clearSession() {
  localStorage.removeItem(KEY)
}

export const INITIAL_SESSION = {
  sessionId: generateSessionId(),
  completedStops: [],     // array de stop ids (1–12)
  hasSeenWarning: false,
  contact: null,          // { email?, phone? } — captura opcional al final
  rgpdConsent: false,     // se activa al enviar contacto
  startedAt: new Date().toISOString(),
}
