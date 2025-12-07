/**
 * ============================================
 * ZAVO - useNotifications Hook
 * ============================================
 * 
 * Hook para notificaciones en tiempo real
 */

import { useEffect, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getUserNotifications,
  getUnreadNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
  subscribeToNotifications,
  subscribeToUnreadCount,
} from '../../services/firebase/notificationService'
import { Notification } from '../../types/firebase'

// ============================================
// QUERY KEYS
// ============================================

export const notificationKeys = {
  all: ['notifications'] as const,
  list: (userId: string) => [...notificationKeys.all, 'list', userId] as const,
  unread: (userId: string) => [...notificationKeys.all, 'unread', userId] as const,
  count: (userId: string) => [...notificationKeys.all, 'count', userId] as const,
}

// ============================================
// QUERIES
// ============================================

/**
 * Hook para obtener notificaciones de un usuario
 */
export function useNotifications(userId: string) {
  return useQuery({
    queryKey: notificationKeys.list(userId),
    queryFn: () => getUserNotifications(userId),
    enabled: !!userId,
  })
}

/**
 * Hook para obtener notificaciones no leídas
 */
export function useUnreadNotifications(userId: string) {
  return useQuery({
    queryKey: notificationKeys.unread(userId),
    queryFn: () => getUnreadNotifications(userId),
    enabled: !!userId,
  })
}

// ============================================
// SUSCRIPCIONES EN TIEMPO REAL
// ============================================

/**
 * Hook para notificaciones en tiempo real
 */
export function useNotificationsRealtime(userId: string) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!userId) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)

    const unsubscribe = subscribeToNotifications(userId, (updatedNotifications) => {
      setNotifications(updatedNotifications)
      setIsLoading(false)
      
      // Actualizar cache
      queryClient.setQueryData(notificationKeys.list(userId), updatedNotifications)
    })

    return () => unsubscribe()
  }, [userId, queryClient])

  return { notifications, isLoading }
}

/**
 * Hook para contar notificaciones no leídas en tiempo real
 */
export function useUnreadCount(userId: string) {
  const [count, setCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!userId) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)

    const unsubscribe = subscribeToUnreadCount(userId, (newCount) => {
      setCount(newCount)
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [userId])

  return { count, isLoading }
}

// ============================================
// MUTATIONS
// ============================================

/**
 * Hook para marcar una notificación como leída
 */
export function useMarkAsRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (notificationId: string) => {
      const result = await markAsRead(notificationId)
      if (result.error) throw new Error(result.error)
      return notificationId
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all })
    },
  })
}

/**
 * Hook para marcar todas como leídas
 */
export function useMarkAllAsRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (userId: string) => {
      const result = await markAllAsRead(userId)
      if (result.error) throw new Error(result.error)
      return userId
    },
    onSuccess: (userId) => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.list(userId) })
      queryClient.invalidateQueries({ queryKey: notificationKeys.unread(userId) })
    },
  })
}

/**
 * Hook para eliminar una notificación
 */
export function useDeleteNotification() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (notificationId: string) => {
      const result = await deleteNotification(notificationId)
      if (result.error) throw new Error(result.error)
      return notificationId
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all })
    },
  })
}

/**
 * Hook para eliminar todas las notificaciones
 */
export function useDeleteAllNotifications() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (userId: string) => {
      const result = await deleteAllNotifications(userId)
      if (result.error) throw new Error(result.error)
      return userId
    },
    onSuccess: (userId) => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.list(userId) })
    },
  })
}
