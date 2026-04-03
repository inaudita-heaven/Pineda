import { create } from 'zustand'
import { loadSession, saveSession, INITIAL_SESSION } from '../lib/session'
import { upsertVisitante, registrarEscaneo } from '../lib/supabase'

function getInitialState() {
  const saved = loadSession()
  return saved ?? { ...INITIAL_SESSION }
}

export const usePassportStore = create((set, get) => ({
  ...getInitialState(),

  // ID del registro en la tabla `visitantes` de Supabase (null hasta primer sync)
  visitorDbId: null,
  // Bloqueo anti-doble-tap durante petición en vuelo
  scanLock: false,

  /**
   * Registra una parada completada.
   * Flujo:
   *  1. scanLock ON
   *  2. upsert visitante en Supabase (obtiene visitor_id de DB)
   *  3. registrar escaneo con idempotency_key
   *  4. actualizar estado local
   *  5. scanLock OFF
   *
   * Si Supabase falla, el progreso se guarda igualmente en localStorage
   * para no penalizar al usuario en zonas con mala cobertura.
   */
  async completeStop(stopId) {
    const state = get()
    if (state.scanLock) return { ok: false, reason: 'locked' }
    if (state.completedStops.includes(stopId)) return { ok: false, reason: 'duplicate' }

    set({ scanLock: true })

    let visitorDbId = state.visitorDbId
    try {
      if (!visitorDbId) {
        visitorDbId = await upsertVisitante(state.sessionId)
        set({ visitorDbId })
      }
      await registrarEscaneo(visitorDbId, stopId)
    } catch {
      // Fallo silencioso — progreso sigue guardándose localmente
    }

    set(s => {
      const next = { ...s, completedStops: [...s.completedStops, stopId], scanLock: false }
      saveSession(next)
      return next
    })

    return { ok: true }
  },

  markWarningShown() {
    set(state => {
      const next = { ...state, hasSeenWarning: true }
      saveSession(next)
      return next
    })
  },

  saveContact(contact) {
    set(state => {
      const next = { ...state, contact, rgpdConsent: true }
      saveSession(next)
      return next
    })
  },

  reset() {
    const fresh = { ...INITIAL_SESSION }
    saveSession(fresh)
    set({ ...fresh, visitorDbId: null, scanLock: false })
  },

  isCompleted(stopId) {
    return get().completedStops.includes(stopId)
  },
}))
