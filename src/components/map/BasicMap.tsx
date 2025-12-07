/**
 * ============================================
 * ZAVO - BasicMap Component
 * ============================================
 * 
 * Mapa básico y estable sin re-inicialización
 */

import { useEffect, useRef, useState } from 'react'
import { Coordinate } from '../../types/firebase'

// ============================================
// TIPOS
// ============================================

export interface MapMarker {
  id: string
  type: 'restaurant' | 'courier' | 'user' | 'delivery'
  position: Coordinate
  label?: string
  data?: any
}

export interface MapRoute {
  id: string
  points: Coordinate[]
  color?: string
  width?: number
}

interface BasicMapProps {
  center?: Coordinate
  zoom?: number
  markers?: MapMarker[]
  routes?: MapRoute[]
  onMarkerClick?: (marker: MapMarker) => void
  userLocation?: Coordinate | null
  courierLocation?: Coordinate | null
  followCourier?: boolean
  className?: string
  children?: React.ReactNode
}

// ============================================
// COMPONENTE
// ============================================

export default function BasicMap({
  center = { lat: 4.6761, lng: -74.0486 },
  zoom = 14,
  markers = [],
  onMarkerClick,
  userLocation,
  className = '',
  children,
}: BasicMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const [isMapReady, setIsMapReady] = useState(false)
  const [mapError, setMapError] = useState<string | null>(null)
  const initializingRef = useRef(false)

  // ============================================
  // INICIALIZAR MAPA UNA SOLA VEZ
  // ============================================

  useEffect(() => {
    if (initializingRef.current || mapInstanceRef.current || !mapContainerRef.current) {
      return
    }

    initializingRef.current = true

    const initMap = async () => {
      try {
        const L = await import('leaflet')
        await import('leaflet/dist/leaflet.css')

        const container = mapContainerRef.current!
        
        // Generar ID único para evitar conflictos
        const mapId = `map-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        container.id = mapId

        // Crear mapa
        const map = L.map(container, {
          center: [center.lat, center.lng],
          zoom,
          zoomControl: false,
        })

        // Agregar tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
        }).addTo(map)

        // Control de zoom
        L.control.zoom({ position: 'bottomright' }).addTo(map)

        mapInstanceRef.current = map
        setIsMapReady(true)
        setMapError(null)
        
      } catch (error) {
        console.error('Error inicializando mapa:', error)
        setMapError('Error al cargar el mapa')
      } finally {
        initializingRef.current = false
      }
    }

    initMap()

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        try {
          // Limpiar marcadores
          markersRef.current.forEach(marker => {
            if (mapInstanceRef.current && marker) {
              mapInstanceRef.current.removeLayer(marker)
            }
          })
          markersRef.current = []
          
          // Remover mapa
          mapInstanceRef.current.remove()
          mapInstanceRef.current = null
          
        } catch (e) {
          console.warn('Error limpiando mapa:', e)
        }
      }
      setIsMapReady(false)
      initializingRef.current = false
    }
  }, []) // Solo se ejecuta una vez

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
          if (mapInstanceRef.current && marker) {
            mapInstanceRef.current.removeLayer(marker)
          }
        })
        markersRef.current = []

        // Agregar nuevos marcadores
        markers.forEach(markerData => {
          if (!mapInstanceRef.current) return

          const icon = createMarkerIcon(L, markerData.type)
          
          const marker = L.marker([markerData.position.lat, markerData.position.lng], { icon })
            .addTo(mapInstanceRef.current)

          if (markerData.label) {
            marker.bindPopup(markerData.label)
          }

          marker.on('click', () => {
            onMarkerClick?.(markerData)
          })

          markersRef.current.push(marker)
        })

        // Agregar marcador de usuario
        if (userLocation && mapInstanceRef.current) {
          const userIcon = L.divIcon({
            className: 'user-location-marker',
            html: '<div style="width: 16px; height: 16px; background: #3B82F6; border: 2px solid white; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.2);"></div>',
            iconSize: [16, 16],
            iconAnchor: [8, 8],
          })

          const userMarker = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
            .addTo(mapInstanceRef.current)

          markersRef.current.push(userMarker)
        }

      } catch (error) {
        console.error('Error actualizando marcadores:', error)
      }
    }

    updateMarkers()
  }, [isMapReady, markers, userLocation, onMarkerClick])

  // ============================================
  // HELPER FUNCTIONS
  // ============================================

  const createMarkerIcon = (L: any, type: string) => {
    const iconConfig = {
      restaurant: { color: '#16A34A', emoji: '🏪' },
      courier: { color: '#F97316', emoji: '🚗' },
      delivery: { color: '#3B82F6', emoji: '📍' },
      user: { color: '#8B5CF6', emoji: '👤' },
    }

    const config = iconConfig[type as keyof typeof iconConfig] || iconConfig.restaurant

    return L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="
          display: flex; 
          align-items: center; 
          justify-center: center;
          width: 32px; 
          height: 32px; 
          background-color: ${config.color}; 
          border: 2px solid white; 
          border-radius: 50%; 
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          font-size: 14px;
        ">
          ${config.emoji}
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    })
  }

  // ============================================
  // RENDER
  // ============================================

  if (mapError) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 ${className}`}>
        <div className="text-center p-8">
          <div className="text-red-500 text-lg mb-2">⚠️</div>
          <p className="text-gray-600">{mapError}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-lg text-sm"
          >
            Recargar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      <div ref={mapContainerRef} className="w-full h-full" />
      
      {!isMapReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-2"></div>
            <p className="text-gray-600">Cargando mapa...</p>
          </div>
        </div>
      )}

      {children}
    </div>
  )
}
