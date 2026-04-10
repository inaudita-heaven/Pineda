/**
 * session.js — Gestión de sesión anónima
 * src/lib/session.js
 *
 * Sesión completamente anónima: sin registro, sin login.
 * El session_id se genera en el primer acceso y persiste en localStorage.
 *
 * Qué guarda localStorage:
 *   pineda_session_id   — UUID v4 anónimo (permanente)
 *   pineda_visited      — JSON array de stop IDs sellados: [1, 4, ...]
 *   pineda_coupon       — código PINEDA30-XXXXXX una vez desbloqueado
 *   pineda_credits_seen — boolean: si ya se mostró PantallaCreditos
 *   pineda_lang         — código de idioma (gestionado por i18n.js)
 *
 * IMPORTANTE: toda escritura a Supabase usa el session_id como clave foránea.
 * El session_id nunca se muestra al usuario ni se envía por email.
 */

// ── Claves de localStorage ─────────────────────────────────────────────────────
const KEY_SESSION_ID    = 'pineda_session_id';
const KEY_VISITED       = 'pineda_visited';
const KEY_COUPON        = 'pineda_coupon';
const KEY_CREDITS_SEEN  = 'pineda_credits_seen';

// ── Generador de UUID v4 ───────────────────────────────────────────────────────
// Usa crypto.randomUUID() si está disponible (todos los browsers modernos + HTTPS).
// Fallback manual para entornos sin soporte (raro pero posible en Android antiguo).
const generateUUID = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  // Fallback
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

// ── session_id ─────────────────────────────────────────────────────────────────

/**
 * Devuelve el session_id existente o crea uno nuevo.
 * Es la única función que debe llamarse para obtener el ID del visitante.
 */
export const getSessionId = () => {
  let id = localStorage.getItem(KEY_SESSION_ID);
  if (!id) {
    id = generateUUID();
    localStorage.setItem(KEY_SESSION_ID, id);
  }
  return id;
};

/** Solo para tests / reset manual. No llamar en producción. */
export const _resetSessionId = () => {
  localStorage.removeItem(KEY_SESSION_ID);
};

// ── Paradas visitadas ──────────────────────────────────────────────────────────

/**
 * Devuelve el array de stop IDs sellados por este visitante.
 * Ejemplo: [1, 4, 7]
 */
export const getVisitedStops = () => {
  try {
    const raw = localStorage.getItem(KEY_VISITED);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

/**
 * Añade un stop ID al registro de visitados.
 * Es idempotente: no añade duplicados.
 * Devuelve el array actualizado.
 */
export const addVisitedStop = (stopId) => {
  const visited = getVisitedStops();
  if (visited.includes(stopId)) return visited;

  const updated = [...visited, stopId];
  localStorage.setItem(KEY_VISITED, JSON.stringify(updated));
  return updated;
};

/**
 * Devuelve true si el stop con ese id ya está sellado.
 */
export const isStopVisited = (stopId) => {
  return getVisitedStops().includes(stopId);
};

/**
 * Limpia todas las paradas visitadas (para tests o reset de ruta).
 */
export const clearVisitedStops = () => {
  localStorage.removeItem(KEY_VISITED);
};

// ── Cupón ──────────────────────────────────────────────────────────────────────

/**
 * Guarda el código de cupón en localStorage una vez desbloqueado.
 * Ejemplo: saveCoupon('PINEDA30-AB12CD')
 */
export const saveCoupon = (code) => {
  localStorage.setItem(KEY_COUPON, code);
};

/**
 * Devuelve el código de cupón guardado, o null si no hay ninguno.
 */
export const getSavedCoupon = () => {
  return localStorage.getItem(KEY_COUPON) || null;
};

/**
 * Devuelve true si este visitante ya tiene cupón desbloqueado.
 */
export const hasCoupon = () => {
  return Boolean(getSavedCoupon());
};

// ── PantallaCreditos ───────────────────────────────────────────────────────────

/**
 * Devuelve true si el visitante ya ha visto PantallaCreditos.
 * Se muestra solo una vez por sesión (por app instalada, no por visita).
 */
export const hasSeenCredits = () => {
  return localStorage.getItem(KEY_CREDITS_SEEN) === 'true';
};

/**
 * Marca PantallaCreditos como vista.
 */
export const markCreditsSeen = () => {
  localStorage.setItem(KEY_CREDITS_SEEN, 'true');
};

// ── Estado completo de sesión ──────────────────────────────────────────────────

/**
 * Snapshot completo del estado de sesión.
 * Útil para debug y para pasar estado inicial a App.jsx.
 *
 * @returns {{
 *   sessionId: string,
 *   visitedStops: number[],
 *   couponCode: string|null,
 *   hasCoupon: boolean,
 *   hasSeenCredits: boolean,
 * }}
 */
export const getSessionSnapshot = () => ({
  sessionId:      getSessionId(),
  visitedStops:   getVisitedStops(),
  couponCode:     getSavedCoupon(),
  hasCoupon:      hasCoupon(),
  hasSeenCredits: hasSeenCredits(),
});

/**
 * Borra toda la sesión (paradas + cupón + créditos).
 * NO borra session_id ni idioma — esos persisten.
 * Usar solo para reset de demo / testing.
 */
export const resetSession = () => {
  localStorage.removeItem(KEY_VISITED);
  localStorage.removeItem(KEY_COUPON);
  localStorage.removeItem(KEY_CREDITS_SEEN);
};
