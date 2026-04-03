const KEY = 'rutaexpo_session'

function generateSessionId() {
  return 'ses_' + Math.random().toString(36).slice(2, 11) + Date.now().toString(36)
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
    // localStorage not available (private mode, etc.)
  }
}

export function clearSession() {
  localStorage.removeItem(KEY)
}

export function getOrCreateSessionId() {
  const existing = loadSession()
  if (existing?.sessionId) return existing.sessionId
  return generateSessionId()
}

export const INITIAL_SESSION = {
  sessionId: generateSessionId(),
  completedStops: [],   // array of stop ids (1–12)
  hasSeenWarning: false,
  contact: null,        // { email?, phone? } — captura opcional al final
  startedAt: new Date().toISOString(),
}
