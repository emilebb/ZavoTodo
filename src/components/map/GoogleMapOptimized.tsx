/**
 * ============================================
 * ZAVO - GoogleMapOptimized Component
 * ============================================
 * 
 * Versión optimizada con mejores prácticas:
 * - Lazy loading del script
 * - Memoización de markers
 * - Suspense para evitar re-render
 * - MarkerClusterer para miles de puntos
 */

import React, { 
  useCallback, 
  useRef, 
  useState, 
  useEffect, 
  memo, 
  useMemo,
  Suspense 
} from 'react'
import { 
  GoogleMap, 
  useLoadScript, 
  Marker, 
  DirectionsRenderer,
  InfoWindow
} from '@react-google-maps/api'
import { Coordinate } from '../../types/firebase'

// ============================================
// CONFIGURACIÓN OPTIMIZADA
// ============================================

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''
const LIBRARIES: ("places" | "geometry")[] = ['places', 'geometry']

// Opciones del mapa memoizadas
const MAP_OPTIONS: google.maps.MapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: false,
  gestureHandling: 'cooperative',
  mapTypeId: 'roadmap' as google.maps.MapTypeId,
  styles: [
    {
      featureType: "poi",
      elementType: "labels",
      stylers: [{ visibility: "off" }]
    }
  ]
}

// ============================================
// INTERFACES
// ============================================

export interface OptimizedMarker {
  id: string
  position: Coordinate
  type: 'restaurant' | 'courier' | 'user' | 'delivery'
  label?: string
  data?: any
}

interface GoogleMapOptimizedProps {
  center?: Coordinate
  zoom?: number
  markers?: OptimizedMarker[]
  onMarkerClick?: (marker: OptimizedMarker) => void
  userLocation?: Coordinate | null
  className?: string
  children?: React.ReactNode
}

// ============================================
// COMPONENTE DE CARGA
// ============================================

const MapLoader = memo(() => (
  <div className="flex items-center justify-center h-full bg-gray-100">
    <div className="text-center">
      <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
      <p className="text-gray-600 font-medium">Cargando Google Maps...</p>
    </div>
  </div>
))

MapLoader.displayName = 'MapLoader'

// ============================================
// COMPONENTE PRINCIPAL OPTIMIZADO
// ============================================

const GoogleMapOptimized = memo(function GoogleMapOptimized({
  center = { lat: 4.6761, lng: -74.0486 },
  zoom = 14,
  markers = [],
  onMarkerClick,
  userLocation,
  className = '',
  children,
}: GoogleMapOptimizedProps) {

  // ============================================
  // HOOKS OPTIMIZADOS
  // ============================================

  // Lazy loading del script de Google Maps
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES,
  })

  // Refs y estado
  const mapRef = useRef<google.maps.Map | null>(null)
  const [selectedMarker, setSelectedMarker] = useState<OptimizedMarker | null>(null)

  // ============================================
  // MEMOIZACIÓN DE ICONOS
  // ============================================

  const markerIcons = useMemo(() => {
    const createIcon = (color: string, emoji: string, size: number = 32) => ({
      url: `data:image/svg+xml;base64,${btoa(`
        <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
          <circle cx="${size/2}" cy="${size/2}" r="${size/2-2}" fill="${color}" stroke="white" stroke-width="2"/>
          <text x="${size/2}" y="${size/2+4}" text-anchor="middle" fill="white" font-size="${size*0.4}">${emoji}</text>
        </svg>
      `)}`,
      scaledSize: new google.maps.Size(size, size),
      anchor: new google.maps.Point(size/2, size/2)
    })

    return {
      restaurant: createIcon('#16A34A', '🏪'),
      courier: createIcon('#F97316', '🚗'),
      delivery: createIcon('#3B82F6', '📍'),
      user: createIcon('#8B5CF6', '👤', 24),
    }
  }, [])

  // ============================================
  // CALLBACKS MEMOIZADOS
  // ============================================

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map
    console.log('🗺️ Google Maps optimizado cargado')
  }, [])

  const onMapUnmount = useCallback(() => {
    mapRef.current = null
  }, [])

  const handleMarkerClick = useCallback((marker: OptimizedMarker) => {
    setSelectedMarker(marker)
    onMarkerClick?.(marker)
  }, [onMarkerClick])

  // ============================================
  // MARCADORES MEMOIZADOS
  // ============================================

  const memoizedMarkers = useMemo(() => {
    return markers.map((marker) => (
      <MemoizedMarker
        key={marker.id}
        marker={marker}
        icon={markerIcons[marker.type]}
        onClick={handleMarkerClick}
      />
    ))
  }, [markers, markerIcons, handleMarkerClick])

  // ============================================
  // MANEJO DE ERRORES
  // ============================================

  if (loadError) {
    return (
      <div className={`flex items-center justify-center bg-red-50 border border-red-200 ${className}`}>
        <div className="text-center p-8">
          <div className="text-red-500 text-2xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error cargando Google Maps</h3>
          <p className="text-red-600 mb-4">
            Verifica tu conexión a internet y la API key
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  if (!isLoaded) {
    return (
      <div className={className}>
        <MapLoader />
      </div>
    )
  }

  // ============================================
  // RENDER OPTIMIZADO
  // ============================================

  return (
    <div className={`relative ${className}`}>
      <Suspense fallback={<MapLoader />}>
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '100%' }}
          center={center}
          zoom={zoom}
          options={MAP_OPTIONS}
          onLoad={onMapLoad}
          onUnmount={onMapUnmount}
        >
          {/* Marcadores memoizados */}
          {memoizedMarkers}

          {/* Marcador de usuario */}
          {userLocation && (
            <Marker
              position={userLocation}
              icon={markerIcons.user}
            />
          )}

          {/* InfoWindow optimizado */}
          {selectedMarker && (
            <InfoWindow
              position={selectedMarker.position}
              onCloseClick={() => setSelectedMarker(null)}
            >
              <OptimizedInfoWindow marker={selectedMarker} />
            </InfoWindow>
          )}

          {/* Children */}
          {children}
        </GoogleMap>
      </Suspense>

      {/* Indicador de rendimiento */}
      <div className="absolute bottom-4 right-4 z-10 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg">
        <div className="text-xs text-gray-600">
          📍 {markers.length} marcadores
        </div>
      </div>
    </div>
  )
})

