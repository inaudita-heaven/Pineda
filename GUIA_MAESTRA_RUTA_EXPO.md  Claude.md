---
title: "GUIA_MAESTRA_RUTA_EXPO.md | Claude"
source: "https://claude.ai/public/artifacts/ba7f7ef9-05ba-42fb-a04e-cdf346cca90f"
author:
  - "[[Claude]]"
published:
created: 2026-04-03
description: "GUIA_MAESTRA_RUTA_EXPO.md"
tags:
  - "clippings"
---
**Claude**

## 🗺️ GUÍA MAESTRA — Sistema Ruta Expo

### Viana ➜ La Inaudita · Córdoba · Abril–Mayo 2025

> **Documento vivo.** Actualizar en cada decisión técnica relevante.  
> Última revisión: abril 2025

---

## 0\. Índice

1. [Contexto y Objetivo](about:blank#1-contexto-y-objetivo)
2. [Fechas y KPIs de Tráfico](about:blank#2-fechas-y-kpis-de-tr%C3%A1fico)
3. [Stack Tecnológico](about:blank#3-stack-tecnol%C3%B3gico)
4. [Arquitectura del Sistema](about:blank#4-arquitectura-del-sistema)
5. [Flujo de Experiencia de Usuario (UX)](about:blank#5-flujo-de-experiencia-de-usuario-ux)
6. [Esquema de Base de Datos](about:blank#6-esquema-de-base-de-datos)
7. [Seguridad y Anti-Fraude](about:blank#7-seguridad-y-anti-fraude)
8. [Cumplimiento RGPD](about:blank#8-cumplimiento-rgpd)
9. [Gestión de Riesgos (SPOF)](about:blank#9-gesti%C3%B3n-de-riesgos-spof)
10. [Roadmap de Desarrollo](about:blank#10-roadmap-de-desarrollo)
11. [Decisiones Pendientes](about:blank#11-decisiones-pendientes)
12. [Glosario](about:blank#12-glosario)

---

## 1\. Contexto y Objetivo

Sistema digital gamificado para gestionar una **ruta artística de 12 paradas** en Córdoba que conecta el **Palacio de Viana** (Parada 1 / Inicio) con **La Inaudita** (Parada 12 / Meta).

### Premio al completar el recorrido

Cupón del **30% de descuento** para obra de **Rafael Pineda**, canjeable en caja de La Inaudita.

### Premisa de negocio

- Coste de infraestructura objetivo: **~0 €** (escalable a 25 €/mes en Supabase si hay demanda masiva).
- El sistema debe ser **autónomo**: sin personal técnico de guardia durante el evento.

---

## 2\. Fechas y KPIs de Tráfico

| Métrica | Valor |
| --- | --- |
| **Periodo del evento** | 15 abril – 30 mayo 2025 |
| **Total usuarios esperados** | ~100.000 |
| **Media diaria** | 2.500 – 3.500 usuarios/día |
| **Pico máximo estimado** | 10.000 usuarios/día |
| **Pico crítico (Viana, mayo)** | 27.497 visitas registradas solo en mayo |
| **Horario extendido Viana** | Hasta 10 h seguidas en días de festival |

> ⚠️ **El pico en Parada 1 (Viana) es el escenario de carga más severo.** El sistema debe absorber avalanchas de escaneos simultáneos sin degradación.

---

## 3\. Stack Tecnológico

| Capa | Tecnología | Motivo |
| --- | --- | --- |
| **Frontend** | React + Vite | Ecosistema moderno, rápido de desarrollar |
| **PWA** | Vite PWA Plugin | Caché offline para callejuelas sin 4G |
| **Escáner QR** | `html5-qrcode` | Integrado en cliente, cero APIs externas |
| **Navegación** | Google Maps Deep Links | Sin consumo de API de pago |
| **Hosting frontend** | Cloudflare Pages | CDN global, absorbe picos gratis |
| **Backend / BD** | Supabase (PostgreSQL) | Proyecto nuevo, aislado del CEREBRO V12 |
| **Autenticación** | ⚠️ *Por definir* — ver §11 | — |

### Coste estimado

```
Cloudflare Pages:    0 € (gratis hasta 500 builds/mes)
Supabase Free Tier:  0 € (hasta 500MB BD, 2GB transferencia)
Supabase Pro:       25 €/mes (si se supera el free tier)
TOTAL:              0 € → 25 €/mes
```

---

## 4\. Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────┐
│                   USUARIO (móvil)                   │
│          React PWA · Cloudflare Pages (Edge)        │
└──────────────┬──────────────────────┬───────────────┘
               │ HTTPS                │ Deep Link
               ▼                      ▼
┌──────────────────────┐   ┌─────────────────────────┐
│   Supabase           │   │   Google Maps App        │
│   PostgreSQL + RLS   │   │   (nativa del usuario)   │
│   Auth (TBD)         │   └─────────────────────────┘
└──────────────────────┘
```

**Flujo de datos simplificado:**

1. Usuario carga la PWA desde Cloudflare Edge (caché global).
2. Se registra → Supabase crea fila en `visitantes`.
3. Escanea QR en cada parada → Supabase inserta en `escaneos_paradas`.
4. Al completar parada 12 → Supabase valida condiciones → genera cupón.

---

## 5\. Flujo de Experiencia de Usuario (UX)

### Parada 1 — Registro (Palacio de Viana)

```
Escanea QR físico
      ↓
Abre PWA en navegador
      ↓
Pantalla de registro
[Email / Teléfono]
[✓ Acepto política RGPD]  ← obligatorio
[Comenzar ruta →]
      ↓
Se crea "Pasaporte Digital"
```

### Paradas 2–11 — Recorrido

```
Lista de paradas en la app
      ↓
[📍 Llévame a la obra]  → Abre Google Maps con ruta a pie
      ↓
Llega a la obra, la disfruta
      ↓
[📷 Escanear parada]  → Cámara lee QR
      ↓
Validación backend (idempotency_key)
      ↓
Parada marcada ✓ · Progreso actualizado
```

### Parada 12 — Meta (La Inaudita)

```
Escanea QR final
      ↓
Backend verifica: ¿12/12 paradas escaneadas?
      ↓
🎉 Confeti digital
      ↓
Cupón generado: PINEDA30-XXXXXX
      ↓
Usuario muestra cupón en caja → 30% descuento
```

---

## 6\. Esquema de Base de Datos

> Ejecutar en el **SQL Editor del proyecto Supabase nuevo** (no en CEREBRO V12).

```sql
-- ============================================================
-- TABLA 1: Visitantes (identidad única del recorrido)
-- ============================================================
CREATE TABLE visitantes (
  id                  UUID      PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id          TEXT      UNIQUE NOT NULL,   -- ID del navegador (localStorage)
  email               TEXT,
  telefono            TEXT,
  consentimiento_rgpd BOOLEAN   NOT NULL DEFAULT false,
  fecha_inicio        TIMESTAMP DEFAULT NOW(),
  fecha_borrado       TIMESTAMP,                   -- NULL = activo; rellena post-evento

  CHECK (consentimiento_rgpd = true)               -- Bloquea registros sin consentimiento
);

-- ============================================================
-- TABLA 2: Escaneos (registro de paradas con anti-duplicación)
-- ============================================================
CREATE TABLE escaneos_paradas (
  id               UUID      PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id       UUID      NOT NULL REFERENCES visitantes(id) ON DELETE CASCADE,
  parada           INTEGER   NOT NULL CHECK (parada BETWEEN 1 AND 12),
  idempotency_key  TEXT      UNIQUE NOT NULL,      -- Previene duplicados a nivel BD
  timestamp        TIMESTAMP DEFAULT NOW(),
  ip_address       INET,                           -- Opcional: detección de fraude

  UNIQUE(visitor_id, parada)                       -- 1 visitante · 1 parada · 1 escaneo
);

-- ============================================================
-- RLS (Row Level Security)
-- ============================================================
ALTER TABLE visitantes       ENABLE ROW LEVEL SECURITY;
ALTER TABLE escaneos_paradas ENABLE ROW LEVEL SECURITY;

-- Los visitantes solo ven sus propios datos
CREATE POLICY "visitantes_select_own"
ON visitantes FOR SELECT
USING (auth.uid()::text = session_id);

-- Los visitantes solo insertan sus propios escaneos
CREATE POLICY "escaneos_insert_own"
ON escaneos_paradas FOR INSERT
WITH CHECK (
  visitor_id IN (
    SELECT id FROM visitantes WHERE session_id = auth.uid()::text
  )
);
```

### Índices recomendados (rendimiento en picos)

```sql
CREATE INDEX idx_escaneos_visitor_id ON escaneos_paradas(visitor_id);
CREATE INDEX idx_escaneos_parada     ON escaneos_paradas(parada);
CREATE INDEX idx_visitantes_session  ON visitantes(session_id);
```

---

## 7\. Seguridad y Anti-Fraude

### Capa 1 — Frontend: scanLock

```
Usuario pulsa "Escanear" →
  ¿scanLock activo? → Ignorar petición
  ¿scanLock inactivo? → Activar lock → Enviar a backend → Desactivar lock
```

Evita el **"doble tap"** por frustración o impaciencia.

### Capa 2 — Backend: idempotency\_key

```
idempotency_key = hash(visitor_id + parada + fecha_UTC_truncada_a_minuto)
```

Si Postgres ya tiene esa clave → `UNIQUE violation` → rechaza en milisegundos.  
**Resultado:** Imposible registrar la misma parada dos veces, aunque se intente desde varios dispositivos simultáneamente.

### Capa 3 — Base de datos: Constraint SQL

```sql
UNIQUE(visitor_id, parada)
```

Red de seguridad final. Opera a nivel de BD independientemente del código de aplicación.

### Formato del QR en cada parada

No es un número simple. Es una **URL con token seguro**:

```
https://rutaexpo.app/scan?stop=7&token=a3f9b2e1c8d4
```

- `stop`: número de parada (1–12)
- `token`: hash único por parada, no adivinable por fuerza bruta

---

## 8\. Cumplimiento RGPD

| Principio | Implementación |
| --- | --- |
| **Minimización de datos** | Solo email o teléfono (no ambos obligatoriamente) |
| **Consentimiento explícito** | Checkbox vacío obligatorio antes del registro |
| **Información al usuario** | Texto bajo el botón: responsable, finalidad, legitimación, derechos |
| **Derecho al olvido** | Anonimización/borrado post-evento via columna `fecha_borrado` |
| **Seguridad técnica** | RLS en Supabase · HTTPS en todo el stack |

### Texto legal mínimo visible en registro

> *Responsable: La Inaudita. Finalidad: gestión de la ruta artística y comunicaciones culturales. Legitimación: consentimiento. Derechos: acceso, rectificación y supresión en \[email\]. Más info en \[política de privacidad\].*

---

## 9\. Gestión de Riesgos (SPOF)

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Avalancha de escaneos en Viana (Parada 1) | **Alta** | Alto | Cloudflare Edge + idempotency\_key |
| Race condition (doble escaneo) | **Alta** | Medio | scanLock + UNIQUE constraint BD |
| Sin cobertura 4G en callejuelas | Media | Medio | PWA con caché offline |
| Caída de Supabase Free Tier | Baja | Alto | Upgrade a Pro (25 €/mes) como plan B |
| QR dañado / ilegible en la calle | Media | Bajo | URL de respaldo impresa junto al QR |
| Fraude de cupones (compartir código) | Baja | Bajo | Cupón de un solo uso marcado en BD |

---

## 10\. Roadmap de Desarrollo

### ✅ Fase 0 — Arquitectura (Completada)

- Definición de stack tecnológico
- Esquema de BD diseñado
- Estrategia anti-fraude documentada
- Cumplimiento RGPD planificado

### 🚧 Fase 1 — PoC Escáner QR (En curso)

- Crear proyecto en Supabase (nuevo, aislado)
- Ejecutar SQL del esquema de BD
- Componente React con `html5-qrcode` + `scanLock`
- Integración `idempotency_key` → Supabase
- Test de estrés: doble tap, múltiples dispositivos

### 📋 Fase 2 — MVP Completo

- Pantalla de registro con validación RGPD
- Lista de 12 paradas con estado de progreso
- Deep links Google Maps por cada parada
- Pantalla de meta + generación de cupón
- Panel de admin básico (estadísticas del recorrido)

### 🚀 Fase 3 — Producción

- Configurar dominio en Cloudflare Pages
- Generar y maquetar los 12 QRs físicos para impresión
- Test de carga (simular 10k usuarios concurrentes)
- Documentar proceso de borrado post-evento (RGPD)

---

## 11\. Decisiones Pendientes

> Estas decisiones **bloquean o condicionan** partes del desarrollo. Resolver antes de avanzar en la fase correspondiente.

| # | Decisión | Opciones | Impacto |
| --- | --- | --- | --- |
| D-01 | **Sistema de autenticación** | Magic Link · Sesión anónima · OTP SMS | Afecta políticas RLS y UX de registro |
| D-02 | **¿PoC aislado o conectado a Supabase?** | Componente React puro · Integrado desde inicio | Velocidad de iteración en Fase 1 |
| D-03 | **Caducidad del cupón** | Sin caducidad · 48h · Hasta fin del evento | Lógica de validación en BD |
| D-04 | **Nombre de dominio** | rutaexpo.app · vianalainaudita.es · otro | Necesario antes de imprimir QRs |
| D-05 | **Panel de administración** | Supabase Dashboard directo · Panel custom | Esfuerzo de desarrollo Fase 2 |

---

## 12\. Glosario

| Término | Definición |
| --- | --- |
| **SPOF** | Single Point of Failure — punto único cuyo fallo colapsa el sistema |
| **Race Condition** | Dos peticiones simultáneas que intentan modificar el mismo dato a la vez |
| **idempotency\_key** | Hash único que garantiza que una operación solo se ejecute una vez en BD |
| **scanLock** | Flag en React que bloquea nuevas peticiones mientras una está en vuelo |
| **PWA** | Progressive Web App — web que funciona offline y se puede "instalar" en el móvil |
| **RLS** | Row Level Security — política de Supabase que restringe acceso por fila |
| **Deep Link** | URL que abre directamente una app nativa (ej: Google Maps) con parámetros |
| **Free Tier** | Plan gratuito de Supabase (500 MB BD, 2 GB transferencia/mes) |
| **CEREBRO V12** | Proyecto Supabase existente, separado de este sistema. No tocar. |

---

*Ruta Expo · Sistema Digital · Guía Maestra v1.0*  
*Proyecto de La Inaudita · Córdoba 2025*