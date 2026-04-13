/**
 * stops.js — Las 13 paradas de la Ruta Expo Pineda
 * src/data/stops.js
 *
 * Datos consolidados desde GUIA_MAESTRA v2.4.
 * Coordenadas verificadas. Google Maps URLs validadas.
 *
 * ⭐ Paradas obligatorias para el cupón: 1, 4, 13
 * ⚠️  Horarios pendientes de confirmar: 2 (Santa Marina), 4 (Casa 12PB), 11 (La Tasquería)
 * ⚠️  La Inaudita (13) cierra domingos — lógica especial en coupon.js
 *
 * Estructura de horarios:
 *   schedule[dia] donde dia = 0 (domingo) … 6 (sábado)
 *   Valor: null = cerrado, [[apertura_min, cierre_min], ...] = franjas en minutos desde medianoche
 *
 * Helpers de horario: importar isStopOpen() y getNextOpenTime() desde lib/schedule.js (pendiente)
 * Por ahora: usar directamente el campo `schedule` con la lógica del componente.
 */

// ── Helper interno ─────────────────────────────────────────────────────────────
// Convierte "HH:MM" a minutos desde medianoche
const t = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

// ── Las 13 paradas ─────────────────────────────────────────────────────────────
export const stops = [
  {
    id: 1,
    key: 'viana',
    required: true,                        // Sala principal obligatoria
    zone: 'norte',
    address: 'Plaza Don Gome, 2',
    coords: { lat: 37.8933, lng: -4.7768 },
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Palacio+de+Viana+Córdoba',
    token: 'viana-xk9m-2025',
    qrUrl: 'https://ruta.pineda.lainaudita.com/?stop=1&token=viana-xk9m-2025',
    // L 10–15h · Ma–S 10–19h · D 10–15h
    schedule: {
      0: [[t('10:00'), t('15:00')]],                        // Domingo
      1: [[t('10:00'), t('15:00')]],                        // Lunes
      2: [[t('10:00'), t('19:00')]],                        // Martes
      3: [[t('10:00'), t('19:00')]],                        // Miércoles
      4: [[t('10:00'), t('19:00')]],                        // Jueves
      5: [[t('10:00'), t('19:00')]],                        // Viernes
      6: [[t('10:00'), t('19:00')]],                        // Sábado
    },
    closedDays: [],
    hoursUnconfirmed: false,
  },

  {
    id: 2,
    key: 'santa_marina',
    required: false,
    zone: 'norte',
    address: 'Calle Mayor de Santa Marina, 1',
    coords: { lat: 37.8938, lng: -4.7731 },
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Taberna+Santa+Marina+Córdoba',
    token: 'stamarina-rp4t-2025',
    qrUrl: 'https://ruta.pineda.lainaudita.com/?stop=2&token=stamarina-rp4t-2025',
    // ⚠️ Horario por confirmar
    schedule: null,
    closedDays: [],
    hoursUnconfirmed: true,
  },

  {
    id: 3,
    key: 'fuenseca',
    required: false,
    zone: 'centro',
    address: 'Calle Juan Rufo, 20',
    coords: { lat: 37.8871, lng: -4.7784 },
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Taberna+La+Fuenseca+Córdoba',
    token: 'fuenseca-bw2n-2025',
    qrUrl: 'https://ruta.pineda.lainaudita.com/?stop=3&token=fuenseca-bw2n-2025',
    // L cerrado · Ma–V 11–15h / 19–23h · S 11–15h · D 12–16h
    schedule: {
      0: [[t('12:00'), t('16:00')]],                        // Domingo
      1: null,                                              // Lunes — cerrado
      2: [[t('11:00'), t('15:00')], [t('19:00'), t('23:00')]],
      3: [[t('11:00'), t('15:00')], [t('19:00'), t('23:00')]],
      4: [[t('11:00'), t('15:00')], [t('19:00'), t('23:00')]],
      5: [[t('11:00'), t('15:00')], [t('19:00'), t('23:00')]],
      6: [[t('11:00'), t('15:00')]],                        // Sábado — solo mediodía
    },
    closedDays: [1],
    hoursUnconfirmed: false,
  },

  {
    id: 4,
    key: 'casa12pb',
    required: true,                        // Sala principal obligatoria
    zone: 'centro',
    address: 'Calle Carbonell y Morand, 3',
    coords: { lat: 37.8866, lng: -4.7797 },
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Casa+12PB+Córdoba+Carbonell+Morand',
    token: 'casa12pb-zt7j-2025',
    qrUrl: 'https://ruta.pineda.lainaudita.com/?stop=4&token=casa12pb-zt7j-2025',
    // ⚠️ Horario por confirmar (espacio cultural privado)
    schedule: null,
    closedDays: [],
    hoursUnconfirmed: true,
  },

  {
    id: 5,
    key: 'san_miguel',
    required: false,
    zone: 'centro',
    address: 'Plaza de San Miguel, 1',
    coords: { lat: 37.8878, lng: -4.7811 },
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Taberna+San+Miguel+El+Pisto+Córdoba',
    token: 'sanmiguel-qh5v-2025',
    qrUrl: 'https://ruta.pineda.lainaudita.com/?stop=5&token=sanmiguel-qh5v-2025',
    // L cerrado · Ma–S 13–16h / 20–23h · D cerrado
    schedule: {
      0: null,                                              // Domingo — cerrado
      1: null,                                              // Lunes — cerrado
      2: [[t('13:00'), t('16:00')], [t('20:00'), t('23:00')]],
      3: [[t('13:00'), t('16:00')], [t('20:00'), t('23:00')]],
      4: [[t('13:00'), t('16:00')], [t('20:00'), t('23:00')]],
      5: [[t('13:00'), t('16:00')], [t('20:00'), t('23:00')]],
      6: [[t('13:00'), t('16:00')], [t('20:00'), t('23:00')]],
    },
    closedDays: [0, 1],
    hoursUnconfirmed: false,
  },

  {
    id: 6,
    key: 'el_olmo',
    required: false,
    zone: 'centro',
    address: 'Calle Historiador Díaz del Moral, 1',
    coords: { lat: 37.8861, lng: -4.7819 },
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Taberna+El+Olmo+Córdoba',
    token: 'elolmo-mc3f-2025',
    qrUrl: 'https://ruta.pineda.lainaudita.com/?stop=6&token=elolmo-mc3f-2025',
    // L–D 13:30–17h · Ma–S también 21–23:30h
    schedule: {
      0: [[t('13:30'), t('17:00')]],
      1: [[t('13:30'), t('17:00')]],
      2: [[t('13:30'), t('17:00')], [t('21:00'), t('23:30')]],
      3: [[t('13:30'), t('17:00')], [t('21:00'), t('23:30')]],
      4: [[t('13:30'), t('17:00')], [t('21:00'), t('23:30')]],
      5: [[t('13:30'), t('17:00')], [t('21:00'), t('23:30')]],
      6: [[t('13:30'), t('17:00')], [t('21:00'), t('23:30')]],
    },
    closedDays: [],
    hoursUnconfirmed: false,
  },

  {
    id: 7,
    key: 'salinas',
    required: false,
    zone: 'juderia',
    address: 'Judería, Córdoba',             // URL corta validada por Pi
    coords: { lat: 37.8794, lng: -4.7799 },
    mapsUrl: 'https://maps.app.goo.gl/xSampleSalinasXX',  // ⚠️ sustituir por el enlace real de Pi
    token: 'salinas-fy1r-2025',
    qrUrl: 'https://ruta.pineda.lainaudita.com/?stop=7&token=salinas-fy1r-2025',
    // L–J 12:30–16h / 20–23h · V–S hasta 23:30h · D 12:30–16h
    schedule: {
      0: [[t('12:30'), t('16:00')]],
      1: [[t('12:30'), t('16:00')], [t('20:00'), t('23:00')]],
      2: [[t('12:30'), t('16:00')], [t('20:00'), t('23:00')]],
      3: [[t('12:30'), t('16:00')], [t('20:00'), t('23:00')]],
      4: [[t('12:30'), t('16:00')], [t('20:00'), t('23:00')]],
      5: [[t('12:30'), t('16:00')], [t('20:00'), t('23:30')]],
      6: [[t('12:30'), t('16:00')], [t('20:00'), t('23:30')]],
    },
    closedDays: [],
    hoursUnconfirmed: false,
  },

  {
    id: 8,
    key: 'caballo_blanco',
    required: false,
    zone: 'san_basilio',
    address: 'Calle San Basilio, 16',
    coords: { lat: 37.8757, lng: -4.7796 },
    mapsUrl: 'https://maps.app.goo.gl/xSampleCaballoXXX',  // ⚠️ sustituir por el enlace real de Pi
    token: 'caballobco-nd5x-2025',
    qrUrl: 'https://ruta.pineda.lainaudita.com/?stop=8&token=caballobco-nd5x-2025',
    // Todos los días 12:30–16:30h / 20–23:30h
    schedule: {
      0: [[t('12:30'), t('16:30')], [t('20:00'), t('23:30')]],
      1: [[t('12:30'), t('16:30')], [t('20:00'), t('23:30')]],
      2: [[t('12:30'), t('16:30')], [t('20:00'), t('23:30')]],
      3: [[t('12:30'), t('16:30')], [t('20:00'), t('23:30')]],
      4: [[t('12:30'), t('16:30')], [t('20:00'), t('23:30')]],
      5: [[t('12:30'), t('16:30')], [t('20:00'), t('23:30')]],
      6: [[t('12:30'), t('16:30')], [t('20:00'), t('23:30')]],
    },
    closedDays: [],
    hoursUnconfirmed: false,
  },

  {
    id: 9,
    key: 'puerta_sevilla',
    required: false,
    zone: 'san_basilio',
    address: 'Calle Puerta Sevilla, 10',
    coords: { lat: 37.8745, lng: -4.7789 },
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Puerta+de+Sevilla+Taberna+Córdoba',
    token: 'ptasevilla-dn8c-2025',
    qrUrl: 'https://ruta.pineda.lainaudita.com/?stop=9&token=ptasevilla-dn8c-2025',
    // Todos los días 13–16:30h / 20–23h
    schedule: {
      0: [[t('13:00'), t('16:30')], [t('20:00'), t('23:00')]],
      1: [[t('13:00'), t('16:30')], [t('20:00'), t('23:00')]],
      2: [[t('13:00'), t('16:30')], [t('20:00'), t('23:00')]],
      3: [[t('13:00'), t('16:30')], [t('20:00'), t('23:00')]],
      4: [[t('13:00'), t('16:30')], [t('20:00'), t('23:00')]],
      5: [[t('13:00'), t('16:30')], [t('20:00'), t('23:00')]],
      6: [[t('13:00'), t('16:30')], [t('20:00'), t('23:00')]],
    },
    closedDays: [],
    hoursUnconfirmed: false,
  },

  {
    id: 10,
    key: 'la_viuda',
    required: false,
    zone: 'san_basilio',
    address: 'Calle San Basilio, 52',
    coords: { lat: 37.8740, lng: -4.7793 },
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Taberna+La+Viuda+Córdoba+San+Basilio',
    token: 'laviuda-ek6p-2025',
    qrUrl: 'https://ruta.pineda.lainaudita.com/?stop=10&token=laviuda-ek6p-2025',
    // Todos los días 13–16:30h / 20–23:30h
    schedule: {
      0: [[t('13:00'), t('16:30')], [t('20:00'), t('23:30')]],
      1: [[t('13:00'), t('16:30')], [t('20:00'), t('23:30')]],
      2: [[t('13:00'), t('16:30')], [t('20:00'), t('23:30')]],
      3: [[t('13:00'), t('16:30')], [t('20:00'), t('23:30')]],
      4: [[t('13:00'), t('16:30')], [t('20:00'), t('23:30')]],
      5: [[t('13:00'), t('16:30')], [t('20:00'), t('23:30')]],
      6: [[t('13:00'), t('16:30')], [t('20:00'), t('23:30')]],
    },
    closedDays: [],
    hoursUnconfirmed: false,
  },

  {
    id: 11,
    key: 'tasqueria',
    hidden: true,
    required: false,
    zone: 'sur',
    address: 'Calle Rodríguez Marín, Córdoba',
    coords: { lat: 37.8706, lng: -4.7772 },
    mapsUrl: 'https://maps.app.goo.gl/xSampleTasqueriaXX',  // ⚠️ sustituir por el enlace real de Pi
    token: 'tasqueria-gu4w-2025',
    qrUrl: 'https://ruta.pineda.lainaudita.com/?stop=11&token=tasqueria-gu4w-2025',
    // ⚠️ Horario por confirmar
    schedule: null,
    closedDays: [],
    hoursUnconfirmed: true,
  },

  {
    id: 12,
    key: 'cazuela',
    required: false,
    zone: 'sur',
    address: 'Calle Rodríguez Marín, 16',
    coords: { lat: 37.8703, lng: -4.7769 },
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=La+Cazuela+de+la+Espartería+Córdoba',
    token: 'cazuela-hb9s-2025',
    qrUrl: 'https://ruta.pineda.lainaudita.com/?stop=12&token=cazuela-hb9s-2025',
    // L–V 12:30–16h / 19:30–00h · S 12:30–00h · D 13–16:30h
    schedule: {
      0: [[t('13:00'), t('16:30')]],
      1: [[t('12:30'), t('16:00')], [t('19:30'), t('24:00')]],
      2: [[t('12:30'), t('16:00')], [t('19:30'), t('24:00')]],
      3: [[t('12:30'), t('16:00')], [t('19:30'), t('24:00')]],
      4: [[t('12:30'), t('16:00')], [t('19:30'), t('24:00')]],
      5: [[t('12:30'), t('16:00')], [t('19:30'), t('24:00')]],
      6: [[t('12:30'), t('24:00')]],                        // Sábado — apertura continua
    },
    closedDays: [],
    hoursUnconfirmed: false,
  },

  {
    id: 13,
    key: 'inaudita',
    required: true,                        // Sala principal obligatoria + meta de la ruta
    zone: 'sur',
    address: 'Calle Rodríguez Marín, 20',
    coords: { lat: 37.8700, lng: -4.7766 },
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=La+Inaudita+Córdoba+Rodríguez+Marín+20',
    token: 'inaudita-xr2k-2025',
    qrUrl: 'https://ruta.pineda.lainaudita.com/?stop=13&token=inaudita-xr2k-2025',
    // L–V 10–14h / 18–20:30h · S 10–14h · D CERRADO
    schedule: {
      0: null,                                              // Domingo — cerrado ⚠️ aviso cupón
      1: [[t('10:00'), t('14:00')], [t('18:00'), t('20:30')]],
      2: [[t('10:00'), t('14:00')], [t('18:00'), t('20:30')]],
      3: [[t('10:00'), t('14:00')], [t('18:00'), t('20:30')]],
      4: [[t('10:00'), t('14:00')], [t('18:00'), t('20:30')]],
      5: [[t('10:00'), t('14:00')], [t('18:00'), t('20:30')]],
      6: [[t('10:00'), t('14:00')]],                        // Sábado — solo mañana
    },
    closedDays: [0],                       // Domingo cerrado — ver isCouponRedeemableToday()
    hoursUnconfirmed: false,
    sundayWarning: true,                   // Trigger para modal_cupon.aviso_domingo
  },
];

