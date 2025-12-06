import { Navigation, MapPin } from 'lucide-react'

interface LocationCardProps {
  latitude?: number | null
  longitude?: number | null
  isLoading?: boolean
  onActivate?: () => void
}

const LocationCard = ({ latitude, longitude, isLoading, onActivate }: LocationCardProps) => {
  const formatCoordinate = (coord: number) => {
    return coord.toFixed(4)
  }

  const hasLocation = latitude && longitude

  return (
    <div className="location-card-container">
      <div className="location-card">
        {/* Icon Container */}
        <div className="location-icon-container">
          <div className="location-icon-background">
            <Navigation className="location-icon" />
          </div>
        </div>

        {/* Content */}
        <div className="location-content">
          <h4 className="location-title">Tu ubicación</h4>
          <p className="location-coordinates">
            {hasLocation 
              ? `${formatCoordinate(latitude)}, ${formatCoordinate(longitude)}`
              : 'Activar geolocalización'
            }
          </p>
        </div>

        {/* Action Button (only show if no location) */}
        {!hasLocation && !isLoading && (
          <button 
            onClick={onActivate}
            className="location-activate-btn"
            disabled={isLoading}
          >
            <MapPin className="w-4 h-4" />
          </button>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="location-loading">
            <div className="loading-spinner" />
          </div>
        )}
      </div>
    </div>
  )
}

export default LocationCard
