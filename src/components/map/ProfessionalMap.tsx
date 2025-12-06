import { useState } from 'react'
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  Navigation,
  MapPin, 
  Route, 
  Clock, 
  Star,
  ExternalLink,
  Locate,
  Zap
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCurrentLocation } from '../../hooks/useCurrentLocation'
import { usePacksQuery } from '../../hooks/usePacks'
import { useFilterStore } from '../../store/filterStore'
import Button from '../ui/Button'
import Input from '../ui/Input'
import LocationCard from './LocationCard'

const ProfessionalMap = () => {
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null)
  const { latitude, longitude, getCurrentLocation, loading: locationLoading } = useCurrentLocation()
  const { searchText, setSearchText } = useFilterStore()
  usePacksQuery({ activo: true })

  // Marcadores de demo en el mapa
  const demoMarkers = [
    { id: '1', x: 45, y: 35, discount: '-50%', name: 'Panadería El Buen Pan' },
    { id: '2', x: 60, y: 55, discount: '-35%', name: 'Café Central' },
    { id: '3', x: 30, y: 70, discount: '-60%', name: 'Restaurante Verde' },
    { id: '4', x: 75, y: 25, discount: '-45%', name: 'Pastelería Dulce' },
    { id: '5', x: 55, y: 80, discount: '-40%', name: 'Market Fresh' },
  ]

  const demoFeatures = [
    { icon: Navigation, text: 'Geolocalización en tiempo real', color: 'text-blue-600' },
    { icon: MapPin, text: 'Marcadores interactivos', color: 'text-green-600' },
    { icon: Route, text: 'Rutas y direcciones', color: 'text-purple-600' },
    { icon: Clock, text: 'Horarios de retiro', color: 'text-orange-600' },
    { icon: Star, text: 'Calificaciones y reseñas', color: 'text-yellow-600' },
    { icon: ExternalLink, text: 'Integración Google Maps', color: 'text-gray-600' },
  ]

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-green-50 relative overflow-hidden">
      
      {/* Header Bar */}
      <div className="absolute top-0 left-0 right-0 z-30 p-4">
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-4">
          <div className="flex items-center space-x-4">
            
            {/* Back Button */}
            <Link to="/">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-10 w-10 p-0 rounded-xl bg-gray-100/80 hover:bg-gray-200/80 transition-all duration-200"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Button>
            </Link>

            {/* Search Bar */}
            <div className="flex-1 relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <Input
                placeholder="Buscar negocios, packs..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="h-12 pl-12 pr-4 text-base bg-gray-50/80 border-gray-200/50 rounded-xl shadow-sm focus:shadow-md transition-all duration-200"
              />
            </div>

            {/* Filters Button */}
            <Button 
              variant="outline" 
              size="sm"
              className="h-12 px-6 bg-white/80 border-gray-200/50 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
            >
              <Filter className="w-5 h-5 mr-2 text-green-600" />
              <span className="font-medium">Filtros</span>
            </Button>

            {/* Location Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={getCurrentLocation}
              loading={locationLoading}
              className="h-10 w-10 p-0 rounded-xl bg-blue-100/80 hover:bg-blue-200/80 transition-all duration-200"
            >
              <Locate className="w-5 h-5 text-blue-600" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Map Area */}
      <div className="absolute inset-0 pt-24 pb-20 px-4">
        <div className="h-full relative">
          
          {/* Map Container */}
          <div 
            className="w-full h-full rounded-3xl overflow-hidden relative shadow-2xl border border-white/30"
            style={{
              background: `
                radial-gradient(circle at 20% 30%, rgba(34, 197, 94, 0.08) 0%, transparent 50%),
                radial-gradient(circle at 80% 70%, rgba(59, 130, 246, 0.08) 0%, transparent 50%),
                linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)
              `
            }}
          >
            
            {/* Subtle Grid Pattern */}
            <div 
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(0, 0, 0, 0.1) 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px'
              }}
            />

            {/* Demo Markers */}
            {demoMarkers.map((marker) => (
              <div
                key={marker.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
                onClick={() => setSelectedMarker(selectedMarker === marker.id ? null : marker.id)}
              >
                {/* Marker Base */}
                <div className="relative">
                  <div className="w-14 h-14 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border-2 border-green-400/60 flex items-center justify-center group-hover:scale-110 transition-all duration-300 backdrop-blur-sm">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-inner">
                      <span className="text-white font-bold text-sm">🏪</span>
                    </div>
                  </div>
                  
                  {/* Discount Badge */}
                  <div className="absolute -top-2 -right-2">
                    <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-lg">
                      {marker.discount}
                    </div>
                  </div>

                  {/* Glow Effect */}
                  <div className="absolute inset-0 w-14 h-14 bg-green-400/20 rounded-2xl blur-xl group-hover:bg-green-400/30 transition-all duration-300" />
                  
                  {/* Selection Ring */}
                  {selectedMarker === marker.id && (
                    <div className="absolute inset-0 w-14 h-14 border-4 border-green-500 rounded-2xl animate-pulse" />
                  )}
                </div>

                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                  <div className="bg-gray-900/90 backdrop-blur-sm text-white text-xs font-medium px-3 py-2 rounded-xl whitespace-nowrap shadow-xl">
                    {marker.name}
                  </div>
                </div>
              </div>
            ))}

            {/* User Location Marker */}
            {latitude && longitude && (
              <div
                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                style={{ left: '50%', top: '60%' }}
              >
                <div className="relative">
                  <div className="w-6 h-6 bg-blue-500 rounded-full border-4 border-white shadow-lg animate-pulse" />
                  <div className="absolute inset-0 w-6 h-6 bg-blue-500/30 rounded-full animate-ping" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Panel - Features */}
      <div className="absolute top-24 right-4 z-20 w-80">
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6">
          <div className="flex items-center space-x-2 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Funcionalidades Demo</h3>
          </div>
          
          <div className="space-y-4">
            {demoFeatures.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="flex items-center space-x-4 p-3 rounded-xl bg-gray-50/50 hover:bg-gray-100/50 transition-all duration-200">
                  <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center">
                    <Icon className={`w-5 h-5 ${feature.color}`} />
                  </div>
                  <span className="text-gray-700 font-medium text-sm leading-relaxed">
                    {feature.text}
                  </span>
                </div>
              )
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200/50">
            <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-4">
              <div className="flex items-start space-x-2">
                <div className="text-lg">💡</div>
                <div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    <span className="font-semibold">Tip:</span> En producción, este mapa usaría Google Maps API 
                    para navegación real y datos de tráfico en tiempo real.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Panel - Professional Location Card */}
      <div className="absolute bottom-4 left-4 right-4 z-20">
        <LocationCard
          latitude={latitude}
          longitude={longitude}
          isLoading={locationLoading}
          onActivate={getCurrentLocation}
        />
      </div>

      {/* Selected Marker Info */}
      {selectedMarker && (
        <div className="absolute bottom-24 left-4 right-4 z-25">
          <div className="max-w-lg mx-auto">
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 text-lg mb-1">
                    {demoMarkers.find(m => m.id === selectedMarker)?.name}
                  </h3>
                  <div className="flex items-center space-x-2 mb-2">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm text-gray-600">4.8 • 1.2 km</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Pack sorpresa con productos frescos del día. Perfecto para el desayuno o merienda.
                  </p>
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl font-bold text-green-600">$8,000</div>
                    <div className="text-sm text-gray-500 line-through">$15,000</div>
                    <div className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-lg">
                      {demoMarkers.find(m => m.id === selectedMarker)?.discount}
                    </div>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedMarker(null)}
                  className="h-8 w-8 p-0 rounded-lg"
                >
                  ×
                </Button>
              </div>
              
              <div className="flex space-x-3">
                <Button size="sm" className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600">
                  Ver Pack
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Route className="w-4 h-4 mr-2" />
                  Cómo llegar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfessionalMap
