/**
 * ZAVO MapView Component
 * Componente abstracto de mapa que permite cambiar de proveedor
 * 
 * Actualmente usa una implementación simulada.
 * TODO: Integrar con Mapbox GL JS o Google Maps JS API
 */

import { useEffect, useRef, useState, memo, useCallback } from 'react'
import { 
  Coordinate, 
  MapMarker, 
  MapPolyline,
  DEFAULT_MAP_CONFIG 
} from '../../types/location'
import { MAP_COLORS } from '../../config/realtime'
import MapMarkerComponent from './MapMarker'

interface MapViewProps {
  center?: Coordinate
  zoom?: number
  markers?: MapMarker[]
  polylines?: MapPolyline[]
  onMarkerClick?: (id: string) => void
  onMapClick?: (coordinate: Coordinate) => void
  showUserLocation?: boolean
  userLocation?: Coordinate | null
  className?: string
  children?: React.ReactNode
}

/**
 * MapView - Componente de mapa abstracto
 * 
 * @example
 * <MapView
 *   center={{ lat: 4.6761, lng: -74.0486 }}
 *   zoom={14}
 *   markers={markers}
 *   polylines={[{ id: 'route', points: routePoints, type: 'route' }]}
 *   onMarkerClick={(id) => console.log('Clicked:', id)}
 * />
 */
const MapView = memo(function MapView({
  center = DEFAULT_MAP_CONFIG.defaultCenter,
  zoom = DEFAULT_MAP_CONFIG.defaultZoom,
  markers = [],
  polylines = [],
  onMarkerClick,
  onMapClick,
  showUserLocation = false,
  userLocation,
  className = '',
  children,
}: MapViewProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const [mapSize, setMapSize] = useState({ width: 0, height: 0 })
  
  // Calcular tamaño del mapa
  useEffect(() => {
    if (!mapContainerRef.current) return
    
    const updateSize = () => {
      if (mapContainerRef.current) {
        setMapSize({
          width: mapContainerRef.current.offsetWidth,
          height: mapContainerRef.current.offsetHeight,
        })
      }
    }
    
    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  /**
   * Convierte coordenadas geográficas a posición en píxeles
   * Simplificación para demo - en producción usar proyección real
   */
  const coordToPixel = useCallback((coord: Coordinate): { x: number; y: number } => {
    const scale = Math.pow(2, zoom) * 0.5
    const x = (coord.lng - center.lng) * scale * 100 + mapSize.width / 2
    const y = (center.lat - coord.lat) * scale * 100 + mapSize.height / 2
    return { x, y }
  }, [center, zoom, mapSize])

  /**
   * Convierte posición en píxeles a coordenadas
   */
  const pixelToCoord = useCallback((x: number, y: number): Coordinate => {
    const scale = Math.pow(2, zoom) * 0.5
    return {
      lng: (x - mapSize.width / 2) / (scale * 100) + center.lng,
      lat: center.lat - (y - mapSize.height / 2) / (scale * 100),
    }
  }, [center, zoom, mapSize])

  /**
   * Maneja click en el mapa
   */
  const handleMapClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!onMapClick) return
    
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const coord = pixelToCoord(x, y)
    onMapClick(coord)
  }, [onMapClick, pixelToCoord])

  /**
   * Renderiza polylines (rutas)
   */
  const renderPolylines = () => {
    return polylines.map(polyline => {
      if (polyline.points.length < 2) return null
      
      const pathPoints = polyline.points.map(coord => {
        const pixel = coordToPixel(coord)
        return `${pixel.x},${pixel.y}`
      }).join(' ')
      
      const color = polyline.color || (
        polyline.type === 'route' ? MAP_COLORS.routeActive : MAP_COLORS.routeCompleted
      )
      
      return (
        <svg
          key={polyline.id}
          className="absolute inset-0 pointer-events-none"
          style={{ width: '100%', height: '100%' }}
        >
          <polyline
            points={pathPoints}
            fill="none"
            stroke={color}
            strokeWidth={polyline.width || 4}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={polyline.dashed ? '8,8' : undefined}
            className="drop-shadow-md"
          />
        </svg>
      )
    })
  }

  /**
   * Renderiza markers
   */
  const renderMarkers = () => {
    return markers.map(marker => {
      const pixel = coordToPixel(marker.position)
      
      // Verificar si está dentro del viewport
      if (pixel.x < -50 || pixel.x > mapSize.width + 50 ||
          pixel.y < -50 || pixel.y > mapSize.height + 50) {
        return null
      }
      
      return (
        <MapMarkerComponent
          key={marker.id}
          marker={marker}
          position={pixel}
          onClick={() => onMarkerClick?.(marker.id)}
        />
      )
    })
  }

  /**
   * Renderiza ubicación del usuario
   */
  const renderUserLocation = () => {
    if (!showUserLocation || !userLocation) return null
    
    const pixel = coordToPixel(userLocation)
    
    return (
      <div
        className="absolute transform -translate-x-1/2 -translate-y-1/2 z-30"
        style={{ left: pixel.x, top: pixel.y }}
      >
        {/* Círculo de precisión */}
        <div className="absolute inset-0 w-16 h-16 -ml-6 -mt-6 bg-blue-500/20 rounded-full animate-ping" />
        {/* Punto central */}
        <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg" />
      </div>
    )
  }

  return (
    <div
      ref={mapContainerRef}
      className={`relative overflow-hidden bg-gradient-to-br from-green-50 to-teal-50 ${className}`}
      onClick={handleMapClick}
    >
      {/* Fondo del mapa simulado */}
      <div className="absolute inset-0">
        {/* Grid de calles simulado */}
        <svg className="w-full h-full opacity-20">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#16A34A" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
        
        {/* Indicador de que es un mapa demo */}
        <div className="absolute top-4 left-4 z-50">
          <div className="px-3 py-1.5 bg-amber-100 border border-amber-300 rounded-lg text-xs font-medium text-amber-800">
            🗺️ Mapa Demo - Integrar Google Maps / Mapbox
          </div>
        </div>
      </div>
      
      {/* Polylines (rutas) */}
      {renderPolylines()}
      
      {/* Markers */}
      {renderMarkers()}
      
      {/* Ubicación del usuario */}
      {renderUserLocation()}
      
      {/* Children (controles adicionales) */}
      {children}
      
      {/* Controles de zoom */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-40">
        <button
          className="w-10 h-10 bg-white rounded-xl shadow-card flex items-center justify-center text-lg font-bold text-content hover:bg-gray-50 transition-colors"
          onClick={(e) => {
            e.stopPropagation()
            // TODO: Implementar zoom in
          }}
          aria-label="Acercar"
        >
          +
        </button>
        <button
          className="w-10 h-10 bg-white rounded-xl shadow-card flex items-center justify-center text-lg font-bold text-content hover:bg-gray-50 transition-colors"
          onClick={(e) => {
            e.stopPropagation()
            // TODO: Implementar zoom out
          }}
          aria-label="Alejar"
        >
          −
        </button>
      </div>
    </div>
  )
})

export default MapView
