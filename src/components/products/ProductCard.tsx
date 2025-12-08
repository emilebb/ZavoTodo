/**
 * ============================================
 * ZAVO - Product Card Component
 * ============================================
 * 
 * Tarjeta de producto universal que se adapta
 * a los diferentes tipos de productos:
 * - Mystery Bag
 * - Regular Product
 * - Daily Deal
 * - Expiring Soon
 * - Seasonal Pack
 */

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  MapPin, 
  Clock, 
  Star, 
  ShoppingBag,
  Zap,
  Gift,
  Calendar,
  AlertTriangle,
  Sparkles,
  Heart,
  ChevronRight
} from 'lucide-react'
import { 
  Product, 
  ProductType,
  PRODUCT_TYPE_LABELS,
  PRODUCT_TYPE_ICONS,
  PRODUCT_TYPE_COLORS,
  CATEGORY_ICONS
} from '../../types/products'

// ============================================
// TIPOS
// ============================================

interface ProductCardProps {
  product: Product
  variant?: 'default' | 'compact' | 'horizontal' | 'featured'
  showBusiness?: boolean
  onAddToCart?: (product: Product) => void
  onFavorite?: (product: Product) => void
}

// ============================================
// COMPONENTES AUXILIARES
// ============================================

const TypeBadge: React.FC<{ type: ProductType }> = ({ type }) => {
  const colors = PRODUCT_TYPE_COLORS[type]
  const icon = PRODUCT_TYPE_ICONS[type]
  const label = PRODUCT_TYPE_LABELS[type]
  
  return (
    <span className={`
      inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold
      ${colors.bg} ${colors.text}
    `}>
      <span>{icon}</span>
      <span>{label}</span>
    </span>
  )
}

const DiscountBadge: React.FC<{ percentage: number }> = ({ percentage }) => (
  <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg">
    -{percentage}%
  </span>
)

