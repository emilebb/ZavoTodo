/**
 * ============================================
 * ZAVO - SimpleMap Component
 * ============================================
 * 
 * Mapa simple y funcional con Leaflet
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

interface SimpleMapProps {
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

export default function SimpleMap({
  center = { lat: 4.6761, lng: -74.0486 },
  zoom = 14,
  markers = [],
  routes = [],
  onMarkerClick,
  userLocation,
  courierLocation,
  followCourier = false,
  className = '',
  children,
}: SimpleMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)
  const markersRef = useRef<Map<string, any>>(new Map())
  const [isMapReady, setIsMapReady] = useState(false)
  const [mapError, setMapError] = useState<string | null>(null)

  // ============================================
  // INICIALIZAR MAPA
  // ============================================

  useEffect(() => {
    let mounted = true

    const initMap = async () => {
      if (!mapContainerRef.current || mapRef.current) return

      try {
        const L = await import('leaflet')
        await import('leaflet/dist/leaflet.css')

        // Limpiar contenedor completamente
        const container = mapContainerRef.current
        container.innerHTML = ''
        
        // Remover cualquier referencia de Leaflet anterior
        if ((container as any)._leaflet_id) {
          delete (container as any)._leaflet_id
        }

        // Crear mapa con ID único
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

        // Click en mapa
        map.on('click', (e: any) => {
          console.log('Map clicked:', e.latlng)
        })

        if (mounted) {
          mapRef.current = map
          setIsMapReady(true)
          setMapError(null)
        }
      } catch (error) {
        console.error('Error inicializando mapa:', error)
        if (mounted) {
          setMapError('Error al cargar el mapa')
        }
      }
    }

    initMap()

    return () => {
      mounted = false
      if (mapRef.current) {
        try {
          // Limpiar marcadores primero
          markersRef.current.forEach(marker => {
            mapRef.current.removeLayer(marker)
          })
          markersRef.current.clear()
          
          // Remover el mapa
          mapRef.current.remove()
          
          // Limpiar contenedor
          if (mapContainerRef.current) {
            mapContainerRef.current.innerHTML = ''
            if ((mapContainerRef.current as any)._leaflet_id) {
              delete (mapContainerRef.current as any)._leaflet_id
            }
          }
        } catch (e) {
          console.warn('Error limpiando mapa:', e)
        }
        mapRef.current = null
      }
      setIsMapReady(false)
    }
  }, [])

  // ============================================
  // ACTUALIZAR MARCADORES
  // ============================================

  useEffect(() => {
    if (!isMapReady || !mapRef.current) return

    const updateMarkers = async () => {
      try {
        const L = await import('leaflet')

        // Limpiar marcadores existentes
        markersRef.current.forEach(marker => {
          mapRef.current.removeLayer(marker)
        })
        markersRef.current.clear()

        // Agregar nuevos marcadores
        markers.forEach(markerData => {
          const icon = getMarkerIcon(L, markerData.type)
          
          const marker = L.marker([markerData.position.lat, markerData.position.lng], { icon })
            .addTo(mapRef.current)

          if (markerData.label) {
            marker.bindPopup(markerData.label)
          }

          marker.on('click', () => {
            onMarkerClick?.(markerData)
          })

          markersRef.current.set(markerData.id, marker)
        })

        // Agregar marcador de usuario si existe
        if (userLocation) {
          const userIcon = L.divIcon({
            className: 'user-location-marker',
            html: '<div class="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>',
            iconSize: [16, 16],
            iconAnchor: [8, 8],
          })

          const userMarker = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
            .addTo(mapRef.current)

          markersRef.current.set('user-location', userMarker)
        }

      } catch (error) {
        console.error('Error actualizando marcadores:', error)
      }
    }

    updateMarkers()
  }, [isMapReady, markers, userLocation, onMarkerClick])

  // ============================================
  // SEGUIR COURIER
  // ============================================

  useEffect(() => {
    if (!isMapReady || !mapRef.current || !followCourier || !courierLocation) return

    try {
      mapRef.current.setView([courierLocation.lat, courierLocation.lng], zoom, {
        animate: true,
        duration: 1,
      })
    } catch (error) {
      console.error('Error siguiendo courier:', error)
    }
  }, [isMapReady, courierLocation, followCourier, zoom])

  // ============================================
  // HELPER FUNCTIONS
  // ============================================

  const getMarkerIcon = (L: any, type: string) => {
    const iconConfig = {
      restaurant: { color: '#16A34A', icon: '🏪' },
      courier: { color: '#F97316', icon: '🚗' },
      delivery: { color: '#3B82F6', icon: '📍' },
      user: { color: '#8B5CF6', icon: '👤' },
    }

    const config = iconConfig[type as keyof typeof iconConfig] || iconConfig.restaurant

    return L.divIcon({
      className: 'custom-marker',
      html: `
        <div class="flex items-center justify-center w-8 h-8 rounded-full border-2 border-white shadow-lg" 
             style="background-color: ${config.color}">
          <span class="text-white text-xs">${config.icon}</span>
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
