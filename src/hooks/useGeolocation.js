import { useState, useEffect, useRef } from 'react'

/**
 * Haversine distance in metres between two lat/lng points.
 */
function haversineMetres(lat1, lng1, lat2, lng2) {
  const R = 6371000
  const φ1 = (lat1 * Math.PI) / 180
  const φ2 = (lat2 * Math.PI) / 180
  const Δφ = ((lat2 - lat1) * Math.PI) / 180
  const Δλ = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(Δφ / 2) ** 2 +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2
  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

/**
 * Hook that watches the user's GPS position.
 * Returns:
 *   - position: { lat, lng } | null
 *   - error: string | null
 *   - getDistanceTo(lat, lng): metres (or Infinity if no position)
 *   - isNear(lat, lng, thresholdMetres): boolean
 */
export function useGeolocation() {
  const [position, setPosition] = useState(null)
  const [error, setError] = useState(null)
  const watchIdRef = useRef(null)

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocalización no disponible en este dispositivo.')
      return
    }

    const options = { enableHighAccuracy: true, maximumAge: 10000, timeout: 15000 }

    watchIdRef.current = navigator.geolocation.watchPosition(
      pos => {
        setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setError(null)
      },
      err => {
        if (err.code === 1) setError('Permiso de ubicación denegado.')
        else setError(null) // timeout/unavailable — silent
      },
      options
    )

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current)
      }
    }
  }, [])

  function getDistanceTo(lat, lng) {
    if (!position) return Infinity
    return haversineMetres(position.lat, position.lng, lat, lng)
  }

  function isNear(lat, lng, thresholdMetres = 50) {
    return getDistanceTo(lat, lng) <= thresholdMetres
  }

  return { position, error, getDistanceTo, isNear }
}