const UrgencyIndicator: React.FC<{ 
  type: ProductType
  product: Product 
}> = ({ type, product }) => {
  if (type === 'daily_deal') {
    const deal = product as any
    return (
      <div className="flex items-center gap-1 text-orange-600 text-xs font-medium">
        <Zap className="w-3.5 h-3.5" />
        <span>Termina pronto</span>
      </div>
    )
  }
  
  if (type === 'expiring_soon') {
    const expiring = product as any
    const days = expiring.expiringDetails?.daysUntilExpiry || 0
    return (
      <div className="flex items-center gap-1 text-red-600 text-xs font-medium">
        <AlertTriangle className="w-3.5 h-3.5" />
        <span>{days === 0 ? 'Último día' : `${days} días`}</span>
      </div>
    )
  }
  
  if (type === 'mystery_bag') {
    return (
      <div className="flex items-center gap-1 text-purple-600 text-xs font-medium">
        <Gift className="w-3.5 h-3.5" />
        <span>Sorpresa</span>
      </div>
    )
  }
  
  if (type === 'seasonal') {
    return (
      <div className="flex items-center gap-1 text-emerald-600 text-xs font-medium">
        <Sparkles className="w-3.5 h-3.5" />
        <span>Edición limitada</span>
      </div>
    )
  }
  
  return null
}

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  variant = 'default',
  showBusiness = true,
  onAddToCart,
  onFavorite
}) => {
  const [isFavorite, setIsFavorite] = useState(false)
  const [imageError, setImageError] = useState(false)
  
  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsFavorite(!isFavorite)
    onFavorite?.(product)
  }
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onAddToCart?.(product)
  }
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price)
  }
  
  const getStockStatus = () => {
    const remaining = product.quantity - product.quantitySold
    if (remaining === 0) return { text: 'Agotado', color: 'text-red-600', urgent: true }
    if (remaining <= 3) return { text: `¡Solo ${remaining}!`, color: 'text-orange-600', urgent: true }
    if (remaining <= 10) return { text: `${remaining} disponibles`, color: 'text-yellow-600', urgent: false }
    return { text: 'Disponible', color: 'text-green-600', urgent: false }
  }
  
  const stockStatus = getStockStatus()
  const isAvailable = product.quantity - product.quantitySold > 0

  // ============================================
  // RENDER - VARIANTE COMPACTA
  // ============================================
  
  if (variant === 'compact') {
    return (
      <Link 
        to={`/producto/${product.id}`}
        className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-200"
      >
        {/* Imagen */}
        <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
          {!imageError && product.images?.[0] ? (
            <img 
              src={product.images[0]} 
              alt={product.name}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <span className="text-2xl">{CATEGORY_ICONS[product.category]}</span>
            </div>
          )}
          {product.discountPercentage >= 30 && (
            <span className="absolute top-1 left-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
              -{product.discountPercentage}%
            </span>
          )}
        </div>
        
        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">{product.name}</p>
          <p className="text-xs text-gray-500 truncate">{product.businessName}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm font-bold text-emerald-600">{formatPrice(product.discountPrice)}</span>
            <span className="text-xs text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
          </div>
        </div>
        
        <ChevronRight className="w-4 h-4 text-gray-400" />
      </Link>
    )
  }

  // ============================================
  // RENDER - VARIANTE HORIZONTAL
  // ============================================
  
  if (variant === 'horizontal') {
    return (
      <Link 
        to={`/producto/${product.id}`}
        className="flex bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group"
      >
        {/* Imagen */}
        <div className="relative w-32 sm:w-40 flex-shrink-0">
          {!imageError && product.images?.[0] ? (
            <img 
              src={product.images[0]} 
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <span className="text-4xl">{CATEGORY_ICONS[product.category]}</span>
            </div>
          )}
          <DiscountBadge percentage={product.discountPercentage} />
        </div>
        
        {/* Content */}
        <div className="flex-1 p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-2 mb-2">
              <TypeBadge type={product.type} />
              <UrgencyIndicator type={product.type} product={product} />
            </div>
            
            <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1 group-hover:text-emerald-600 transition-colors">
              {product.name}
            </h3>
            
            {showBusiness && (
              <p className="text-sm text-gray-500 mb-2">{product.businessName}</p>
            )}
            
            <p className="text-xs text-gray-600 line-clamp-2">{product.description}</p>
          </div>
          
          <div className="flex items-end justify-between mt-3">
            <div>
              <span className="text-lg font-bold text-emerald-600">{formatPrice(product.discountPrice)}</span>
              <span className="text-sm text-gray-400 line-through ml-2">{formatPrice(product.originalPrice)}</span>
            </div>
            
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Clock className="w-3.5 h-3.5" />
              <span>{product.pickupWindow.start} - {product.pickupWindow.end}</span>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  // ============================================
  // RENDER - VARIANTE DESTACADA
  // ============================================
  
  if (variant === 'featured') {
    return (
      <Link 
        to={`/producto/${product.id}`}
        className="relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 group"
      >
        {/* Imagen Grande */}
        <div className="relative h-64 sm:h-80">
          {!imageError && product.images?.[0] ? (
            <img 
              src={product.images[0]} 
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
              <span className="text-8xl opacity-50">{CATEGORY_ICONS[product.category]}</span>
            </div>
          )}
          
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          
          {/* Top Badges */}
          <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
            <TypeBadge type={product.type} />
            <button 
              onClick={handleFavorite}
              className={`p-2 rounded-full backdrop-blur-md transition-all duration-200 ${
                isFavorite 
                  ? 'bg-red-500 text-white' 
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          </div>
          
          {/* Discount Badge */}
          <div className="absolute top-4 right-16">
            <span className="bg-red-500 text-white text-sm font-bold px-3 py-1.5 rounded-full shadow-lg">
              -{product.discountPercentage}%
            </span>
          </div>
          
          {/* Bottom Content */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h3 className="text-2xl font-bold mb-2">{product.name}</h3>
            
            <div className="flex items-center gap-4 mb-3">
              {showBusiness && (
                <span className="text-white/80">{product.businessName}</span>
              )}
              {product.rating && (
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>{product.rating.toFixed(1)}</span>
                </div>
              )}
            </div>
            
            <div className="flex items-end justify-between">
              <div>
                <span className="text-3xl font-bold">{formatPrice(product.discountPrice)}</span>
                <span className="text-lg text-white/60 line-through ml-3">{formatPrice(product.originalPrice)}</span>
              </div>
              
              <button
                onClick={handleAddToCart}
                disabled={!isAvailable}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  isAvailable
                    ? 'bg-white text-emerald-600 hover:bg-emerald-50'
                    : 'bg-gray-400 text-white cursor-not-allowed'
                }`}
              >
                {isAvailable ? 'Agregar' : 'Agotado'}
              </button>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  // ============================================
  // RENDER - VARIANTE DEFAULT
  // ============================================
  
  return (
    <Link 
      to={`/producto/${product.id}`}
      className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:border-gray-200 transition-all duration-300 group"
    >
      {/* Imagen */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {!imageError && product.images?.[0] ? (
          <img 
            src={product.images[0]} 
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <span className="text-5xl">{CATEGORY_ICONS[product.category]}</span>
          </div>
        )}
        
        {/* Discount Badge */}
        <DiscountBadge percentage={product.discountPercentage} />
        
        {/* Favorite Button */}
        <button 
          onClick={handleFavorite}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all duration-200 ${
            isFavorite 
              ? 'bg-red-500 text-white' 
              : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-500'
          }`}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>
        
        {/* Stock Status */}
        {stockStatus.urgent && (
          <div className={`absolute bottom-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold bg-white/90 backdrop-blur-sm ${stockStatus.color}`}>
            {stockStatus.text}
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="p-4">
        {/* Type Badge & Urgency */}
        <div className="flex items-center justify-between mb-3">
          <TypeBadge type={product.type} />
          <UrgencyIndicator type={product.type} product={product} />
        </div>
        
        {/* Title */}
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1 group-hover:text-emerald-600 transition-colors">
          {product.name}
        </h3>
        
        {/* Business */}
        {showBusiness && (
          <p className="text-sm text-gray-500 mb-2 truncate">{product.businessName}</p>
        )}
        
        {/* Description */}
        <p className="text-xs text-gray-600 line-clamp-2 mb-3">{product.description}</p>
        
        {/* Location & Time */}
        <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
          {product.location.distance && (
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>{product.location.distance.toFixed(1)} km</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{product.pickupWindow.start} - {product.pickupWindow.end}</span>
          </div>
        </div>
        
        {/* Price & Action */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div>
            <span className="text-lg font-bold text-emerald-600">{formatPrice(product.discountPrice)}</span>
            <span className="text-sm text-gray-400 line-through ml-2">{formatPrice(product.originalPrice)}</span>
          </div>
          
          <button
            onClick={handleAddToCart}
            disabled={!isAvailable}
            className={`p-2.5 rounded-xl transition-all duration-200 ${
              isAvailable
                ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            <ShoppingBag className="w-5 h-5" />
          </button>
        </div>
      </div>
    </Link>
  )
}

export default ProductCard
