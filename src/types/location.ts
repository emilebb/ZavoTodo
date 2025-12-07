/**
 * ZAVO Location & Tracking Types
 * Tipos para el sistema de mapa y tracking en tiempo real
 */

// ============================================
// COORDENADAS Y UBICACIÓN
// ============================================

export interface Coordinate {
  lat: number
  lng: number
}

export interface Address {
  street: string
  city: string
  postalCode?: string
  country?: string
  formatted: string
}

// ============================================
// RESTAURANTE / NEGOCIO EN MAPA
// ============================================

export interface Restaurant {
  id: string
  name: string
  location: Coordinate
  address: Address
  rating: number
  totalReviews: number
  category: 'panaderia' | 'restaurante' | 'cafe' | 'supermercado' | 'otro'
  imageUrl?: string
  isOpen: boolean
  packCount: number // Packs disponibles
}

// ============================================
// COURIER / REPARTIDOR
// ============================================

export type VehicleType = 'bike' | 'moto' | 'car' | 'walk'

export type CourierStatus = 'idle' | 'assigned' | 'picking_up' | 'delivering'

export interface Courier {
  id: string
  name: string
  phone?: string
  photoUrl?: string
  location: Coordinate
  vehicleType: VehicleType
  status: CourierStatus
  rating?: number
}

// ============================================
// ORDEN Y TRACKING
// ============================================

export type OrderStatus = 
  | 'created'      // Orden creada, pendiente de confirmación
  | 'confirmed'    // Confirmada por el restaurante
  | 'preparing'    // Preparando el pedido
  | 'ready'        // Listo para recoger
  | 'picked_up'    // Recogido por el courier
  | 'on_the_way'   // En camino al usuario
  | 'delivered'    // Entregado
  | 'canceled'     // Cancelado

export interface OrderTracking {
  id: string
  restaurantId: string
  restaurantName: string
  restaurantLocation: Coordinate
  courierId?: string
  courier?: Courier
  userId: string
  status: OrderStatus
  deliveryLocation: Coordinate
  deliveryAddress: Address
  courierLocation?: Coordinate
  etaMinutes?: number
  route?: Coordinate[] // Ruta calculada
  createdAt: string
  updatedAt: string
  // Timestamps de cada etapa
  confirmedAt?: string
  preparingAt?: string
  readyAt?: string
  pickedUpAt?: string
  deliveredAt?: string
  canceledAt?: string
}

// ============================================
// MARKERS DEL MAPA
// ============================================

export type MarkerType = 'restaurant' | 'courier' | 'user' | 'delivery'

export interface MapMarker {
  id: string
  type: MarkerType
  position: Coordinate
  status?: string
  label?: string
  icon?: string
  data?: Restaurant | Courier | OrderTracking
}

// ============================================
// POLYLINES DEL MAPA
// ============================================

export type PolylineType = 'route' | 'area' | 'delivery_path'

export interface MapPolyline {
  id: string
  points: Coordinate[]
  type: PolylineType
  color?: string
  width?: number
  dashed?: boolean
}

// ============================================
// EVENTOS DE REALTIME
// ============================================

export type RealtimeEventType = 
  | 'order_status_changed'
  | 'courier_location_updated'
  | 'eta_updated'
  | 'courier_assigned'
  | 'order_canceled'

export interface RealtimeEvent {
  type: RealtimeEventType
  orderId: string
  payload: {
    status?: OrderStatus
    courierLocation?: Coordinate
    etaMinutes?: number
    courier?: Courier
    timestamp: string
  }
}

// ============================================
// CONFIGURACIÓN DEL MAPA
// ============================================

export interface MapConfig {
  defaultCenter: Coordinate
  defaultZoom: number
  minZoom: number
  maxZoom: number
  style?: string // URL del estilo del mapa
}

export const DEFAULT_MAP_CONFIG: MapConfig = {
  defaultCenter: { lat: 4.6761, lng: -74.0486 }, // Bogotá
  defaultZoom: 14,
  minZoom: 10,
  maxZoom: 18,
}

// ============================================
// HELPERS
// ============================================

/**
 * Calcula la distancia entre dos coordenadas (Haversine)
 */
export function calculateDistance(from: Coordinate, to: Coordinate): number {
  const R = 6371 // Radio de la Tierra en km
  const dLat = toRad(to.lat - from.lat)
  const dLng = toRad(to.lng - from.lng)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(from.lat)) *
      Math.cos(toRad(to.lat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180)
}

/**
 * Interpola entre dos coordenadas (para animación suave)
 */
export function interpolateCoordinate(
  from: Coordinate,
  to: Coordinate,
  progress: number // 0 a 1
): Coordinate {
  return {
    lat: from.lat + (to.lat - from.lat) * progress,
    lng: from.lng + (to.lng - from.lng) * progress,
  }
}

/**
 * Genera puntos intermedios entre dos coordenadas
 */
export function generateRoutePoints(
  from: Coordinate,
  to: Coordinate,
  numPoints: number = 10
): Coordinate[] {
  const points: Coordinate[] = []
  for (let i = 0; i <= numPoints; i++) {
    points.push(interpolateCoordinate(from, to, i / numPoints))
  }
  return points
}

/**
 * Formatea ETA en texto legible
 */
export function formatEta(minutes: number): string {
  if (minutes < 1) return 'Llegando...'
  if (minutes === 1) return '1 minuto'
  if (minutes < 60) return `${Math.round(minutes)} minutos`
  const hours = Math.floor(minutes / 60)
  const mins = Math.round(minutes % 60)
  return `${hours}h ${mins}min`
}

/**
 * Obtiene el label del estado de la orden
 */
export function getOrderStatusLabel(status: OrderStatus): string {
  const labels: Record<OrderStatus, string> = {
    created: 'Orden creada',
    confirmed: 'Confirmada',
    preparing: 'Preparando',
    ready: 'Listo para recoger',
    picked_up: 'Recogido',
    on_the_way: 'En camino',
    delivered: 'Entregado',
    canceled: 'Cancelado',
  }
  return labels[status]
}

/**
 * Obtiene el color del estado de la orden
 */
export function getOrderStatusColor(status: OrderStatus): string {
  const colors: Record<OrderStatus, string> = {
    created: 'text-gray-500',
    confirmed: 'text-blue-500',
    preparing: 'text-amber-500',
    ready: 'text-teal-500',
    picked_up: 'text-primary-500',
    on_the_way: 'text-primary-600',
    delivered: 'text-green-600',
    canceled: 'text-red-500',
  }
  return colors[status]
}
