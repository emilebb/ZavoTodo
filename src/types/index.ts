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
 * User - Usuario del sistema (cliente)
 */
export interface User {
  id: string
  name: string
  email: string
  role: 'user' | 'business' | 'admin'
  phone?: string
  avatar?: string
  verified: boolean
  active: boolean
  created_at: string
  updated_at?: string
  
  // Campos específicos para usuarios
  dateOfBirth?: string
  preferences?: {
    notifications: boolean
    marketing: boolean
    categories: string[]
  }
}

/**
 * Business - Negocio/Restaurante
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

// ============================================
// REGISTRATION TYPES
// ============================================

/**
 * RegisterUserData - Datos para registro de usuario
 */
export interface RegisterUserData {
  name: string
  email: string
  password: string
  phone?: string
  dateOfBirth?: string
  acceptTerms: boolean
  acceptMarketing?: boolean
}

/**
 * RegisterBusinessData - Datos para registro de negocio
 */
export interface RegisterBusinessData {
  // Datos del administrador
  adminName: string
  adminEmail: string
  adminPassword: string
  adminPhone?: string
  
  // Datos del negocio
  businessName: string
  businessEmail?: string
  businessPhone: string
  address: string
  category: string
  description?: string
  
  // Información legal
  nit?: string
  legalName?: string
  
  // Términos
  acceptTerms: boolean
  acceptBusinessTerms: boolean
}

/**
 * BusinessProfile - Perfil completo del negocio
 */
export interface BusinessProfile {
  id: string
  userId: string // ID del usuario que administra el negocio
  businessName: string
  email: string
  phone: string
  address: string
  category: string
  description?: string
  
  // Información legal
  nit?: string
  legalName?: string
  
  // Ubicación
  lat?: number
  lng?: number
  
  // Configuración
  logo?: string
  coverImage?: string
  rating: number
  verified: boolean
  active: boolean
  
  // Horarios
  schedule?: {
    [key: string]: {
      open: string
      close: string
      isOpen: boolean
    }
  }
  
  // Timestamps
  created_at: string
  updated_at?: string
}