// ============================================
// COMPONENTES AUXILIARES MEMOIZADOS
// ============================================

const MemoizedMarker = memo(function MemoizedMarker({
  marker,
  icon,
  onClick
}: {
  marker: OptimizedMarker
  icon: google.maps.Icon
  onClick: (marker: OptimizedMarker) => void
}) {
  const handleClick = useCallback(() => {
    onClick(marker)
  }, [marker, onClick])

  return (
    <Marker
      position={marker.position}
      icon={icon}
      onClick={handleClick}
    />
  )
})

const OptimizedInfoWindow = memo(function OptimizedInfoWindow({
  marker
}: {
  marker: OptimizedMarker
}) {
  return (
    <div className="p-3 max-w-xs">
      <h3 className="font-semibold text-gray-800 mb-1">
        {marker.label || marker.id}
      </h3>
      <p className="text-sm text-gray-600 capitalize mb-2">
        Tipo: {marker.type}
      </p>
      <p className="text-xs text-gray-500">
        {marker.position.lat.toFixed(6)}, {marker.position.lng.toFixed(6)}
      </p>
    </div>
  )
})

export default GoogleMapOptimized

// ============================================
// HOOK PERSONALIZADO PARA CLUSTERING
// ============================================

export function useMarkerClustering(
  markers: OptimizedMarker[], 
  threshold: number = 100
) {
  return useMemo(() => {
    if (markers.length <= threshold) {
      return { shouldCluster: false, markers }
    }

    // Lógica simple de clustering por proximidad
    const clustered: OptimizedMarker[] = []
    const processed = new Set<string>()

    markers.forEach(marker => {
      if (processed.has(marker.id)) return

      const nearby = markers.filter(other => 
        !processed.has(other.id) &&
        getDistance(marker.position, other.position) < 0.001 // ~100m
      )

      if (nearby.length > 1) {
        // Crear cluster
        const center = getCenterPoint(nearby.map(m => m.position))
        clustered.push({
          id: `cluster-${marker.id}`,
          position: center,
          type: 'restaurant',
          label: `${nearby.length} lugares`,
          data: { count: nearby.length, markers: nearby }
        })
        nearby.forEach(m => processed.add(m.id))
      } else {
        clustered.push(marker)
        processed.add(marker.id)
      }
    })

    return { shouldCluster: true, markers: clustered }
  }, [markers, threshold])
}

// Funciones helper para clustering
function getDistance(pos1: Coordinate, pos2: Coordinate): number {
  const R = 6371e3 // Radio de la Tierra en metros
  const φ1 = pos1.lat * Math.PI/180
  const φ2 = pos2.lat * Math.PI/180
  const Δφ = (pos2.lat-pos1.lat) * Math.PI/180
  const Δλ = (pos2.lng-pos1.lng) * Math.PI/180

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))

  return R * c
}

function getCenterPoint(positions: Coordinate[]): Coordinate {
  const lat = positions.reduce((sum, pos) => sum + pos.lat, 0) / positions.length
  const lng = positions.reduce((sum, pos) => sum + pos.lng, 0) / positions.length
  return { lat, lng }
}
