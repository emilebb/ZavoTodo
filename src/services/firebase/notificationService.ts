/**
 * ============================================
 * ZAVO - Firebase Notification Service
 * ============================================
 * 
 * Sistema de notificaciones con Firebase
 * Incluye: crear, leer, marcar como leída, tiempo real
 */

import {
  collection,
  doc,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  writeBatch,
  Unsubscribe,
} from 'firebase/firestore'
import { db } from '../../lib/firebase'
import { 
  Notification, 
  CreateNotificationData, 
  NotificationType,
  COLLECTIONS 
} from '../../types/firebase'

// ============================================
// CREAR NOTIFICACIÓN
// ============================================

/**
 * Crea una nueva notificación
 */
export async function createNotification(
  data: CreateNotificationData
): Promise<{ notification: Notification | null; error: string | null }> {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.NOTIFICATIONS), {
      ...data,
      is_read: false,
      created_at: serverTimestamp(),
    })

    const notification: Notification = {
      id: docRef.id,
      ...data,
      is_read: false,
      created_at: new Date().toISOString(),
    }

    return { notification, error: null }
  } catch (error: unknown) {
    console.error('Error creando notificación:', error)
    return { notification: null, error: 'Error al crear la notificación' }
  }
}

/**
 * Crea notificación de cambio de estado de pedido
 */
export async function createOrderNotification(
  userId: string,
  orderId: string,
  type: NotificationType,
  title: string,
  message: string
): Promise<{ error: string | null }> {
  const result = await createNotification({
    user_id: userId,
    type,
    title,
    message,
    data: { order_id: orderId },
  })

  return { error: result.error }
}

// ============================================
// LEER NOTIFICACIONES
// ============================================

/**
 * Obtiene notificaciones de un usuario
 */
export async function getUserNotifications(
  userId: string,
  limitCount: number = 50
): Promise<Notification[]> {
  try {
    const q = query(
      collection(db, COLLECTIONS.NOTIFICATIONS),
      where('user_id', '==', userId),
      orderBy('created_at', 'desc'),
      limit(limitCount)
    )

    const snapshot = await getDocs(q)
    
    return snapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...docSnap.data(),
    } as Notification))
  } catch (error) {
    console.error('Error obteniendo notificaciones:', error)
    return []
  }
}

/**
 * Obtiene notificaciones no leídas
 */
export async function getUnreadNotifications(
  userId: string
): Promise<Notification[]> {
  try {
    const q = query(
      collection(db, COLLECTIONS.NOTIFICATIONS),
      where('user_id', '==', userId),
      where('is_read', '==', false),
      orderBy('created_at', 'desc')
    )

    const snapshot = await getDocs(q)
    
    return snapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...docSnap.data(),
    } as Notification))
  } catch (error) {
    console.error('Error obteniendo notificaciones no leídas:', error)
    return []
  }
}

/**
 * Cuenta notificaciones no leídas
 */
export async function countUnreadNotifications(userId: string): Promise<number> {
  const notifications = await getUnreadNotifications(userId)
  return notifications.length
}

// ============================================
// ACTUALIZAR NOTIFICACIONES
// ============================================

/**
 * Marca una notificación como leída
 */
export async function markAsRead(
  notificationId: string
): Promise<{ error: string | null }> {
  try {
    await updateDoc(doc(db, COLLECTIONS.NOTIFICATIONS, notificationId), {
      is_read: true,
      read_at: serverTimestamp(),
    })

    return { error: null }
  } catch (error: unknown) {
    console.error('Error marcando como leída:', error)
    return { error: 'Error al marcar la notificación' }
  }
}

/**
 * Marca todas las notificaciones como leídas
 */
export async function markAllAsRead(
  userId: string
): Promise<{ error: string | null }> {
  try {
    const unread = await getUnreadNotifications(userId)
    
    if (unread.length === 0) {
      return { error: null }
    }

    const batch = writeBatch(db)
    
    unread.forEach(notification => {
      const docRef = doc(db, COLLECTIONS.NOTIFICATIONS, notification.id)
      batch.update(docRef, {
        is_read: true,
        read_at: serverTimestamp(),
      })
    })

    await batch.commit()

    return { error: null }
  } catch (error: unknown) {
    console.error('Error marcando todas como leídas:', error)
    return { error: 'Error al marcar las notificaciones' }
  }
}

