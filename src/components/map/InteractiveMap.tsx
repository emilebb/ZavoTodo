import { useState, useRef } from 'react'
import { 
  MapPin, 
  Navigation, 
  Search, 
  Clock, 
  Star,
  ExternalLink,
  X,
  Locate,
  Route,
  Timer
} from 'lucide-react'
import MapFilters from './MapFilters'
import { useCurrentLocation } from '../../hooks/useCurrentLocation'
import { usePacksQuery } from '../../hooks/usePacks'
import { useFilterStore } from '../../store/filterStore'
import Card from '../ui/Card'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Badge from '../ui/Badge'
import { Pack } from '../../types'

interface MapMarker {
  id: string
  lat: number
  lng: number
  pack: Pack
  type: 'business' | 'user'
}

interface RouteInfo {
  distance: string
  duration: string
  steps: string[]
}

const InteractiveMap = () => {
  const [selectedPack, setSelectedPack] = useState<Pack | null>(null)
  const [showRoute, setShowRoute] = useState(false)
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null)
  const [mapCenter, setMapCenter] = useState({ lat: 4.6097, lng: -74.0817 }) // Bogotá
  const [zoom, setZoom] = useState(12)
  const mapRef = useRef<HTMLDivElement>(null)

  const { latitude, longitude, getCurrentLocation, loading: locationLoading } = useCurrentLocation()
  const { searchText, setSearchText } = useFilterStore()
  const { data: packs, isLoading } = usePacksQuery({ activo: true })

  // Simular marcadores de negocios
  const markers: MapMarker[] = [
    ...(packs?.map(pack => ({
      id: pack.id,
      lat: pack.business?.lat || 4.6097 + (Math.random() - 0.5) * 0.02,
      lng: pack.business?.lng || -74.0817 + (Math.random() - 0.5) * 0.02,
      pack,
      type: 'business' as const
    })) || []),
    ...(latitude && longitude ? [{
      id: 'user-location',
      lat: latitude,
      lng: longitude,
      pack: {} as Pack,
      type: 'user' as const
    }] : [])
  ]

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price)
  }

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371 // Radio de la Tierra en km
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLng = (lng2 - lng1) * Math.PI / 180
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  const handleMarkerClick = (pack: Pack) => {
    setSelectedPack(pack)
    setShowRoute(false)
  }

  const handleShowRoute = () => {
    if (selectedPack && latitude && longitude) {
      setShowRoute(true)
      // Simular información de ruta
      const distance = calculateDistance(
        latitude, 
        longitude, 
        selectedPack.business?.lat || 4.6097, 
        selectedPack.business?.lng || -74.0817
      )
      setRouteInfo({
        distance: `${distance.toFixed(1)} km`,
        duration: `${Math.ceil(distance * 3)} min`, // Estimación simple
        steps: [
          'Dirígete hacia el norte por la Calle Principal',
          'Gira a la derecha en la Carrera 15',
          'Continúa recto por 800m',
          `Llegaste a ${selectedPack.business?.nombre}`
        ]
      })
    }
  }

  const openInGoogleMaps = () => {
    if (selectedPack && latitude && longitude) {
      const url = `https://www.google.com/maps/dir/${latitude},${longitude}/${selectedPack.business?.lat},${selectedPack.business?.lng}`
      window.open(url, '_blank')
    }
  }

  return (
    <div className="relative h-screen bg-gray-50">
      {/* Search Bar */}
      <div className="absolute top-4 left-4 right-4 z-20">
        <Card className="p-4">
          <div className="flex space-x-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar negocios, packs..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="pl-10"
              />
            </div>
            <MapFilters />
            <Button
              variant="outline"
              size="sm"
              onClick={getCurrentLocation}
              loading={locationLoading}
            >
              <Locate className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      </div>

      {/* Map Container */}
      <div 
        ref={mapRef}
        className="w-full h-full relative overflow-hidden"
        style={{
          background: `
            radial-gradient(circle at 30% 20%, rgba(34, 197, 94, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 70% 80%, rgba(20, 184, 166, 0.1) 0%, transparent 50%),
            linear-gradient(135deg, #f0fdf4 0%, #f0fdfa 100%)
          `
        }}
      >
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(34, 197, 94, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(34, 197, 94, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />

        {/* Markers */}
        {markers.map((marker) => (
          <div
            key={marker.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
            style={{
              left: `${((marker.lng - mapCenter.lng) / 0.02 + 50)}%`,
              top: `${(-(marker.lat - mapCenter.lat) / 0.02 + 50)}%`
            }}
            onClick={() => marker.type === 'business' && handleMarkerClick(marker.pack)}
          >
            {marker.type === 'user' ? (
              // User Location Marker
              <div className="relative">
                <div className="w-6 h-6 bg-blue-500 rounded-full border-4 border-white shadow-lg animate-pulse" />
                <div className="absolute inset-0 w-6 h-6 bg-blue-500 rounded-full opacity-30 animate-ping" />
              </div>
            ) : (
              // Business Marker
              <div className="relative group">
                <div className="w-12 h-12 bg-white rounded-full shadow-lg border-2 border-primary-500 flex items-center justify-center hover:scale-110 transition-transform duration-200">
                  <span className="text-lg">
                    {marker.pack.business?.nombre?.charAt(0) || '🏪'}
                  </span>
                </div>
                {/* Price Badge */}
                <div className="absolute -top-2 -right-2">
                  <Badge variant="success" size="sm" className="text-xs font-bold">
                    -{marker.pack.porcentaje_descuento}%
                  </Badge>
                </div>
                {/* Hover Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                  <div className="bg-gray-900 text-white text-xs rounded-lg px-2 py-1 whitespace-nowrap">
                    {marker.pack.business?.nombre}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Route Line (when showing route) */}
        {showRoute && selectedPack && latitude && longitude && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-5">
            <line
              x1={`${((longitude - mapCenter.lng) / 0.02 + 50)}%`}
              y1={`${(-(latitude - mapCenter.lat) / 0.02 + 50)}%`}
              x2={`${(((selectedPack.business?.lng || -74.0817) - mapCenter.lng) / 0.02 + 50)}%`}
              y2={`${(-((selectedPack.business?.lat || 4.6097) - mapCenter.lat) / 0.02 + 50)}%`}
              stroke="#3b82f6"
              strokeWidth="3"
              strokeDasharray="10,5"
              className="animate-pulse"
            />
          </svg>
        )}
      </div>

      {/* Selected Pack Card */}
      {selectedPack && (
        <div className="absolute bottom-4 left-4 right-4 z-20">
          <Card className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-700 font-medium text-sm">
                      {selectedPack.business?.nombre?.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{selectedPack.business?.nombre}</h3>
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 text-yellow-500 fill-current" />
                      <span className="text-xs text-gray-500">4.8</span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-500">
                        {latitude && longitude && selectedPack.business?.lat && selectedPack.business?.lng
                          ? `${calculateDistance(latitude, longitude, selectedPack.business.lat, selectedPack.business.lng).toFixed(1)} km`
                          : '1.2 km'
                        }
                      </span>
                    </div>
                  </div>
                </div>

                <h4 className="font-medium text-gray-900 mb-2">{selectedPack.titulo}</h4>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{selectedPack.descripcion}</p>

                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="truncate">{selectedPack.business?.direccion}</span>
                  </div>
                  <div className="flex items-center text-sm text-orange-600">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{selectedPack.hora_retiro_desde} - {selectedPack.hora_retiro_hasta}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div>
                      <div className="text-sm text-gray-500 line-through">
                        {formatPrice(selectedPack.precio_original)}
                      </div>
                      <div className="text-xl font-bold text-primary-600">
                        {formatPrice(selectedPack.precio_descuento)}
                      </div>
                    </div>
                    <Badge variant="error" size="sm">
                      -{selectedPack.porcentaje_descuento}% OFF
                    </Badge>
                  </div>

                  <div className="flex space-x-2">
                    {!showRoute ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleShowRoute}
                          disabled={!latitude || !longitude}
                        >
                          <Route className="w-4 h-4 mr-2" />
                          Cómo llegar
                        </Button>
                        <Button size="sm">
                          Ver Pack
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowRoute(false)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={openInGoogleMaps}
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Google Maps
                        </Button>
                        <Button size="sm">
                          Iniciar
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedPack(null)
                  setShowRoute(false)
                  setRouteInfo(null)
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Route Information */}
            {showRoute && routeInfo && (
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center space-x-4 mb-3">
                  <div className="flex items-center space-x-2">
                    <Timer className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-blue-600">{routeInfo.duration}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Navigation className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">{routeInfo.distance}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h5 className="font-medium text-gray-900 text-sm">Direcciones:</h5>
                  {routeInfo.steps.map((step, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-blue-600 text-xs font-medium">{index + 1}</span>
                      </div>
                      <p className="text-sm text-gray-600">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Map Controls */}
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20">
        <div className="flex flex-col space-y-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setZoom(Math.min(zoom + 1, 18))}
            className="w-10 h-10 p-0"
          >
            +
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setZoom(Math.max(zoom - 1, 8))}
            className="w-10 h-10 p-0"
          >
            -
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-30">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-gray-600">Cargando negocios cercanos...</p>
          </div>
        </div>
      )}

      {/* No Location Permission */}
      {!latitude && !longitude && !locationLoading && (
        <div className="absolute top-20 left-4 right-4 z-20">
          <Card className="p-4 bg-yellow-50 border-yellow-200">
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="font-medium text-yellow-800">Ubicación no disponible</p>
                <p className="text-sm text-yellow-700">
                  Permite el acceso a tu ubicación para ver negocios cercanos
                </p>
              </div>
              <Button
                size="sm"
                onClick={getCurrentLocation}
                loading={locationLoading}
              >
                Activar
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

export default InteractiveMap
