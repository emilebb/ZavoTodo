/**
 * ZAVO Mock Service
 * Servicios simulados para desarrollo
 * 
 * TODO: Reemplazar con llamadas a API real cuando esté disponible
 * Puntos de integración marcados con comentarios
 */

import { Pack, Business, Order, Location } from '../types'

// ============================================
// MOCK DATA
// ============================================

const MOCK_BUSINESSES: Business[] = [
  {
    id: 'b1',
    user_id: 'u1',
    nombre: 'Panadería El Buen Pan',
    descripcion: 'Panadería artesanal con más de 20 años de tradición',
    direccion: 'Calle 85 #15-20, Bogotá',
    categoria: 'panaderia',
    lat: 4.6761,
    lng: -74.0486,
    horario: '6:00 AM - 8:00 PM',
    rating: 4.8,
    total_reviews: 234,
    verificado: true,
    activo: true,
    created_at: '2024-01-15T10:00:00Z',
  },
  {
    id: 'b2',
    user_id: 'u2',
    nombre: 'Café Central Premium',
    descripcion: 'El mejor café de especialidad en el centro',
    direccion: 'Carrera 7 #45-12, Bogotá',
    categoria: 'cafe',
    lat: 4.6486,
    lng: -74.0628,
    horario: '7:00 AM - 9:00 PM',
    rating: 4.9,
    total_reviews: 456,
    verificado: true,
    activo: true,
    created_at: '2024-02-01T10:00:00Z',
  },
  {
    id: 'b3',
    user_id: 'u3',
    nombre: 'Restaurante Verde Gourmet',
    descripcion: 'Cocina saludable y sostenible',
    direccion: 'Calle 93 #11-30, Bogotá',
    categoria: 'restaurante',
    lat: 4.6789,
    lng: -74.0345,
    horario: '11:00 AM - 10:00 PM',
    rating: 4.7,
    total_reviews: 189,
    verificado: true,
    activo: true,
    created_at: '2024-01-20T10:00:00Z',
  },
]

const MOCK_PACKS: Pack[] = [
  {
    id: 'p1',
    business_id: 'b1',
    titulo: 'Pack Sorpresa de Panadería',
    descripcion: 'Deliciosos panes, pasteles y productos de panadería del día. Perfectos para el desayuno o merienda.',
    categoria: 'panaderia',
    precio_original: 15000,
    precio_descuento: 8000,
    porcentaje_descuento: 47,
    stock: 3,
    hora_retiro_desde: '17:00',
    hora_retiro_hasta: '20:00',
    activo: true,
    created_at: '2024-03-01T10:00:00Z',
  },
  {
    id: 'p2',
    business_id: 'b2',
    titulo: 'Pack Café Premium',
    descripcion: 'Café de especialidad y pasteles artesanales. Una experiencia única para los amantes del café.',
    categoria: 'cafe',
    precio_original: 18500,
    precio_descuento: 12000,
    porcentaje_descuento: 35,
    stock: 5,
    hora_retiro_desde: '18:00',
    hora_retiro_hasta: '21:00',
    activo: true,
    created_at: '2024-03-02T10:00:00Z',
  },
  {
    id: 'p3',
    business_id: 'b3',
    titulo: 'Pack Gourmet Sorpresa',
    descripcion: 'Platos del día preparados con ingredientes frescos y orgánicos. Ideal para una cena especial.',
    categoria: 'restaurante',
    precio_original: 25000,
    precio_descuento: 10000,
    porcentaje_descuento: 60,
    stock: 2,
    hora_retiro_desde: '20:00',
    hora_retiro_hasta: '22:00',
    activo: true,
    created_at: '2024-03-03T10:00:00Z',
  },
]

// ============================================
// MOCK SERVICE FUNCTIONS
// ============================================

/**
 * Simula delay de red
 */
const simulateNetworkDelay = (ms: number = 300) => 
  new Promise(resolve => setTimeout(resolve, ms))

/**
 * Obtener packs cercanos a una ubicación
 * TODO: Integrar con API de geolocalización real
 * @param location - Coordenadas del usuario
 * @param radiusKm - Radio de búsqueda en kilómetros
 */
