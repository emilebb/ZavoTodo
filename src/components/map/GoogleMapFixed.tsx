/**
 * ============================================
 * ZAVO - GoogleMap Component (Fixed)
 * ============================================
 * 
 * Componente de Google Maps sin errores de btoa
 */

import React, { useCallback, useRef, useState, useEffect, memo } from 'react'
import { 
  GoogleMap as GoogleMapReact, 
  LoadScript, 
  Marker, 
  DirectionsRenderer,
  InfoWindow
} from '@react-google-maps/api'
import { Coordinate } from '../../types/firebase'

// ============================================
// CONFIGURACIÓN
// ============================================

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''
const LIBRARIES: ("places" | "geometry")[] = ['places', 'geometry']

const MAP_OPTIONS: google.maps.MapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: true,
  gestureHandling: 'cooperative',
}

// ============================================
// INTERFACES
// ============================================

export interface MapMarker {
  id: string
  type: 'restaurant' | 'courier' | 'user' | 'delivery'
  position: Coordinate
  label?: string
  data?: any
  icon?: string
  animation?: google.maps.Animation
}

export interface MapRoute {
  id: string
  origin: Coordinate
  destination: Coordinate
  waypoints?: Coordinate[]
  color?: string
  strokeWeight?: number
}

interface GoogleMapProps {
  center?: Coordinate
  zoom?: number
  markers?: MapMarker[]
  routes?: MapRoute[]
  onMarkerClick?: (marker: MapMarker) => void
  onMapClick?: (coordinate: Coordinate) => void
  userLocation?: Coordinate | null
  courierLocation?: Coordinate | null
  followCourier?: boolean
  showTraffic?: boolean
  className?: string
  children?: React.ReactNode
}

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

