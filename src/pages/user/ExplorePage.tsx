/**
 * ============================================
 * ZAVO - Explore Page (Uber Eats Style)
 * ============================================
 * 
 * Sistema de exploración avanzado con:
 * - Vista de Lista
 * - Vista de Mapa
 * - Filtros avanzados
 * - Ordenamiento por cercanía
 * - Geolocalización en tiempo real
 */

import { useState, useEffect, useMemo, useCallback } from 'react'
import { 
  MapPin, 
  List, 
  Map as MapIcon, 
  SlidersHorizontal,
  Search,
  X,
  Navigation,
  ChevronDown,
  Loader2,
  Locate
} from 'lucide-react'
import ProductCard from '../../components/products/ProductCard'
import ProductFilters from '../../components/products/ProductFilters'
import ExploreMap from '../../components/explore/ExploreMap'
import FilterModal from '../../components/explore/FilterModal'
import { 
  Product, 
  ProductType, 
  ProductCategory
} from '../../types/products'
import { allMockProducts } from '../../data/mockProducts'

// ============================================
// TIPOS
// ============================================

type ViewMode = 'list' | 'map' | 'split'
type SortOption = 'distance' | 'price_low' | 'price_high' | 'discount' | 'rating'

interface UserLocation {
  lat: number
  lng: number
  accuracy?: number
  loading: boolean
  error?: string
}

// ============================================
// CONSTANTES
// ============================================

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'distance', label: 'Más cercanos' },
  { value: 'price_low', label: 'Menor precio' },
  { value: 'price_high', label: 'Mayor precio' },
  { value: 'discount', label: 'Mayor descuento' },
  { value: 'rating', label: 'Mejor valorados' }
]

const DISTANCE_OPTIONS = [0.5, 1, 2, 5, 10, 20]

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

