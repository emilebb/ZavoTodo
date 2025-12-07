/**
 * ZAVO Mock Realtime Tracking
 * Simula tracking en tiempo real para desarrollo sin backend
 * 
 * Este archivo puede ser desactivado fácilmente cambiando
 * VITE_USE_REALTIME_MOCK=false en el .env
 */

import { 
  Coordinate, 
  OrderTracking, 
  Courier, 
  OrderStatus,
  RealtimeEvent,
  generateRoutePoints,
  interpolateCoordinate 
} from '../types/location'
import { MOCK_UPDATE_INTERVAL } from '../config/realtime'

// ============================================
// MOCK DATA
// ============================================

const MOCK_COURIERS: Courier[] = [
  {
    id: 'courier-1',
    name: 'Carlos Rodríguez',
    phone: '+57 300 123 4567',
    photoUrl: undefined,
    location: { lat: 4.6761, lng: -74.0486 },
    vehicleType: 'moto',
    status: 'idle',
    rating: 4.9,
  },
  {
    id: 'courier-2',
    name: 'María González',
    phone: '+57 301 234 5678',
    photoUrl: undefined,
    location: { lat: 4.6800, lng: -74.0500 },
    vehicleType: 'bike',
    status: 'idle',
    rating: 4.8,
  },
]

const MOCK_RESTAURANTS_LOCATIONS: Record<string, Coordinate> = {
  'b1': { lat: 4.6761, lng: -74.0486 },
  'b2': { lat: 4.6486, lng: -74.0628 },
  'b3': { lat: 4.6789, lng: -74.0345 },
}

// ============================================
// MOCK TRACKING STATE
// ============================================

interface MockTrackingState {
  order: OrderTracking | null
  courier: Courier | null
  routePoints: Coordinate[]
  currentPointIndex: number
  intervalId: NodeJS.Timeout | null
  listeners: Set<(event: RealtimeEvent) => void>
}

const mockState: MockTrackingState = {
  order: null,
  courier: null,
  routePoints: [],
  currentPointIndex: 0,
  intervalId: null,
  listeners: new Set(),
}

// ============================================
// STATUS PROGRESSION
// ============================================

const STATUS_PROGRESSION: OrderStatus[] = [
  'created',
  'confirmed',
  'preparing',
  'ready',
  'picked_up',
  'on_the_way',
  'delivered',
]

function getNextStatus(current: OrderStatus): OrderStatus | null {
  const currentIndex = STATUS_PROGRESSION.indexOf(current)
  if (currentIndex === -1 || currentIndex >= STATUS_PROGRESSION.length - 1) {
    return null
  }
  return STATUS_PROGRESSION[currentIndex + 1]
}

// ============================================
// MOCK TRACKING FUNCTIONS
// ============================================

/**
 * Inicia el tracking mock para una orden
 */
