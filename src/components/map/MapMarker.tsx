/**
 * ZAVO MapMarker Component
 * Componente de marker para el mapa
 */

import { memo } from 'react'
import { MapMarker, MarkerType } from '../../types/location'
import { MAP_COLORS, VEHICLE_ICONS } from '../../config/realtime'
import { Store, Navigation, User, MapPin } from 'lucide-react'

interface MapMarkerProps {
  marker: MapMarker
  position: { x: number; y: number }
  onClick?: () => void
}

/**
 * Obtiene el icono según el tipo de marker
 */
function getMarkerIcon(type: MarkerType, data?: MapMarker['data']) {
  switch (type) {
    case 'restaurant':
      return <Store className="w-5 h-5 text-white" />
    case 'courier':
      // Mostrar emoji de vehículo si está disponible
      const courier = data as { vehicleType?: string } | undefined
      if (courier?.vehicleType) {
        return <span className="text-lg">{VEHICLE_ICONS[courier.vehicleType] || '🛵'}</span>
      }
      return <Navigation className="w-5 h-5 text-white" />
    case 'user':
      return <User className="w-5 h-5 text-white" />
    case 'delivery':
      return <MapPin className="w-5 h-5 text-white" />
    default:
      return <MapPin className="w-5 h-5 text-white" />
  }
}

/**
 * Obtiene el color de fondo según el tipo de marker
 */
function getMarkerColor(type: MarkerType): string {
  switch (type) {
    case 'restaurant':
      return MAP_COLORS.restaurant
    case 'courier':
      return MAP_COLORS.courier
    case 'user':
      return MAP_COLORS.user
    case 'delivery':
      return MAP_COLORS.delivery
    default:
      return MAP_COLORS.restaurant
  }
}

/**
 * MapMarker - Componente de marker individual
 */
const MapMarkerComponent = memo(function MapMarkerComponent({
  marker,
  position,
  onClick,
}: MapMarkerProps) {
  const bgColor = getMarkerColor(marker.type)
  const icon = getMarkerIcon(marker.type, marker.data)
  
  // Animación especial para courier en movimiento
  const isCourier = marker.type === 'courier'
  const isMoving = isCourier && marker.status === 'delivering'
  
  return (
    <div
      className={`
        absolute transform -translate-x-1/2 -translate-y-full
        cursor-pointer transition-all duration-300 ease-out
        hover:scale-110 hover:z-50
        ${isMoving ? 'animate-bounce' : ''}
      `}
      style={{ 
        left: position.x, 
        top: position.y,
        zIndex: isCourier ? 40 : 30,
      }}
      onClick={(e) => {
        e.stopPropagation()
        onClick?.()
      }}
      role="button"
      aria-label={marker.label || `Marker: ${marker.type}`}
    >
      {/* Pin shape */}
      <div className="relative">
        {/* Sombra */}
        <div 
          className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-4 h-2 bg-black/20 rounded-full blur-sm"
        />
        
        {/* Marker body */}
        <div
          className="relative flex items-center justify-center w-10 h-10 rounded-full shadow-lg border-2 border-white"
          style={{ backgroundColor: bgColor }}
        >
          {icon}
          
          {/* Pulse animation for courier */}
          {isMoving && (
            <div 
              className="absolute inset-0 rounded-full animate-ping opacity-30"
              style={{ backgroundColor: bgColor }}
            />
          )}
        </div>
        
        {/* Pin pointer */}
        <div
          className="absolute left-1/2 transform -translate-x-1/2 w-0 h-0"
          style={{
            borderLeft: '6px solid transparent',
            borderRight: '6px solid transparent',
            borderTop: `8px solid ${bgColor}`,
            bottom: '-6px',
          }}
        />
      </div>
      
      {/* Label (si existe) */}
      {marker.label && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 whitespace-nowrap">
          <span className="px-2 py-0.5 bg-white rounded-md shadow-sm text-xs font-medium text-content">
            {marker.label}
          </span>
        </div>
      )}
      
      {/* Status badge (para courier) */}
      {isCourier && marker.status && (
        <div className="absolute -top-1 -right-1">
          <div className={`
            w-3 h-3 rounded-full border border-white
            ${marker.status === 'delivering' ? 'bg-green-500' : 'bg-amber-500'}
          `} />
        </div>
      )}
    </div>
  )
})

export default MapMarkerComponent