// ============================================
// ELIMINAR NOTIFICACIONES
// ============================================

/**
 * Elimina una notificación
 */
export async function deleteNotification(
  notificationId: string
): Promise<{ error: string | null }> {
  try {
    await deleteDoc(doc(db, COLLECTIONS.NOTIFICATIONS, notificationId))
    return { error: null }
  } catch (error: unknown) {
    console.error('Error eliminando notificación:', error)
    return { error: 'Error al eliminar la notificación' }
  }
}

/**
 * Elimina todas las notificaciones de un usuario
 */
export async function deleteAllNotifications(
  userId: string
): Promise<{ error: string | null }> {
  try {
    const notifications = await getUserNotifications(userId, 500)
    
    if (notifications.length === 0) {
      return { error: null }
    }

    const batch = writeBatch(db)
    
    notifications.forEach(notification => {
      const docRef = doc(db, COLLECTIONS.NOTIFICATIONS, notification.id)
      batch.delete(docRef)
    })

    await batch.commit()

    return { error: null }
  } catch (error: unknown) {
    console.error('Error eliminando notificaciones:', error)
    return { error: 'Error al eliminar las notificaciones' }
  }
}

// ============================================
// TIEMPO REAL
// ============================================

/**
 * Escucha notificaciones en tiempo real
 */
export function subscribeToNotifications(
  userId: string,
  callback: (notifications: Notification[]) => void
): Unsubscribe {
  const q = query(
    collection(db, COLLECTIONS.NOTIFICATIONS),
    where('user_id', '==', userId),
    orderBy('created_at', 'desc'),
    limit(50)
  )
  
  return onSnapshot(q, (snapshot) => {
    const notifications = snapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...docSnap.data(),
    } as Notification))
    callback(notifications)
  }, (error) => {
    console.error('Error en suscripción a notificaciones:', error)
    callback([])
  })
}

/**
 * Escucha el conteo de notificaciones no leídas
 */
export function subscribeToUnreadCount(
  userId: string,
  callback: (count: number) => void
): Unsubscribe {
  const q = query(
    collection(db, COLLECTIONS.NOTIFICATIONS),
    where('user_id', '==', userId),
    where('is_read', '==', false)
  )
  
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.length)
  }, (error) => {
    console.error('Error en suscripción a conteo:', error)
    callback(0)
  })
}

// ============================================
// HELPERS PARA CREAR NOTIFICACIONES DE PEDIDOS
// ============================================

/**
 * Notificaciones predefinidas para estados de pedido
 */
export const ORDER_NOTIFICATIONS = {
  confirmed: {
    title: '¡Pedido confirmado!',
    message: 'El restaurante ha confirmado tu pedido y comenzará a prepararlo.',
  },
  preparing: {
    title: 'Preparando tu pedido',
    message: 'Tu pedido está siendo preparado con mucho cariño.',
  },
  ready: {
    title: 'Pedido listo',
    message: 'Tu pedido está listo. Buscando repartidor cercano...',
  },
  picked_up: {
    title: 'Pedido recogido',
    message: 'El repartidor ha recogido tu pedido.',
  },
  delivering: {
    title: '¡En camino!',
    message: 'Tu pedido está en camino. ¡Ya casi llega!',
  },
  delivered: {
    title: '¡Pedido entregado!',
    message: '¡Disfruta tu comida! Gracias por usar ZAVO.',
  },
  cancelled: {
    title: 'Pedido cancelado',
    message: 'Tu pedido ha sido cancelado. Si tienes dudas, contáctanos.',
  },
} as const

/**
 * Crea notificación automática según el estado del pedido
 */
export async function notifyOrderStatusChange(
  userId: string,
  orderId: string,
  status: keyof typeof ORDER_NOTIFICATIONS
): Promise<{ error: string | null }> {
  const notification = ORDER_NOTIFICATIONS[status]
  
  if (!notification) {
    return { error: 'Estado de notificación no válido' }
  }

  return createOrderNotification(
    userId,
    orderId,
    `order_${status}` as NotificationType,
    notification.title,
    notification.message
  )
}
