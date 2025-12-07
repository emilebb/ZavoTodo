/**
 * ============================================
 * ZAVO - useOrderTracking Hook
 * ============================================
 * 
 * Hook para tracking en tiempo real de pedidos
 * Incluye: ubicación del repartidor, ruta, ETA
 */

import { useEffect, useState, useRef, useCallback } from 'react'
import {
  subscribeToOrder,
  subscribeToOrderLocations,
  addOrderLocation,
} from '../../services/firebase/orderService'
import { Order, OrderLocation, Coordinate } from '../../types/firebase'

// ============================================
// TIPOS
// ============================================

export interface TrackingState {
  order: Order | null
  locations: OrderLocation[]
  currentLocation: Coordinate | null
  route: Coordinate[]
  isLoading: boolean
  error: string | null
}

export interface UseOrderTrackingReturn extends TrackingState {
  // Acciones
  refresh: () => void
}

// ============================================
// CONFIGURACIÓN
// ============================================

const LOCATION_UPDATE_INTERVAL = parseInt(
  import.meta.env.VITE_LOCATION_UPDATE_INTERVAL || '3000'
)

// ============================================
// HOOK PRINCIPAL
// ============================================

/**
 * Hook para tracking en tiempo real de un pedido
 * 
 * @example
 * const { order, currentLocation, route, isLoading } = useOrderTracking('order-123')
 */
export function useOrderTracking(orderId: string): UseOrderTrackingReturn {
  const [state, setState] = useState<TrackingState>({
    order: null,
    locations: [],
    currentLocation: null,
    route: [],
    isLoading: true,
    error: null,
  })

  const unsubscribeOrderRef = useRef<(() => void) | null>(null)
  const unsubscribeLocationsRef = useRef<(() => void) | null>(null)

  // Suscribirse al pedido
  useEffect(() => {
    if (!orderId) {
      setState(prev => ({ ...prev, isLoading: false }))
      return
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }))

    // Suscribirse a cambios del pedido
    unsubscribeOrderRef.current = subscribeToOrder(orderId, (order) => {
      setState(prev => ({
        ...prev,
        order,
        isLoading: false,
        error: order ? null : 'Pedido no encontrado',
      }))
    })

    // Suscribirse a ubicaciones
    unsubscribeLocationsRef.current = subscribeToOrderLocations(orderId, (locations) => {
      // Ordenar por timestamp (más reciente primero)
      const sortedLocations = [...locations].sort((a, b) => {
        const timeA = new Date(a.timestamp as string).getTime()
        const timeB = new Date(b.timestamp as string).getTime()
        return timeB - timeA
      })

      // Ubicación actual es la más reciente
      const currentLocation = sortedLocations[0] 
        ? { lat: sortedLocations[0].lat, lng: sortedLocations[0].lng }
        : null

      // Ruta es todas las ubicaciones en orden cronológico
      const route = [...sortedLocations]
        .reverse()
        .map(loc => ({ lat: loc.lat, lng: loc.lng }))

      setState(prev => ({
        ...prev,
        locations: sortedLocations,
        currentLocation,
        route,
      }))
    })

    // Cleanup
    return () => {
      unsubscribeOrderRef.current?.()
      unsubscribeLocationsRef.current?.()
    }
  }, [orderId])

  // Función para refrescar manualmente
  const refresh = useCallback(() => {
    if (!orderId) return
    
    // Re-suscribirse
    unsubscribeOrderRef.current?.()
    unsubscribeLocationsRef.current?.()

    setState(prev => ({ ...prev, isLoading: true }))

    unsubscribeOrderRef.current = subscribeToOrder(orderId, (order) => {
      setState(prev => ({ ...prev, order, isLoading: false }))
    })

    unsubscribeLocationsRef.current = subscribeToOrderLocations(orderId, (locations) => {
      const sortedLocations = [...locations].sort((a, b) => {
        const timeA = new Date(a.timestamp as string).getTime()
        const timeB = new Date(b.timestamp as string).getTime()
        return timeB - timeA
      })

      const currentLocation = sortedLocations[0] 
        ? { lat: sortedLocations[0].lat, lng: sortedLocations[0].lng }
        : null

      const route = [...sortedLocations]
        .reverse()
        .map(loc => ({ lat: loc.lat, lng: loc.lng }))

      setState(prev => ({
        ...prev,
        locations: sortedLocations,
        currentLocation,
        route,
      }))
    })
  }, [orderId])

  return {
    ...state,
    refresh,
  }
}

