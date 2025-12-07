/**
 * ============================================
 * ZAVO - GoogleMapAdvanced Component
 * ============================================
 * 
 * Funciones avanzadas de Google Maps:
 * - Geolocalización en tiempo real
 * - Múltiples marcadores
 * - Clustering
 * - Eventos del mapa
 * - Polylines personalizadas
 */

import { useCallback, useRef, useState, useEffect } from 'react'
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
  MarkerClusterer,
  Polyline
} from '@react-google-maps/api'
import { Coordinate } from '../../types/firebase'

// ============================================
// CONFIGURACIÓN AVANZADA
// ============================================

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''
const LIBRARIES: ("places" | "geometry" | "drawing")[] = ['places', 'geometry']

// Opciones del clusterer
const CLUSTER_OPTIONS = {
  imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m',
  gridSize: 60,
  maxZoom: 15,
}

// ============================================
// INTERFACES AVANZADAS
// ============================================

export interface AdvancedMarker {
  id: string
  position: Coordinate
  type: 'restaurant' | 'courier' | 'user' | 'delivery'
  label?: string
  data?: any
  animation?: google.maps.Animation
  clusterable?: boolean
}

export interface PolylineData {
  id: string
  path: Coordinate[]
  strokeColor?: string
  strokeWeight?: number
  strokeOpacity?: number
  geodesic?: boolean
}

interface GoogleMapAdvancedProps {
  center?: Coordinate
  zoom?: number
  markers?: AdvancedMarker[]
  polylines?: PolylineData[]
  enableGeolocation?: boolean
  enableClustering?: boolean
  onMapClick?: (coordinate: Coordinate) => void
  onMarkerClick?: (marker: AdvancedMarker) => void
  onDragEnd?: (center: Coordinate) => void
  onZoomChanged?: (zoom: number) => void
  onBoundsChanged?: (bounds: google.maps.LatLngBounds) => void
  className?: string
}

// ============================================
// COMPONENTE AVANZADO
// ============================================

