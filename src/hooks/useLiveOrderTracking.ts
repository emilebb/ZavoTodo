/**
 * ZAVO useLiveOrderTracking Hook
 * Hook para tracking en tiempo real de órdenes
 * 
 * Soporta:
 * - WebSocket real (producción)
 * - Mock tracking (desarrollo)
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { 
  OrderTracking, 
  Courier, 
  Coordinate, 
  RealtimeEvent,
  OrderStatus 
} from '../types/location'
import { 
  USE_REALTIME_MOCK, 
  REALTIME_URL, 
  RECONNECT_INTERVAL,
  MAX_RECONNECT_ATTEMPTS 
} from '../config/realtime'
import { 
  startMockTracking, 
  stopMockTracking,
  createDemoOrder 
} from '../services/mockRealtimeTracking'

interface UseLiveOrderTrackingReturn {
  order: OrderTracking | null
  courier: Courier | null
  route: Coordinate[]
  isLoading: boolean
  isConnected: boolean
  error: string | null
  // Acciones
  startTracking: (orderId: string, restaurantId: string, deliveryLocation: Coordinate) => void
  stopTracking: () => void
  startDemoTracking: () => void
}

/**
 * Hook para tracking en tiempo real de órdenes
 * 
 * @example
 * const { order, courier, route, isLoading, startTracking } = useLiveOrderTracking()
 * 
 * // Iniciar tracking
 * startTracking('order-123', 'restaurant-1', { lat: 4.68, lng: -74.05 })
 * 
 * // O usar demo
 * startDemoTracking()
 */
