/**
 * ============================================
 * ZAVO - Filter Modal Component
 * ============================================
 * 
 * Modal de filtros avanzados estilo Uber Eats
 */

import { useState, useEffect } from 'react'
import { 
  X, 
  MapPin, 
  DollarSign, 
  Percent, 
  Tag,
  RotateCcw,
  Check
} from 'lucide-react'
import { 
  ProductType, 
  ProductCategory,
  PRODUCT_TYPE_LABELS,
  PRODUCT_TYPE_ICONS,
  CATEGORY_LABELS,
  CATEGORY_ICONS
} from '../../types/products'

// ============================================
// TIPOS
// ============================================

interface FilterModalProps {
  isOpen: boolean
  onClose: () => void
  selectedTypes: ProductType[]
  selectedCategories: ProductCategory[]
  maxDistance: number
  priceRange: [number, number]
  minDiscount: number
  onTypeChange: (types: ProductType[]) => void
  onCategoryChange: (categories: ProductCategory[]) => void
  onDistanceChange: (distance: number) => void
  onPriceRangeChange: (range: [number, number]) => void
  onMinDiscountChange: (discount: number) => void
  onClearAll: () => void
}

// ============================================
// CONSTANTES
// ============================================

const DISTANCE_OPTIONS = [
  { value: 0.5, label: '500m' },
  { value: 1, label: '1 km' },
  { value: 2, label: '2 km' },
  { value: 5, label: '5 km' },
  { value: 10, label: '10 km' },
  { value: 20, label: '20 km' }
]

const PRICE_PRESETS = [
  { min: 0, max: 10000, label: 'Hasta $10.000' },
  { min: 0, max: 20000, label: 'Hasta $20.000' },
  { min: 0, max: 50000, label: 'Hasta $50.000' },
  { min: 0, max: 100000, label: 'Cualquier precio' }
]

const DISCOUNT_OPTIONS = [
  { value: 0, label: 'Cualquiera' },
  { value: 20, label: '20% o más' },
  { value: 30, label: '30% o más' },
  { value: 50, label: '50% o más' }
]

const PRODUCT_TYPES: ProductType[] = [
  'mystery_bag',
  'regular',
  'daily_deal',
  'expiring_soon',
  'seasonal'
]

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  selectedTypes,
  selectedCategories,
  maxDistance,
  priceRange,
  minDiscount,
  onTypeChange,
  onCategoryChange,
  onDistanceChange,
  onPriceRangeChange,
  onMinDiscountChange,
  onClearAll
}) => {
  // Estado para secciones expandibles (futuro uso)
  // const [activeSection, setActiveSection] = useState<string>('type')

  // Cerrar con ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEsc)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleTypeToggle = (type: ProductType) => {
    if (selectedTypes.includes(type)) {
      onTypeChange(selectedTypes.filter(t => t !== type))
    } else {
      onTypeChange([...selectedTypes, type])
    }
  }

  const handleCategoryToggle = (category: ProductCategory) => {
    if (selectedCategories.includes(category)) {
      onCategoryChange(selectedCategories.filter(c => c !== category))
    } else {
      onCategoryChange([...selectedCategories, category])
    }
  }

  const categories = Object.entries(CATEGORY_LABELS) as [ProductCategory, string][]

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl max-h-[90vh] overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onClearAll}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
            >
              <RotateCcw className="w-4 h-4" />
              Limpiar
            </button>
          </div>
          
          <h2 className="text-lg font-bold text-gray-900">Filtros</h2>
          
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)] px-6 py-4 space-y-8">
          
          {/* Tipo de Producto */}
          <section>
            <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-4">
              <Tag className="w-4 h-4" />
              Tipo de producto
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {PRODUCT_TYPES.map(type => {
                const isSelected = selectedTypes.includes(type)
                return (
                  <button
                    key={type}
                    onClick={() => handleTypeToggle(type)}
                    className={`
                      flex items-center gap-3 p-4 rounded-xl border-2 transition-all
                      ${isSelected 
                        ? 'border-emerald-500 bg-emerald-50' 
                        : 'border-gray-200 hover:border-gray-300'
                      }
                    `}
                  >
                    <span className="text-2xl">{PRODUCT_TYPE_ICONS[type]}</span>
                    <span className={`text-sm font-medium ${isSelected ? 'text-emerald-700' : 'text-gray-700'}`}>
                      {PRODUCT_TYPE_LABELS[type]}
                    </span>
                    {isSelected && (
                      <Check className="w-4 h-4 text-emerald-600 ml-auto" />
                    )}
                  </button>
                )
              })}
            </div>
          </section>

          {/* Distancia */}
          <section>
            <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-4">
              <MapPin className="w-4 h-4" />
              Distancia máxima
            </h3>
            <div className="flex flex-wrap gap-2">
              {DISTANCE_OPTIONS.map(option => (
                <button
                  key={option.value}
                  onClick={() => onDistanceChange(option.value)}
                  className={`
                    px-4 py-2.5 rounded-full text-sm font-medium transition-all
                    ${maxDistance === option.value
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }
                  `}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </section>

          {/* Precio */}
          <section>
            <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-4">
              <DollarSign className="w-4 h-4" />
              Rango de precio
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {PRICE_PRESETS.map((preset, index) => {
                const isSelected = priceRange[0] === preset.min && priceRange[1] === preset.max
                return (
                  <button
                    key={index}
                    onClick={() => onPriceRangeChange([preset.min, preset.max])}
                    className={`
                      p-4 rounded-xl border-2 text-sm font-medium transition-all
                      ${isSelected
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                      }
                    `}
                  >
                    {preset.label}
                  </button>
                )
              })}
            </div>
          </section>

          {/* Descuento Mínimo */}
          <section>
            <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-4">
              <Percent className="w-4 h-4" />
              Descuento mínimo
            </h3>
            <div className="flex flex-wrap gap-2">
              {DISCOUNT_OPTIONS.map(option => (
                <button
                  key={option.value}
                  onClick={() => onMinDiscountChange(option.value)}
                  className={`
                    px-4 py-2.5 rounded-full text-sm font-medium transition-all
                    ${minDiscount === option.value
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }
                  `}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </section>

          {/* Categorías */}
          <section>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
              Categorías
            </h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {categories.map(([category, label]) => {
                const isSelected = selectedCategories.includes(category)
                return (
                  <button
                    key={category}
                    onClick={() => handleCategoryToggle(category)}
                    className={`
                      flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all
                      ${isSelected
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-gray-200 hover:border-gray-300'
                      }
                    `}
                  >
                    <span className="text-2xl">{CATEGORY_ICONS[category]}</span>
                    <span className={`text-xs font-medium text-center ${isSelected ? 'text-emerald-700' : 'text-gray-600'}`}>
                      {label}
                    </span>
                  </button>
                )
              })}
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 safe-area-bottom">
          <button
            onClick={onClose}
            className="w-full py-4 bg-emerald-500 text-white rounded-xl font-semibold hover:bg-emerald-600 transition-colors"
          >
            Aplicar filtros
          </button>
        </div>
      </div>

      {/* Animación CSS */}
      <style>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
        .safe-area-bottom {
          padding-bottom: max(1rem, env(safe-area-inset-bottom));
        }
      `}</style>
    </>
  )
}

export default FilterModal