export default function GoogleMapAdvanced({
  center = { lat: 4.6761, lng: -74.0486 },
  zoom = 14,
  markers = [],
  polylines = [],
  enableGeolocation = true,
  enableClustering = true,
  onMapClick,
  onMarkerClick,
  onDragEnd,
  onZoomChanged,
  onBoundsChanged,
  className = ''
}: GoogleMapAdvancedProps) {

  // ============================================
  // ESTADO Y REFS
  // ============================================

  const mapRef = useRef<google.maps.Map | null>(null)
  const [userLocation, setUserLocation] = useState<Coordinate | null>(null)
  const [selectedMarker, setSelectedMarker] = useState<AdvancedMarker | null>(null)
  const [isTracking, setIsTracking] = useState(false)
  const watchIdRef = useRef<number | null>(null)

  // ============================================
  // GEOLOCALIZACIÓN EN TIEMPO REAL
  // ============================================

  const startLocationTracking = useCallback(() => {
    if (!navigator.geolocation) {
      console.error('Geolocalización no soportada')
      return
    }

    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000
    }

    const onSuccess = (position: GeolocationPosition) => {
      const newLocation: Coordinate = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      }
      
      setUserLocation(newLocation)
      
      // Centrar mapa en la primera ubicación
      if (mapRef.current && !isTracking) {
        mapRef.current.panTo(newLocation)
        setIsTracking(true)
      }
    }

    const onError = (error: GeolocationPositionError) => {
      console.error('Error de geolocalización:', error.message)
    }

    // Obtener ubicación inicial
    navigator.geolocation.getCurrentPosition(onSuccess, onError, options)

    // Iniciar seguimiento continuo
    watchIdRef.current = navigator.geolocation.watchPosition(
      onSuccess, 
      onError, 
      options
    )
  }, [isTracking])

  const stopLocationTracking = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current)
      watchIdRef.current = null
      setIsTracking(false)
    }
  }, [])

  // ============================================
  // EFECTOS
  // ============================================

  useEffect(() => {
    if (enableGeolocation) {
      startLocationTracking()
    }

    return () => {
      stopLocationTracking()
    }
  }, [enableGeolocation, startLocationTracking, stopLocationTracking])

  // ============================================
  // CALLBACKS DEL MAPA
  // ============================================

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map
    console.log('🗺️ Mapa avanzado cargado')
  }, [])

  const onMapClickHandler = useCallback((event: google.maps.MapMouseEvent) => {
    if (event.latLng && onMapClick) {
      const coordinate: Coordinate = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng()
      }
      onMapClick(coordinate)
    }
  }, [onMapClick])

  const onDragEndHandler = useCallback(() => {
    if (mapRef.current && onDragEnd) {
      const center = mapRef.current.getCenter()
      if (center) {
        onDragEnd({
          lat: center.lat(),
          lng: center.lng()
        })
      }
    }
  }, [onDragEnd])

  const onZoomChangedHandler = useCallback(() => {
    if (mapRef.current && onZoomChanged) {
      const zoom = mapRef.current.getZoom()
      if (zoom !== undefined) {
        onZoomChanged(zoom)
      }
    }
  }, [onZoomChanged])

  const onBoundsChangedHandler = useCallback(() => {
    if (mapRef.current && onBoundsChanged) {
      const bounds = mapRef.current.getBounds()
      if (bounds) {
        onBoundsChanged(bounds)
      }
    }
  }, [onBoundsChanged])

  // ============================================
  // FUNCIONES HELPER
  // ============================================

  const getMarkerIcon = (marker: AdvancedMarker) => {
    const icons = {
      restaurant: '🏪',
      courier: '🚗', 
      delivery: '📍',
      user: '👤'
    }

    const colors = {
      restaurant: '#16A34A',
      courier: '#F97316',
      delivery: '#3B82F6', 
      user: '#8B5CF6'
    }

    return {
      url: `data:image/svg+xml;base64,${btoa(`
        <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="14" fill="${colors[marker.type]}" stroke="white" stroke-width="2"/>
          <text x="16" y="20" text-anchor="middle" fill="white" font-size="14">${icons[marker.type]}</text>
        </svg>
      `)}`,
      scaledSize: new google.maps.Size(32, 32),
      anchor: new google.maps.Point(16, 16)
    }
  }

  // Separar marcadores para clustering
  const clusterableMarkers = markers.filter(m => m.clusterable !== false)
  const nonClusterableMarkers = markers.filter(m => m.clusterable === false)

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className={`relative ${className}`}>
      <LoadScript
        googleMapsApiKey={GOOGLE_MAPS_API_KEY}
        libraries={LIBRARIES}
      >
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '100%' }}
          center={center}
          zoom={zoom}
          onLoad={onMapLoad}
          onClick={onMapClickHandler}
          onDragEnd={onDragEndHandler}
          onZoomChanged={onZoomChangedHandler}
          onBoundsChanged={onBoundsChangedHandler}
          options={{
            disableDefaultUI: false,
            zoomControl: true,
            streetViewControl: false,
            mapTypeControl: true,
            fullscreenControl: true,
            gestureHandling: 'cooperative',
          }}
        >
          {/* Marcadores con clustering */}
          {enableClustering && clusterableMarkers.length > 0 ? (
            <MarkerClusterer options={CLUSTER_OPTIONS}>
              {(clusterer) => (
                <>
                  {clusterableMarkers.map((marker) => (
                    <Marker
                      key={marker.id}
                      position={marker.position}
                      icon={getMarkerIcon(marker)}
                      animation={marker.animation}
                      clusterer={clusterer}
                      onClick={() => {
                        setSelectedMarker(marker)
                        onMarkerClick?.(marker)
                      }}
                    />
                  ))}
                </>
              )}
            </MarkerClusterer>
          ) : (
            // Marcadores sin clustering
            clusterableMarkers.map((marker) => (
              <Marker
                key={marker.id}
                position={marker.position}
                icon={getMarkerIcon(marker)}
                animation={marker.animation}
                onClick={() => {
                  setSelectedMarker(marker)
                  onMarkerClick?.(marker)
                }}
              />
            ))
          )}

          {/* Marcadores sin clustering */}
          {nonClusterableMarkers.map((marker) => (
            <Marker
              key={marker.id}
              position={marker.position}
              icon={getMarkerIcon(marker)}
              animation={marker.animation}
              onClick={() => {
                setSelectedMarker(marker)
                onMarkerClick?.(marker)
              }}
            />
          ))}

          {/* Marcador de usuario (geolocalización) */}
          {userLocation && (
            <Marker
              position={userLocation}
              icon={{
                url: `data:image/svg+xml;base64,${btoa(`
                  <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="10" cy="10" r="8" fill="#3B82F6" stroke="white" stroke-width="2"/>
                    <circle cx="10" cy="10" r="3" fill="white"/>
                  </svg>
                `)}`,
                scaledSize: new google.maps.Size(20, 20),
                anchor: new google.maps.Point(10, 10)
              }}
            />
          )}

          {/* Polylines personalizadas */}
          {polylines.map((polyline) => (
            <Polyline
              key={polyline.id}
              path={polyline.path}
              options={{
                strokeColor: polyline.strokeColor || '#16A34A',
                strokeWeight: polyline.strokeWeight || 4,
                strokeOpacity: polyline.strokeOpacity || 0.8,
                geodesic: polyline.geodesic || false,
              }}
            />
          ))}

          {/* InfoWindow */}
          {selectedMarker && (
            <InfoWindow
              position={selectedMarker.position}
              onCloseClick={() => setSelectedMarker(null)}
            >
              <div className="p-3 max-w-xs">
                <h3 className="font-semibold text-gray-800 mb-1">
                  {selectedMarker.label || selectedMarker.id}
                </h3>
                <p className="text-sm text-gray-600 capitalize mb-2">
                  Tipo: {selectedMarker.type}
                </p>
                <p className="text-xs text-gray-500">
                  Lat: {selectedMarker.position.lat.toFixed(6)}<br/>
                  Lng: {selectedMarker.position.lng.toFixed(6)}
                </p>
                {selectedMarker.data && (
                  <div className="mt-2 text-xs text-gray-600">
                    <pre>{JSON.stringify(selectedMarker.data, null, 2)}</pre>
                  </div>
                )}
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>

      {/* Controles de geolocalización */}
      {enableGeolocation && (
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={isTracking ? stopLocationTracking : startLocationTracking}
            className={`px-4 py-2 rounded-lg shadow-lg text-white font-medium transition-colors ${
              isTracking 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {isTracking ? '⏹️ Detener' : '📍 Ubicar'}
          </button>
        </div>
      )}

      {/* Información de estado */}
      <div className="absolute bottom-4 left-4 z-10 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
        <div className="text-sm space-y-1">
          <div>📍 Marcadores: {markers.length}</div>
          <div>📏 Polylines: {polylines.length}</div>
          {userLocation && (
            <div className="text-green-600">
              🎯 Ubicación: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
