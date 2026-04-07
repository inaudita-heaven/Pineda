import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePassportStore } from '../store/passportStore'
import { PARADAS } from '../data/paradas'

// Leaflet needs its CSS loaded globally — imported once here
import 'leaflet/dist/leaflet.css'

const SECTOR_COLORS = {
  'santa-marina': '#b5451b',
  'centro':       '#8b5e3c',
  'juderia':      '#5c7c3a',
  'axerquia':     '#3a6c8b',
}

/**
 * Embedded Leaflet map showing all 13 stops.
 * Tap a marker → navigate to /parada/:id
 */
export default function MapView() {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const navigate = useNavigate()
  const completedStops = usePassportStore(s => s.completedStops)

  useEffect(() => {
    let L
    let map

    async function initMap() {
      L = (await import('leaflet')).default

      // Fix default icon paths broken by Vite bundling
      delete L.Icon.Default.prototype._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      })

      if (!mapRef.current || mapInstanceRef.current) return

      // Centre between Viana and La Inaudita
      map = L.map(mapRef.current, { zoomControl: true, attributionControl: false }).setView(
        [37.8820, -4.7800], 15
      )

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(map)

      // Route polyline
      const routeCoords = PARADAS.map(p => [p.lat, p.lng])
      L.polyline(routeCoords, { color: '#b5451b', weight: 2, opacity: 0.5, dashArray: '6 4' }).addTo(map)

      // Markers
      PARADAS.forEach(parada => {
        const done = completedStops.includes(parada.id)
        const color = done ? '#22c55e' : (SECTOR_COLORS[parada.sector] ?? '#b5451b')
        const star = parada.required ? '⭐' : ''

        const icon = L.divIcon({
          className: '',
          html: `<div style="
            width:32px;height:32px;border-radius:50%;
            background:${color};border:2px solid #fff;
            display:flex;align-items:center;justify-content:center;
            box-shadow:0 2px 6px rgba(0,0,0,.35);
            font-size:0.7rem;font-weight:700;color:#fff;
            cursor:pointer;
          ">${done ? '✓' : String(parada.id)}</div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        })

        const marker = L.marker([parada.lat, parada.lng], { icon }).addTo(map)
        marker.bindPopup(
          `<div style="min-width:160px">
            <p style="font-weight:700;margin:0 0 4px">${star}${parada.nombre}</p>
            <p style="font-size:0.78rem;color:#666;margin:0 0 8px">📍 ${parada.ubicacion}</p>
            <button
              onclick="window.__paradaNavigate(${parada.id})"
              style="
                background:#b5451b;color:#fff;border:none;border-radius:6px;
                padding:6px 14px;font-size:0.82rem;cursor:pointer;width:100%;
              "
            >${done ? '✓ Ver parada' : '→ Ir a la parada'}</button>
          </div>`,
          { maxWidth: 220 }
        )
      })

      mapInstanceRef.current = map
    }

    // Expose navigation callback accessible from popup HTML
    window.__paradaNavigate = (id) => {
      navigate(`/parada/${id}`)
    }

    initMap()

    return () => {
      delete window.__paradaNavigate
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, []) // init once

  // Update marker colors when completedStops changes
  useEffect(() => {
    // Re-render map by destroying and recreating if stops change
    // Simple approach: force remount via key in parent (not needed here)
    // For now markers update on next open; full live-update would require ref tracking
  }, [completedStops])

  return (
    <div
      ref={mapRef}
      style={{
        width: '100%',
        height: 340,
        borderRadius: 'var(--radius)',
        overflow: 'hidden',
        border: '1px solid var(--border)',
        marginBottom: 24,
      }}
    />
  )
}
