# Ruta Expo

Base tecnica inicial del sistema de pasaporte digital para la ruta artistica entre Palacio de Viana y La Inaudita.

## Resumen

Este directorio no contenia una aplicacion implementada. Solo existia un documento de especificacion funcional y tecnica. A partir de esa guia se ha creado una primera base ejecutable del proyecto para convertir la idea en un MVP real sobre el que ya se puede iterar.

Lo realizado en esta fase:

- creacion del proyecto frontend con React + Vite
- estructura minima de app lista para desarrollo local
- flujo de registro local con sesion anonima persistida
- progreso de 12 paradas con estado guardado en `localStorage`
- simulador de validacion QR para iterar sin hardware ni backend
- generacion local de cupon al completar 12/12
- esquema SQL inicial para Supabase con tablas y RLS orientativa
- documentacion de arranque y siguientes pasos

## Contexto de origen

El proyecto parte del documento:

- `GUIA_MAESTRA_RUTA_EXPO.md  Claude.md`

Ese archivo describe el producto, el stack previsto, el flujo UX y una primera propuesta de base de datos. No habia todavia:

- codigo fuente frontend
- configuracion de build
- estructura de carpetas
- modelo de cupones implementado
- demo navegable del flujo

## Decisiones tecnicas cerradas en esta entrega

Para desbloquear el MVP y evitar dependencias sin resolver, se han fijado estas decisiones:

- Autenticacion MVP: sesion anonima local basada en un `session_id` persistido en navegador.
- Registro MVP: se solicita un unico dato de contacto, email o telefono.
- Persistencia temporal en frontend: `localStorage` para permitir demo y avance sin backend conectado.
- Cupon: una entidad propia en base de datos, una fila por visitante.
- Admin: se asume Supabase Dashboard en la primera fase, sin panel custom.
- Offline: se considera `online-first`; la PWA y la cola offline quedan para una fase posterior.

## Stack implementado

### Frontend

- React 18
- Vite 5
- CSS plano en un unico fichero

### Backend objetivo

- Supabase / PostgreSQL

## Estructura creada

```text
.
├── README.md
├── index.html
├── package.json
├── vite.config.js
├── src
│   ├── App.jsx
│   ├── main.jsx
│   ├── styles.css
│   ├── components
│   │   ├── QrScannerMock.jsx
│   │   ├── RegistrationForm.jsx
│   │   ├── RouteProgress.jsx
│   │   └── StopCard.jsx
│   ├── data
│   │   └── stops.js
│   └── lib
│       ├── coupon.js
│       └── session.js
└── supabase
    └── schema.sql
```

## Funcionalidad implementada

### 1. Shell principal de la aplicacion

Archivo:

- `src/App.jsx`

Implementa:

- carga del estado inicial
- restauracion de sesion desde `localStorage`
- registro del visitante
- listado de paradas
- control del progreso
- emision local del cupon cuando se completan las 12 paradas
- reset de la demo

### 2. Registro de usuario

Archivo:

- `src/components/RegistrationForm.jsx`

Implementa:

- campo unico para email o telefono
- checkbox obligatorio de consentimiento
- validacion basica de formulario
- alta de sesion en el flujo local del MVP

### 3. Progreso de ruta

Archivo:

- `src/components/RouteProgress.jsx`

Implementa:

- contador de paradas completadas
- porcentaje total
- barra visual de progreso

### 4. Tarjetas de parada

Archivo:

- `src/components/StopCard.jsx`

Implementa:

- visualizacion de cada parada
- acceso a deep link de Google Maps
- accion para iniciar escaneo o validacion
- estado visual de parada completada

### 5. Simulador de escaneo QR

Archivo:

- `src/components/QrScannerMock.jsx`

Implementa:

- simulacion del contenido de un QR real
- parseo de URL con parametros `stop` y `token`
- validacion basica contra la parada esperada

Este componente existe para permitir iteracion rapida mientras no se conecte `html5-qrcode`.

### 6. Datos temporales de las 12 paradas

Archivo:

- `src/data/stops.js`

Implementa:

- identificador de parada
- nombre
- area
- consulta de Google Maps
- token QR de ejemplo

### 7. Utilidades de sesion y cupon

Archivos:

- `src/lib/session.js`
- `src/lib/coupon.js`

Implementan:

- generacion y persistencia de `session_id`
- generacion local de un codigo de cupon para la demo

### 8. Estilos base de interfaz

Archivo:

- `src/styles.css`

Implementa:

- layout responsive
- tarjetas principales
- hero superior
- modal del simulador QR
- barra de progreso
- estados visuales del recorrido

## Base de datos creada

Archivo:

- `supabase/schema.sql`

Se ha dejado preparado un esquema inicial para Supabase con estas tablas:

- `visitantes`
- `paradas`
- `escaneos_paradas`
- `cupones`

### Mejoras respecto a la guia original

Se corrigieron o completaron varios puntos del diseño inicial:

- se añadió la tabla `paradas` en lugar de depender solo del numero de parada
- se añadió la tabla `cupones`, ausente en la guia original
- se añadió la restriccion de contacto obligatorio
- se dejaron indices basicos para consultas principales
- se orientaron politicas RLS vinculadas a `session_id`

### Limitacion actual del SQL

La RLS esta orientada al diseño final, pero no queda operativa por si sola hasta definir como Supabase emitira y propagara el `session_id` dentro de los claims JWT o mediante una estrategia equivalente. Esto significa que el SQL es una base de trabajo correcta, pero no una integracion final cerrada.

## Scripts disponibles

Definidos en `package.json`:

- `npm run dev`: arranca Vite en desarrollo
- `npm run build`: compila produccion
- `npm run preview`: sirve el build local

## Validacion realizada

Se ejecutaron estas comprobaciones:

- `npm install`
- `npm run build`

Resultado:

- instalacion completada correctamente
- build de produccion generado correctamente en `dist/`

## Como ejecutar el proyecto

1. Ejecuta `npm install` si no tienes dependencias instaladas.
2. Ejecuta `npm run dev`.
3. Abre `http://localhost:5173`.

## Archivos auxiliares creados

- `.gitignore`
- `package-lock.json`
- `dist/` generado por la build de validacion

## Lo que aun no esta implementado

Esta entrega deja una base funcional local, pero no resuelve todavia la integracion completa de produccion.

Pendiente:

- conectar frontend con Supabase real
- definir autenticacion anonima real o mecanismo alternativo seguro
- sustituir el simulador por escaneo con camara usando `html5-qrcode`
- generar cupones desde backend
- marcar cupones como canjeados desde un flujo de caja o admin
- activar PWA real con service worker
- decidir si hace falta cola offline para escaneos
- completar textos legales y politica de privacidad reales
- reemplazar placeholders de paradas y mapas por ubicaciones definitivas

## Recomendacion de siguiente fase

El siguiente paso correcto no es añadir mas UI, sino cerrar el backend operativo:

1. crear proyecto Supabase real
2. ejecutar `supabase/schema.sql`
3. definir estrategia real de autenticacion/sesion
4. conectar registro y escaneos desde React
5. reemplazar el mock QR por camara real

## Estado actual del proyecto

Estado: base MVP creada y validada localmente.

El proyecto ya no es solo una guia. Ahora existe una aplicacion inicial compilable, con estructura real y una primera base de datos para continuar el desarrollo.
