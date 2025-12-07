/**
 * ============================================
 * ZAVO - Firebase Types
 * ============================================
 * 
 * Tipos TypeScript para todas las colecciones de Firestore
 * Estructura de datos completa para la aplicación
 */

import { Timestamp } from 'firebase/firestore'

// ============================================
// TIPOS BASE
// ============================================

/**
 * Coordenadas geográficas
 */
export interface Coordinate {
  lat: number
  lng: number
}

/**
 * Timestamp de Firestore o Date
 */
export type FirebaseTimestamp = Timestamp | Date | string

// ============================================
// USUARIOS (users)
// ============================================

/**
 * Roles de usuario en la aplicación
 */
export type UserRole = 'cliente' | 'admin' | 'repartidor'

/**
 * Usuario en Firestore
 * Colección: users/{userId}
 */
export interface FirebaseUser {
  id: string
  name: string
  email: string
  phone?: string
  avatar_url?: string
  role: UserRole
  // Dirección de entrega por defecto
  default_address?: {
    street: string
    city: string
    coordinates?: Coordinate
  }
  // Metadata
  created_at: FirebaseTimestamp
  updated_at?: FirebaseTimestamp
  last_login?: FirebaseTimestamp
  // Estado
  is_active: boolean
  fcm_token?: string // Para notificaciones push
}

/**
 * Datos para crear un nuevo usuario
 */
export type CreateUserData = Omit<FirebaseUser, 'id' | 'created_at' | 'updated_at'>

// ============================================
// PRODUCTOS (products)
// ============================================

/**
 * Categorías de productos
 */
export type ProductCategory = 
  | 'panaderia' 
  | 'restaurante' 
  | 'cafe' 
  | 'supermercado' 
  | 'frutas' 
  | 'otro'

/**
 * Producto en Firestore
 * Colección: products/{productId}
 */
export interface Product {
  id: string
  name: string
  description: string
  price: number
  original_price?: number // Precio original (si hay descuento)
  discount_percentage?: number
  stock: number
  image_url: string
  images?: string[] // Imágenes adicionales
  category: ProductCategory
  // Negocio que vende el producto
  business_id: string
  business_name: string
  // Disponibilidad
  is_available: boolean
  available_from?: string // Hora de inicio "17:00"
  available_until?: string // Hora de fin "20:00"
  // Metadata
  created_at: FirebaseTimestamp
  updated_at?: FirebaseTimestamp
  // Stats
  total_sold?: number
  rating?: number
  reviews_count?: number
}

/**
 * Datos para crear un nuevo producto
 */
export type CreateProductData = Omit<Product, 'id' | 'created_at' | 'updated_at' | 'total_sold'>

// ============================================
// PEDIDOS (orders)
// ============================================

/**
 * Estados posibles de un pedido
 */
export type OrderStatus = 
  | 'pending'      // Pendiente de confirmación
  | 'confirmed'    // Confirmado por el negocio
  | 'preparing'    // En preparación
  | 'ready'        // Listo para recoger
  | 'picked_up'    // Recogido por repartidor
  | 'delivering'   // En camino
  | 'delivered'    // Entregado
  | 'completed'    // Completado
  | 'cancelled'    // Cancelado

/**
 * Pedido en Firestore
 * Colección: orders/{orderId}
 */
export interface Order {
  id: string
  // Referencias
  user_id: string
  user_name: string
  user_phone?: string
  business_id: string
  business_name: string
  driver_id?: string
  driver_name?: string
  // Estado
  status: OrderStatus
  // Totales
  subtotal: number
  delivery_fee: number
  discount?: number
  total: number
  // Direcciones
  pickup_address: string
  pickup_coordinates: Coordinate
  delivery_address: string
  delivery_coordinates: Coordinate
  // Tiempos
  estimated_delivery?: FirebaseTimestamp
  actual_delivery?: FirebaseTimestamp
  // Metadata
  created_at: FirebaseTimestamp
  updated_at?: FirebaseTimestamp
  confirmed_at?: FirebaseTimestamp
  preparing_at?: FirebaseTimestamp
  ready_at?: FirebaseTimestamp
  picked_up_at?: FirebaseTimestamp
  delivered_at?: FirebaseTimestamp
  cancelled_at?: FirebaseTimestamp
  cancellation_reason?: string
  // Notas
  notes?: string
  // QR para verificación
  qr_code?: string
}

