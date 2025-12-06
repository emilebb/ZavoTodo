import { useQuery, useMutation } from '@tanstack/react-query'
import { supabaseService } from '../services/supabaseService'
import { Order } from '../types'
import { useZavoQueryClient } from './useQueryClient'
import toast from 'react-hot-toast'

export const useOrdersQuery = (filters?: {
  userId?: string
  businessId?: string
  packId?: string
}) => {
  return useQuery({
    queryKey: ['orders', filters],
    queryFn: () => supabaseService.getOrders(filters),
    staleTime: 1000 * 60 * 1, // 1 minute
  })
}

export const useOrderQuery = (id: string) => {
  return useQuery({
    queryKey: ['orders', id],
    queryFn: () => supabaseService.getOrderById(id),
    enabled: !!id,
  })
}

export const useUserOrdersQuery = (userId: string) => {
  return useQuery({
    queryKey: ['orders', 'user', userId],
    queryFn: () => supabaseService.getOrders({ userId }),
    enabled: !!userId,
  })
}

export const useBusinessOrdersQuery = (businessId: string) => {
  return useQuery({
    queryKey: ['orders', 'business', businessId],
    queryFn: () => supabaseService.getOrders({ businessId }),
    enabled: !!businessId,
  })
}

export const useCreateOrderMutation = () => {
  const { invalidateQueries } = useZavoQueryClient()

  return useMutation({
    mutationFn: (order: Omit<Order, 'id' | 'created_at' | 'pack' | 'user'>) =>
      supabaseService.createOrder(order),
    onSuccess: () => {
      invalidateQueries.orders()
      invalidateQueries.packs() // Update pack stock
      toast.success('¡Pedido creado exitosamente!')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al crear el pedido')
    },
  })
}

export const useUpdateOrderMutation = () => {
  const { invalidateQueries } = useZavoQueryClient()

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Order> }) =>
      supabaseService.updateOrder(id, updates),
    onSuccess: (data) => {
      invalidateQueries.orders()
      
      if (data.estado === 'recogido') {
        toast.success('¡Pedido marcado como recogido!')
      } else if (data.estado === 'confirmado') {
        toast.success('¡Pedido confirmado!')
      } else {
        toast.success('Pedido actualizado exitosamente')
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al actualizar el pedido')
    },
  })
}
