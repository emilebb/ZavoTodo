/**
 * ============================================
 * ZAVO - Google Maps Demo Page
 * ============================================
 * 
 * Ejemplo completo de uso de Google Maps
 */

import { useState, useCallback } from 'react'
import GoogleMapClean, { MapMarker, MapRoute } from '../components/map/GoogleMapClean'
import GoogleMapOptimized, { OptimizedMarker } from '../components/map/GoogleMapOptimized'
import EnvDebug from '../components/debug/EnvDebug'
import { Coordinate } from '../types/firebase'

// ============================================
// DATOS DE EJEMPLO
// ============================================

const SAMPLE_MARKERS: MapMarker[] = [
  {
    id: 'restaurant-1',
    type: 'restaurant',
    position: { lat: 4.6761, lng: -74.0486 },
    label: 'Panadería El Buen Pan',
    data: { rating: 4.8, category: 'panaderia' }
  },
  {
    id: 'restaurant-2', 
    type: 'restaurant',
    position: { lat: 4.6800, lng: -74.0520 },
    label: 'Café Central Premium',
    data: { rating: 4.9, category: 'cafe' }
  },
  {
    id: 'courier-1',
    type: 'courier',
    position: { lat: 4.6780, lng: -74.0500 },
    label: 'Repartidor Juan',
    // animation: google.maps.Animation.BOUNCE, // No disponible en MapMarker
    data: { status: 'en_camino', eta: '15 min' }
  }
]

const SAMPLE_ROUTES: MapRoute[] = [
  {
    id: 'delivery-route',
    origin: { lat: 4.6761, lng: -74.0486 },
    destination: { lat: 4.6800, lng: -74.0520 },
    color: '#16A34A',
    strokeWeight: 4
  }
]

// ============================================
// COMPONENTE DEMO
// ============================================

export default function GoogleMapDemo() {
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null)
  const [mapCenter, setMapCenter] = useState<Coordinate>({ lat: 4.6761, lng: -74.0486 })
  const [userLocation, setUserLocation] = useState<Coordinate | null>(null)
  const [mapType, setMapType] = useState<'basic' | 'optimized'>('basic')

  // ============================================
  // HANDLERS
  // ============================================

  const handleMarkerClick = useCallback((marker: MapMarker) => {
    console.log('Marker clicked:', marker)
    setSelectedMarker(marker)
  }, [])

  const handleMapClick = useCallback((coordinate: Coordinate) => {
    console.log('Map clicked:', coordinate)
    setMapCenter(coordinate)
  }, [])

  const handleGetLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location: Coordinate = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
          setUserLocation(location)
          setMapCenter(location)
        },
        (error) => {
          console.error('Error obteniendo ubicación:', error)
        }
      )
    }
  }, [])

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Debug de variables de entorno */}
      <EnvDebug />
      
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            🗺️ Google Maps Demo - ZAVO
          </h1>
          
          {/* Controles */}
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex gap-2">
              <button
                onClick={() => setMapType('basic')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  mapType === 'basic'
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Mapa Básico
              </button>
              <button
                onClick={() => setMapType('optimized')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  mapType === 'optimized'
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Mapa Optimizado
              </button>
            </div>

            <button
              onClick={handleGetLocation}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              📍 Mi Ubicación
            </button>

            <div className="text-sm text-gray-600">
              Centro: {mapCenter.lat.toFixed(4)}, {mapCenter.lng.toFixed(4)}
            </div>
          </div>
        </div>
      </div>

      {/* Mapa */}
      <div className="flex-1 h-[calc(100vh-140px)]">
        {mapType === 'basic' ? (
          <GoogleMapClean
            center={mapCenter}
            zoom={14}
            markers={SAMPLE_MARKERS}
            routes={SAMPLE_ROUTES}
            onMarkerClick={handleMarkerClick}
            onMapClick={handleMapClick}
            userLocation={userLocation}
            showTraffic={true}
            className="w-full h-full"
          />
        ) : (
          <GoogleMapOptimized
            center={mapCenter}
            zoom={14}
            markers={SAMPLE_MARKERS as OptimizedMarker[]}
            onMarkerClick={handleMarkerClick as any}
            userLocation={userLocation}
            className="w-full h-full"
          />
        )}
      </div>

      {/* Panel de información */}
      {selectedMarker && (
        <div className="fixed bottom-4 left-4 bg-white rounded-lg shadow-lg p-4 max-w-sm z-50">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-gray-800">
              {selectedMarker.label}
            </h3>
            <button
              onClick={() => setSelectedMarker(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-2 text-sm text-gray-600">
            <div>
              <strong>Tipo:</strong> {selectedMarker.type}
            </div>
            <div>
              <strong>Posición:</strong> {selectedMarker.position.lat.toFixed(4)}, {selectedMarker.position.lng.toFixed(4)}
            </div>
            {selectedMarker.data && (
              <div>
                <strong>Datos:</strong>
                <pre className="mt-1 text-xs bg-gray-100 p-2 rounded">
                  {JSON.stringify(selectedMarker.data, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Instrucciones */}
      <div className="fixed top-20 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-4 max-w-xs shadow-lg z-40">
        <h4 className="font-semibold text-gray-800 mb-2">💡 Instrucciones</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Click en marcadores para ver info</li>
          <li>• Click en el mapa para cambiar centro</li>
          <li>• Usa "Mi Ubicación" para geolocalización</li>
          <li>• Cambia entre mapa básico y optimizado</li>
          <li>• Las rutas se dibujan automáticamente</li>
        </ul>
      </div>
    </div>
  )
}
