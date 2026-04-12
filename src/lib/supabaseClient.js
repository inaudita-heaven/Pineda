/**
 * supabaseClient.js — Cliente Supabase singleton
 * src/lib/supabaseClient.js
 *
 * Proyecto: yoypkknozprahgotmkgm.supabase.co
 * ⚠️  NO es CEREBRO V12 — proyecto independiente para Ruta Expo Pineda.
 *
 * Variables de entorno requeridas en .env.local:
 *   VITE_SUPABASE_URL        = https://yoypkknozprahgotmkgm.supabase.co
 *   VITE_SUPABASE_ANON_KEY   = eyJ... (clave anon pública, safe para frontend)
 *
 * El cliente usa la clave `anon` para todas las operaciones del visitante.
 * El panel de caja (CajaPanelComponent) también usa `anon` + RLS policies.
 * Las funciones RPC (puede_emitir_cupon, marcar_copa_usada, registrar_compra)
 * están protegidas en BD — no requieren service_role desde el frontend.
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnon = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnon) {
  console.warn(
    '[supabaseClient] Faltan variables de entorno.\n' +
    'Crea .env.local con VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY.\n' +
    'La app funcionará en modo offline (sin BD).'
  );
}

// Fallback stub: evita que createClient() lance excepción en local sin .env.local.
// Las llamadas a Supabase fallarán silenciosamente (try/catch en App.jsx).
export const supabase = createClient(
  supabaseUrl  || 'https://placeholder.supabase.co',
  supabaseAnon || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.stub',
  {
    auth: {
      // Sin sesión de usuario: toda la app es anónima por diseño
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  }
);

// ── Helpers de RPC ─────────────────────────────────────────────────────────────
// Wrappers tipados para las tres funciones RPC del schema.

/**
 * Comprueba si un visitante puede emitir cupón (3 salas + 2 tabernas).
 * @param {string} sessionId
 * @returns {Promise<boolean>}
 */
export const rpcPuedeEmitirCupon = async (sessionId) => {
  const { data, error } = await supabase.rpc('puede_emitir_cupon', {
    p_session_id: sessionId,
  });
  if (error) throw error;
  return Boolean(data);
};

/**
 * Marca la copa de cata como usada para un código de cupón.
 * @param {string} codigo — 'PINEDA30-XXXXXX'
 * @returns {Promise<{ ok: boolean, error?: string }>}
 */
export const rpcMarcarCopaUsada = async (codigo) => {
  const { data, error } = await supabase.rpc('marcar_copa_usada', {
    p_codigo: codigo,
  });
  if (error) throw error;
  return data;
};

/**
 * Registra la compra de una obra con precio final.
 * @param {string} codigo     — 'PINEDA30-XXXXXX'
 * @param {string} obraId     — 'obra-001'
 * @param {number} precioFinal — precio en euros con descuento aplicado
 * @returns {Promise<{ ok: boolean, error?: string }>}
 */
export const rpcRegistrarCompra = async (codigo, obraId, precioFinal) => {
  const { data, error } = await supabase.rpc('registrar_compra', {
    p_codigo:       codigo,
    p_obra_id:      obraId,
    p_precio_final: precioFinal,
  });
  if (error) throw error;
  return data;
};
