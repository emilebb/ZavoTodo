/**
 * ZAVO TrackingMapPage Component
 * Página de mapa con tracking en tiempo real estilo Rappi
 * 
 * Features:
 * - Vista de mapa full con markers de negocios
 * - Tracking en tiempo real de órdenes activas
 * - Layout responsive (desktop sidebar / mobile bottom sheet)
 */

import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { 
  Coordinate,
  Restaurant 
} from '../../types/location'
import { useUserLocation } from '../../hooks/useUserLocation'
import { useLiveOrderTracking } from '../../hooks/useLiveOrderTracking'
// Usando versión limpia sin errores
import GoogleMapClean, { MapMarker, MapRoute } from './GoogleMapClean'
import OrderTrackingPanel from './OrderTrackingPanel'
import Button from '../ui/Button'
import Card from '../ui/Card'
import { 
  Navigation, 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  Star,
  Package,
  Play,
  X,
  Loader2
} from 'lucide-react'

// ============================================
// MOCK DATA - Negocios cercanos
// ============================================

const MOCK_RESTAURANTS: Restaurant[] = [
  {
    id: 'b1',
    name: 'Panadería El Buen Pan',
    location: { lat: 4.6761, lng: -74.0486 },
    address: {
      street: 'Calle 85 #15-20',
      city: 'Bogotá',
      formatted: 'Calle 85 #15-20, Bogotá',
    },
    rating: 4.8,
    totalReviews: 234,
    category: 'panaderia',
    isOpen: true,
    packCount: 3,
  },
  {
    id: 'b2',
    name: 'Café Central Premium',
    location: { lat: 4.6800, lng: -74.0520 },
    address: {
      street: 'Carrera 7 #45-12',
      city: 'Bogotá',
      formatted: 'Carrera 7 #45-12, Bogotá',
    },
    rating: 4.9,
    totalReviews: 456,
    category: 'cafe',
    isOpen: true,
    packCount: 5,
  },
  {
    id: 'b3',
    name: 'Restaurante Verde',
    location: { lat: 4.6720, lng: -74.0450 },
    address: {
      street: 'Calle 93 #11-30',
      city: 'Bogotá',
      formatted: 'Calle 93 #11-30, Bogotá',
    },
    rating: 4.7,
    totalReviews: 189,
    category: 'restaurante',
    isOpen: true,
    packCount: 2,
  },
]

// ============================================
// COMPONENTES AUXILIARES
// ============================================

/**
 * Card de restaurante seleccionado
 */
function RestaurantCard({ 
  restaurant, 
  onClose 
}: { 
  restaurant: Restaurant
  onClose: () => void 
}) {
  return (
    <Card className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-40 p-0 overflow-hidden">
      {/* Header con imagen placeholder */}
      <div className="h-24 bg-gradient-to-br from-primary-100 to-teal-100 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center"
          aria-label="Cerrar"
        >
          <X className="w-4 h-4" />
        </button>
        <div className="absolute bottom-2 left-3">
          <span className="px-2 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-xs font-medium text-primary-700">
            {restaurant.packCount} packs disponibles
          </span>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-content">{restaurant.name}</h3>
          <div className="flex items-center gap-1 text-sm">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span className="font-medium">{restaurant.rating}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-content-muted mb-4">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span>0.5 km</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>17:00 - 20:00</span>
          </div>
        </div>
        
        <Link to={`/pack/${restaurant.id}`}>
          <Button fullWidth size="sm">
            Ver Packs
          </Button>
        </Link>
      </div>
    </Card>
  )
}

/**
 * Estado vacío - Sin orden activa
 */