/**
 * Item de un pedido
 * Subcolección: orders/{orderId}/order_items/{itemId}
 */
export interface OrderItem {
  id: string
  product_id: string
  product_name: string
  product_image?: string
  quantity: number
  unit_price: number
  total_price: number
}

/**
 * Ubicación del repartidor (tracking)
 * Subcolección: orders/{orderId}/order_locations/{locationId}
 */
export interface OrderLocation {
  id: string
  lat: number
  lng: number
  accuracy?: number
  heading?: number // Dirección en grados
  speed?: number // Velocidad en m/s
  timestamp: FirebaseTimestamp
}

/**
 * Datos para crear un nuevo pedido
 */
export type CreateOrderData = Omit<Order, 'id' | 'created_at' | 'updated_at'>

// ============================================
// NOTIFICACIONES (notifications)
// ============================================

/**
 * Tipos de notificación
 */
export type NotificationType = 
  | 'order_confirmed'
  | 'order_preparing'
  | 'order_ready'
  | 'order_picked_up'
  | 'order_delivering'
  | 'order_delivered'
  | 'order_cancelled'
  | 'promotion'
  | 'system'

/**
 * Notificación en Firestore
 * Colección: notifications/{notificationId}
 */
export interface Notification {
  id: string
  user_id: string
  type: NotificationType
  title: string
  message: string
  // Datos adicionales
  data?: {
    order_id?: string
    product_id?: string
    url?: string
  }
  // Estado
  is_read: boolean
  read_at?: FirebaseTimestamp
  // Metadata
  created_at: FirebaseTimestamp
}

/**
 * Datos para crear una notificación
 */
export type CreateNotificationData = Omit<Notification, 'id' | 'created_at' | 'is_read' | 'read_at'>

// ============================================
// NEGOCIOS (businesses)
// ============================================

/**
 * Negocio/Tienda en Firestore
 * Colección: businesses/{businessId}
 */
export interface Business {
  id: string
  name: string
  description?: string
  logo_url?: string
  cover_url?: string
  // Contacto
  email: string
  phone: string
  // Ubicación
  address: string
  city: string
  coordinates: Coordinate
  // Horarios
  opening_hours: {
    [day: string]: {
      open: string
      close: string
      is_closed?: boolean
    }
  }
  // Categoría
  category: ProductCategory
  // Estado
  is_active: boolean
  is_verified: boolean
  // Stats
  rating?: number
  reviews_count?: number
  total_orders?: number
  // Metadata
  owner_id: string
  created_at: FirebaseTimestamp
  updated_at?: FirebaseTimestamp
}

// ============================================
// HELPERS DE CONVERSIÓN
// ============================================

/**
 * Convierte un Timestamp de Firestore a Date
 */
export function toDate(timestamp: FirebaseTimestamp): Date {
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate()
  }
  if (timestamp instanceof Date) {
    return timestamp
  }
  return new Date(timestamp)
}

/**
 * Convierte un Timestamp a string ISO
 */
export function toISOString(timestamp: FirebaseTimestamp): string {
  return toDate(timestamp).toISOString()
}

/**
 * Formatea un timestamp para mostrar
 */
export function formatTimestamp(timestamp: FirebaseTimestamp): string {
  const date = toDate(timestamp)
  return new Intl.DateTimeFormat('es-CO', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

// ============================================
// CONSTANTES
// ============================================

/**
 * Nombres de colecciones en Firestore
 */
export const COLLECTIONS = {
  USERS: 'users',
  PRODUCTS: 'products',
  ORDERS: 'orders',
  ORDER_ITEMS: 'order_items',
  ORDER_LOCATIONS: 'order_locations',
  NOTIFICATIONS: 'notifications',
  BUSINESSES: 'businesses',
} as const

/**
 * Labels de estados de pedido
 */
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Pendiente',
  confirmed: 'Confirmado',
  preparing: 'Preparando',
  ready: 'Listo',
  picked_up: 'Recogido',
  delivering: 'En camino',
  delivered: 'Entregado',
  completed: 'Completado',
  cancelled: 'Cancelado',
}

/**
 * Colores de estados de pedido
 */
export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  preparing: 'bg-orange-100 text-orange-800',
  ready: 'bg-teal-100 text-teal-800',
  picked_up: 'bg-indigo-100 text-indigo-800',
  delivering: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
}
