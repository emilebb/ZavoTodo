/**
 * ============================================
 * ZAVO - Mapa Temporal (Mientras se configura API Key)
 * ============================================
 */

import React from 'react'
import { Coordinate } from '../../types/firebase'

export interface MapMarker {
  id: string
  type: 'restaurant' | 'courier' | 'user' | 'delivery'
  position: Coordinate
  label?: string
  data?: any
}

export interface MapRoute {
  id: string
  origin: Coordinate
  destination: Coordinate
  waypoints?: Coordinate[]
  color?: string
  strokeWeight?: number
}

interface TempMapProps {
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

export default function TempMap({
  center = { lat: 4.6761, lng: -74.0486 },
  markers = [],
  routes = [],
  onMarkerClick,
  userLocation,
  className = '',
  children,
}: TempMapProps) {

  const getMarkerColor = (type: string) => {
    const colors = {
      restaurant: '#16A34A',
      courier: '#F97316', 
      delivery: '#3B82F6',
      user: '#8B5CF6'
    }
    return colors[type as keyof typeof colors] || colors.restaurant
  }

  const getMarkerSymbol = (type: string) => {
    const symbols = {
      restaurant: 'R',
      courier: 'C',
      delivery: 'D', 
      user: 'U'
    }
    return symbols[type as keyof typeof symbols] || symbols.restaurant
  }

  return (
    <div className={`relative bg-gray-100 ${className}`}>
      {/* Mapa simulado */}
      <div className="w-full h-full bg-gradient-to-br from-green-50 to-blue-50 relative overflow-hidden">
        
        {/* Grid de fondo */}
        <div className="absolute inset-0 opacity-10">
          <div className="grid grid-cols-8 grid-rows-8 h-full">
            {Array.from({ length: 64 }).map((_, i) => (
              <div key={i} className="border border-gray-300"></div>
            ))}
          </div>
        </div>

        {/* Centro del mapa */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          <div className="text-xs text-gray-600 mt-1 whitespace-nowrap">
            Centro: {center.lat.toFixed(4)}, {center.lng.toFixed(4)}
          </div>
        </div>

        {/* Marcadores simulados */}
        {markers.map((marker, index) => (
          <div
            key={marker.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
            style={{
              left: `${30 + (index * 15) % 60}%`,
              top: `${25 + (index * 10) % 50}%`,
            }}
            onClick={() => onMarkerClick?.(marker)}
          >
            <div
              className="w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white font-bold text-sm"
              style={{ backgroundColor: getMarkerColor(marker.type) }}
            >
              {getMarkerSymbol(marker.type)}
            </div>
            {marker.label && (
              <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow text-xs whitespace-nowrap">
                {marker.label}
              </div>
            )}
          </div>
        ))}

        {/* Usuario */}
        {userLocation && (
          <div className="absolute top-1/3 left-1/3 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>
            <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow text-xs">
              Tu ubicación
            </div>
          </div>
        )}

        {/* Rutas simuladas */}
        {routes.map((route, index) => (
          <div key={route.id} className="absolute inset-0">
            <svg className="w-full h-full">
              <path
                d={`M ${20 + index * 10}% 30% Q 50% 20% ${80 - index * 10}% 70%`}
                stroke={route.color || '#16A34A'}
                strokeWidth={route.strokeWeight || 3}
                fill="none"
                strokeDasharray="5,5"
                className="animate-pulse"
              />
            </svg>
          </div>
        ))}

        {/* Mensaje de configuración */}
        <div className="absolute top-4 left-4 bg-yellow-100 border border-yellow-400 rounded-lg p-4 max-w-sm">
          <div className="flex items-start">
            <div className="text-yellow-600 text-xl mr-2">⚠️</div>
            <div>
              <h3 className="font-semibold text-yellow-800 mb-1">Configuración Requerida</h3>
              <p className="text-yellow-700 text-sm mb-2">
                Para usar Google Maps, configura tu API key para localhost en Google Cloud Console.
              </p>
              <div className="text-xs text-yellow-600">
                <strong>Agregar a HTTP referrers:</strong><br/>
                • http://localhost:*<br/>
                • https://localhost:*
              </div>
            </div>
          </div>
        </div>

        {/* Información del mapa */}
        <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
          <div className="text-sm space-y-1">
            <div><strong>Marcadores:</strong> {markers.length}</div>
            <div><strong>Rutas:</strong> {routes.length}</div>
            <div><strong>Estado:</strong> <span className="text-yellow-600">Simulado</span></div>
          </div>
        </div>

        {children}
      </div>
    </div>
  )
}