function EmptyTrackingState({ onStartDemo }: { onStartDemo: () => void }) {
  return (
    <div className="p-6 text-center">
      <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <Package className="w-8 h-8 text-primary-600" />
      </div>
      <h3 className="text-lg font-semibold text-content mb-2">
        Sin pedidos activos
      </h3>
      <p className="text-content-muted text-sm mb-6">
        Explora los negocios en el mapa y rescata comida deliciosa cerca de ti.
      </p>
      <Button 
        variant="outline" 
        size="sm"
        onClick={onStartDemo}
        className="gap-2"
      >
        <Play className="w-4 h-4" />
        Ver Demo de Tracking
      </Button>
    </div>
  )
}

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export default function TrackingMapPage() {
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  
  // Hooks
  const { location: userLocation, isLoading: locationLoading } = useUserLocation()
  const { 
    order, 
    courier, 
    route,
    isConnected,
    startDemoTracking,
    stopTracking 
  } = useLiveOrderTracking()

  // Detectar mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Convertir restaurantes a markers
  const restaurantMarkers: MapMarker[] = useMemo(() => {
    return MOCK_RESTAURANTS.map(restaurant => ({
      id: restaurant.id,
      type: 'restaurant' as const,
      position: restaurant.location,
      label: restaurant.name,
      data: restaurant,
    }))
  }, [])

  // Markers de tracking (orden activa)
  const trackingMarkers: MapMarker[] = useMemo(() => {
    if (!order) return []
    
    const markers: MapMarker[] = []
    
    // Marker del restaurante de la orden
    markers.push({
      id: 'order-restaurant',
      type: 'restaurant',
      position: order.restaurantLocation,
      label: order.restaurantName,
    })
    
    // Marker de destino
    markers.push({
      id: 'delivery-location',
      type: 'delivery',
      position: order.deliveryLocation,
      label: 'Tu ubicación',
    })
    
    // Marker del courier
    if (courier && order.courierLocation) {
      markers.push({
        id: 'courier',
        type: 'courier',
        position: order.courierLocation,
        label: courier.name,
        data: courier,
      })
    }
    
    return markers
  }, [order, courier])

  // Rutas para Google Maps
  const routes: MapRoute[] = useMemo(() => {
    if (!order || route.length < 2) return []
    
    return [{
      id: 'delivery-route',
      origin: order.restaurantLocation,
      destination: order.deliveryLocation,
      color: '#16A34A',
      strokeWeight: 4
    }]
  }, [order, route])

  // Todos los markers combinados
  const allMarkers = useMemo(() => {
    // Si hay orden activa, mostrar solo markers de tracking
    if (order) return trackingMarkers
    // Si no, mostrar restaurantes
    return restaurantMarkers
  }, [order, trackingMarkers, restaurantMarkers])

  // Centro del mapa
  const mapCenter: Coordinate = useMemo(() => {
    if (order?.courierLocation) return order.courierLocation
    if (userLocation) return userLocation
    return { lat: 4.6761, lng: -74.0486 } // Bogotá default
  }, [order, userLocation])

  // Handler de click en marker
  const handleMarkerClick = (marker: MapMarker) => {
    if (order) return // No seleccionar durante tracking
    
    if (marker.type === 'restaurant' && marker.data) {
      setSelectedRestaurant(marker.data as Restaurant)
    }
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col md:flex-row">
      {/* Panel lateral (Desktop) o vacío (Mobile) */}
      {!isMobile && (
        <div className="w-96 border-r border-gray-200 bg-white flex flex-col">
          {/* Header del panel */}
          <div className="p-4 border-b border-gray-100">
            <h1 className="text-xl font-bold font-display text-content mb-2">
              Mapa
            </h1>
            
            {/* Search bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-content-muted" />
              <input
                type="text"
                placeholder="Buscar negocios..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            
            {/* Filtros */}
            <div className="flex gap-2 mt-3">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg text-sm text-content-muted hover:bg-gray-200 transition-colors"
              >
                <Filter className="w-4 h-4" />
                Filtros
              </button>
              <button className="px-3 py-1.5 bg-primary-50 text-primary-700 rounded-lg text-sm font-medium">
                Cerca de mí
              </button>
            </div>
          </div>
          
          {/* Contenido del panel */}
          <div className="flex-1 overflow-y-auto">
            {order ? (
              // Mostrar tracking panel
              <OrderTrackingPanel
                order={order}
                courier={courier}
                onClose={stopTracking}
                variant="desktop"
              />
            ) : (
              // Mostrar estado vacío o lista de restaurantes
              <EmptyTrackingState onStartDemo={startDemoTracking} />
            )}
          </div>
        </div>
      )}
      
      {/* Mapa */}
      <div className="flex-1 relative">
        {locationLoading ? (
          <div className="h-full flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <Loader2 className="w-8 h-8 text-primary-500 animate-spin mx-auto mb-2" />
              <p className="text-content-muted">Obteniendo ubicación...</p>
            </div>
          </div>
        ) : (
          <GoogleMapClean
            center={mapCenter}
            zoom={14}
            markers={allMarkers}
            routes={routes}
            onMarkerClick={handleMarkerClick}
            userLocation={userLocation}
            courierLocation={order?.courierLocation}
            followCourier={!!order}
            showTraffic={true}
            className="h-full"
          >
            {/* Botón de ubicación */}
            <button
              className="absolute top-4 right-4 w-12 h-12 bg-white rounded-xl shadow-card flex items-center justify-center text-primary-600 hover:bg-gray-50 transition-colors z-40"
              aria-label="Ir a mi ubicación"
            >
              <Navigation className="w-6 h-6" />
            </button>
            
            {/* Demo button (mobile) */}
            {isMobile && !order && (
              <button
                onClick={startDemoTracking}
                className="absolute top-4 left-4 px-4 py-2 bg-primary-500 text-white rounded-xl shadow-lg flex items-center gap-2 text-sm font-medium z-40"
              >
                <Play className="w-4 h-4" />
                Demo Tracking
              </button>
            )}
          </GoogleMapClean>
        )}
        
        {/* Restaurant card (cuando se selecciona uno) */}
        {selectedRestaurant && !order && (
          <RestaurantCard 
            restaurant={selectedRestaurant} 
            onClose={() => setSelectedRestaurant(null)}
          />
        )}
      </div>
      
      {/* Bottom sheet (Mobile) */}
      {isMobile && order && (
        <OrderTrackingPanel
          order={order}
          courier={courier}
          onClose={stopTracking}
          variant="mobile"
        />
      )}
      
      {/* Connection status indicator */}
      {order && (
        <div className={`
          fixed top-20 left-1/2 -translate-x-1/2 z-50
          px-3 py-1.5 rounded-full text-xs font-medium
          transition-all duration-300
          ${isConnected 
            ? 'bg-green-100 text-green-700' 
            : 'bg-amber-100 text-amber-700'
          }
        `}>
          {isConnected ? '● En vivo' : '○ Reconectando...'}
        </div>
      )}
    </div>
  )
}
