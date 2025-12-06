import { useQuery, useMutation } from '@tanstack/react-query'
import { supabaseService } from '../services/supabaseService'
import { Pack } from '../types'
import { useZavoQueryClient } from './useQueryClient'
import toast from 'react-hot-toast'

export const usePacksQuery = (filters?: {
  searchText?: string
  businessId?: string
  activo?: boolean
}) => {
  return useQuery({
    queryKey: ['packs', filters],
    queryFn: () => supabaseService.getPacks(filters),
    staleTime: 1000 * 60 * 2, // 2 minutes
  })
}

export const usePackQuery = (id: string) => {
  return useQuery({
    queryKey: ['packs', id],
    queryFn: () => supabaseService.getPackById(id),
    enabled: !!id,
  })
}

export const useBusinessPacksQuery = (businessId: string) => {
  return useQuery({
    queryKey: ['packs', 'business', businessId],
    queryFn: () => supabaseService.getPacks({ businessId }),
    enabled: !!businessId,
  })
}

export const useCreatePackMutation = () => {
  const { invalidateQueries } = useZavoQueryClient()

  return useMutation({
    mutationFn: (pack: Omit<Pack, 'id' | 'created_at' | 'business'>) =>
      supabaseService.createPack(pack),
    onSuccess: () => {
      invalidateQueries.packs()
      toast.success('Pack creado exitosamente')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al crear el pack')
    },
  })
}

export const useUpdatePackMutation = () => {
  const { invalidateQueries } = useZavoQueryClient()

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Pack> }) =>
      supabaseService.updatePack(id, updates),
    onSuccess: () => {
      invalidateQueries.packs()
      toast.success('Pack actualizado exitosamente')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al actualizar el pack')
    },
  })
}

export const useDeletePackMutation = () => {
  const { invalidateQueries } = useZavoQueryClient()

  return useMutation({
    mutationFn: (id: string) => supabaseService.deletePack(id),
    onSuccess: () => {
      invalidateQueries.packs()
      toast.success('Pack eliminado exitosamente')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al eliminar el pack')
    },
  })
}
