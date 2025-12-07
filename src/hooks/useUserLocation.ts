/**
 * ZAVO useUserLocation Hook
 * Hook para obtener y trackear la ubicación del usuario
 */

import { useState, useEffect, useCallback } from 'react'
import { Coordinate } from '../types/location'
import { MAP_CONFIG } from '../config/realtime'

interface UseUserLocationOptions {
  enableHighAccuracy?: boolean
  watchPosition?: boolean
  timeout?: number
  maximumAge?: number
}

interface UseUserLocationReturn {
  location: Coordinate | null
  error: string | null
  isLoading: boolean
  isSupported: boolean
  requestPermission: () => Promise<void>
  refresh: () => void
}

/**
 * Hook para obtener la ubicación del usuario
 * 
 * @example
 * const { location, error, isLoading, requestPermission } = useUserLocation()
 * 
 * if (isLoading) return <Spinner />
 * if (error) return <Error message={error} />
 * if (location) return <Map center={location} />
 */
export function useUserLocation(
  options: UseUserLocationOptions = {}
): UseUserLocationReturn {
  const {
    enableHighAccuracy = true,
    watchPosition = false,
    timeout = 10000,
    maximumAge = 60000, // 1 minuto de cache
  } = options

  const [location, setLocation] = useState<Coordinate | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [watchId, setWatchId] = useState<number | null>(null)

  const isSupported = typeof navigator !== 'undefined' && 'geolocation' in navigator

  /**
   * Maneja el éxito de la geolocalización
   */
  const handleSuccess = useCallback((position: GeolocationPosition) => {
    setLocation({
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    })
    setError(null)
    setIsLoading(false)
  }, [])

  /**
   * Maneja errores de geolocalización
   */
  const handleError = useCallback((err: GeolocationPositionError) => {
    let errorMessage: string

    switch (err.code) {
      case err.PERMISSION_DENIED:
        errorMessage = 'Permiso de ubicación denegado. Por favor, habilita la ubicación en tu navegador.'
        break
      case err.POSITION_UNAVAILABLE:
        errorMessage = 'No se pudo obtener tu ubicación. Verifica tu conexión GPS.'
        break
      case err.TIMEOUT:
        errorMessage = 'La solicitud de ubicación tardó demasiado. Intenta de nuevo.'
        break
      default:
        errorMessage = 'Error desconocido al obtener la ubicación.'
    }

    setError(errorMessage)
    setIsLoading(false)
    
    // Usar ubicación por defecto (Bogotá) como fallback
    setLocation(MAP_CONFIG.defaultCenter)
  }, [])

  /**
   * Opciones de geolocalización
   */
  const geoOptions: PositionOptions = {
    enableHighAccuracy,
    timeout,
    maximumAge,
  }

  /**
   * Solicita permiso y obtiene la ubicación
   */
  const requestPermission = useCallback(async () => {
    if (!isSupported) {
      setError('Tu navegador no soporta geolocalización.')
      setIsLoading(false)
      setLocation(MAP_CONFIG.defaultCenter)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Intentar obtener la ubicación (esto solicitará permiso si es necesario)
      navigator.geolocation.getCurrentPosition(
        handleSuccess,
        handleError,
        geoOptions
      )
    } catch (err) {
      setError('Error al solicitar permisos de ubicación.')
      setIsLoading(false)
      setLocation(MAP_CONFIG.defaultCenter)
    }
  }, [isSupported, handleSuccess, handleError, geoOptions])

  /**
   * Refresca la ubicación actual
   */
  const refresh = useCallback(() => {
    if (!isSupported) return
    
    setIsLoading(true)
    navigator.geolocation.getCurrentPosition(
      handleSuccess,
      handleError,
      { ...geoOptions, maximumAge: 0 } // Forzar ubicación fresca
    )
  }, [isSupported, handleSuccess, handleError, geoOptions])

  /**
   * Efecto para obtener ubicación inicial
   */
  useEffect(() => {
    if (!isSupported) {
      setError('Tu navegador no soporta geolocalización.')
      setIsLoading(false)
      setLocation(MAP_CONFIG.defaultCenter)
      return
    }

    // Obtener ubicación inicial
    navigator.geolocation.getCurrentPosition(
      handleSuccess,
      handleError,
      geoOptions
    )

    // Si watchPosition está habilitado, observar cambios
    if (watchPosition) {
      const id = navigator.geolocation.watchPosition(
        handleSuccess,
        handleError,
        geoOptions
      )
      setWatchId(id)
    }

    // Cleanup
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId)
      }
    }
  }, []) // Solo ejecutar al montar

  return {
    location,
    error,
    isLoading,
    isSupported,
    requestPermission,
    refresh,
  }
}

export default useUserLocation
