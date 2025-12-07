/**
 * ============================================
 * ZAVO - Firebase Order Service
 * ============================================
 * 
 * Sistema completo de pedidos con Firebase
 * Incluye: crear, actualizar estado, tracking en tiempo real
 */

import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
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
  Order, 
  OrderItem, 
  OrderLocation,
  OrderStatus, 
 
  COLLECTIONS 
} from '../../types/firebase'

// ============================================
// TIPOS
// ============================================

export interface CreateOrderInput {
  user_id: string
  user_name: string
  user_phone?: string
  business_id: string
  business_name: string
  items: Array<{
    product_id: string
    product_name: string
    product_image?: string
    quantity: number
    unit_price: number
  }>
  delivery_address: string
  delivery_coordinates: { lat: number; lng: number }
  pickup_address: string
  pickup_coordinates: { lat: number; lng: number }
  notes?: string
}

export interface OrderWithItems extends Order {
  items: OrderItem[]
}

// ============================================
// CREAR PEDIDO
// ============================================

/**
 * Crea un nuevo pedido con sus items
 */
export async function createOrder(
  input: CreateOrderInput
): Promise<{ order: Order | null; error: string | null }> {
  try {
    // Calcular totales
    const subtotal = input.items.reduce(
      (sum, item) => sum + item.unit_price * item.quantity,
      0
    )
    const delivery_fee = 3500 // Fee fijo por ahora
    const total = subtotal + delivery_fee

    // Crear orden
    const orderData: Omit<Order, 'id'> = {
      user_id: input.user_id,
      user_name: input.user_name,
      user_phone: input.user_phone,
      business_id: input.business_id,
      business_name: input.business_name,
      status: 'pending',
      subtotal,
      delivery_fee,
      total,
      pickup_address: input.pickup_address,
      pickup_coordinates: input.pickup_coordinates,
      delivery_address: input.delivery_address,
      delivery_coordinates: input.delivery_coordinates,
      notes: input.notes,
      created_at: serverTimestamp(),
    }

    // Usar batch para crear orden e items atómicamente
    const batch = writeBatch(db)

    // Crear documento de orden
    const orderRef = doc(collection(db, COLLECTIONS.ORDERS))
    batch.set(orderRef, orderData)

    // Crear items como subcolección
    for (const item of input.items) {
      const itemRef = doc(
        collection(db, COLLECTIONS.ORDERS, orderRef.id, COLLECTIONS.ORDER_ITEMS)
      )
      batch.set(itemRef, {
        product_id: item.product_id,
        product_name: item.product_name,
        product_image: item.product_image || '',
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.unit_price * item.quantity,
      })
    }

    // Ejecutar batch
    await batch.commit()

    const order: Order = {
      id: orderRef.id,
      ...orderData,
      created_at: new Date().toISOString(),
    }

    return { order, error: null }
  } catch (error: any) {
    console.error('Error creando pedido:', error)
    return { order: null, error: 'Error al crear el pedido' }
  }
}

// ============================================
// LEER PEDIDOS
// ============================================

/**
 * Obtiene un pedido por ID
 */
export async function getOrder(id: string): Promise<Order | null> {
  try {
    const docRef = doc(db, COLLECTIONS.ORDERS, id)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as Order
    }

    return null
  } catch (error) {
    console.error('Error obteniendo pedido:', error)
    return null
  }
}

/**
 * Obtiene un pedido con sus items
 */
export async function getOrderWithItems(id: string): Promise<OrderWithItems | null> {
  try {
    const order = await getOrder(id)
    if (!order) return null

    // Obtener items
    const itemsRef = collection(db, COLLECTIONS.ORDERS, id, COLLECTIONS.ORDER_ITEMS)
    const itemsSnap = await getDocs(itemsRef)

    const items: OrderItem[] = itemsSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as OrderItem))

    return { ...order, items }
  } catch (error) {
    console.error('Error obteniendo pedido con items:', error)
    return null
  }
}

/**
 * Obtiene pedidos de un usuario
 */
export async function getUserOrders(
  userId: string,
  limitCount: number = 20
): Promise<Order[]> {
  try {
    const q = query(
      collection(db, COLLECTIONS.ORDERS),
      where('user_id', '==', userId),
      orderBy('created_at', 'desc'),
      limit(limitCount)
    )

    const snapshot = await getDocs(q)
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as Order))
  } catch (error) {
    console.error('Error obteniendo pedidos del usuario:', error)
    return []
  }
}

/**
 * Obtiene pedidos de un negocio
 */
export async function getBusinessOrders(
  businessId: string,
  status?: OrderStatus,
  limitCount: number = 50
): Promise<Order[]> {
  try {
    let q = query(
      collection(db, COLLECTIONS.ORDERS),
      where('business_id', '==', businessId),
      orderBy('created_at', 'desc'),
      limit(limitCount)
    )

    if (status) {
      q = query(
        collection(db, COLLECTIONS.ORDERS),
        where('business_id', '==', businessId),
        where('status', '==', status),
        orderBy('created_at', 'desc'),
        limit(limitCount)
      )
    }

    const snapshot = await getDocs(q)
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as Order))
  } catch (error) {
    console.error('Error obteniendo pedidos del negocio:', error)
    return []
  }
}

/**
 * Obtiene pedidos activos (para admin/dashboard)
 */
