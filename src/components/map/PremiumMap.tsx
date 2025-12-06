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
  X,
  Sparkles
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCurrentLocation } from '../../hooks/useCurrentLocation'
import { usePacksQuery } from '../../hooks/usePacks'
import { useFilterStore } from '../../store/filterStore'
import Button from '../ui/Button'
import Input from '../ui/Input'
import LocationCard from './LocationCard'

const PremiumMap = () => {
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null)
  const { latitude, longitude, getCurrentLocation, loading: locationLoading } = useCurrentLocation()
  const { searchText, setSearchText } = useFilterStore()
  const { data: packs } = usePacksQuery({ activo: true })

  // Marcadores premium con datos completos
  const premiumMarkers = [
    { 
      id: '1', x: 32, y: 28, discount: '-50%', name: 'Panadería El Buen Pan', 
      rating: 4.8, distance: '0.8 km', category: '🥖', price: 8000, originalPrice: 16000 
    },
    { 
      id: '2', x: 68, y: 45, discount: '-35%', name: 'Café Central Premium', 
      rating: 4.9, distance: '1.2 km', category: '☕', price: 12000, originalPrice: 18500 
    },
    { 
      id: '3', x: 25, y: 72, discount: '-60%', name: 'Restaurante Verde Gourmet', 
      rating: 4.7, distance: '0.5 km', category: '🍽️', price: 15000, originalPrice: 37500 
    },
    { 
      id: '4', x: 78, y: 25, discount: '-45%', name: 'Pastelería Dulce Artesanal', 
      rating: 4.6, distance: '1.5 km', category: '🧁', price: 9500, originalPrice: 17300 
    },
    { 
      id: '5', x: 55, y: 78, discount: '-40%', name: 'Market Fresh Orgánico', 
      rating: 4.8, distance: '2.1 km', category: '🥗', price: 11000, originalPrice: 18300 
    },
  ]

  const premiumFeatures = [
    { 
      icon: Navigation, 
      text: 'Geolocalización en tiempo real', 
      color: 'text-blue-600', 
      bgColor: 'bg-blue-50',
      description: 'Ubicación precisa GPS'
    },
    { 
      icon: MapPin, 
      text: 'Marcadores interactivos', 
      color: 'text-emerald-600', 
      bgColor: 'bg-emerald-50',
      description: 'Negocios cercanos'
    },
    { 
      icon: Route, 
      text: 'Rutas y direcciones', 
      color: 'text-purple-600', 
      bgColor: 'bg-purple-50',
      description: 'Navegación optimizada'
    },
    { 
      icon: Clock, 
      text: 'Horarios de retiro', 
      color: 'text-amber-600', 
      bgColor: 'bg-amber-50',
      description: 'Disponibilidad real'
    },
    { 
      icon: Star, 
      text: 'Calificaciones y reseñas', 
      color: 'text-yellow-600', 
      bgColor: 'bg-yellow-50',
      description: 'Opiniones verificadas'
    },
    { 
      icon: ExternalLink, 
      text: 'Integración Google Maps', 
      color: 'text-slate-600', 
      bgColor: 'bg-slate-50',
      description: 'Navegación externa'
    },
  ]

  const selectedMarkerData = premiumMarkers.find(m => m.id === selectedMarker)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price)
  }

  return (
    <div className="premium-map-container">
      
      {/* Premium Header */}
      <header className="premium-header">
        <div className="header-glass-container">
          
          {/* Back Button */}
          <Link to="/" className="back-btn-premium">
            <div className="back-btn-inner">
              <ArrowLeft className="w-5 h-5 text-slate-700" />
            </div>
          </Link>

          {/* Premium Search */}
          <div className="search-premium-container">
            <div className="search-premium-wrapper">
              <div className="search-icon-container">
                <Search className="w-5 h-5 text-slate-400" />
              </div>
              <Input
                placeholder="Buscar negocios, packs sorpresa..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="search-premium-input"
              />
              <div className="search-accent" />
            </div>
          </div>

          {/* Premium Actions */}
          <div className="actions-premium-container">
            <Button className="filter-btn-premium">
              <div className="filter-btn-content">
                <Filter className="w-4 h-4 text-emerald-600" />
                <span className="filter-btn-text">Filtros</span>
                <div className="filter-btn-accent" />
              </div>
            </Button>
            
            <Button
              onClick={getCurrentLocation}
              loading={locationLoading}
              className="location-btn-premium"
            >
              <div className="location-btn-inner">
                <Locate className="w-4 h-4 text-blue-600" />
              </div>
            </Button>
          </div>
        </div>
      </header>

      {/* Premium Main Content */}
      <main className="premium-main-content">
        
        {/* Premium Map */}
        <div className="premium-map-section">
          <div className="premium-map-canvas">
            
            {/* Ambient Background */}
            <div className="map-ambient-bg" />
            
            {/* Subtle Grid */}
            <div className="map-premium-grid" />

            {/* Premium Markers */}
            {premiumMarkers.map((marker) => (
              <div
                key={marker.id}
                className="premium-marker"
                style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
                onClick={() => setSelectedMarker(selectedMarker === marker.id ? null : marker.id)}
              >
                {/* Marker Glow */}
                <div className="marker-ambient-glow" />
                
                {/* Marker Base */}
                <div className={`premium-marker-base ${selectedMarker === marker.id ? 'marker-selected' : ''}`}>
                  <div className="marker-inner-container">
                    <div className="marker-category-icon">
                      {marker.category}
                    </div>
                  </div>
                  
                  {/* Premium Discount Badge */}
                  <div className="premium-discount-badge">
                    <span className="discount-text">{marker.discount}</span>
                    <div className="discount-shine" />
                  </div>

                  {/* Selection Ring */}
                  {selectedMarker === marker.id && (
                    <div className="selection-ring">
                      <div className="ring-pulse" />
                    </div>
                  )}
                </div>

                {/* Premium Tooltip */}
                <div className="premium-tooltip">
                  <div className="tooltip-premium-content">
                    <div className="tooltip-header">
                      <span className="tooltip-name">{marker.name}</span>
                      <div className="tooltip-rating">
                        <Star className="w-3 h-3 text-amber-400 fill-current" />
                        <span className="rating-text">{marker.rating}</span>
                      </div>
                    </div>
                    <div className="tooltip-meta">
                      <span className="tooltip-distance">{marker.distance}</span>
                      <span className="tooltip-separator">•</span>
                      <span className="tooltip-price">{formatPrice(marker.price)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Premium User Location */}
            {latitude && longitude && (
              <div className="premium-user-location" style={{ left: '50%', top: '60%' }}>
                <div className="user-location-rings">
                  <div className="location-ring-1" />
                  <div className="location-ring-2" />
                  <div className="location-ring-3" />
                </div>
                <div className="user-location-dot">
                  <div className="location-dot-inner" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Premium Features Panel */}
        <aside className="premium-features-panel">
          <div className="panel-premium-container">
            
            {/* Panel Header */}
            <div className="panel-premium-header">
              <div className="panel-icon-container">
                <div className="panel-icon-bg">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div className="panel-icon-glow" />
              </div>
              <div className="panel-title-section">
                <h3 className="panel-premium-title">Funcionalidades</h3>
                <p className="panel-premium-subtitle">Características premium</p>
              </div>
            </div>
            
            {/* Features List */}
            <div className="premium-features-list">
              {premiumFeatures.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <div key={index} className="premium-feature-item">
                    <div className="feature-icon-wrapper">
                      <div className={`feature-premium-icon ${feature.bgColor}`}>
                        <Icon className={`w-4 h-4 ${feature.color}`} />
                      </div>
                      <div className="feature-icon-shine" />
                    </div>
                    <div className="feature-content-section">
                      <span className="feature-premium-title">{feature.text}</span>
                      <span className="feature-premium-description">{feature.description}</span>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Premium Panel Footer */}
            <div className="panel-premium-footer">
              <div className="premium-tip-container">
                <div className="tip-premium-icon">
                  <div className="tip-icon-bg">💡</div>
                  <div className="tip-icon-glow" />
                </div>
                <div className="tip-premium-content">
                  <p className="tip-premium-text">
                    <span className="tip-highlight">Tip Premium:</span> En producción, este mapa 
                    integra Google Maps API con datos en tiempo real y navegación avanzada.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </main>

      {/* Premium Bottom Section */}
      <footer className="premium-bottom-section">
        
        {/* Premium Location Card */}
        <div className="premium-location-wrapper">
          <LocationCard
            latitude={latitude}
            longitude={longitude}
            isLoading={locationLoading}
            onActivate={getCurrentLocation}
          />
        </div>

        {/* Premium Marker Info */}
        {selectedMarker && selectedMarkerData && (
          <div className="premium-marker-info">
            <div className="marker-info-premium-container">
              
              {/* Info Header */}
              <div className="marker-info-premium-header">
                <div className="marker-info-main-content">
                  <div className="marker-title-section">
                    <h3 className="marker-premium-name">{selectedMarkerData.name}</h3>
                    <div className="marker-premium-meta">
                      <div className="marker-rating-section">
                        <Star className="w-4 h-4 text-amber-400 fill-current" />
                        <span className="rating-premium-text">{selectedMarkerData.rating}</span>
                      </div>
                      <div className="meta-separator">•</div>
                      <span className="distance-premium-text">{selectedMarkerData.distance}</span>
                      <div className="meta-separator">•</div>
                      <span className="category-premium-text">{selectedMarkerData.category}</span>
                    </div>
                  </div>
                  <p className="marker-premium-description">
                    Pack sorpresa premium con productos frescos y artesanales del día. 
                    Perfecto para disfrutar en cualquier momento.
                  </p>
                </div>
                
                <Button
                  onClick={() => setSelectedMarker(null)}
                  className="close-premium-button"
                >
                  <X className="w-4 h-4 text-slate-500" />
                </Button>
              </div>
              
              {/* Premium Price Section */}
              <div className="premium-price-section">
                <div className="price-premium-container">
                  <div className="current-premium-price">{formatPrice(selectedMarkerData.price)}</div>
                  <div className="original-premium-price">{formatPrice(selectedMarkerData.originalPrice)}</div>
                  <div className="savings-premium-badge">
                    <span className="savings-text">Ahorras {formatPrice(selectedMarkerData.originalPrice - selectedMarkerData.price)}</span>
                    <div className="savings-shine" />
                  </div>
                </div>
                <div className="premium-discount-info">
                  <span className="discount-premium-badge">{selectedMarkerData.discount}</span>
                </div>
              </div>
              
              {/* Premium Actions */}
              <div className="premium-marker-actions">
                <Button className="primary-premium-action">
                  <span className="action-text">Ver Pack Premium</span>
                  <div className="action-shine" />
                </Button>
                <Button className="secondary-premium-action">
                  <Route className="w-4 h-4 mr-2" />
                  <span className="action-text">Cómo llegar</span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </footer>
    </div>
  )
}

export default PremiumMap
