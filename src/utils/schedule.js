const DAYS = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];

function toMinutes(time) {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

/**
 * Returns the open/closed status of a stop at the current time.
 * @returns {{ open: boolean|null, label: string }}
 *   open: true = abierta, false = cerrada, null = horario desconocido
 */
export function getStopStatus(stop) {
  if (!stop.horario) {
    return { open: null, label: 'Horario por confirmar' };
  }

  const now = new Date();
  const dayName = DAYS[now.getDay()];
  const slots = stop.horario[dayName];

  if (!slots || slots.length === 0) {
    return { open: false, label: 'Cerrado hoy' };
  }

  const currentMin = now.getHours() * 60 + now.getMinutes();

  for (const slot of slots) {
    const openMin = toMinutes(slot.open);
    // 00:00 as closing time means midnight (end of day = 24:00)
    const closeMin = slot.close === '00:00' ? 24 * 60 : toMinutes(slot.close);
    if (currentMin >= openMin && currentMin < closeMin) {
      return { open: true, label: `Abierta · cierra ${slot.close === '00:00' ? '00:00' : slot.close}` };
    }
  }

  // Find next opening slot today
  const upcoming = slots
    .map(s => toMinutes(s.open))
    .filter(t => t > currentMin)
    .sort((a, b) => a - b);

  if (upcoming.length > 0) {
    const h = Math.floor(upcoming[0] / 60);
    const m = upcoming[0] % 60;
    const label = `Abre a las ${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    return { open: false, label };
  }

  return { open: false, label: 'Cerrado por hoy' };
}
