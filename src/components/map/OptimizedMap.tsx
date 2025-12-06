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
  Zap,
  X
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCurrentLocation } from '../../hooks/useCurrentLocation'
import { usePacksQuery } from '../../hooks/usePacks'
import { useFilterStore } from '../../store/filterStore'
import Button from '../ui/Button'
import Input from '../ui/Input'
import LocationCard from './LocationCard'

const OptimizedMap = () => {
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null)
  const { latitude, longitude, getCurrentLocation, loading: locationLoading } = useCurrentLocation()
  const { searchText, setSearchText } = useFilterStore()
  const { data: packs } = usePacksQuery({ activo: true })

  // Marcadores de demo optimizados
  const demoMarkers = [
    { id: '1', x: 35, y: 25, discount: '-50%', name: 'Panadería El Buen Pan', rating: 4.8, distance: '0.8 km' },
    { id: '2', x: 65, y: 40, discount: '-35%', name: 'Café Central', rating: 4.6, distance: '1.2 km' },
    { id: '3', x: 25, y: 65, discount: '-60%', name: 'Restaurante Verde', rating: 4.9, distance: '0.5 km' },
    { id: '4', x: 75, y: 20, discount: '-45%', name: 'Pastelería Dulce', rating: 4.7, distance: '1.5 km' },
    { id: '5', x: 50, y: 75, discount: '-40%', name: 'Market Fresh', rating: 4.5, distance: '2.1 km' },
  ]

  const demoFeatures = [
    { icon: Navigation, text: 'Geolocalización en tiempo real', color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { icon: MapPin, text: 'Marcadores interactivos', color: 'text-green-600', bgColor: 'bg-green-50' },
    { icon: Route, text: 'Rutas y direcciones', color: 'text-purple-600', bgColor: 'bg-purple-50' },
    { icon: Clock, text: 'Horarios de retiro', color: 'text-orange-600', bgColor: 'bg-orange-50' },
    { icon: Star, text: 'Calificaciones y reseñas', color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
    { icon: ExternalLink, text: 'Integración Google Maps', color: 'text-gray-600', bgColor: 'bg-gray-50' },
  ]

  const selectedMarkerData = demoMarkers.find(m => m.id === selectedMarker)

  return (
    <div className="optimized-map-container">
      
      {/* Header Bar - Fixed Top */}
      <header className="optimized-header">
        <div className="header-content">
          
          {/* Back Button */}
          <Link to="/" className="back-button">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </Link>

          {/* Search Bar */}
          <div className="search-container">
            <div className="search-input-wrapper">
              <Search className="search-icon" />
              <Input
                placeholder="Buscar negocios, packs..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="search-input"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <Button className="filter-button">
              <Filter className="w-4 h-4 mr-2 text-green-600" />
              <span className="font-medium text-gray-700">Filtros</span>
            </Button>
            
            <Button
              onClick={getCurrentLocation}
              loading={locationLoading}
              className="location-button"
            >
              <Locate className="w-4 h-4 text-blue-600" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="main-content">
        
        {/* Map Container */}
        <div className="map-container">
          <div className="map-canvas">
            
            {/* Subtle Grid Pattern */}
            <div className="map-grid" />

            {/* Demo Markers */}
            {demoMarkers.map((marker) => (
              <div
                key={marker.id}
                className="map-marker"
                style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
                onClick={() => setSelectedMarker(selectedMarker === marker.id ? null : marker.id)}
              >
                {/* Marker Base */}
                <div className={`marker-base ${selectedMarker === marker.id ? 'marker-selected' : ''}`}>
                  <div className="marker-icon-container">
                    <span className="marker-icon">🏪</span>
                  </div>
                  
                  {/* Discount Badge */}
                  <div className="discount-badge">
                    {marker.discount}
                  </div>

                  {/* Glow Effect */}
                  <div className="marker-glow" />
                </div>

                {/* Tooltip */}
                <div className="marker-tooltip">
                  <div className="tooltip-content">
                    {marker.name}
                  </div>
                </div>
              </div>
            ))}

            {/* User Location Marker */}
            {latitude && longitude && (
              <div className="user-location-marker" style={{ left: '50%', top: '60%' }}>
                <div className="user-location-dot" />
                <div className="user-location-pulse" />
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Features */}
        <aside className="features-panel">
          <div className="panel-content">
            
            {/* Panel Header */}
            <div className="panel-header">
              <div className="panel-icon">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <h3 className="panel-title">Funcionalidades Demo</h3>
            </div>
            
            {/* Features List */}
            <div className="features-list">
              {demoFeatures.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <div key={index} className="feature-item">
                    <div className={`feature-icon ${feature.bgColor}`}>
                      <Icon className={`w-4 h-4 ${feature.color}`} />
                    </div>
                    <span className="feature-text">
                      {feature.text}
                    </span>
                  </div>
                )
              })}
            </div>

            {/* Panel Footer */}
            <div className="panel-footer">
              <div className="tip-container">
                <div className="tip-icon">💡</div>
                <div className="tip-content">
                  <p className="tip-text">
                    <span className="font-semibold">Tip:</span> En producción, este mapa usaría Google Maps API 
                    para navegación real y datos de tráfico en tiempo real.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </main>

      {/* Bottom Section */}
      <footer className="bottom-section">
        
        {/* Location Card */}
        <div className="location-card-wrapper">
          <LocationCard
            latitude={latitude}
            longitude={longitude}
            isLoading={locationLoading}
            onActivate={getCurrentLocation}
          />
        </div>

        {/* Selected Marker Info */}
        {selectedMarker && selectedMarkerData && (
          <div className="marker-info-card">
            <div className="marker-info-content">
              
              {/* Header */}
              <div className="marker-info-header">
                <div className="marker-info-main">
                  <h3 className="marker-name">{selectedMarkerData.name}</h3>
                  <div className="marker-meta">
                    <div className="rating">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span>{selectedMarkerData.rating}</span>
                    </div>
                    <span className="separator">•</span>
                    <span className="distance">{selectedMarkerData.distance}</span>
                  </div>
                  <p className="marker-description">
                    Pack sorpresa con productos frescos del día. Perfecto para el desayuno o merienda.
                  </p>
                </div>
                
                <Button
                  onClick={() => setSelectedMarker(null)}
                  className="close-button"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Price Section */}
              <div className="price-section">
                <div className="price-info">
                  <div className="current-price">$8,000</div>
                  <div className="original-price">$15,000</div>
                  <div className="discount-badge-info">
                    {selectedMarkerData.discount}
                  </div>
                </div>
              </div>
              
              {/* Actions */}
              <div className="marker-actions">
                <Button className="primary-action">
                  Ver Pack
                </Button>
                <Button className="secondary-action">
                  <Route className="w-4 h-4 mr-2" />
                  Cómo llegar
                </Button>
              </div>
            </div>
          </div>
        )}
      </footer>
    </div>
  )
}

export default OptimizedMap