export async function getPacksNearLocation(
  _location: Location,
  _radiusKm: number = 5
): Promise<Pack[]> {
  await simulateNetworkDelay()
  
  // En producción: llamar a API con filtro geográfico
  // GET /api/packs?lat=${location.lat}&lng=${location.lng}&radius=${radiusKm}
  
  const packsWithBusiness = MOCK_PACKS.map(pack => ({
    ...pack,
    business: MOCK_BUSINESSES.find(b => b.id === pack.business_id),
  }))
  
  return packsWithBusiness.filter(p => p.activo && p.stock > 0)
}

/**
 * Obtener todos los packs activos
 * TODO: Implementar paginación cuando haya más datos
 */
export async function getActivePacks(): Promise<Pack[]> {
  await simulateNetworkDelay()
  
  return MOCK_PACKS
    .filter(p => p.activo && p.stock > 0)
    .map(pack => ({
      ...pack,
      business: MOCK_BUSINESSES.find(b => b.id === pack.business_id),
    }))
}

/**
 * Obtener pack por ID
 */
export async function getPackById(id: string): Promise<Pack | null> {
  await simulateNetworkDelay()
  
  const pack = MOCK_PACKS.find(p => p.id === id)
  if (!pack) return null
  
  return {
    ...pack,
    business: MOCK_BUSINESSES.find(b => b.id === pack.business_id),
  }
}

/**
 * Obtener negocios aliados
 * TODO: Integrar con API de negocios verificados
 */
export async function getPartnerBusinesses(): Promise<Business[]> {
  await simulateNetworkDelay()
  
  return MOCK_BUSINESSES.filter(b => b.activo && b.verificado)
}

/**
 * Obtener negocio por ID
 */
export async function getBusinessById(id: string): Promise<Business | null> {
  await simulateNetworkDelay()
  
  return MOCK_BUSINESSES.find(b => b.id === id) || null
}

/**
 * Obtener pedidos del usuario
 * TODO: Integrar con sistema de autenticación
 * @param userId - ID del usuario autenticado
 */
export async function getUserOrders(_userId: string): Promise<Order[]> {
  await simulateNetworkDelay()
  
  // En producción: GET /api/orders?user_id=${userId}
  // Por ahora retornamos array vacío (usuario nuevo)
  return []
}

/**
 * Crear nuevo pedido
 * TODO: Integrar con pasarela de pagos (Stripe, PayU, etc.)
 * @param packId - ID del pack a reservar
 * @param userId - ID del usuario
 */
export async function createOrder(
  packId: string,
  userId: string
): Promise<Order> {
  await simulateNetworkDelay(500)
  
  const pack = await getPackById(packId)
  if (!pack) throw new Error('Pack no encontrado')
  if (pack.stock <= 0) throw new Error('Pack agotado')
  
  // En producción:
  // 1. Verificar stock en tiempo real
  // 2. Procesar pago
  // 3. Crear orden en base de datos
  // 4. Generar QR único
  // 5. Enviar confirmación por email/push
  
  const newOrder: Order = {
    id: `order_${Date.now()}`,
    user_id: userId,
    pack_id: packId,
    cantidad: 1,
    precio_total: pack.precio_descuento,
    estado: 'confirmado',
    qr_code: `ZAVO-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    created_at: new Date().toISOString(),
    pack,
  }
  
  return newOrder
}

/**
 * Actualizar estado de pedido
 * TODO: Implementar webhooks para actualizaciones en tiempo real
 */
export async function updateOrderStatus(
  _orderId: string,
  _status: Order['estado']
): Promise<Order> {
  await simulateNetworkDelay()
  
  // En producción: PATCH /api/orders/${orderId}
  throw new Error('Not implemented - conectar con backend')
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Calcular distancia entre dos puntos (Haversine formula)
 * TODO: Usar Google Maps Distance Matrix API para rutas reales
 */
export function calculateDistance(
  point1: Location,
  point2: Location
): number {
  const R = 6371 // Radio de la Tierra en km
  const dLat = toRad(point2.lat - point1.lat)
  const dLng = toRad(point2.lng - point1.lng)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(point1.lat)) *
      Math.cos(toRad(point2.lat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180)
}

/**
 * Formatear precio en COP
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(price)
}

/**
 * Formatear fecha
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