// ============================================
// HOOK PARA COMPARTIR UBICACIÓN (REPARTIDOR)
// ============================================

export interface UseDriverSharingReturn {
  isSharing: boolean
  error: string | null
  startSharing: () => void
  stopSharing: () => void
}

/**
 * Hook para que el repartidor comparta su ubicación
 * 
 * @example
 * const { isSharing, startSharing, stopSharing } = useDriverSharing('order-123')
 */
export function useDriverSharing(orderId: string): UseDriverSharingReturn {
  const [isSharing, setIsSharing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const watchIdRef = useRef<number | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const lastLocationRef = useRef<Coordinate | null>(null)

  // Función para enviar ubicación a Firestore
  const sendLocation = useCallback(async (position: GeolocationPosition) => {
    const location = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
      accuracy: position.coords.accuracy,
      heading: position.coords.heading || undefined,
      speed: position.coords.speed || undefined,
    }

    // Evitar enviar si la ubicación no ha cambiado significativamente
    if (lastLocationRef.current) {
      const distance = calculateDistance(lastLocationRef.current, location)
      if (distance < 0.01) return // Menos de 10 metros
    }

    lastLocationRef.current = location

    const result = await addOrderLocation(orderId, location)
    if (result.error) {
      console.error('Error enviando ubicación:', result.error)
    }
  }, [orderId])

  // Iniciar compartir ubicación
  const startSharing = useCallback(() => {
    if (!orderId || !navigator.geolocation) {
      setError('Geolocalización no disponible')
      return
    }

    setError(null)
    setIsSharing(true)

    // Obtener ubicación inicial
    navigator.geolocation.getCurrentPosition(
      sendLocation,
      (err) => {
        setError(`Error de ubicación: ${err.message}`)
        setIsSharing(false)
      },
      { enableHighAccuracy: true }
    )

    // Observar cambios de ubicación
    watchIdRef.current = navigator.geolocation.watchPosition(
      sendLocation,
      (err) => {
        console.error('Error watching position:', err)
      },
      { 
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 10000,
      }
    )

    // También enviar cada N segundos como backup
    intervalRef.current = setInterval(() => {
      navigator.geolocation.getCurrentPosition(
        sendLocation,
        (err) => console.error('Interval location error:', err),
        { enableHighAccuracy: true }
      )
    }, LOCATION_UPDATE_INTERVAL)
  }, [orderId, sendLocation])

  // Detener compartir ubicación
  const stopSharing = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current)
      watchIdRef.current = null
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    setIsSharing(false)
    lastLocationRef.current = null
  }, [])

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      stopSharing()
    }
  }, [stopSharing])

  return {
    isSharing,
    error,
    startSharing,
    stopSharing,
  }
}

// ============================================
// HELPERS
// ============================================

/**
 * Calcula la distancia entre dos coordenadas (Haversine)
 */
function calculateDistance(from: Coordinate, to: Coordinate): number {
  const R = 6371 // Radio de la Tierra en km
  const dLat = toRad(to.lat - from.lat)
  const dLng = toRad(to.lng - from.lng)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(from.lat)) *
      Math.cos(toRad(to.lat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180)
}

/**
 * Calcula ETA basado en distancia y velocidad promedio
 */
export function calculateETA(
  currentLocation: Coordinate,
  destination: Coordinate,
  averageSpeedKmh: number = 25
): number {
  const distance = calculateDistance(currentLocation, destination)
  const timeHours = distance / averageSpeedKmh
  return Math.round(timeHours * 60) // Minutos
}

/**
 * Interpola entre dos coordenadas para animación suave
 */
export function interpolateCoordinate(
  from: Coordinate,
  to: Coordinate,
  progress: number
): Coordinate {
  return {
    lat: from.lat + (to.lat - from.lat) * progress,
    lng: from.lng + (to.lng - from.lng) * progress,
  }
}