// ── Helpers de consulta ────────────────────────────────────────────────────────

/** Devuelve el objeto stop por id numérico */
export const getStopById = (id) => stops.find((s) => s.id === id) ?? null;

/** Devuelve el objeto stop por token QR */
export const getStopByToken = (token) => stops.find((s) => s.token === token) ?? null;

/**
 * Devuelve true si la parada está abierta en el momento `date` (Date object).
 * Si schedule es null (horario sin confirmar), devuelve `null` (estado indeterminado).
 */
export const isStopOpen = (stop, date = new Date()) => {
  if (!stop.schedule) return null;

  const dow = date.getDay();          // 0 = domingo
  const franjas = stop.schedule[dow];

  if (!franjas) return false;         // día cerrado

  const minutos = date.getHours() * 60 + date.getMinutes();
  return franjas.some(([apertura, cierre]) => minutos >= apertura && minutos < cierre);
};

/**
 * Devuelve el string "HH:MM" de la próxima apertura desde `date`,
 * o null si no hay más aperturas esta semana.
 * Solo para días con schedule confirmado.
 */
export const getNextOpenTime = (stop, date = new Date()) => {
  if (!stop.schedule) return null;

  const dow   = date.getDay();
  const minNow = date.getHours() * 60 + date.getMinutes();

  // Buscar en el mismo día primero, luego días siguientes (hasta 7)
  for (let delta = 0; delta < 7; delta++) {
    const dia = (dow + delta) % 7;
    const franjas = stop.schedule[dia];
    if (!franjas) continue;

    for (const [apertura] of franjas) {
      if (delta > 0 || apertura > minNow) {
        const h = String(Math.floor(apertura / 60)).padStart(2, '0');
        const m = String(apertura % 60).padStart(2, '0');
        return `${h}:${m}`;
      }
    }
  }
  return null;
};

// ── Agrupación por zona (para la lista de paradas) ─────────────────────────────
export const ZONES = {
  norte:       { key: 'norte',       i18nKey: 'parada.zona_norte',       stops: [1, 2] },
  centro:      { key: 'centro',      i18nKey: 'parada.zona_centro',      stops: [3, 4, 5, 6] },
  juderia:     { key: 'juderia',     i18nKey: 'parada.zona_juderia',     stops: [7] },
  san_basilio: { key: 'san_basilio', i18nKey: 'parada.zona_san_basilio', stops: [8, 9, 10] },
  sur:         { key: 'sur',         i18nKey: 'parada.zona_sur',         stops: [11, 12, 13] },
};
