/**
 * ZAVO Realtime Configuration
 * Configuración para WebSocket y tracking en tiempo real
 */

// ============================================
// ENVIRONMENT VARIABLES
// ============================================

/**
 * URL del servidor de WebSocket para tracking en tiempo real
 * En producción: wss://api.zavo.app/realtime
 */
export const REALTIME_URL = import.meta.env.VITE_REALTIME_URL || 'wss://api.zavo.app/realtime'

/**
 * Habilitar modo mock para desarrollo sin backend
 * Simula movimiento del courier y actualizaciones de estado
 */
export const USE_REALTIME_MOCK = import.meta.env.VITE_USE_REALTIME_MOCK === 'true' || true // Default true para desarrollo

/**
 * Intervalo de actualización del mock en ms
 */
export const MOCK_UPDATE_INTERVAL = 2000 // 2 segundos

/**
 * Intervalo de reconexión del WebSocket en ms
 */
export const RECONNECT_INTERVAL = 3000 // 3 segundos

/**
 * Máximo número de intentos de reconexión
 */
export const MAX_RECONNECT_ATTEMPTS = 5

// ============================================
// CONFIGURACIÓN DEL MAPA
// ============================================

export const MAP_CONFIG = {
  /**
   * Centro por defecto del mapa (Bogotá)
   */
  defaultCenter: {
    lat: 4.6761,
    lng: -74.0486,
  },
  
  /**
   * Zoom por defecto
   */
  defaultZoom: 14,
  
  /**
   * Zoom mínimo y máximo
   */
  minZoom: 10,
  maxZoom: 18,
  
  /**
   * Estilo del mapa (para Mapbox)
   * Opciones: 'streets', 'light', 'dark', 'satellite'
   */
  style: 'streets',
  
  /**
   * API Key de Google Maps (si se usa)
   */
  googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
  
  /**
   * Access Token de Mapbox (si se usa)
   */
  mapboxAccessToken: import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || '',
}

// ============================================
// COLORES DEL MAPA (sincronizados con design tokens)
// ============================================

export const MAP_COLORS = {
  /**
   * Ruta activa / courier en movimiento
   */
  routeActive: '#16A34A', // primary-600
  
  /**
   * Ruta completada
   */
  routeCompleted: '#86EFAC', // primary-300
  
  /**
   * Estado urgente / retraso
   */
  urgent: '#F97316', // accent-500
  
  /**
   * Marker de restaurante
   */
  restaurant: '#16A34A', // primary-600
  
  /**
   * Marker de courier
   */
  courier: '#0D9488', // teal-600
  
  /**
   * Marker de usuario / destino
   */
  user: '#3B82F6', // blue-500
  
  /**
   * Marker de entrega
   */
  delivery: '#8B5CF6', // violet-500
}

// ============================================
// ICONOS DE VEHÍCULOS
// ============================================

export const VEHICLE_ICONS: Record<string, string> = {
  bike: '🚴',
  moto: '🛵',
  car: '🚗',
  walk: '🚶',
}

// ============================================
// ESTADOS DE LA ORDEN (para timeline)
// ============================================

export const ORDER_STEPS = [
  { status: 'created', label: 'Orden creada', icon: '📝' },
  { status: 'confirmed', label: 'Confirmada', icon: '✅' },
  { status: 'preparing', label: 'Preparando', icon: '👨‍🍳' },
  { status: 'ready', label: 'Listo', icon: '📦' },
  { status: 'picked_up', label: 'Recogido', icon: '🛵' },
  { status: 'on_the_way', label: 'En camino', icon: '🚀' },
  { status: 'delivered', label: 'Entregado', icon: '🎉' },
] as const

// ============================================
// MENSAJES DE ESTADO
// ============================================

export const STATUS_MESSAGES: Record<string, string> = {
  created: 'Tu orden ha sido creada. Esperando confirmación del restaurante.',
  confirmed: 'El restaurante ha confirmado tu orden. Pronto comenzarán a prepararla.',
  preparing: 'Tu pedido está siendo preparado con mucho cariño.',
  ready: 'Tu pedido está listo. Buscando repartidor cercano...',
  picked_up: 'El repartidor ha recogido tu pedido.',
  on_the_way: 'Tu pedido está en camino. ¡Ya casi llega!',
  delivered: '¡Tu pedido ha sido entregado! Disfrútalo.',
  canceled: 'Tu orden ha sido cancelada.',
}

// ============================================
// HELPERS DE CONFIGURACIÓN
// ============================================

/**
 * Verifica si el tracking en tiempo real está disponible
 */
export function isRealtimeAvailable(): boolean {
  return !!(REALTIME_URL && !USE_REALTIME_MOCK)
}

/**
 * Obtiene la URL del WebSocket para una orden específica
 */
export function getOrderChannelUrl(orderId: string): string {
  return `${REALTIME_URL}/orders/${orderId}`
}

/**
 * Obtiene el mensaje de estado para una orden
 */
export function getStatusMessage(status: string): string {
  return STATUS_MESSAGES[status] || 'Estado desconocido'
}