export async function getActiveOrders(limitCount: number = 50): Promise<Order[]> {
  try {
    const activeStatuses: OrderStatus[] = [
      'pending', 'confirmed', 'preparing', 'ready', 'picked_up', 'delivering'
    ]

    const q = query(
      collection(db, COLLECTIONS.ORDERS),
      where('status', 'in', activeStatuses),
      orderBy('created_at', 'desc'),
      limit(limitCount)
    )

    const snapshot = await getDocs(q)
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as Order))
  } catch (error) {
    console.error('Error obteniendo pedidos activos:', error)
    return []
  }
}

// ============================================
// ACTUALIZAR ESTADO
// ============================================

/**
 * Actualiza el estado de un pedido
 */
export async function updateOrderStatus(
  orderId: string,
  newStatus: OrderStatus,
  additionalData?: Partial<Order>
): Promise<{ error: string | null }> {
  try {
    const timestampField = `${newStatus}_at`
    
    await updateDoc(doc(db, COLLECTIONS.ORDERS, orderId), {
      status: newStatus,
      [timestampField]: serverTimestamp(),
      updated_at: serverTimestamp(),
      ...additionalData,
    })

    return { error: null }
  } catch (error: any) {
    console.error('Error actualizando estado:', error)
    return { error: 'Error al actualizar el estado del pedido' }
  }
}

/**
 * Asigna un repartidor a un pedido
 */
export async function assignDriver(
  orderId: string,
  driverId: string,
  driverName: string
): Promise<{ error: string | null }> {
  return updateOrderStatus(orderId, 'picked_up', {
    driver_id: driverId,
    driver_name: driverName,
  })
}

/**
 * Cancela un pedido
 */
export async function cancelOrder(
  orderId: string,
  reason?: string
): Promise<{ error: string | null }> {
  return updateOrderStatus(orderId, 'cancelled', {
    cancellation_reason: reason,
  })
}

// ============================================
// TRACKING EN TIEMPO REAL
// ============================================

/**
 * Escucha cambios en un pedido en tiempo real
 */
export function subscribeToOrder(
  orderId: string,
  callback: (order: Order | null) => void
): Unsubscribe {
  const docRef = doc(db, COLLECTIONS.ORDERS, orderId)
  
  return onSnapshot(docRef, (snapshot) => {
    if (snapshot.exists()) {
      callback({
        id: snapshot.id,
        ...snapshot.data(),
      } as Order)
    } else {
      callback(null)
    }
  }, (error) => {
    console.error('Error en suscripción a pedido:', error)
    callback(null)
  })
}

/**
 * Escucha cambios en los pedidos de un usuario
 */
export function subscribeToUserOrders(
  userId: string,
  callback: (orders: Order[]) => void
): Unsubscribe {
  const q = query(
    collection(db, COLLECTIONS.ORDERS),
    where('user_id', '==', userId),
    orderBy('created_at', 'desc'),
    limit(20)
  )
  
  return onSnapshot(q, (snapshot) => {
    const orders = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as Order))
    callback(orders)
  }, (error) => {
    console.error('Error en suscripción a pedidos:', error)
    callback([])
  })
}

/**
 * Escucha ubicaciones del repartidor en tiempo real
 */
export function subscribeToOrderLocations(
  orderId: string,
  callback: (locations: OrderLocation[]) => void
): Unsubscribe {
  const locationsRef = collection(
    db, 
    COLLECTIONS.ORDERS, 
    orderId, 
    COLLECTIONS.ORDER_LOCATIONS
  )
  
  const q = query(locationsRef, orderBy('timestamp', 'desc'), limit(50))
  
  return onSnapshot(q, (snapshot) => {
    const locations = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as OrderLocation))
    callback(locations)
  }, (error) => {
    console.error('Error en suscripción a ubicaciones:', error)
    callback([])
  })
}

/**
 * Agrega una ubicación del repartidor
 */
export async function addOrderLocation(
  orderId: string,
  location: { lat: number; lng: number; accuracy?: number; heading?: number; speed?: number }
): Promise<{ error: string | null }> {
  try {
    const locationsRef = collection(
      db, 
      COLLECTIONS.ORDERS, 
      orderId, 
      COLLECTIONS.ORDER_LOCATIONS
    )

    await addDoc(locationsRef, {
      ...location,
      timestamp: serverTimestamp(),
    })

    // También actualizar la ubicación en el pedido principal
    await updateDoc(doc(db, COLLECTIONS.ORDERS, orderId), {
      'courier_location': location,
      updated_at: serverTimestamp(),
    })

    return { error: null }
  } catch (error: any) {
    console.error('Error agregando ubicación:', error)
    return { error: 'Error al registrar ubicación' }
  }
}

// ============================================
// ELIMINAR PEDIDO
// ============================================

/**
 * Elimina un pedido (solo admin)
 */
export async function deleteOrder(orderId: string): Promise<{ error: string | null }> {
  try {
    // Eliminar items primero
    const itemsRef = collection(db, COLLECTIONS.ORDERS, orderId, COLLECTIONS.ORDER_ITEMS)
    const itemsSnap = await getDocs(itemsRef)
    
    const batch = writeBatch(db)
    itemsSnap.docs.forEach(doc => {
      batch.delete(doc.ref)
    })

    // Eliminar ubicaciones
    const locationsRef = collection(db, COLLECTIONS.ORDERS, orderId, COLLECTIONS.ORDER_LOCATIONS)
    const locationsSnap = await getDocs(locationsRef)
    locationsSnap.docs.forEach(doc => {
      batch.delete(doc.ref)
    })

    // Eliminar pedido
    batch.delete(doc(db, COLLECTIONS.ORDERS, orderId))

    await batch.commit()

    return { error: null }
  } catch (error: any) {
    console.error('Error eliminando pedido:', error)
    return { error: 'Error al eliminar el pedido' }
  }
}