const ExplorePage = () => {
  // ============================================
  // ESTADO
  // ============================================
  
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [showSortMenu, setShowSortMenu] = useState(false)
  
  // Filtros
  const [selectedTypes, setSelectedTypes] = useState<ProductType[]>([])
  const [selectedCategories, setSelectedCategories] = useState<ProductCategory[]>([])
  const [maxDistance, setMaxDistance] = useState<number>(5)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000])
  const [minDiscount, setMinDiscount] = useState<number>(0)
  const [sortBy, setSortBy] = useState<SortOption>('distance')
  
  // Ubicación
  const [userLocation, setUserLocation] = useState<UserLocation>({
    lat: 4.6097,  // Bogotá por defecto
    lng: -74.0817,
    loading: true
  })
  
  // Producto seleccionado en mapa
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  // ============================================
  // GEOLOCALIZACIÓN
  // ============================================
  
  const getUserLocation = useCallback(() => {
    setUserLocation(prev => ({ ...prev, loading: true, error: undefined }))
    
    if (!navigator.geolocation) {
      setUserLocation(prev => ({ 
        ...prev, 
        loading: false, 
        error: 'Geolocalización no soportada' 
      }))
      return
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          loading: false
        })
        console.log('📍 Ubicación obtenida:', position.coords)
      },
      (error) => {
        console.error('❌ Error de geolocalización:', error)
        setUserLocation(prev => ({ 
          ...prev, 
          loading: false, 
          error: 'No se pudo obtener tu ubicación' 
        }))
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    )
  }, [])
  
  useEffect(() => {
    getUserLocation()
  }, [getUserLocation])

  // ============================================
  // CÁLCULO DE DISTANCIA
  // ============================================
  
  const calculateDistance = useCallback((lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371 // Radio de la Tierra en km
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLng = (lng2 - lng1) * Math.PI / 180
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }, [])

  // ============================================
  // PRODUCTOS FILTRADOS Y ORDENADOS
  // ============================================
  
  const filteredProducts = useMemo(() => {
    let products = allMockProducts.map(product => ({
      ...product,
      location: {
        ...product.location,
        distance: calculateDistance(
          userLocation.lat,
          userLocation.lng,
          product.location.lat,
          product.location.lng
        )
      }
    }))
    
    // Filtro por búsqueda
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      products = products.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.businessName.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.tags?.some(tag => tag.toLowerCase().includes(query))
      )
    }
    
    // Filtro por tipo
    if (selectedTypes.length > 0) {
      products = products.filter(p => selectedTypes.includes(p.type))
    }
    
    // Filtro por categoría
    if (selectedCategories.length > 0) {
      products = products.filter(p => selectedCategories.includes(p.category))
    }
    
    // Filtro por distancia
    products = products.filter(p => 
      p.location.distance !== undefined && p.location.distance <= maxDistance
    )
    
    // Filtro por precio
    products = products.filter(p => 
      p.discountPrice >= priceRange[0] && p.discountPrice <= priceRange[1]
    )
    
    // Filtro por descuento mínimo
    if (minDiscount > 0) {
      products = products.filter(p => p.discountPercentage >= minDiscount)
    }
    
    // Ordenamiento
    switch (sortBy) {
      case 'distance':
        products.sort((a, b) => (a.location.distance || 0) - (b.location.distance || 0))
        break
      case 'price_low':
        products.sort((a, b) => a.discountPrice - b.discountPrice)
        break
      case 'price_high':
        products.sort((a, b) => b.discountPrice - a.discountPrice)
        break
      case 'discount':
        products.sort((a, b) => b.discountPercentage - a.discountPercentage)
        break
      case 'rating':
        products.sort((a, b) => (b.rating || 0) - (a.rating || 0))
        break
    }
    
    return products
  }, [
    searchQuery, 
    selectedTypes, 
    selectedCategories, 
    maxDistance, 
    priceRange, 
    minDiscount, 
    sortBy,
    userLocation,
    calculateDistance
  ])

  // ============================================
  // HANDLERS
  // ============================================
  
  const handleClearFilters = () => {
    setSelectedTypes([])
    setSelectedCategories([])
    setMaxDistance(5)
    setPriceRange([0, 100000])
    setMinDiscount(0)
    setSortBy('distance')
    setSearchQuery('')
  }
  
  const activeFiltersCount = useMemo(() => {
    let count = 0
    if (selectedTypes.length > 0) count++
    if (selectedCategories.length > 0) count++
    if (maxDistance !== 5) count++
    if (priceRange[0] > 0 || priceRange[1] < 100000) count++
    if (minDiscount > 0) count++
    return count
  }, [selectedTypes, selectedCategories, maxDistance, priceRange, minDiscount])

  // ============================================
  // RENDER
  // ============================================
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* ============================================ */}
      {/* HEADER STICKY */}
      {/* ============================================ */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        {/* Location Bar */}
        <div className="px-4 py-3 border-b border-gray-100">
          <button 
            onClick={getUserLocation}
            className="flex items-center gap-2 text-left w-full"
          >
            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
              {userLocation.loading ? (
                <Loader2 className="w-5 h-5 text-emerald-600 animate-spin" />
              ) : (
                <MapPin className="w-5 h-5 text-emerald-600" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500">Tu ubicación</p>
              <p className="text-sm font-medium text-gray-900 truncate">
                {userLocation.error || 'Bogotá, Colombia'}
              </p>
            </div>
            <Navigation className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        
        {/* Search Bar */}
        <div className="px-4 py-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar productos, negocios..."
              className="w-full pl-12 pr-12 py-3 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            )}
          </div>
        </div>
        
        {/* Filters Row */}
        <div className="px-4 pb-3">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            {/* View Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1 flex-shrink-0">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-all ${
                  viewMode === 'list' 
                    ? 'bg-white shadow-sm text-emerald-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`p-2 rounded-md transition-all ${
                  viewMode === 'map' 
                    ? 'bg-white shadow-sm text-emerald-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <MapIcon className="w-4 h-4" />
              </button>
            </div>
            
            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(true)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all flex-shrink-0 ${
                activeFiltersCount > 0
                  ? 'bg-emerald-500 text-white'
                  : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filtros</span>
              {activeFiltersCount > 0 && (
                <span className="w-5 h-5 bg-white text-emerald-600 rounded-full text-xs font-bold flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>
            
            {/* Distance Filter */}
            <select
              value={maxDistance}
              onChange={(e) => setMaxDistance(Number(e.target.value))}
              className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 flex-shrink-0"
            >
              {DISTANCE_OPTIONS.map(d => (
                <option key={d} value={d}>{d} km</option>
              ))}
            </select>
            
            {/* Sort Button */}
            <div className="relative flex-shrink-0">
              <button
                onClick={() => setShowSortMenu(!showSortMenu)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:border-gray-300"
              >
                <span>{SORT_OPTIONS.find(o => o.value === sortBy)?.label}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {showSortMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setShowSortMenu(false)} 
                  />
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-20">
                    {SORT_OPTIONS.map(option => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSortBy(option.value)
                          setShowSortMenu(false)
                        }}
                        className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                          sortBy === option.value
                            ? 'bg-emerald-50 text-emerald-700 font-medium'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* Type Filters */}
        <div className="px-4 pb-3">
          <ProductFilters
            selectedTypes={selectedTypes}
            selectedCategories={selectedCategories}
            onTypeChange={setSelectedTypes}
            onCategoryChange={setSelectedCategories}
            onClearAll={handleClearFilters}
          />
        </div>
      </div>

      {/* ============================================ */}
      {/* RESULTS INFO */}
      {/* ============================================ */}
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-gray-900">{filteredProducts.length}</span>
            {' '}productos encontrados
          </p>
          {activeFiltersCount > 0 && (
            <button
              onClick={handleClearFilters}
              className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      {/* ============================================ */}
      {/* CONTENT */}
      {/* ============================================ */}
      
      {viewMode === 'list' ? (
        /* LIST VIEW */
        <div className="px-4 py-4">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No encontramos productos
              </h3>
              <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                Intenta ajustar los filtros o ampliar el radio de búsqueda
              </p>
              <button
                onClick={handleClearFilters}
                className="px-6 py-3 bg-emerald-500 text-white rounded-xl font-medium hover:bg-emerald-600 transition-colors"
              >
                Limpiar filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  variant="default"
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        /* MAP VIEW */
        <div className="relative" style={{ height: 'calc(100vh - 280px)' }}>
          <ExploreMap
            products={filteredProducts}
            userLocation={userLocation}
            selectedProduct={selectedProduct}
            onProductSelect={setSelectedProduct}
            onRefreshLocation={getUserLocation}
          />
          
          {/* Floating Product Card */}
          {selectedProduct && (
            <div className="absolute bottom-4 left-4 right-4 z-10">
              <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md hover:bg-gray-100 z-10"
                >
                  <X className="w-4 h-4 text-gray-600" />
                </button>
                <ProductCard
                  product={selectedProduct}
                  variant="horizontal"
                />
              </div>
            </div>
          )}
          
          {/* Recenter Button */}
          <button
            onClick={getUserLocation}
            className="absolute top-4 right-4 p-3 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors z-10"
            title="Centrar en mi ubicación"
          >
            {userLocation.loading ? (
              <Loader2 className="w-5 h-5 text-emerald-600 animate-spin" />
            ) : (
              <Locate className="w-5 h-5 text-emerald-600" />
            )}
          </button>
        </div>
      )}

      {/* ============================================ */}
      {/* FILTER MODAL */}
      {/* ============================================ */}
      <FilterModal
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        selectedTypes={selectedTypes}
        selectedCategories={selectedCategories}
        maxDistance={maxDistance}
        priceRange={priceRange}
        minDiscount={minDiscount}
        onTypeChange={setSelectedTypes}
        onCategoryChange={setSelectedCategories}
        onDistanceChange={setMaxDistance}
        onPriceRangeChange={setPriceRange}
        onMinDiscountChange={setMinDiscount}
        onClearAll={handleClearFilters}
      />
    </div>
  )
}

export default ExplorePage
