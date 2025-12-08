/**
 * ============================================
 * ZAVO - Explore Map Component
 * ============================================
 * 
 * Mapa interactivo estilo Uber Eats con:
 * - Marcadores de productos
 * - Ubicación del usuario
 * - Clusters de productos
 * - Interacción con productos
 */

import { useCallback, useMemo } from 'react'
import { GoogleMap, useJsApiLoader, Marker, Circle } from '@react-google-maps/api'
import { MapPin } from 'lucide-react'
import { Product, PRODUCT_TYPE_COLORS, CATEGORY_ICONS } from '../../types/products'

// ============================================
// TIPOS
// ============================================

interface ExploreMapProps {
  products: Product[]
  userLocation: {
    lat: number
    lng: number
    loading: boolean
  }
  selectedProduct: Product | null
  onProductSelect: (product: Product | null) => void
  onRefreshLocation: () => void
}

// ============================================
// CONFIGURACIÓN DEL MAPA
// ============================================

const mapContainerStyle = {
  width: '100%',
  height: '100%'
}

// Centro por defecto: Bogotá
// const defaultCenter = { lat: 4.6097, lng: -74.0817 }

const mapOptions: google.maps.MapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: false,
  styles: [
    {
      featureType: 'poi',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }]
    },
    {
      featureType: 'transit',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }]
    },
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [{ color: '#e9e9e9' }]
    },
    {
      featureType: 'landscape',
      elementType: 'geometry',
      stylers: [{ color: '#f5f5f5' }]
    }
  ]
}

const libraries: ("geometry" | "places")[] = ['geometry', 'places']

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

const ExploreMap: React.FC<ExploreMapProps> = ({
  products,
  userLocation,
  selectedProduct,
  onProductSelect
}) => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
    libraries
  })

  const center = useMemo(() => ({
    lat: userLocation.lat,
    lng: userLocation.lng
  }), [userLocation.lat, userLocation.lng])

  const onMapClick = useCallback(() => {
    onProductSelect(null)
  }, [onProductSelect])

  // ============================================
  // RENDER - LOADING
  // ============================================

  if (loadError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center p-8">
          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Error al cargar el mapa</p>
        </div>
      </div>
    )
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center p-8">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Cargando mapa...</p>
        </div>
      </div>
    )
  }

  // ============================================
  // RENDER - MAPA
  // ============================================

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={center}
      zoom={14}
      options={mapOptions}
      onClick={onMapClick}
    >
      {/* User Location Marker */}
      <Marker
        position={center}
        icon={{
          path: google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: '#10B981',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 3
        }}
        zIndex={1000}
      />
      
      {/* User Location Accuracy Circle */}
      <Circle
        center={center}
        radius={100}
        options={{
          fillColor: '#10B981',
          fillOpacity: 0.1,
          strokeColor: '#10B981',
          strokeOpacity: 0.3,
          strokeWeight: 1
        }}
      />

      {/* Product Markers */}
      {products.map(product => {
        const isSelected = selectedProduct?.id === product.id
        // const colors = PRODUCT_TYPE_COLORS[product.type]
        
        return (
          <Marker
            key={product.id}
            position={{
              lat: product.location.lat,
              lng: product.location.lng
            }}
            onClick={() => onProductSelect(product)}
            icon={{
              url: `data:image/svg+xml,${encodeURIComponent(`
                <svg width="40" height="48" viewBox="0 0 40 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 0C8.954 0 0 8.954 0 20c0 14.667 20 28 20 28s20-13.333 20-28C40 8.954 31.046 0 20 0z" fill="${isSelected ? '#10B981' : '#ffffff'}"/>
                  <path d="M20 0C8.954 0 0 8.954 0 20c0 14.667 20 28 20 28s20-13.333 20-28C40 8.954 31.046 0 20 0z" stroke="${isSelected ? '#059669' : '#d1d5db'}" stroke-width="2"/>
                  <circle cx="20" cy="18" r="12" fill="${isSelected ? '#ffffff' : '#10B981'}"/>
                  <text x="20" y="23" text-anchor="middle" font-size="14" fill="${isSelected ? '#10B981' : '#ffffff'}">${CATEGORY_ICONS[product.category]}</text>
                </svg>
              `)}`,
              scaledSize: new google.maps.Size(isSelected ? 48 : 40, isSelected ? 56 : 48),
              anchor: new google.maps.Point(isSelected ? 24 : 20, isSelected ? 56 : 48)
            }}
            animation={isSelected ? google.maps.Animation.BOUNCE : undefined}
            zIndex={isSelected ? 999 : 1}
          />
        )
      })}
    </GoogleMap>
  )
}

export default ExploreMap
