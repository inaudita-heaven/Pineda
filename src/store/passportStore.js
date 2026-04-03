import { create } from 'zustand'
import { loadSession, saveSession, INITIAL_SESSION } from '../lib/session'

function getInitialState() {
  const saved = loadSession()
  return saved ?? { ...INITIAL_SESSION }
}

export const usePassportStore = create((set, get) => ({
  ...getInitialState(),

  /** Marca una parada como completada. Primera persistencia tras parada 1 muestra aviso. */
  completeStop(stopId) {
    set(state => {
      if (state.completedStops.includes(stopId)) return state
      const next = { ...state, completedStops: [...state.completedStops, stopId] }
      saveSession(next)
      return next
    })
  },

  /** Marca que el usuario ya vio el aviso de pérdida de progreso. */
  markWarningShown() {
    set(state => {
      const next = { ...state, hasSeenWarning: true }
      saveSession(next)
      return next
    })
  },

  /** Guarda contacto opcional (parada 12). */
  saveContact(contact) {
    set(state => {
      const next = { ...state, contact }
      saveSession(next)
      return next
    })
  },

  /** Resetea el pasaporte completamente. */
  reset() {
    const fresh = { ...INITIAL_SESSION, sessionId: get().sessionId }
    saveSession(fresh)
    set(fresh)
  },

  isCompleted(stopId) {
    return get().completedStops.includes(stopId)
  },

  get completedCount() {
    return get().completedStops.length
  },
}))
