/**
 * ============================================
 * ZAVO - LiveMap Component (Limpio)
 * ============================================
 * 
 * Componente de mapa en vivo sin errores
 */

import { useEffect, useRef, useState, memo } from 'react'
import { Coordinate } from '../../types/firebase'

// ============================================
// CONFIGURACIÓN
// ============================================

const MAP_PROVIDER = import.meta.env.VITE_MAP_PROVIDER || 'leaflet'
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || ''

// ============================================
// TIPOS
// ============================================

export type MarkerType = 'restaurant' | 'courier' | 'user' | 'delivery' | 'product'

export interface MapMarker {
  id: string
  type: MarkerType
  position: Coordinate
  label?: string
  icon?: string
  data?: Record<string, unknown>
}

export interface MapRoute {
  id: string
  points: Coordinate[]
  color?: string
  width?: number
  dashed?: boolean
}

export interface LiveMapProps {
  center?: Coordinate
  zoom?: number
  markers?: MapMarker[]
  routes?: MapRoute[]
  userLocation?: Coordinate | null
  courierLocation?: Coordinate | null
  onMarkerClick?: (marker: MapMarker) => void
  onMapClick?: (coordinate: Coordinate) => void
  followCourier?: boolean
  theme?: 'light' | 'dark' | 'streets' | 'satellite'
  className?: string
  children?: React.ReactNode
}

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

const LiveMapClean = memo(function LiveMapClean({
  center = { lat: 4.6761, lng: -74.0486 },
  zoom = 14,
  markers = [],
  routes = [],
  userLocation,
  courierLocation,
  onMarkerClick,
  onMapClick,
  followCourier = false,
  className = '',
  children,
}: LiveMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)
  const [isMapReady, setIsMapReady] = useState(false)
  const [mapError, setMapError] = useState<string | null>(null)

  // ============================================
  // INICIALIZAR MAPA
  // ============================================

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current || isMapReady) return

    const initMap = async () => {
      try {
        const container = mapContainerRef.current!
        const leafletContainer = container as any
        
        // Limpiar contenedor si ya tiene un mapa
        if (leafletContainer._leaflet_id || container.hasChildNodes()) {
          console.warn('Contenedor de mapa ya inicializado, limpiando...')
          if (leafletContainer._leaflet_id) {
            delete leafletContainer._leaflet_id
          }
          container.innerHTML = ''
        }

        if (MAP_PROVIDER === 'mapbox' && MAPBOX_TOKEN) {
          await initMapbox()
        } else {
          await initLeaflet()
        }
        setIsMapReady(true)
      } catch (error) {
        console.error('Error inicializando mapa:', error)
        setMapError('Error al cargar el mapa')
      }
    }

    initMap()

    return () => {
      if (mapRef.current) {
        try {
          mapRef.current.remove?.()
        } catch (e) {
          console.warn('Error limpiando mapa:', e)
        }
        mapRef.current = null
      }
      setIsMapReady(false)
    }
  }, [])

  // Inicializar Mapbox
  const initMapbox = async () => {
    const mapboxgl = await import('mapbox-gl')
    await import('mapbox-gl/dist/mapbox-gl.css')
    
    mapboxgl.default.accessToken = MAPBOX_TOKEN

    const map = new mapboxgl.default.Map({
      container: mapContainerRef.current!,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [center.lng, center.lat],
      zoom,
    })

    map.addControl(new mapboxgl.default.NavigationControl(), 'bottom-right')

    map.on('click', (e: any) => {
      onMapClick?.({ lat: e.lngLat.lat, lng: e.lngLat.lng })
    })

    mapRef.current = map
  }

  // Inicializar Leaflet (fallback gratuito)
  const initLeaflet = async () => {
    const L = await import('leaflet')
    await import('leaflet/dist/leaflet.css')

    const map = L.map(mapContainerRef.current!, {
      center: [center.lat, center.lng],
      zoom,
      zoomControl: false,
    })

    // Usar tiles de OpenStreetMap (gratuito)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map)

    // Agregar control de zoom
    L.control.zoom({ position: 'bottomright' }).addTo(map)

    map.on('click', (e: any) => {
      onMapClick?.({ lat: e.latlng.lat, lng: e.latlng.lng })
    })

    mapRef.current = map
  }

  // ============================================
  // RENDER
  // ============================================

  if (mapError) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 ${className}`}>
        <div className="text-center p-4">
          <p className="text-red-500 mb-2">❌ {mapError}</p>
          <p className="text-sm text-gray-500">
            Verifica tu conexión o la configuración del mapa
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      {/* Contenedor del mapa */}
      <div 
        ref={mapContainerRef} 
        className="w-full h-full"
        style={{ minHeight: '400px' }}
      />

      {/* Loading overlay */}
      {!isMapReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-sm text-gray-500">Cargando mapa...</p>
          </div>
        </div>
      )}

      {/* Provider badge */}
      <div className="absolute top-2 left-2 z-10">
        <span className="px-2 py-1 bg-white/90 backdrop-blur-sm rounded text-xs font-medium text-gray-600 shadow-sm">
          {MAP_PROVIDER === 'mapbox' ? '🗺️ Mapbox' : '🍃 Leaflet'}
        </span>
      </div>

      {/* Children (controles adicionales) */}
      {children}
    </div>
  )
})

export default LiveMapClean
