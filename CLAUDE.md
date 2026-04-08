# 🗺️ GUÍA MAESTRA — Sistema Ruta Expo
### Rafael Pineda, Pintor de Córdoba · Viana ➜ La Inaudita · Abril–Mayo 2025

> **Documento vivo.** Actualizar en cada decisión técnica relevante.  
> Última revisión: abril 2026 — v2.3

---

## 0. Índice

1. [Contexto y Objetivo](#1-contexto-y-objetivo)
2. [Las 13 Paradas](#2-las-13-paradas)
3. [Fechas y KPIs de Tráfico](#3-fechas-y-kpis-de-tráfico)
4. [Stack Tecnológico](#4-stack-tecnológico)
5. [Arquitectura del Sistema](#5-arquitectura-del-sistema)
6. [Regla del Cupón](#6-regla-del-cupón)
7. [Catálogo de la Exposición](#7-catálogo-de-la-exposición)
8. [Navegación entre Paradas](#8-navegación-entre-paradas)
9. [Horarios y Estado de Paradas](#9-horarios-y-estado-de-paradas)
10. [Flujo de Experiencia de Usuario (UX)](#10-flujo-de-experiencia-de-usuario-ux)
11. [Esquema de Base de Datos](#11-esquema-de-base-de-datos)
12. [Seguridad y Anti-Fraude](#12-seguridad-y-anti-fraude)
13. [Cumplimiento RGPD](#13-cumplimiento-rgpd)
14. [Estética y Diseño](#14-estética-y-diseño)
15. [Gestión de Riesgos (SPOF)](#15-gestión-de-riesgos-spof)
16. [Roadmap de Desarrollo](#16-roadmap-de-desarrollo)
17. [Decisiones Pendientes](#17-decisiones-pendientes)
18. [Glosario](#18-glosario)

---

## 1. Contexto y Objetivo

Sistema digital gamificado para una **ruta gastronómica y artística de 13 paradas** en Córdoba,
bajo el título de la exposición **"Rafael Pineda, Pintor de Córdoba"**.

La ruta conecta el **Palacio de Viana** (Parada 1 / Inicio) con **La Inaudita** (Parada 13 / Meta),
pasando por tabernas y espacios históricos del casco antiguo.

### Las tres salas principales de la exposición

| Sala | Parada | Subtítulo |
|---|---|---|
| Palacio de Viana | 1 | *Paisaje y paisanaje cordobés* |
| Casa 12PB | 4 | *Los estilos de Pineda* |
| La Inaudita | 13 | *Los peligros del toreo* |

### Premio al completar el recorrido

Cupón **PINEDA30** — 30% de descuento en obra de Rafael Pineda disponible para venta,
canjeable en caja de La Inaudita. Ver reglas detalladas en §6.

### Premisa de negocio

- Coste de infraestructura: **~0 €** (escalable a 25 €/mes en Supabase si hay demanda masiva).
- Sistema **autónomo**: sin personal técnico de guardia durante el evento.

---

## 2. Las 13 Paradas

### Distribución por zonas geográficas

```
NORTE — Santa Marina
  1 · Palacio de Viana ⭐         Pl. Don Gome, 2
  2 · Taberna Santa Marina        C. Mayor de Sta. Marina, 1

CENTRO
  3 · Taberna La Fuenseca         C. Juan Rufo, 20
  4 · Casa 12PB ⭐                C. Carbonell y Morand, 3
  5 · Taberna San Miguel          Pl. de San Miguel, 1
  6 · Taberna El Olmo             C. Historiador Díaz del Moral, 1

JUDERÍA
  7 · Taberna Casa Salinas        (enlace directo Maps)

SAN BASILIO
  8 · Posada del Caballo Blanco   C. San Basilio, 16
  9 · Puerta de Sevilla           C. Puerta Sevilla, 10
 10 · Taberna La Viuda            C. San Basilio, 52

SUR — Rodríguez Marín
 11 · La Tasquería                C. Rodríguez Marín
 12 · La Cazuela de la Espartería C. Rodríguez Marín, 16
 13 · La Inaudita ⭐              C. Rodríguez Marín, 20
```

⭐ = Sala principal / parada obligatoria para el cupón

### Horarios por parada

| # | Establecimiento | Horario | Cierra |
|---|---|---|---|
| 1 | Palacio de Viana | L 10–15h · Ma–S 10–19h · D 10–15h | — |
| 2 | Taberna Santa Marina | ⚠️ Por confirmar | — |
| 3 | Taberna La Fuenseca | L cerrado · Ma–V 11–15h / 19–23h · S 11–15h · D 12–16h | Lunes |
| 4 | Casa 12PB | ⚠️ Por confirmar (espacio cultural) | — |
| 5 | Taberna San Miguel | L cerrado · Ma–S 13–16h / 20–23h · D cerrado | L y D |
| 6 | Taberna El Olmo | L–D 13:30–17h · Ma–S también 21–23:30h | — |
| 7 | Casa Salinas | L–J 12:30–16h / 20–23h · V–S hasta 23:30h · D 12:30–16h | — |
| 8 | Posada Caballo Blanco | Todos los días 12:30–16:30h / 20–23:30h | — |
| 9 | Puerta de Sevilla | Todos los días 13–16:30h / 20–23h | — |
| 10 | Taberna La Viuda | Todos los días 13–16:30h / 20–23:30h | — |
| 11 | La Tasquería | ⚠️ Por confirmar | — |
| 12 | La Cazuela Espartería | L–V 12:30–16h / 19:30–00h · S 12:30–00h · D 13–16:30h | — |
| 13 | La Inaudita | L–V 10–14h / 18–20:30h · S 10–14h · **D cerrado** | **Domingo** |

> ⚠️ **La Inaudita cierra los domingos.** El cupón no es canjeable en domingo.
> La app mostrará aviso específico si el usuario completa la ruta en domingo.

---

## 3. Fechas y KPIs de Tráfico

| Métrica | Valor |
|---|---|
| **Periodo del evento** | 15 abril – 30 mayo 2025 |
| **Total usuarios esperados** | ~100.000 |
| **Media diaria** | 2.500 – 3.500 usuarios/día |
| **Pico máximo estimado** | 10.000 usuarios/día |
| **Pico crítico (Viana, mayo)** | 27.497 visitas registradas solo en mayo |
| **Horario extendido Viana** | Hasta 10 h seguidas en días de festival |

> ⚠️ El pico en Parada 1 (Viana) es el escenario de carga más severo.

---

## 4. Stack Tecnológico

| Capa | Tecnología | Motivo |
|---|---|---|
| **Frontend** | React + Vite | Ecosistema moderno, rápido de desarrollar |
| **PWA** | Vite PWA Plugin | Caché offline para callejuelas sin 4G |
| **Escáner QR** | `html5-qrcode` (`Html5Qrcode` directo) | Cámara trasera automática (`facingMode: 'environment'`), sin selector de cámara |
| **Navegación** | Google Maps Deep Links | Sin mapa embebido — abre app nativa del usuario |
| **Geolocalización** | Browser Geolocation API | Opcional — bonus de comodidad, no dependencia |
| **Hosting frontend** | GitHub Pages (actual) / Cloudflare Pages | CDN global, absorbe picos gratis |
| **Backend / BD** | Supabase (PostgreSQL) | Proyecto nuevo, aislado del CEREBRO V12 |
| **Autenticación** | Sesión anónima (`session_id` en localStorage) | ✅ Decidido — mínima fricción |

> ❌ **Leaflet / mapa embebido descartado.** Decisión tomada: coordenadas imprecisas, UX inferior
> a Google Maps nativo, complejidad sin valor suficiente. Ver §8.

### Coste estimado

```
GitHub Pages / Cloudflare Pages:  0 €
Supabase Free Tier:               0 €  (hasta 500MB BD, 2GB transferencia)
Supabase Pro:                    25 €/mes  (si se supera el free tier)
TOTAL:                            0 € → 25 €/mes
```

---

## 5. Arquitectura del Sistema

```
┌──────────────────────────────────────────────────────────────┐
│                      USUARIO (móvil)                         │
│           React PWA · GitHub Pages / Cloudflare (Edge)       │
│                                                              │
│  [Lista Paradas]  [Escáner QR]  [Catálogo]  [Pasaporte]      │
└──────┬───────────────────────────────────┬───────────────────┘
       │ HTTPS                             │ Deep Link
       ▼                                   ▼
┌─────────────┐               ┌─────────────────────────┐
│  Supabase   │               │   Google Maps App        │
│  PostgreSQL │               │   (nativa del usuario)   │
│  + RLS      │               └─────────────────────────┘
└─────────────┘
```

**Flujo de datos:**

1. Usuario entra a la PWA desde QR físico en Parada 1 (Viana).
2. Se crea `session_id` anónimo en localStorage → Supabase registra visita.
3. Ve la lista de 13 paradas y el catálogo de obras desde el inicio.
4. En cada parada: escanea QR → Supabase valida token → parada sellada.
5. Pantalla intermedia antes de navegar: texto anzuelo + botón que abre Google Maps.
6. Al cumplir regla del cupón → Supabase genera `PINEDA30-XXXXXX`.
7. Usuario muestra cupón en caja de La Inaudita → 30% descuento.

---

## 6. Regla del Cupón

### Condiciones para desbloquear PINEDA30

```
✅ Mínimo 5 paradas selladas
✅ Las 3 salas principales incluidas (Viana · Casa 12PB · La Inaudita)
❌ NO canjeable en domingo (La Inaudita cerrada)
```

### Lógica en código (`coupon.js`)

```js
export const REQUIRED_STOP_IDS = [1, 4, 13];   // Viana, Casa 12PB, La Inaudita
export const MIN_STOPS_FOR_COUPON = 5;

export function checkCouponEligibility(visitedStopIds) {
  const visited = new Set(visitedStopIds);
  const missingRequired = REQUIRED_STOP_IDS.filter(id => !visited.has(id));
  const remaining = Math.max(0, MIN_STOPS_FOR_COUPON - visited.size);
  return {
    eligible: missingRequired.length === 0 && visited.size >= MIN_STOPS_FOR_COUPON,
    missingRequired,
    remaining
  };
}

export function isCouponRedeemableToday() {
  return new Date().getDay() !== 0;  // 0 = domingo
}
```

### Formato del cupón

```
PINEDA30-XXXXXX   (6 caracteres derivados del session_id)
```

### Descuento: qué está incluido y qué no

| Tipo de obra | Descuento | Notas |
|---|---|---|
| Obra en papel (prints, grabados…) | ✅ 30% con PINEDA30 | Precio tachado visible en catálogo |
| Obra original colgada (seleccionada) | ❌ Sin descuento | Precio normal en catálogo |
| Obra propiedad de taberna | ➖ No en venta | "Colección privada" en catálogo |

---

## 7. Catálogo de la Exposición

### Visibilidad

El catálogo es **visible desde el inicio de la ruta**, sin necesidad de completarla.
Sirve como anticipo de las obras y refuerza el interés por visitar las salas.

### Estructura de datos (`catalog.js`)

```js
{
  id: 'obra-001',
  title: 'Título de la obra',
  artist: 'Rafael Pineda',
  year: 2024,
  technique: 'Óleo sobre lienzo',
  dimensions: '80 × 60 cm',
  sala: 1,                          // parada donde se exhibe (1, 4 o 13)
  forSale: true,                    // ¿está a la venta?
  discountEligible: true,           // ¿acepta PINEDA30?
  owner: 'inaudita',                // 'inaudita' | 'viana' | 'casa12pb' | 'taberna_[nombre]'
  price: 450,                       // precio base en euros (null si no en venta)
  imageUrl: '/images/obra-001.jpg',
  description: 'Descripción de la obra...'
}
```

### Estados visuales en la app

```
forSale: true  + discountEligible: true  → Precio tachado + PINEDA30 aplicado
forSale: true  + discountEligible: false → Precio normal (sin cupón)
forSale: false                           → "Colección privada · No disponible"
```

### Pendiente

- Listado completo de obras con precios (proporcionado por La Inaudita).
- Imágenes de las obras (fotografías de alta resolución).

---

## 8. Navegación entre Paradas

### Decisión de arquitectura

❌ **Mapa embebido (Leaflet) descartado.** Motivos: coordenadas difíciles de mantener,
UX inferior a Google Maps nativo, complejidad innecesaria para el valor que aporta.

✅ **Solución adoptada: Deep Links a Google Maps + pantalla intermedia.**

### Flujo de navegación

```
Usuario pulsa [IR A LA SIGUIENTE PARADA]
        ↓
Pantalla intermedia (2-3 segundos antes de abrir Maps):
  · Nombre y dirección de la siguiente parada
  · Texto anzuelo (ver §10)
  · "Cuando llegues, busca el cartel en la puerta y escanea el QR"
  · [< VOLVER A LA RUTA] siempre visible
        ↓
Se abre Google Maps con ruta a pie calculada
        ↓
Usuario llega · Ve QR físico en la puerta · Lo escanea
        ↓
App valida y sella la parada
```

### Retorno desde Google Maps

El QR físico en la puerta de cada local es el punto de retorno natural.
El usuario llega, ve el cartel, escanea → la app abre directamente en esa parada.
No necesita "volver" manualmente a la app.

### Formato del Deep Link

```
https://www.google.com/maps/dir/?api=1&destination=DIRECCION&travelmode=walking
```

### Texto anzuelo por parada

Textos de transición entre paradas — basados en la historia real de cada lugar:

| De → A | Anzuelo |
|---|---|
| Inicio → P1 Viana | *Un palacio con doce patios y quinientos años de secretos. Pineda entró aquí y vio Córdoba entera en un solo muro encalado.* |
| P1 → P2 Santa Marina | *El barrio de Santa Marina huele a torería. Manolete nació a dos calles. Pineda lo pintó sin pintarlo: la sombra de un capote basta.* |
| P2 → P3 La Fuenseca | *Desde 1850, guitarristas y poetas beben en La Fuenseca sin que nadie los haya invitado. Los espectáculos aquí no se programan: se improvisan.* |
| P3 → P4 Casa 12PB | *Aquí está la segunda sala. La que cambia todo lo que creías saber sobre cómo pinta Pineda.* |
| P4 → P5 San Miguel | *Desde 1880, El Pisto ha visto pasar a Manolete, a Julio Romero de Torres y a la picaresca cordobesa. Todos bebieron en la misma barra.* |
| P5 → P6 El Olmo | *Hay tabernas que sirven vino. Y tabernas que guardan cuadros que el dueño no quiere vender a ningún precio.* |
| P6 → P7 Casa Salinas | *La Judería no se explica: se camina. Cada adoquín tiene tres civilizaciones debajo. Pineda las pintó todas a la vez.* |
| P7 → P8 Caballo Blanco | *Una casa del siglo XV al lado de las Caballerizas Reales. Aquí huele a patio cordobés y a cocina de siempre. La obra que hay dentro tardó en llegar cuatro siglos.* |
| P8 → P9 Puerta Sevilla | *San Basilio es el barrio de los patios. La puerta que lo cierra por el sur lleva siglos dejando pasar a quien sabe mirar.* |
| P9 → P10 La Viuda | *Dicen que La Viuda guarda el salmorejo más frío de Córdoba y el cuadro más difícil de ver de la ruta. Compruébalo.* |
| P10 → P11 La Tasquería | *Rodríguez Marín. La calle donde termina el casco antiguo y empieza algo más tranquilo, más de barrio. Pineda lo pintó justo así.* |
| P11 → P12 La Cazuela | *Ya casi estás. A dos puertas de La Inaudita hay una cazuela que lleva el nombre del oficio que llenó esta calle durante siglos. Para un momento y pruébala.* |
| P12 → P13 La Inaudita | *La última sala. El origen de todo. Aquí nació la exposición, aquí está la obra más importante, y aquí se canjea el cupón. Bienvenido al final del recorrido.* |

> ⚠️ Anzuelos pendientes de validar con material real sobre Pineda (D-09).

---

## 9. Horarios y Estado de Paradas

### Lógica de estado en tiempo real

Cada tarjeta de parada compara la hora local del móvil con los horarios del establecimiento:

```
🟢 Abierta ahora    → Escaneo disponible
🔴 Cerrada          → Tarjeta en gris · "Abre a las HH:MM"
⭐ Obligatoria      → Badge visible siempre
```

### Aviso especial en La Inaudita (parada 13)

Si el usuario completa la ruta un **domingo**:

> *"¡Felicidades! Tienes tu cupón PINEDA30. La Inaudita abre de lunes a sábado, de 10:00 a 14:00 y de 18:00 a 20:30. Puedes canjearlo cualquiera de esos días."*

El cupón **se genera igualmente** — solo se avisa que el canje es al día siguiente.

---

## 10. Flujo de Experiencia de Usuario (UX)

### Principio rector

> Mínima fricción. Sin registro obligatorio al inicio. Sin instalación forzada.
> El visitante entra, explora y sella. El dato se recoge de forma progresiva y voluntaria.

### Pantalla 0 — Bienvenida / Quién es Pineda

```
[Retrato grabado de Pineda — grande, protagonista]

RAFAEL PINEDA
Pintor de Córdoba

[Texto breve: quién es, qué hace, por qué esta ruta]
Tono literario, no Wikipedia. (D-10: pendiente de redactar)

· 13 paradas · Casco antiguo · ~2 horas a pie ·

[COMENZAR LA RUTA →]
```

El botón no dice "Registrarse". Dice "Comenzar la ruta".
La sesión anónima se crea en ese momento, invisible para el usuario.

### Pantalla 1 — Parada activa (tras escanear QR)

```
─────────────────────
PARADA III · Sellada ✓
Taberna La Fuenseca
─────────────────────
[Imagen de la obra expuesta]

"Título sugerente de la obra"
Óleo sobre lienzo · 65×50cm · 2021

[Ver ficha completa y precio →]  ← abre catálogo
─────────────────────
Progreso: ●●●○○○○○○○○○○
3 de 13 · 0 de 3 salas principales
─────────────────────
[texto anzuelo hacia siguiente parada]

[IR A LA SIGUIENTE PARADA →]
─────────────────────
```

### Pantalla 2 — Intermedia (camino entre paradas)

```
─────────────────────
TABERNA SAN MIGUEL        ← nombre en mayúsculas pequeñas, color tenue
─────────────────────


  Cuando llegues
  abre la cámara de tu móvil
  y apunta al cartel de Pineda
  que encontrarás en la entrada


─────────────────────
Abrir Google Maps →       ← enlace de texto discreto
─────────────────────
```

> ✅ **Implementado.** Fondo blanco. Texto serif grande centrado.
> Google Maps se abre automáticamente (600 ms de delay).
> La pantalla **no desaparece sola** — permanece hasta que el usuario
> escanea el QR físico en la puerta, lo que recarga la app con los params del token.
> Sin botón de volver. Sin ruido visual.

### Pantalla 3 — Desbloqueo del cupón

```
─────────────────────
      🎉
─────────────────────
Lo has conseguido.

PINEDA30-X7K2M9

30% en obra elegible
Canjeable en La Inaudita
L–S · 10–14h / 18–20:30h
─────────────────────
Guarda tu cupón por email
[tu@email.com          ]
☐ Acepto que La Inaudita use mi email
  para enviarme el cupón y comunicaciones
  culturales. Derechos: info@lainaudita.es

[GUARDAR POR EMAIL]    ← desactivado sin email + checkbox
[Lo recuerdo yo]       ← guarda flag en localStorage, no vuelve a preguntar
─────────────────────
[VOLVER AL PASAPORTE]
─────────────────────
```

> ✅ **Implementado.** El formulario de email solo aparece en este momento (nunca antes).
> Si el usuario pulsa "Lo recuerdo yo", se guarda `ruta_expo_email_dismissed` en
> localStorage y el formulario no vuelve a mostrarse en aperturas futuras del cupón.

### Flujo completo

```
Escanea QR físico en Viana
        ↓
Abre PWA en navegador
        ↓
Pantalla bienvenida + quién es Pineda
        ↓
[Comenzar la ruta →] → session_id generado
        ↓
Lista de 13 paradas (abiertas/cerradas en tiempo real)
        ↓
En cada parada: [📷 Escanear] → valida token → sella
        ↓
Pantalla intermedia con anzuelo → abre Google Maps
        ↓
Llega al local → escanea QR físico en la puerta
        ↓
Al sellar 5+ paradas con las 3 salas:
🎉 Cupón PINEDA30 desbloqueado
        ↓
Formulario email + RGPD (solo aquí, nunca antes)
        ↓
Muestra cupón en caja de La Inaudita → 30%
```

---

## 11. Esquema de Base de Datos

> Ejecutar en el **SQL Editor del proyecto Supabase nuevo** (no en CEREBRO V12).

```sql
-- ============================================================
-- TABLA 1: Visitantes
-- ============================================================
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

-- ============================================================
-- TABLA 2: Paradas (catálogo de las 13)
-- ============================================================
CREATE TABLE paradas (
  id          INTEGER   PRIMARY KEY,          -- 1 a 13
  nombre      TEXT      NOT NULL,
  zona        TEXT,
  direccion   TEXT,
  maps_url    TEXT,
  token       TEXT      UNIQUE NOT NULL,      -- token del QR físico
  required    BOOLEAN   NOT NULL DEFAULT false,
  lat         NUMERIC,
  lng         NUMERIC,
  horario     JSONB
);

-- ============================================================
-- TABLA 3: Escaneos
-- ============================================================
CREATE TABLE escaneos_paradas (
  id               UUID      PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id       UUID      NOT NULL REFERENCES visitantes(id) ON DELETE CASCADE,
  parada_id        INTEGER   NOT NULL REFERENCES paradas(id),
  idempotency_key  TEXT      UNIQUE NOT NULL,
  timestamp        TIMESTAMP DEFAULT NOW(),
  ip_address       INET,
  UNIQUE(visitor_id, parada_id)
);

-- ============================================================
-- TABLA 4: Cupones
-- ============================================================
CREATE TABLE cupones (
  id          UUID      PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id  UUID      UNIQUE NOT NULL REFERENCES visitantes(id),
  codigo      TEXT      UNIQUE NOT NULL,
  creado_en   TIMESTAMP DEFAULT NOW(),
  canjeado    BOOLEAN   DEFAULT false,
  canjeado_en TIMESTAMP
);

-- ============================================================
-- RLS
-- ============================================================
ALTER TABLE visitantes       ENABLE ROW LEVEL SECURITY;
ALTER TABLE escaneos_paradas ENABLE ROW LEVEL SECURITY;
ALTER TABLE cupones          ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- Índices de rendimiento (picos de Viana)
-- ============================================================
CREATE INDEX idx_escaneos_visitor    ON escaneos_paradas(visitor_id);
CREATE INDEX idx_escaneos_parada     ON escaneos_paradas(parada_id);
CREATE INDEX idx_visitantes_session  ON visitantes(session_id);
CREATE INDEX idx_cupones_session     ON cupones(session_id);
```

### Función de validación del cupón

```sql
CREATE OR REPLACE FUNCTION puede_emitir_cupon(p_session_id UUID)
RETURNS BOOLEAN LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_total          INT;
  v_obligatorias   INT;
BEGIN
  SELECT COUNT(DISTINCT parada_id) INTO v_total
    FROM escaneos_paradas WHERE visitor_id = p_session_id;

  SELECT COUNT(DISTINCT ep.parada_id) INTO v_obligatorias
    FROM escaneos_paradas ep
    JOIN paradas p ON p.id = ep.parada_id
   WHERE ep.visitor_id = p_session_id AND p.required = true;

  RETURN (v_total >= 5) AND (v_obligatorias = 3);
END; $$;
```

---

## 12. Seguridad y Anti-Fraude

### Capa 1 — Frontend: `scanLock`

Flag en React que bloquea nuevas peticiones mientras una está en vuelo.
Evita el doble tap por impaciencia.

### Capa 2 — Backend: `idempotency_key`

```
idempotency_key = hash(visitor_id + parada_id + fecha_UTC_truncada_a_minuto)
```

Si Postgres ya tiene esa clave → `UNIQUE violation` → rechaza en milisegundos.

### Capa 3 — BD: constraint SQL

```sql
UNIQUE(visitor_id, parada_id)
```

### Formato del QR

URL con token seguro no adivinable:

```
https://inaudita-heaven.github.io/Pineda/?stop=4&token=casa12pb-zt7j-2025
```

### Tokens producción (generados)

| # | Token | Obligatoria |
|---|---|---|
| 1 | `viana-xk9m-2025` | ⭐ |
| 2 | `stamarina-rp4t-2025` | |
| 3 | `fuenseca-bw2n-2025` | |
| 4 | `casa12pb-zt7j-2025` | ⭐ |
| 5 | `sanmiguel-qh5v-2025` | |
| 6 | `elolmo-mc3f-2025` | |
| 7 | `salinas-fy1r-2025` | |
| 8 | `caballobco-nd5x-2025` | |
| 9 | `ptasevilla-dn8c-2025` | |
| 10 | `laviuda-ek6p-2025` | |
| 11 | `tasqueria-gu4w-2025` | |
| 12 | `cazuela-hb9s-2025` | |
| 13 | `inaudita-xr2k-2025` | ⭐ |

---

## 13. Cumplimiento RGPD

| Principio | Implementación |
|---|---|
| **Minimización de datos** | Session anónima al inicio; email solo si el usuario lo ofrece voluntariamente |
| **Consentimiento explícito** | Checkbox al pedir el email (no al inicio de la ruta) |
| **Información al usuario** | Texto visible en el momento de pedir el email |
| **Derecho al olvido** | Anonimización/borrado post-evento via `fecha_borrado` |
| **Seguridad técnica** | RLS en Supabase · HTTPS en todo el stack |

### Texto legal (momento de pedir email)

> *Acepto que La Inaudita use mi email para enviarme el cupón y comunicaciones culturales. Puedo ejercer mis derechos escribiendo a info@lainaudita.es.*

> ✅ **Implementado en `CouponView.jsx`** — checkbox obligatorio, enlace `mailto:info@lainaudita.es`.
> Email guardado en localStorage (`ruta_expo_coupon_email`) hasta integración Supabase.

---

## 14. Estética y Diseño

### Nombre de la exposición

> **Rafael Pineda, Pintor de Córdoba**

### Salas y subtítulos

| Sala | Subtítulo |
|---|---|
| Palacio de Viana | *Paisaje y paisanaje cordobés* |
| Casa 12PB | *Los estilos de Pineda* |
| La Inaudita | *Los peligros del toreo* |

### Referencia visual confirmada

- Estilo: **galería de arte contemporánea** — referencia Ansorena Madrid
- Cartel de la exposición: blanco, serif clásica, retrato grabado en tinta, mucho aire
- Paleta: negro sobre blanco, sin colores primarios planos

### Principios de diseño

- Tipografía serif clásica (IM Fell English / Cormorant Garamond o similar).
- Mucho espacio en blanco. Fotografía protagonista.
- El pasaporte digital debe parecer un **objeto de coleccionista**, no un formulario.
- Las obras de Pineda son el centro visual — la UI es el marco, no el cuadro.
- Nada de iconos genéricos ni colores corporativos planos.
- **Touch targets móvil:** todos los botones de acción tienen `min-height: 48px` (CSS base `.btn`). ✅

### Pegatina QR física

- Formato: **10 × 10 cm** — para colocar en puerta/entrada de cada local
- Color: **negro sobre blanco**
- Numeración de parada: **números romanos** (I, II, III... XIII)
- Tipografía coherente con el cartel de la exposición
- Marcas de corte para imprenta
- Impresión centralizada (no cada local por su cuenta)

### Pendiente

- [ ] Texto quién es Pineda para pantalla de bienvenida (D-10)
- [ ] Fotografías de alta resolución de las obras (La Inaudita)
- [ ] Paleta de colores y tipografía definitivas

---

## 15. Gestión de Riesgos (SPOF)

| Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|
| Avalancha de escaneos en Viana | **Alta** | Alto | Cloudflare Edge + `idempotency_key` |
| Race condition (doble escaneo) | **Alta** | Medio | `scanLock` + `UNIQUE` constraint BD |
| Sin cobertura 4G en callejuelas | Media | Medio | PWA con caché offline |
| Caída Supabase Free Tier | Baja | Alto | Upgrade a Pro (25 €/mes) como plan B |
| QR dañado / ilegible en la calle | Media | Bajo | URL de respaldo impresa junto al QR |
| Fraude de cupones (compartir código) | Baja | Bajo | `canjeado: true` marcado en BD al usar |
| Usuario completa ruta en domingo | Media | Bajo | Aviso en app + cupón válido para otro día |
| Usuario no vuelve a la app desde Maps | **Alta** | Medio | QR físico en puerta como punto de retorno natural |

---

## 16. Roadmap de Desarrollo

### ✅ Fase 0 — Arquitectura y Decisiones

- Stack tecnológico definido
- 13 paradas confirmadas con tokens generados
- Regla del cupón decidida (5 + 3 obligatorias)
- Esquema de BD diseñado
- Estrategia anti-fraude documentada
- Mapa embebido descartado → deep links a Google Maps

### ✅ Fase 1 — MVP Base (Desplegado)

- App en `https://inaudita-heaven.github.io/Pineda/`
- Grid pasaporte 12 paradas (→ actualizar a 13)
- Sesión localStorage + Supabase conectado
- Botón "Sellar sin QR (modo prueba)"
- Cupón PINEDA30-XXXXXX funcional
- PWA instalable

### 🚧 Fase 2 — Contenido y Datos Reales

- [ ] Actualizar `stops.js` a 13 paradas con datos reales
- [ ] Confirmar horarios de Santa Marina, Casa 12PB y La Tasquería (D-06)
- [ ] Implementar lógica de horarios (tarjetas abiertas/cerradas)
- [ ] Aviso domingo en La Inaudita
- [ ] `catalog.js` con obras y precios (datos de La Inaudita) (D-07)
- [x] Escáner QR real — `Html5Qrcode` con `facingMode: 'environment'`, cámara trasera directa, sin selector
- [x] Formulario email + RGPD en pantalla de cupón (nunca antes); "Lo recuerdo yo" persiste en localStorage
- [x] Touch targets 48px en todos los botones de acción
- [ ] Pantalla de bienvenida con texto sobre Pineda (D-10)
- [ ] Pantalla intermedia "De camino a..." con anzuelos (D-09)

### 📋 Fase 3 — Diseño Visual

- [ ] Rediseño visual completo (estilo galería Ansorena)
- [ ] Fotografías de obras integradas
- [ ] Pegatinas QR 10×10cm generadas para impresión (13 unidades)
- [ ] Geolocalización opcional como bonus (Nivel C)

### 🚀 Fase 4 — Producción

- [ ] Test de carga (simular 10k usuarios concurrentes)
- [ ] Dominio definitivo (D-04)
- [ ] Panel de admin básico (D-05)
- [ ] Documentar proceso de borrado post-evento (RGPD)

---

## 17. Decisiones Pendientes

| # | Decisión | Estado | Impacto |
|---|---|---|---|
| D-01 | **Autenticación** | ✅ Sesión anónima (`session_id` localStorage) | Cerrado |
| D-02 | **Mínimo de paradas** | ✅ 5 paradas + 3 obligatorias | Cerrado |
| D-03 | **Caducidad del cupón** | ⚠️ Pendiente | ¿Sin caducidad? ¿Hasta fin del evento? |
| D-04 | **Dominio definitivo** | ⚠️ Pendiente | Necesario antes de imprimir QRs |
| D-05 | **Panel de admin** | ⚠️ Pendiente | Supabase Dashboard vs panel custom |
| D-06 | **Horarios faltantes** | ⚠️ Pendiente | Santa Marina, Casa 12PB, La Tasquería |
| D-07 | **Obras del catálogo** | ⚠️ Pendiente | Lista, precios, imágenes (La Inaudita) |
| D-08 | **Referencia visual** | ✅ Confirmada — estilo Ansorena, blanco/negro/serif | Cerrado |
| D-09 | **Anzuelos entre paradas** | ✅ Redactados — pendiente validar con material de Pineda | Fase 2 |
| D-10 | **Texto quién es Pineda** | ⚠️ Pendiente — hay material en La Inaudita | Fase 2 |

---

## 18. Glosario

| Término | Definición |
|---|---|
| **SPOF** | Single Point of Failure — punto cuyo fallo colapsa el sistema |
| **Race Condition** | Dos peticiones simultáneas que modifican el mismo dato |
| **idempotency_key** | Hash que garantiza que una operación solo se ejecute una vez en BD |
| **scanLock** | Flag en React que bloquea nuevas peticiones mientras una está en vuelo |
| **PWA** | Progressive Web App — web instalable que funciona offline |
| **RLS** | Row Level Security — política de Supabase que restringe acceso por fila |
| **Deep Link** | URL que abre directamente una app nativa (ej: Google Maps) |
| **Anzuelo** | Texto literario entre paradas que anticipa el siguiente destino y engancha al visitante |
| **Haversine** | Fórmula matemática para calcular distancia entre dos coordenadas GPS |
| **CEREBRO V12** | Proyecto Supabase existente de La Inaudita. No tocar. |
| **session_id** | UUID anónimo generado en el navegador del visitante, sin cuenta ni contraseña |

---

*Rafael Pineda, Pintor de Córdoba · Sistema Digital · Guía Maestra v2.1*
*Proyecto de La Inaudita · Córdoba 2025*
