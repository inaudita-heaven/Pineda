-- ─────────────────────────────────────────────────────────────────
-- Ruta Expo · Supabase Schema
-- Ejecutar en el SQL Editor de Supabase o con supabase db push
-- ─────────────────────────────────────────────────────────────────

-- ── Visitantes (sesión anónima) ───────────────────────────────────
CREATE TABLE IF NOT EXISTS visitantes (
  id                  UUID      PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id          TEXT      UNIQUE NOT NULL,
  email               TEXT,
  telefono            TEXT,
  consentimiento_rgpd BOOLEAN   NOT NULL DEFAULT false,
  fecha_inicio        TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  fecha_borrado       TIMESTAMP WITH TIME ZONE,  -- borrado lógico RGPD
  -- Si hay datos de contacto, el consentimiento debe ser true
  CONSTRAINT rgpd_required_for_contact
    CHECK (
      (email IS NULL AND telefono IS NULL)
      OR consentimiento_rgpd = true
    )
);

-- ── Escaneos de paradas (con anti-fraude) ─────────────────────────
CREATE TABLE IF NOT EXISTS escaneos_paradas (
  id               UUID      PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id       UUID      NOT NULL REFERENCES visitantes(id) ON DELETE CASCADE,
  parada           INTEGER   NOT NULL CHECK (parada BETWEEN 1 AND 12),
  idempotency_key  TEXT      UNIQUE NOT NULL,  -- Capa 2 anti-fraude
  timestamp        TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  -- Capa 3 anti-fraude: imposible registrar la misma parada dos veces por visitante
  UNIQUE(visitor_id, parada)
);

-- ── Cupones ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cupones (
  id           UUID      PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id   UUID      UNIQUE NOT NULL REFERENCES visitantes(id) ON DELETE CASCADE,
  codigo       TEXT      UNIQUE NOT NULL,  -- Formato: PINEDA30-XXXXXX
  canjeado     BOOLEAN   NOT NULL DEFAULT false,
  canjeado_at  TIMESTAMP WITH TIME ZONE,
  created_at   TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────────
-- Row Level Security
-- ─────────────────────────────────────────────────────────────────

ALTER TABLE visitantes         ENABLE ROW LEVEL SECURITY;
ALTER TABLE escaneos_paradas   ENABLE ROW LEVEL SECURITY;
ALTER TABLE cupones            ENABLE ROW LEVEL SECURITY;

-- Visitantes: cada sesión solo puede ver/editar su propio registro
CREATE POLICY "visitante_own" ON visitantes
  FOR ALL USING (session_id = current_setting('app.session_id', true));

-- Escaneos: solo ve los propios (join a través de visitor_id)
CREATE POLICY "escaneos_own" ON escaneos_paradas
  FOR ALL USING (
    visitor_id IN (
      SELECT id FROM visitantes
      WHERE session_id = current_setting('app.session_id', true)
    )
  );

-- Cupones: solo ve el propio
CREATE POLICY "cupon_own" ON cupones
  FOR ALL USING (
    visitor_id IN (
      SELECT id FROM visitantes
      WHERE session_id = current_setting('app.session_id', true)
    )
  );

-- ─────────────────────────────────────────────────────────────────
-- Índices
-- ─────────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_visitantes_session_id  ON visitantes(session_id);
CREATE INDEX IF NOT EXISTS idx_escaneos_visitor_parada ON escaneos_paradas(visitor_id, parada);
CREATE INDEX IF NOT EXISTS idx_cupones_visitor_id      ON cupones(visitor_id);
CREATE INDEX IF NOT EXISTS idx_cupones_codigo          ON cupones(codigo);