export function startMockTracking(
  orderId: string,
  restaurantId: string,
  deliveryLocation: Coordinate,
  onEvent: (event: RealtimeEvent) => void
): () => void {
  // Limpiar tracking anterior
  stopMockTracking()
  
  // Obtener ubicación del restaurante
  const restaurantLocation = MOCK_RESTAURANTS_LOCATIONS[restaurantId] || {
    lat: 4.6761,
    lng: -74.0486,
  }
  
  // Seleccionar courier aleatorio
  const courier = { ...MOCK_COURIERS[Math.floor(Math.random() * MOCK_COURIERS.length)] }
  courier.location = { ...restaurantLocation }
  courier.status = 'assigned'
  
  // Generar ruta desde restaurante a destino
  const routePoints = generateRoutePoints(restaurantLocation, deliveryLocation, 20)
  
  // Crear orden inicial
  const order: OrderTracking = {
    id: orderId,
    restaurantId,
    restaurantName: 'Restaurante Demo',
    restaurantLocation,
    courierId: courier.id,
    courier,
    userId: 'user-1',
    status: 'created',
    deliveryLocation,
    deliveryAddress: {
      street: 'Calle 100 #15-20',
      city: 'Bogotá',
      formatted: 'Calle 100 #15-20, Bogotá',
    },
    courierLocation: courier.location,
    etaMinutes: 25,
    route: routePoints,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  
  // Guardar estado
  mockState.order = order
  mockState.courier = courier
  mockState.routePoints = routePoints
  mockState.currentPointIndex = 0
  mockState.listeners.add(onEvent)
  
  // Emitir evento inicial
  emitEvent({
    type: 'order_status_changed',
    orderId,
    payload: {
      status: 'created',
      timestamp: new Date().toISOString(),
    },
  })
  
  // Iniciar simulación
  let tickCount = 0
  mockState.intervalId = setInterval(() => {
    tickCount++
    simulateTick(tickCount, onEvent)
  }, MOCK_UPDATE_INTERVAL)
  
  // Retornar función de cleanup
  return () => {
    mockState.listeners.delete(onEvent)
    if (mockState.listeners.size === 0) {
      stopMockTracking()
    }
  }
}

/**
 * Detiene el tracking mock
 */
export function stopMockTracking(): void {
  if (mockState.intervalId) {
    clearInterval(mockState.intervalId)
    mockState.intervalId = null
  }
  mockState.order = null
  mockState.courier = null
  mockState.routePoints = []
  mockState.currentPointIndex = 0
}

/**
 * Simula un tick de actualización
 */
function simulateTick(tickCount: number, onEvent: (event: RealtimeEvent) => void): void {
  if (!mockState.order || !mockState.courier) return
  
  const order = mockState.order
  const courier = mockState.courier
  
  // Progresión de estados basada en ticks
  // Cada 3 ticks (6 segundos) avanzamos de estado hasta picked_up
  if (tickCount % 3 === 0 && order.status !== 'on_the_way' && order.status !== 'delivered') {
    const nextStatus = getNextStatus(order.status)
    if (nextStatus && nextStatus !== 'on_the_way') {
      order.status = nextStatus
      order.updatedAt = new Date().toISOString()
      
      // Asignar courier cuando esté listo
      if (nextStatus === 'ready') {
        courier.status = 'picking_up'
        emitEvent({
          type: 'courier_assigned',
          orderId: order.id,
          payload: {
            courier,
            timestamp: new Date().toISOString(),
          },
        })
      }
      
      if (nextStatus === 'picked_up') {
        courier.status = 'delivering'
        order.status = 'on_the_way'
      }
      
      emitEvent({
        type: 'order_status_changed',
        orderId: order.id,
        payload: {
          status: order.status,
          timestamp: new Date().toISOString(),
        },
      })
    }
  }
  
  // Mover courier si está en camino
  if (order.status === 'on_the_way' && mockState.currentPointIndex < mockState.routePoints.length - 1) {
    mockState.currentPointIndex++
    const newLocation = mockState.routePoints[mockState.currentPointIndex]
    
    // Interpolar para movimiento suave
    const prevLocation = courier.location
    courier.location = interpolateCoordinate(prevLocation, newLocation, 0.8)
    order.courierLocation = courier.location
    
    // Actualizar ETA
    const remainingPoints = mockState.routePoints.length - mockState.currentPointIndex
    order.etaMinutes = Math.max(1, Math.round(remainingPoints * 0.5))
    
    emitEvent({
      type: 'courier_location_updated',
      orderId: order.id,
      payload: {
        courierLocation: courier.location,
        timestamp: new Date().toISOString(),
      },
    })
    
    emitEvent({
      type: 'eta_updated',
      orderId: order.id,
      payload: {
        etaMinutes: order.etaMinutes,
        timestamp: new Date().toISOString(),
      },
    })
    
    // Verificar si llegó al destino
    if (mockState.currentPointIndex >= mockState.routePoints.length - 1) {
      order.status = 'delivered'
      order.deliveredAt = new Date().toISOString()
      courier.status = 'idle'
      
      emitEvent({
        type: 'order_status_changed',
        orderId: order.id,
        payload: {
          status: 'delivered',
          timestamp: new Date().toISOString(),
        },
      })
      
      // Detener tracking después de entregar
      setTimeout(() => stopMockTracking(), 3000)
    }
  }
}

/**
 * Emite un evento a todos los listeners
 */
function emitEvent(event: RealtimeEvent): void {
  mockState.listeners.forEach(listener => {
    try {
      listener(event)
    } catch (error) {
      console.error('Error in mock tracking listener:', error)
    }
  })
}

// ============================================
// GETTERS PARA ESTADO ACTUAL
// ============================================

export function getMockOrder(): OrderTracking | null {
  return mockState.order
}

export function getMockCourier(): Courier | null {
  return mockState.courier
}

export function getMockRoute(): Coordinate[] {
  return mockState.routePoints
}

// ============================================
// DEMO: Crear orden de prueba
// ============================================

export function createDemoOrder(): OrderTracking {
  const restaurantLocation = { lat: 4.6761, lng: -74.0486 }
  const deliveryLocation = { lat: 4.6850, lng: -74.0550 }
  
  return {
    id: `order-demo-${Date.now()}`,
    restaurantId: 'b1',
    restaurantName: 'Panadería El Buen Pan',
    restaurantLocation,
    userId: 'user-1',
    status: 'created',
    deliveryLocation,
    deliveryAddress: {
      street: 'Calle 100 #15-20',
      city: 'Bogotá',
      formatted: 'Calle 100 #15-20, Bogotá',
    },
    etaMinutes: 25,
    route: generateRoutePoints(restaurantLocation, deliveryLocation, 20),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}