export function useLiveOrderTracking(): UseLiveOrderTrackingReturn {
  const [order, setOrder] = useState<OrderTracking | null>(null)
  const [courier, setCourier] = useState<Courier | null>(null)
  const [route, setRoute] = useState<Coordinate[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectAttemptsRef = useRef(0)
  const cleanupRef = useRef<(() => void) | null>(null)

  /**
   * Maneja eventos de realtime (mock o WebSocket)
   */
  const handleRealtimeEvent = useCallback((event: RealtimeEvent) => {
    console.log('[Tracking] Event received:', event.type, event.payload)
    
    switch (event.type) {
      case 'order_status_changed':
        setOrder(prev => prev ? {
          ...prev,
          status: event.payload.status as OrderStatus,
          updatedAt: event.payload.timestamp,
        } : null)
        break
        
      case 'courier_location_updated':
        if (event.payload.courierLocation) {
          setCourier(prev => prev ? {
            ...prev,
            location: event.payload.courierLocation!,
          } : null)
          setOrder(prev => prev ? {
            ...prev,
            courierLocation: event.payload.courierLocation,
          } : null)
        }
        break
        
      case 'eta_updated':
        setOrder(prev => prev ? {
          ...prev,
          etaMinutes: event.payload.etaMinutes,
        } : null)
        break
        
      case 'courier_assigned':
        if (event.payload.courier) {
          setCourier(event.payload.courier)
          setOrder(prev => prev ? {
            ...prev,
            courier: event.payload.courier,
            courierId: event.payload.courier?.id,
          } : null)
        }
        break
        
      case 'order_canceled':
        setOrder(prev => prev ? {
          ...prev,
          status: 'canceled',
          canceledAt: event.payload.timestamp,
        } : null)
        break
    }
  }, [])

  /**
   * Conecta al WebSocket real
   */
  const connectWebSocket = useCallback((orderId: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return
    }

    const wsUrl = `${REALTIME_URL}/orders/${orderId}`
    console.log('[Tracking] Connecting to WebSocket:', wsUrl)
    
    try {
      const ws = new WebSocket(wsUrl)
      
      ws.onopen = () => {
        console.log('[Tracking] WebSocket connected')
        setIsConnected(true)
        setError(null)
        reconnectAttemptsRef.current = 0
      }
      
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as RealtimeEvent
          handleRealtimeEvent(data)
        } catch (err) {
          console.error('[Tracking] Error parsing WebSocket message:', err)
        }
      }
      
      ws.onerror = (event) => {
        console.error('[Tracking] WebSocket error:', event)
        setError('Error de conexión en tiempo real')
      }
      
      ws.onclose = () => {
        console.log('[Tracking] WebSocket closed')
        setIsConnected(false)
        
        // Intentar reconexión
        if (reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
          reconnectAttemptsRef.current++
          console.log(`[Tracking] Reconnecting... attempt ${reconnectAttemptsRef.current}`)
          setTimeout(() => connectWebSocket(orderId), RECONNECT_INTERVAL)
        } else {
          setError('No se pudo reconectar. Por favor, recarga la página.')
        }
      }
      
      wsRef.current = ws
    } catch (err) {
      console.error('[Tracking] Error creating WebSocket:', err)
      setError('Error al conectar con el servidor de tracking')
    }
  }, [handleRealtimeEvent])

  /**
   * Inicia el tracking de una orden
   */
  const startTracking = useCallback((
    orderId: string, 
    restaurantId: string, 
    deliveryLocation: Coordinate
  ) => {
    setIsLoading(true)
    setError(null)
    
    if (USE_REALTIME_MOCK) {
      // Usar mock tracking
      console.log('[Tracking] Starting mock tracking for order:', orderId)
      
      // Crear orden inicial
      const mockOrder: OrderTracking = {
        id: orderId,
        restaurantId,
        restaurantName: 'Restaurante',
        restaurantLocation: { lat: 4.6761, lng: -74.0486 },
        userId: 'user-1',
        status: 'created',
        deliveryLocation,
        deliveryAddress: {
          street: 'Tu ubicación',
          city: 'Bogotá',
          formatted: 'Tu ubicación, Bogotá',
        },
        etaMinutes: 25,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      
      setOrder(mockOrder)
      setIsLoading(false)
      setIsConnected(true)
      
      // Iniciar mock tracking
      const cleanup = startMockTracking(
        orderId,
        restaurantId,
        deliveryLocation,
        handleRealtimeEvent
      )
      
      cleanupRef.current = cleanup
    } else {
      // Usar WebSocket real
      connectWebSocket(orderId)
      setIsLoading(false)
    }
  }, [handleRealtimeEvent, connectWebSocket])

  /**
   * Inicia tracking de demostración
   */
  const startDemoTracking = useCallback(() => {
    const demoOrder = createDemoOrder()
    
    setOrder(demoOrder)
    setRoute(demoOrder.route || [])
    setIsLoading(false)
    setIsConnected(true)
    
    // Iniciar mock tracking
    const cleanup = startMockTracking(
      demoOrder.id,
      demoOrder.restaurantId,
      demoOrder.deliveryLocation,
      handleRealtimeEvent
    )
    
    cleanupRef.current = cleanup
  }, [handleRealtimeEvent])

  /**
   * Detiene el tracking
   */
  const stopTracking = useCallback(() => {
    console.log('[Tracking] Stopping tracking')
    
    // Limpiar WebSocket
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }
    
    // Limpiar mock
    if (cleanupRef.current) {
      cleanupRef.current()
      cleanupRef.current = null
    }
    stopMockTracking()
    
    // Reset state
    setOrder(null)
    setCourier(null)
    setRoute([])
    setIsConnected(false)
    setError(null)
    reconnectAttemptsRef.current = 0
  }, [])

  /**
   * Cleanup al desmontar
   */
  useEffect(() => {
    return () => {
      stopTracking()
    }
  }, [stopTracking])

  /**
   * Actualizar ruta cuando cambie la orden
   */
  useEffect(() => {
    if (order?.route) {
      setRoute(order.route)
    }
  }, [order?.route])

  return {
    order,
    courier,
    route,
    isLoading,
    isConnected,
    error,
    startTracking,
    stopTracking,
    startDemoTracking,
  }
}

export default useLiveOrderTracking
