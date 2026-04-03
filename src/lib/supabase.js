import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('[supabase] Variables de entorno no configuradas. Copia .env.example a .env')
}

export const supabase = createClient(
  supabaseUrl ?? 'https://placeholder.supabase.co',
  supabaseAnonKey ?? 'placeholder'
)

/**
 * Registra o recupera un visitante anónimo por session_id.
 * Idempotente: si ya existe, devuelve el registro existente.
 */
export async function upsertVisitante(sessionId) {
  const { data, error } = await supabase
    .from('visitantes')
    .upsert({ session_id: sessionId }, { onConflict: 'session_id' })
    .select('id')
    .single()
  if (error) throw error
  return data.id
}

/**
 * Registra un escaneo de parada con anti-fraude en 3 capas:
 *  1. scanLock en el llamador (frontend)
 *  2. idempotency_key = hash(visitor_id + parada + minuto UTC)
 *  3. UNIQUE(visitor_id, parada) en DB
 *
 * Devuelve { ok: true } si se registró, { ok: false, reason } si ya existía o hubo error.
 */
export async function registrarEscaneo(visitorId, paradaId) {
  const minutoUtc = Math.floor(Date.now() / 60000)
  const idempotencyKey = `${visitorId}_${paradaId}_${minutoUtc}`

  const { error } = await supabase
    .from('escaneos_paradas')
    .insert({
      visitor_id: visitorId,
      parada: paradaId,
      idempotency_key: idempotencyKey,
    })

  if (error) {
    // Código 23505 = unique_violation (ya existe la parada o el idempotency_key)
    if (error.code === '23505') return { ok: false, reason: 'duplicate' }
    return { ok: false, reason: error.message }
  }
  return { ok: true }
}

/**
 * Actualiza email/teléfono y consentimiento RGPD del visitante.
 * Solo se llama si el usuario rellena el formulario opcional en parada 12.
 */
export async function guardarContacto(visitorId, { email, phone }) {
  const { error } = await supabase
    .from('visitantes')
    .update({
      email: email || null,
      telefono: phone || null,
      consentimiento_rgpd: true,
    })
    .eq('id', visitorId)
  if (error) throw error
}

/**
 * Genera y persiste el cupón en DB.
 * Idempotente por visitor_id: si ya existe, devuelve el código existente.
 */
export async function upsertCupon(visitorId, codigo) {
  const { data, error } = await supabase
    .from('cupones')
    .upsert({ visitor_id: visitorId, codigo }, { onConflict: 'visitor_id' })
    .select('codigo')
    .single()
  if (error) throw error
  return data.codigo
}
