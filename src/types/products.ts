/**
 * ============================================
 * ZAVO - Product Types System
 * ============================================
 * 
 * Sistema de productos expandido:
 * - Mystery Bags (Bolsas sorpresa)
 * - Regular Products (Productos normales)
 * - Daily Deals (Promociones del día)
 * - Expiring Soon (Próximos a vencer)
 * - Seasonal Packs (Paquetes de temporada)
 */

// ============================================
// ENUMS
// ============================================

export type ProductType = 
  | 'mystery_bag'      // Bolsa sorpresa estilo Too Good To Go
  | 'regular'          // Producto normal con descuento
  | 'daily_deal'       // Promoción del día (tiempo limitado)
  | 'expiring_soon'    // Próximo a vencer (descuento agresivo)
  | 'seasonal'         // Paquete de temporada

export type ProductCategory =
  | 'panaderia'
  | 'restaurante'
  | 'cafe'
  | 'supermercado'
  | 'frutas_verduras'
  | 'lacteos'
  | 'carnes'
  | 'comida_preparada'
  | 'postres'
  | 'bebidas'
  | 'snacks'
  | 'otro'

export type ProductStatus = 
  | 'active'           // Disponible para compra
  | 'sold_out'         // Agotado
  | 'scheduled'        // Programado para futuro
  | 'expired'          // Expirado
  | 'draft'            // Borrador (no publicado)

// ============================================
// INTERFACES BASE
// ============================================

export interface ProductBase {
  id: string
  businessId: string
  businessName: string
  businessLogo?: string
  
  // Información básica
  name: string
  description: string
  type: ProductType
  category: ProductCategory
  status: ProductStatus
  
  // Precios
  originalPrice: number
  discountPrice: number
  discountPercentage: number
  
  // Stock
  quantity: number
  quantitySold: number
  maxPerUser?: number
  
  // Imágenes
  images: string[]
  thumbnail?: string
  
  // Ubicación
  location: {
    address: string
    lat: number
    lng: number
    distance?: number // Calculado dinámicamente
  }
  
  // Horarios de recogida
  pickupWindow: {
    start: string  // "17:00"
    end: string    // "20:00"
  }
  
  // Fechas
  createdAt: string
  updatedAt: string
  expiresAt?: string  // Para productos con fecha límite
  
  // Metadata
  tags?: string[]
  allergens?: string[]
  isVegetarian?: boolean
  isVegan?: boolean
  isGlutenFree?: boolean
  
  // Ratings
  rating?: number
  reviewCount?: number
}

// ============================================
// TIPOS ESPECÍFICOS DE PRODUCTOS
// ============================================

/**
 * Mystery Bag - Bolsa Sorpresa
 * El contenido es desconocido, solo se sabe la categoría
 */
export interface MysteryBag extends ProductBase {
  type: 'mystery_bag'
  
  // Específico de Mystery Bag
  mysteryDetails: {
    estimatedItems: number      // "3-5 productos"
    estimatedValue: number      // Valor estimado del contenido
    surpriseLevel: 'low' | 'medium' | 'high'  // Qué tan sorpresa es
    possibleContents?: string[] // Posibles contenidos (opcional)
  }
}

/**
 * Regular Product - Producto Normal
 * Producto específico con descuento
 */
export interface RegularProduct extends ProductBase {
  type: 'regular'
  
  // Específico de producto regular
  productDetails: {
    brand?: string
    weight?: string           // "500g", "1L"
    unit?: string             // "unidad", "kg", "litro"
    sku?: string
    barcode?: string
    expirationDate?: string   // Fecha de vencimiento
  }
}

/**
 * Daily Deal - Promoción del Día
 * Oferta especial por tiempo limitado
 */
export interface DailyDeal extends ProductBase {
  type: 'daily_deal'
  
  // Específico de promoción del día
  dealDetails: {
    dealStartTime: string     // Hora de inicio
    dealEndTime: string       // Hora de fin
    isFlashSale: boolean      // Es venta relámpago
    countdown?: number        // Segundos restantes
    originalStock: number     // Stock original
    urgencyLevel: 'low' | 'medium' | 'high' | 'critical'
  }
}

/**
 * Expiring Soon - Próximo a Vencer
 * Productos con fecha de vencimiento cercana
 */
