/**
 * ZAVO Type Definitions
 * Tipos centralizados para toda la aplicación
 * Preparados para integración con backend real
 */

// ============================================
// ENUMS & CONSTANTS
// ============================================

export type UserRole = 'usuario' | 'negocio'

export type OrderStatus = 'pendiente' | 'confirmado' | 'preparando' | 'listo' | 'entregado' | 'cancelado'

export type QRStatus = 'activo' | 'usado' | 'expirado'

export type PackCategory = 'panaderia' | 'restaurante' | 'cafe' | 'supermercado' | 'otro'

// ============================================
// CORE ENTITIES
// ============================================

/**
 * User - Usuario de la plataforma
 * TODO: Integrar con sistema de auth (Supabase/Firebase)
 */
export interface User {
  id: string
  email: string
  nombre: string
  rol: UserRole
  telefono?: string
  avatar_url?: string
  created_at: string
  updated_at?: string
}

/**
 * Business - Negocio aliado
 * TODO: Integrar con API de verificación de negocios
 */
export interface Business {
  id: string
  user_id: string
  nombre: string
  descripcion?: string
  direccion: string
  categoria?: PackCategory
  lat: number
  lng: number
  horario: string
  imagen?: string
  logo_url?: string
  rating?: number
  total_reviews?: number
  verificado?: boolean
  activo?: boolean
  created_at: string
  updated_at?: string
}

/**
 * Location - Coordenadas geográficas
 * TODO: Integrar con Google Maps API
 */
export interface Location {
  lat: number
  lng: number
  address?: string
  city?: string
  country?: string
}

/**
 * Pack - Pack sorpresa disponible
 * TODO: Integrar con sistema de inventario en tiempo real
 */
export interface Pack {
  id: string
  business_id: string
  titulo: string
  descripcion: string
  categoria?: PackCategory
  precio_original: number
  precio_descuento: number
  porcentaje_descuento: number
  stock: number
  hora_retiro_desde: string
  hora_retiro_hasta: string
  activo: boolean
  imagen_url?: string
  created_at: string
  updated_at?: string
  // Relaciones
  business?: Business
}

/**
 * Order - Pedido de un usuario
 * Sistema completo con QR y verificación
 */
export interface Order {
  id: string
  user_id: string
  pack_id: string
  business_id: string
  cantidad: number
  precio_total: number
  estado: OrderStatus
  qr_code?: string
  qr_data?: QRData
  notas?: string
  fecha_retiro?: string
  fecha_entrega?: string
  created_at: string
  updated_at?: string
  // Relaciones
  pack?: Pack
  user?: User
  business?: Business
}

/**
 * QRData - Datos del código QR
 */
export interface QRData {
  orderId: string
  userId: string
  businessId: string
  timestamp: string
  expiresAt: string
  status: QRStatus
}

/**
 * QRVerification - Resultado de verificación QR
 */
export interface QRVerification {
  valid: boolean
  order?: Order
  error?: string
  message: string
}

/**
 * OrderQRResponse - Respuesta al generar QR
 */
export interface OrderQRResponse {
  qrCode: string
  qrData: QRData
  order: Order
}

export interface AuthState {
  user: User | null
  loading: boolean
  initialized: boolean
}

export interface UIState {
  loading: boolean
  sidebarOpen: boolean
  theme: 'light' | 'dark'
}

export interface FilterState {
  searchText: string
  categoria: string
  radio: number
  ubicacion: {
    lat: number
    lng: number
  } | null
}
