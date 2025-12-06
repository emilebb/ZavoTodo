import { useQueryClient } from '@tanstack/react-query'

export const useZavoQueryClient = () => {
  const queryClient = useQueryClient()

  const invalidateQueries = {
    packs: () => queryClient.invalidateQueries({ queryKey: ['packs'] }),
    orders: () => queryClient.invalidateQueries({ queryKey: ['orders'] }),
    businesses: () => queryClient.invalidateQueries({ queryKey: ['businesses'] }),
    users: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  }

  return {
    queryClient,
    invalidateQueries,
  }
}