const GoogleMap = memo(function GoogleMap({
  center = { lat: 4.6761, lng: -74.0486 },
  zoom = 14,
  markers = [],
  routes = [],
  onMarkerClick,
  onMapClick,
  userLocation,
  courierLocation,
  followCourier = false,
  showTraffic = false,
  className = '',
  children,
}: GoogleMapProps) {
  
  const mapRef = useRef<google.maps.Map | null>(null)
  const directionsServiceRef = useRef<google.maps.DirectionsService | null>(null)
  const [directionsResults, setDirectionsResults] = useState<google.maps.DirectionsResult[]>([])
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null)
  const [isMapLoaded, setIsMapLoaded] = useState(false)
  const [mapError, setMapError] = useState<string | null>(null)

  // ============================================
  // CALLBACKS
  // ============================================

  const onMapLoad = useCallback((map: google.maps.Map) => {
    console.log('🗺️ Google Maps cargado')
    mapRef.current = map
    directionsServiceRef.current = new google.maps.DirectionsService()
    setIsMapLoaded(true)
    setMapError(null)

    if (showTraffic) {
      const trafficLayer = new google.maps.TrafficLayer()
      trafficLayer.setMap(map)
    }
  }, [showTraffic])

  const onMapUnmount = useCallback(() => {
    mapRef.current = null
    directionsServiceRef.current = null
    setIsMapLoaded(false)
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

  // ============================================
  // SEGUIMIENTO DEL COURIER
  // ============================================

  useEffect(() => {
    if (followCourier && courierLocation && mapRef.current) {
      mapRef.current.panTo({
        lat: courierLocation.lat,
        lng: courierLocation.lng
      })
    }
  }, [followCourier, courierLocation])

  // ============================================
  // CALCULAR RUTAS
  // ============================================

  useEffect(() => {
    if (!isMapLoaded || !directionsServiceRef.current || routes.length === 0) {
      return
    }

    const calculateRoutes = async () => {
      const results: google.maps.DirectionsResult[] = []

      for (const route of routes) {
        try {
          const request: google.maps.DirectionsRequest = {
            origin: { lat: route.origin.lat, lng: route.origin.lng },
            destination: { lat: route.destination.lat, lng: route.destination.lng },
            waypoints: route.waypoints?.map(wp => ({
              location: { lat: wp.lat, lng: wp.lng },
              stopover: true
            })),
            travelMode: google.maps.TravelMode.DRIVING,
            optimizeWaypoints: true,
          }

          const result = await new Promise<google.maps.DirectionsResult>((resolve, reject) => {
            directionsServiceRef.current!.route(request, (result, status) => {
              if (status === 'OK' && result) {
                resolve(result)
              } else {
                reject(new Error(`Directions request failed: ${status}`))
              }
            })
          })

          results.push(result)
        } catch (error) {
          console.error('Error calculando ruta:', error)
        }
      }

      setDirectionsResults(results)
    }

    calculateRoutes()
  }, [isMapLoaded, routes])

  // ============================================
  // ICONOS SIN EMOJIS (SOLUCION AL ERROR BTOA)
  // ============================================

  const getMarkerIcon = (marker: MapMarker): google.maps.Icon => {
    if (marker.icon) return { url: marker.icon } as google.maps.Icon

    const iconConfig = {
      restaurant: { color: '#16A34A', symbol: 'R' },
      courier: { color: '#F97316', symbol: 'C' },
      delivery: { color: '#3B82F6', symbol: 'D' },
      user: { color: '#8B5CF6', symbol: 'U' },
    }

    const config = iconConfig[marker.type as keyof typeof iconConfig] || iconConfig.restaurant

    // SVG sin emojis para evitar error de btoa
    const svgString = `
      <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="14" fill="${config.color}" stroke="white" stroke-width="2"/>
        <text x="16" y="20" text-anchor="middle" fill="white" font-size="14" font-weight="bold">${config.symbol}</text>
      </svg>
    `

    return {
      url: 'data:image/svg+xml;base64,' + btoa(svgString),
      scaledSize: new google.maps.Size(32, 32),
      anchor: new google.maps.Point(16, 16)
    }
  }

  // ============================================
  // MANEJO DE ERRORES
  // ============================================

  const onLoadError = useCallback((error: Error) => {
    console.error('Error cargando Google Maps:', error)
    setMapError('Error al cargar Google Maps. Verifica tu conexión y API key.')
  }, [])

  // ============================================
  // RENDER
  // ============================================

  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <div className={`flex items-center justify-center bg-red-50 border border-red-200 ${className}`}>
        <div className="text-center p-8">
          <div className="text-red-500 text-2xl mb-4">🔑</div>
          <h3 className="text-lg font-semibold text-red-800 mb-2">API Key Requerida</h3>
          <p className="text-red-600">
            Configura <code>VITE_GOOGLE_MAPS_API_KEY</code> en tu archivo .env
          </p>
        </div>
      </div>
    )
  }

  if (mapError) {
    return (
      <div className={`flex items-center justify-center bg-red-50 border border-red-200 ${className}`}>
        <div className="text-center p-8">
          <div className="text-red-500 text-2xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error del Mapa</h3>
          <p className="text-red-600 mb-4">{mapError}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Recargar Página
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      <LoadScript
        googleMapsApiKey={GOOGLE_MAPS_API_KEY}
        libraries={LIBRARIES}
        onError={onLoadError}
        loadingElement={
          <div className="flex items-center justify-center h-full bg-gray-100">
            <div className="text-center">
              <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Cargando Google Maps...</p>
            </div>
          </div>
        }
      >
        <GoogleMapReact
          mapContainerStyle={{ width: '100%', height: '100%' }}
          center={center}
          zoom={zoom}
          options={MAP_OPTIONS}
          onLoad={onMapLoad}
          onUnmount={onMapUnmount}
          onClick={onMapClickHandler}
        >
          {/* Marcadores */}
          {markers.map((marker) => (
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

          {/* Marcador de usuario */}
          {userLocation && (
            <Marker
              position={userLocation}
              icon={{
                url: 'data:image/svg+xml;base64,' + btoa(`
                  <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="10" cy="10" r="8" fill="#3B82F6" stroke="white" stroke-width="2"/>
                    <circle cx="10" cy="10" r="3" fill="white"/>
                  </svg>
                `),
                scaledSize: new google.maps.Size(20, 20),
                anchor: new google.maps.Point(10, 10)
              }}
            />
          )}

          {/* Renderizar rutas */}
          {directionsResults.map((result, index) => (
            <DirectionsRenderer
              key={`route-${index}`}
              directions={result}
              options={{
                suppressMarkers: true,
                polylineOptions: {
                  strokeColor: routes[index]?.color || '#16A34A',
                  strokeWeight: routes[index]?.strokeWeight || 4,
                  strokeOpacity: 0.8,
                }
              }}
            />
          ))}

          {/* InfoWindow */}
          {selectedMarker && (
            <InfoWindow
              position={selectedMarker.position}
              onCloseClick={() => setSelectedMarker(null)}
            >
              <div className="p-2">
                <h3 className="font-semibold text-gray-800">
                  {selectedMarker.label || selectedMarker.id}
                </h3>
                <p className="text-sm text-gray-600 capitalize">
                  {selectedMarker.type}
                </p>
              </div>
            </InfoWindow>
          )}

          {children}
        </GoogleMapReact>
      </LoadScript>
    </div>
  )
})

export default GoogleMap
