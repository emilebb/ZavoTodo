/**
 * ============================================
 * ZAVO - useProducts Hook
 * ============================================
 * 
 * Hook de TanStack Query para productos
 * Incluye: queries, mutations, optimistic updates
 */

import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query'
import {
  getProducts,
  getProduct,
  getAvailableProducts,
  getProductsByBusiness,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
  ProductFilters,
} from '../../services/firebase/productService'
import { Product, CreateProductData } from '../../types/firebase'

// ============================================
// QUERY KEYS
// ============================================

export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters?: ProductFilters) => [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
  search: (term: string) => [...productKeys.all, 'search', term] as const,
  business: (businessId: string) => [...productKeys.all, 'business', businessId] as const,
}

// ============================================
// QUERIES
// ============================================

/**
 * Hook para obtener lista de productos con paginación infinita
 */
export function useProducts(filters?: ProductFilters) {
  return useInfiniteQuery({
    queryKey: productKeys.list(filters),
    queryFn: async ({ pageParam }) => {
      return getProducts(filters, { 
        limit: 20, 
        lastDoc: pageParam 
      })
    },
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.lastDoc : undefined
    },
    initialPageParam: undefined,
  })
}

/**
 * Hook para obtener productos disponibles
 */
export function useAvailableProducts() {
  return useInfiniteQuery({
    queryKey: [...productKeys.lists(), 'available'],
    queryFn: async ({ pageParam }) => {
      return getAvailableProducts({ 
        limit: 20, 
        lastDoc: pageParam 
      })
    },
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.lastDoc : undefined
    },
    initialPageParam: undefined,
  })
}

/**
 * Hook para obtener productos de un negocio
 */
export function useBusinessProducts(businessId: string) {
  return useInfiniteQuery({
    queryKey: productKeys.business(businessId),
    queryFn: async ({ pageParam }) => {
      return getProductsByBusiness(businessId, { 
        limit: 20, 
        lastDoc: pageParam 
      })
    },
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.lastDoc : undefined
    },
    initialPageParam: undefined,
    enabled: !!businessId,
  })
}

/**
 * Hook para obtener un producto por ID
 */
export function useProduct(id: string) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => getProduct(id),
    enabled: !!id,
  })
}

/**
 * Hook para buscar productos
 */
export function useSearchProducts(searchTerm: string) {
  return useQuery({
    queryKey: productKeys.search(searchTerm),
    queryFn: () => searchProducts(searchTerm),
    enabled: searchTerm.length >= 2,
  })
}

// ============================================
// MUTATIONS
// ============================================

/**
 * Hook para crear un producto
 */
export function useCreateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ 
      data, 
      imageFile 
    }: { 
      data: CreateProductData
      imageFile?: File 
    }) => {
      const result = await createProduct(data, imageFile)
      if (result.error) throw new Error(result.error)
      return result.product!
    },
    onSuccess: (newProduct) => {
      // Invalidar queries de lista
      queryClient.invalidateQueries({ queryKey: productKeys.lists() })
      
      // Agregar a cache
      queryClient.setQueryData(
        productKeys.detail(newProduct.id),
        newProduct
      )
    },
  })
}

/**
 * Hook para actualizar un producto
 */
export function useUpdateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ 
      id, 
      data, 
      imageFile 
    }: { 
      id: string
      data: Partial<Product>
      imageFile?: File 
    }) => {
      const result = await updateProduct(id, data, imageFile)
      if (result.error) throw new Error(result.error)
      return { id, data }
    },
    // Optimistic update
    onMutate: async ({ id, data }) => {
      // Cancelar queries en progreso
      await queryClient.cancelQueries({ queryKey: productKeys.detail(id) })

      // Snapshot del valor anterior
      const previousProduct = queryClient.getQueryData<Product>(
        productKeys.detail(id)
      )

      // Optimistic update
      if (previousProduct) {
        queryClient.setQueryData(productKeys.detail(id), {
          ...previousProduct,
          ...data,
        })
      }

      return { previousProduct }
    },
    onError: (_err, { id }, context) => {
      // Rollback en caso de error
      if (context?.previousProduct) {
        queryClient.setQueryData(
          productKeys.detail(id),
          context.previousProduct
        )
      }
    },
    onSettled: (_data, _error, { id }) => {
      // Refetch para sincronizar
      queryClient.invalidateQueries({ queryKey: productKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: productKeys.lists() })
    },
  })
}

/**
 * Hook para eliminar un producto
 */
export function useDeleteProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteProduct(id)
      if (result.error) throw new Error(result.error)
      return id
    },
    onSuccess: (deletedId) => {
      // Remover de cache
      queryClient.removeQueries({ queryKey: productKeys.detail(deletedId) })
      
      // Invalidar listas
      queryClient.invalidateQueries({ queryKey: productKeys.lists() })
    },
  })
}

// ============================================
// HELPERS
// ============================================

/**
 * Prefetch de un producto
 */
export function usePrefetchProduct() {
  const queryClient = useQueryClient()

  return (id: string) => {
    queryClient.prefetchQuery({
      queryKey: productKeys.detail(id),
      queryFn: () => getProduct(id),
    })
  }
}
