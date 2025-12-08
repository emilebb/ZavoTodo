/**
 * ============================================
 * ZAVO - Product Filters Component
 * ============================================
 * 
 * Filtros horizontales estilo chips para
 * filtrar productos por tipo
 */

import { useState } from 'react'
import { 
  Gift, 
  ShoppingBag, 
  Zap, 
  Clock, 
  Sparkles,
  SlidersHorizontal,
  X
} from 'lucide-react'
import { 
  ProductType, 
  ProductCategory,
  PRODUCT_TYPE_LABELS,
  CATEGORY_LABELS
} from '../../types/products'

// ============================================
// TIPOS
// ============================================

interface ProductFiltersProps {
  selectedTypes: ProductType[]
  selectedCategories: ProductCategory[]
  onTypeChange: (types: ProductType[]) => void
  onCategoryChange: (categories: ProductCategory[]) => void
  onClearAll: () => void
  showCategories?: boolean
}

interface FilterChipProps {
  label: string
  icon?: React.ReactNode
  isActive: boolean
  onClick: () => void
  color?: string
}

// ============================================
// COMPONENTES AUXILIARES
// ============================================

const FilterChip: React.FC<FilterChipProps> = ({ 
  label, 
  icon, 
  isActive, 
  onClick,
  color = 'emerald'
}) => (
  <button
    onClick={onClick}
    className={`
      inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium
      whitespace-nowrap transition-all duration-200
      ${isActive 
        ? `bg-${color}-500 text-white shadow-lg shadow-${color}-500/30` 
        : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300 hover:bg-gray-50'
      }
    `}
  >
    {icon}
    <span>{label}</span>
  </button>
)

// ============================================
// DATOS DE FILTROS
// ============================================

const TYPE_FILTERS: { type: ProductType; icon: React.ReactNode; color: string }[] = [
  { type: 'mystery_bag', icon: <Gift className="w-4 h-4" />, color: 'purple' },
  { type: 'regular', icon: <ShoppingBag className="w-4 h-4" />, color: 'blue' },
  { type: 'daily_deal', icon: <Zap className="w-4 h-4" />, color: 'orange' },
  { type: 'expiring_soon', icon: <Clock className="w-4 h-4" />, color: 'red' },
  { type: 'seasonal', icon: <Sparkles className="w-4 h-4" />, color: 'emerald' },
]

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

const ProductFilters: React.FC<ProductFiltersProps> = ({
  selectedTypes,
  selectedCategories,
  onTypeChange,
  onCategoryChange,
  onClearAll,
  showCategories = false
}) => {
  const [showAllCategories, setShowAllCategories] = useState(false)
  
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
  
  const hasActiveFilters = selectedTypes.length > 0 || selectedCategories.length > 0
  
  const categories = Object.entries(CATEGORY_LABELS) as [ProductCategory, string][]

  return (
    <div className="space-y-4">
      {/* Type Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {/* All Button */}
        <button
          onClick={onClearAll}
          className={`
            inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium
            whitespace-nowrap transition-all duration-200
            ${!hasActiveFilters 
              ? 'bg-gray-900 text-white' 
              : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
            }
          `}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Todo</span>
        </button>
        
        {/* Type Chips */}
        {TYPE_FILTERS.map(({ type, icon, color }) => (
          <button
            key={type}
            onClick={() => handleTypeToggle(type)}
            className={`
              inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium
              whitespace-nowrap transition-all duration-200
              ${selectedTypes.includes(type)
                ? type === 'mystery_bag' ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30'
                : type === 'regular' ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                : type === 'daily_deal' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                : type === 'expiring_soon' ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
                : 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }
            `}
          >
            {icon}
            <span>{PRODUCT_TYPE_LABELS[type]}</span>
          </button>
        ))}
      </div>
      
      {/* Category Filters (Optional) */}
      {showCategories && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Categorías</span>
            <button
              onClick={() => setShowAllCategories(!showAllCategories)}
              className="text-sm text-emerald-600 hover:text-emerald-700"
            >
              {showAllCategories ? 'Ver menos' : 'Ver todas'}
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {(showAllCategories ? categories : categories.slice(0, 6)).map(([category, label]) => (
              <button
                key={category}
                onClick={() => handleCategoryToggle(category)}
                className={`
                  px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200
                  ${selectedCategories.includes(category)
                    ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }
                `}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-gray-500">Filtros activos:</span>
          
          {selectedTypes.map(type => (
            <span
              key={type}
              className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full text-xs"
            >
              {PRODUCT_TYPE_LABELS[type]}
              <button
                onClick={() => handleTypeToggle(type)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          
          {selectedCategories.map(category => (
            <span
              key={category}
              className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full text-xs"
            >
              {CATEGORY_LABELS[category]}
              <button
                onClick={() => handleCategoryToggle(category)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          
          <button
            onClick={onClearAll}
            className="text-xs text-red-500 hover:text-red-600 font-medium"
          >
            Limpiar todo
          </button>
        </div>
      )}
    </div>
  )
}

export default ProductFilters
