# Ruta Expo

Sistema de pasaporte digital gamificado para la ruta artística **Palacio de Viana → La Inaudita** · Córdoba · Abril–Mayo 2025.

El visitante escanea QRs físicos en 12 paradas por el casco histórico. Al completar el recorrido mínimo obtiene un cupón del **30% de descuento** en obra de Rafael Pineda, canjeable en caja de La Inaudita.

-----

## Principios de diseño

- **Sin registro obligatorio al inicio.** El visitante entra directo, sin formularios ni fricción.
- **Sesión anónima silenciosa.** Un `session_id` se genera automáticamente en el navegador (localStorage). El usuario no lo ve.
- **Advertencia de progreso.** Tras la primera parada post-Viana aparece un aviso discreto: si cierras el navegador perderás tu progreso.
- **Captura de datos suave y opcional.** Solo al llegar a La Inaudita (parada 12), se ofrece guardar el cupón por email o teléfono. Sin presión, con beneficio claro para el visitante.
- **Cupón en pantalla.** El código aparece directamente en el móvil. No depende de email ni de cuenta.

-----

## Stack

|Capa         |Tecnología                     |
|-------------|-------------------------------|
|Frontend     |React 18 + Vite 5              |
|PWA          |Vite PWA Plugin                |
|Escáner QR   |`html5-qrcode`                 |
|Navegación   |Google Maps Deep Links         |
|Hosting      |Cloudflare Pages               |
|Base de datos|Supabase (PostgreSQL + RLS)    |
|Autenticación|Sesión anónima por `session_id`|

**Coste objetivo:** 0 € (Supabase Free Tier + Cloudflare Pages gratuito). Escalable a 25 €/mes si se supera el free tier en pico de evento.

-----

## Estructura del proyecto

```
src/
├── App.jsx                   # Shell principal, estado global
├── main.jsx                  # Punto de entrada
├── styles.css                # Estilos base
├── components/
│   ├── StopCard.jsx          # Tarjeta de cada parada
│   ├── RouteProgress.jsx     # Barra de progreso
│   ├── QrScanner.jsx         # Cámara + html5-qrcode
│   ├── CouponScreen.jsx      # Pantalla final con cupón
│   └── SoftCapture.jsx       # Captura opcional email/teléfono
├── data/
│   └── stops.js              # Lista de 12 paradas con coordenadas y tokens QR
└── lib/
    ├── session.js            # Generación y persistencia de session_id
    └── coupon.js             # Generación de código de cupón
supabase/
└── schema.sql                # Esquema de base de datos
```

-----

## Flujo de usuario

```
[Parada 1 · Viana]
Escanea QR físico → abre PWA → entra directo sin registro
        ↓
[Parada 2]
Primera parada post-Viana → aviso discreto:
"Si cierras el navegador perderás tu progreso"
        ↓
[Paradas 3–11]
Escanea QR en cada parada → progreso guardado automáticamente
Botón "Llévame" → abre Google Maps con ruta a pie
        ↓
[Parada 12 · La Inaudita]
🎉 Cupón generado: PINEDA30-XXXXXX
Oferta suave: "¿Quieres que te enviemos el cupón por si lo pierdes?"
Campo opcional email o teléfono
        ↓
Muestra cupón en caja → 30% descuento en obra de Rafael Pineda
```

-----

## Reglas del cupón

- Mínimo **5 paradas** completadas para desbloquear el cupón (pendiente de confirmar si se implementa modelo por sectores).
- Modelo alternativo en estudio: **3 checkpoints obligatorios** (Viana → Casa 12PB → La Inaudita) con paradas mínimas por sector.
- El cupón es de **un solo uso**, marcado en base de datos al canjearse.

-----

## Base de datos

```sql
-- Visitantes (sesión anónima)
CREATE TABLE visitantes (
  id                  UUID      PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id          TEXT      UNIQUE NOT NULL,
  email               TEXT,
  telefono            TEXT,
  consentimiento_rgpd BOOLEAN   NOT NULL DEFAULT false,
  fecha_inicio        TIMESTAMP DEFAULT NOW(),
  fecha_borrado       TIMESTAMP,
  CHECK (consentimiento_rgpd = true)
);

-- Escaneos con anti-duplicación
CREATE TABLE escaneos_paradas (
  id               UUID      PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id       UUID      NOT NULL REFERENCES visitantes(id) ON DELETE CASCADE,
  parada           INTEGER   NOT NULL CHECK (parada BETWEEN 1 AND 12),
  idempotency_key  TEXT      UNIQUE NOT NULL,
  timestamp        TIMESTAMP DEFAULT NOW(),
  UNIQUE(visitor_id, parada)
);

-- Cupones
CREATE TABLE cupones (
  id           UUID      PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id   UUID      NOT NULL REFERENCES visitantes(id),
  codigo       TEXT      UNIQUE NOT NULL,
  canjeado     BOOLEAN   DEFAULT false,
  created_at   TIMESTAMP DEFAULT NOW()
);
```

-----

## Anti-fraude

**Capa 1 — Frontend:** `scanLock` activo mientras hay una petición en vuelo. Evita el doble tap.

**Capa 2 — Backend:** `idempotency_key = hash(visitor_id + parada + minuto_UTC)`. Si Postgres ya tiene esa clave, rechaza en milisegundos.

**Capa 3 — Base de datos:** `UNIQUE(visitor_id, parada)`. Imposible registrar la misma parada dos veces independientemente del código de aplicación.

**Formato QR:** URL con token seguro por parada:

```
https:
