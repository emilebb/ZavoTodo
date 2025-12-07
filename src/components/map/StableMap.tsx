/**
 * ============================================
 * ZAVO - StableMap Component
 * ============================================
 * 
 * Mapa estable que evita re-inicialización
 */

import { useEffect, useRef, useState, useCallback } from 'react'
import { Coordinate } from '../../types/firebase'

export interface MapMarker {
  id: string
  type: 'restaurant' | 'courier' | 'user' | 'delivery'
  position: Coordinate
  label?: string
  data?: any
}

interface StableMapProps {
  center?: Coordinate
  zoom?: number
  markers?: MapMarker[]
  onMarkerClick?: (marker: MapMarker) => void
  userLocation?: Coordinate | null
  className?: string
  children?: React.ReactNode
}

export default function StableMap({
  center = { lat: 4.6761, lng: -74.0486 },
  zoom = 14,
  markers = [],
  onMarkerClick,
  userLocation,
  className = '',
  children,
}: StableMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersRef = useRef<Map<string, any>>(new Map())
  const [isMapReady, setIsMapReady] = useState(false)
  const [mapError, setMapError] = useState<string | null>(null)
  const isInitializedRef = useRef(false)

  // ============================================
  // INICIALIZACIÓN ÚNICA Y SEGURA
  // ============================================

  const initializeMap = useCallback(async () => {
    // Prevenir múltiples inicializaciones
    if (isInitializedRef.current || !mapContainerRef.current || mapInstanceRef.current) {
      return
    }

    isInitializedRef.current = true

    try {
      const L = await import('leaflet')
      await import('leaflet/dist/leaflet.css')

      const container = mapContainerRef.current

      // Limpiar completamente el contenedor
      container.innerHTML = ''
      container.className = 'w-full h-full'
      
      // Remover cualquier referencia previa de Leaflet
      delete (container as any)._leaflet_id

      // Crear mapa con configuración robusta
      const map = L.map(container, {
        center: [center.lat, center.lng],
        zoom,
        zoomControl: false,
        attributionControl: true,
      })

      // Agregar tiles con manejo de errores
      const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
        errorTileUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE4IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+'
      })

      tileLayer.addTo(map)

      // Controles
      L.control.zoom({ position: 'bottomright' }).addTo(map)

      // Eventos
      map.on('load', () => {
        console.log('Mapa cargado correctamente')
      })

      map.on('error', (e) => {
        console.warn('Error en mapa:', e)
      })

      mapInstanceRef.current = map
      setIsMapReady(true)
      setMapError(null)

    } catch (error) {
      console.error('Error inicializando mapa:', error)
      setMapError('Error al cargar el mapa')
      isInitializedRef.current = false
    }
  }, [center.lat, center.lng, zoom])

  // ============================================
  // EFECTO DE INICIALIZACIÓN
  // ============================================

  useEffect(() => {
    initializeMap()

    return () => {
      // Cleanup completo
      if (mapInstanceRef.current) {
        try {
          // Limpiar marcadores
          markersRef.current.forEach(marker => {
            mapInstanceRef.current?.removeLayer(marker)
          })
          markersRef.current.clear()

          // Remover mapa
          mapInstanceRef.current.remove()
          mapInstanceRef.current = null

          // Limpiar contenedor
          if (mapContainerRef.current) {
            mapContainerRef.current.innerHTML = ''
            delete (mapContainerRef.current as any)._leaflet_id
          }
        } catch (e) {
          console.warn('Error en cleanup:', e)
        }
      }
      
      isInitializedRef.current = false
      setIsMapReady(false)
    }
  }, [initializeMap])

  // ============================================
  // ACTUALIZAR MARCADORES
  // ============================================

  useEffect(() => {
    if (!isMapReady || !mapInstanceRef.current) return

    const updateMarkers = async () => {
      try {
        const L = await import('leaflet')

        // Limpiar marcadores existentes
        markersRef.current.forEach(marker => {
          mapInstanceRef.current?.removeLayer(marker)
        })
        markersRef.current.clear()

        // Crear marcadores
        const allMarkers = [...markers]
        
        // Agregar usuario si existe
        if (userLocation) {
          allMarkers.push({
            id: 'user-location',
            type: 'user',
            position: userLocation,
            label: 'Tu ubicación'
          })
        }

        allMarkers.forEach(markerData => {
          if (!mapInstanceRef.current) return

          const icon = createIcon(L, markerData.type)
          
          const marker = L.marker([markerData.position.lat, markerData.position.lng], { icon })
            .addTo(mapInstanceRef.current)

          if (markerData.label) {
            marker.bindPopup(markerData.label)
          }

          marker.on('click', () => {
            onMarkerClick?.(markerData)
          })

          markersRef.current.set(markerData.id, marker)
        })

      } catch (error) {
        console.error('Error actualizando marcadores:', error)
      }
    }

    updateMarkers()
  }, [isMapReady, markers, userLocation, onMarkerClick])

  // ============================================
  // HELPER: CREAR ICONOS
  // ============================================

  const createIcon = (L: any, type: string) => {
    const config = {
      restaurant: { color: '#16A34A', emoji: '🏪', size: 32 },
      courier: { color: '#F97316', emoji: '🚗', size: 32 },
      delivery: { color: '#3B82F6', emoji: '📍', size: 32 },
      user: { color: '#8B5CF6', emoji: '👤', size: 24 },
    }

    const { color, emoji, size } = config[type as keyof typeof config] || config.restaurant

    return L.divIcon({
      className: 'custom-map-marker',
      html: `
        <div style="
          display: flex;
          align-items: center;
          justify-content: center;
          width: ${size}px;
          height: ${size}px;
          background: ${color};
          border: 2px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          font-size: ${size * 0.4}px;
          cursor: pointer;
        ">
          ${emoji}
        </div>
      `,
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
    })
  }

  // ============================================
  // RENDER
  // ============================================

  if (mapError) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 ${className}`}>
        <div className="text-center p-8">
          <div className="text-red-500 text-2xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Error del Mapa</h3>
          <p className="text-gray-600 mb-4">{mapError}</p>
          <button 
            onClick={() => {
              setMapError(null)
              isInitializedRef.current = false
              initializeMap()
            }}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      <div 
        ref={mapContainerRef} 
        className="w-full h-full bg-gray-100"
        style={{ minHeight: '300px' }}
      />
      
      {!isMapReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Cargando mapa...</p>
          </div>
        </div>
      )}

      {children}
    </div>
  )
}
