/**
 * ============================================
 * ZAVO - useOrders Hook
 * ============================================
 * 
 * Hook de TanStack Query para pedidos
 * Incluye: queries, mutations, suscripciones en tiempo real
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState, useCallback } from 'react'
import {
  getOrder,
  getOrderWithItems,
  getUserOrders,
  getBusinessOrders,
  getActiveOrders,
  createOrder,
  updateOrderStatus,
  assignDriver,
  cancelOrder,
  subscribeToOrder,
  subscribeToUserOrders,
  CreateOrderInput,
  OrderWithItems,
} from '../../services/firebase/orderService'
import { Order, OrderStatus } from '../../types/firebase'

// ============================================
// QUERY KEYS
// ============================================

export const orderKeys = {
  all: ['orders'] as const,
  lists: () => [...orderKeys.all, 'list'] as const,
  user: (userId: string) => [...orderKeys.lists(), 'user', userId] as const,
  business: (businessId: string) => [...orderKeys.lists(), 'business', businessId] as const,
  active: () => [...orderKeys.lists(), 'active'] as const,
  details: () => [...orderKeys.all, 'detail'] as const,
  detail: (id: string) => [...orderKeys.details(), id] as const,
}

// ============================================
// QUERIES
// ============================================

/**
 * Hook para obtener un pedido por ID
 */
export function useOrder(id: string) {
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: () => getOrder(id),
    enabled: !!id,
  })
}

/**
 * Hook para obtener un pedido con sus items
 */
export function useOrderWithItems(id: string) {
  return useQuery<OrderWithItems | null>({
    queryKey: [...orderKeys.detail(id), 'items'],
    queryFn: () => getOrderWithItems(id),
    enabled: !!id,
  })
}

/**
 * Hook para obtener pedidos de un usuario
 */
export function useUserOrders(userId: string) {
  return useQuery({
    queryKey: orderKeys.user(userId),
    queryFn: () => getUserOrders(userId),
    enabled: !!userId,
  })
}

/**
 * Hook para obtener pedidos de un negocio
 */
export function useBusinessOrders(businessId: string, status?: OrderStatus) {
  return useQuery({
    queryKey: [...orderKeys.business(businessId), status],
    queryFn: () => getBusinessOrders(businessId, status),
    enabled: !!businessId,
  })
}

/**
 * Hook para obtener pedidos activos (admin)
 */
export function useActiveOrders() {
  return useQuery({
    queryKey: orderKeys.active(),
    queryFn: () => getActiveOrders(),
    refetchInterval: 30000, // Refetch cada 30 segundos
  })
}

// ============================================
// SUSCRIPCIONES EN TIEMPO REAL
// ============================================

/**
 * Hook para suscribirse a un pedido en tiempo real
 */
export function useOrderRealtime(orderId: string) {
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!orderId) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    const unsubscribe = subscribeToOrder(orderId, (updatedOrder) => {
      setOrder(updatedOrder)
      setIsLoading(false)
      
      // Actualizar cache de TanStack Query
      if (updatedOrder) {
        queryClient.setQueryData(orderKeys.detail(orderId), updatedOrder)
      }
    })

    return () => unsubscribe()
  }, [orderId, queryClient])

  return { order, isLoading, error }
}

/**
 * Hook para suscribirse a pedidos de un usuario en tiempo real
 */
export function useUserOrdersRealtime(userId: string) {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!userId) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)

    const unsubscribe = subscribeToUserOrders(userId, (updatedOrders) => {
      setOrders(updatedOrders)
      setIsLoading(false)
      
      // Actualizar cache
      queryClient.setQueryData(orderKeys.user(userId), updatedOrders)
    })

    return () => unsubscribe()
  }, [userId, queryClient])

  return { orders, isLoading }
}

// ============================================
// MUTATIONS
// ============================================

/**
 * Hook para crear un pedido
 */
export function useCreateOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: CreateOrderInput) => {
      const result = await createOrder(input)
      if (result.error) throw new Error(result.error)
      return result.order!
    },
    onSuccess: (newOrder) => {
      // Invalidar queries de lista
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() })
      
      // Agregar a cache
      queryClient.setQueryData(orderKeys.detail(newOrder.id), newOrder)
    },
  })
}

/**
 * Hook para actualizar estado de un pedido
 */
export function useUpdateOrderStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ 
      orderId, 
      status,
      additionalData 
    }: { 
      orderId: string
      status: OrderStatus
      additionalData?: Partial<Order>
    }) => {
      const result = await updateOrderStatus(orderId, status, additionalData)
      if (result.error) throw new Error(result.error)
      return { orderId, status }
    },
    // Optimistic update
    onMutate: async ({ orderId, status }) => {
      await queryClient.cancelQueries({ queryKey: orderKeys.detail(orderId) })

      const previousOrder = queryClient.getQueryData<Order>(
        orderKeys.detail(orderId)
      )

      if (previousOrder) {
        queryClient.setQueryData(orderKeys.detail(orderId), {
          ...previousOrder,
          status,
        })
      }

      return { previousOrder }
    },
    onError: (_err, { orderId }, context) => {
      if (context?.previousOrder) {
        queryClient.setQueryData(
          orderKeys.detail(orderId),
          context.previousOrder
        )
      }
    },
    onSettled: (_data, _error, { orderId }) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(orderId) })
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() })
    },
  })
}

/**
 * Hook para asignar repartidor
 */
export function useAssignDriver() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ 
      orderId, 
      driverId, 
      driverName 
    }: { 
      orderId: string
      driverId: string
      driverName: string
    }) => {
      const result = await assignDriver(orderId, driverId, driverName)
      if (result.error) throw new Error(result.error)
      return { orderId, driverId, driverName }
    },
    onSuccess: (_, { orderId }) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(orderId) })
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() })
    },
  })
}

/**
 * Hook para cancelar un pedido
 */
export function useCancelOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ 
      orderId, 
      reason 
    }: { 
      orderId: string
      reason?: string
    }) => {
      const result = await cancelOrder(orderId, reason)
      if (result.error) throw new Error(result.error)
      return orderId
    },
    onSuccess: (orderId) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(orderId) })
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() })
    },
  })
}

// ============================================
// HELPERS
// ============================================

/**
 * Hook para obtener el pedido activo del usuario (si existe)
 */
export function useActiveUserOrder(userId: string) {
  const { orders, isLoading } = useUserOrdersRealtime(userId)
  
  const activeOrder = orders.find(order => 
    ['pending', 'confirmed', 'preparing', 'ready', 'picked_up', 'delivering'].includes(order.status)
  )

  return { activeOrder, isLoading }
}

/**
 * Hook para verificar si el usuario tiene un pedido activo
 */
export function useHasActiveOrder(userId: string) {
  const { activeOrder, isLoading } = useActiveUserOrder(userId)
  return { hasActiveOrder: !!activeOrder, isLoading }
}