export interface ExpiringSoon extends ProductBase {
  type: 'expiring_soon'
  
  // Específico de próximo a vencer
  expiringDetails: {
    expirationDate: string    // Fecha exacta de vencimiento
    daysUntilExpiry: number   // Días hasta vencer
    freshness: 'fresh' | 'good' | 'consume_soon' | 'last_day'
    qualityGuarantee: boolean // Garantía de calidad
  }
}

/**
 * Seasonal Pack - Paquete de Temporada
 * Ofertas especiales por temporada/festividad
 */
export interface SeasonalPack extends ProductBase {
  type: 'seasonal'
  
  // Específico de temporada
  seasonalDetails: {
    season: string            // "navidad", "halloween", "verano"
    theme: string             // Tema del paquete
    availableFrom: string     // Fecha de inicio
    availableUntil: string    // Fecha de fin
    isLimitedEdition: boolean
    includedItems?: string[]  // Lista de productos incluidos
  }
}

// ============================================
// UNION TYPE
// ============================================

export type Product = 
  | MysteryBag 
  | RegularProduct 
  | DailyDeal 
  | ExpiringSoon 
  | SeasonalPack

// ============================================
// HELPERS & UTILITIES
// ============================================

export interface ProductFilters {
  type?: ProductType[]
  category?: ProductCategory[]
  minPrice?: number
  maxPrice?: number
  minDiscount?: number
  maxDistance?: number
  isVegetarian?: boolean
  isVegan?: boolean
  isGlutenFree?: boolean
  availableNow?: boolean
  sortBy?: 'distance' | 'price' | 'discount' | 'rating' | 'expiring'
  sortOrder?: 'asc' | 'desc'
}

export interface ProductSearchResult {
  products: Product[]
  total: number
  page: number
  limit: number
  hasMore: boolean
  filters: ProductFilters
}

// ============================================
// DISPLAY HELPERS
// ============================================

export const PRODUCT_TYPE_LABELS: Record<ProductType, string> = {
  mystery_bag: 'Bolsa Sorpresa',
  regular: 'Producto',
  daily_deal: 'Oferta del Día',
  expiring_soon: 'Próximo a Vencer',
  seasonal: 'Temporada'
}

export const PRODUCT_TYPE_ICONS: Record<ProductType, string> = {
  mystery_bag: '🎁',
  regular: '🛒',
  daily_deal: '⚡',
  expiring_soon: '⏰',
  seasonal: '🎄'
}

export const PRODUCT_TYPE_COLORS: Record<ProductType, { bg: string; text: string; border: string }> = {
  mystery_bag: { 
    bg: 'bg-purple-50', 
    text: 'text-purple-700', 
    border: 'border-purple-200' 
  },
  regular: { 
    bg: 'bg-blue-50', 
    text: 'text-blue-700', 
    border: 'border-blue-200' 
  },
  daily_deal: { 
    bg: 'bg-orange-50', 
    text: 'text-orange-700', 
    border: 'border-orange-200' 
  },
  expiring_soon: { 
    bg: 'bg-red-50', 
    text: 'text-red-700', 
    border: 'border-red-200' 
  },
  seasonal: { 
    bg: 'bg-emerald-50', 
    text: 'text-emerald-700', 
    border: 'border-emerald-200' 
  }
}

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  panaderia: 'Panadería',
  restaurante: 'Restaurante',
  cafe: 'Café',
  supermercado: 'Supermercado',
  frutas_verduras: 'Frutas y Verduras',
  lacteos: 'Lácteos',
  carnes: 'Carnes',
  comida_preparada: 'Comida Preparada',
  postres: 'Postres',
  bebidas: 'Bebidas',
  snacks: 'Snacks',
  otro: 'Otro'
}

export const CATEGORY_ICONS: Record<ProductCategory, string> = {
  panaderia: '🥖',
  restaurante: '🍽️',
  cafe: '☕',
  supermercado: '🛒',
  frutas_verduras: '🥬',
  lacteos: '🥛',
  carnes: '🥩',
  comida_preparada: '🍱',
  postres: '🍰',
  bebidas: '🥤',
  snacks: '🍿',
  otro: '📦'
}
