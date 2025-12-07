/**
 * ============================================
 * ZAVO - Orders Routes (Firebase Functions)
 * ============================================
 * 
 * Rutas para manejo de pedidos y códigos QR
 */

const express = require('express')
const { admin, db } = require('../config/firebase')
const { authenticateToken } = require('../middleware/auth')
const Joi = require('joi')
const crypto = require('crypto')

const router = express.Router()

// ============================================
// ESQUEMAS DE VALIDACIÓN
// ============================================

const createOrderSchema = Joi.object({
  pack_id: Joi.string().required(),
  cantidad: Joi.number().integer().min(1).required(),
  notas: Joi.string().optional().allow(''),
  fecha_retiro: Joi.string().isoDate().optional()
})

const verifyQRSchema = Joi.object({
  qrContent: Joi.string().required()
})

// ============================================
// UTILIDADES
// ============================================

const generateOrderId = () => {
  return 'order_' + crypto.randomBytes(8).toString('hex')
}

const generateQRData = (orderId, userId, businessId) => {
  const now = new Date()
  const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000) // 24 horas

  return {
    orderId,
    userId,
    businessId,
    timestamp: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
    status: 'activo'
  }
}

const validateQRData = (qrData) => {
  const now = new Date()
  const expiresAt = new Date(qrData.expiresAt)
  
  if (now > expiresAt) {
    return { valid: false, reason: 'QR expirado' }
  }
  
  if (qrData.status !== 'activo') {
    return { valid: false, reason: 'QR ya utilizado' }
  }
  
  return { valid: true }
}

// ============================================
// RUTAS
// ============================================

/**
 * POST /orders
 * Crear un nuevo pedido
 */
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { error, value } = createOrderSchema.validate(req.body)
    if (error) {
      return res.status(400).json({
        error: 'Datos inválidos',
        details: error.details[0].message
      })
    }

    const { pack_id, cantidad, notas, fecha_retiro } = value
    const userId = req.user.uid

    // Verificar que el pack existe y está activo
    const packDoc = await db.collection('packs').doc(pack_id).get()
    if (!packDoc.exists) {
      return res.status(404).json({ error: 'Pack no encontrado' })
    }

    const packData = packDoc.data()
    if (!packData.activo) {
      return res.status(400).json({ error: 'Pack no disponible' })
    }

    if (packData.stock < cantidad) {
      return res.status(400).json({ error: 'Stock insuficiente' })
    }

    // Crear el pedido
    const orderId = generateOrderId()
    const businessId = packData.business_id
    const precioTotal = packData.precio_descuento * cantidad

    // Generar datos del QR
    const qrData = generateQRData(orderId, userId, businessId)

    const orderData = {
      id: orderId,
      user_id: userId,
      pack_id,
      business_id: businessId,
      cantidad,
      precio_total: precioTotal,
      estado: 'pendiente',
      qr_data: qrData,
      notas: notas || null,
      fecha_retiro: fecha_retiro || null,
      fecha_entrega: null,
      created_at: admin.firestore.FieldValue.serverTimestamp(),
      updated_at: admin.firestore.FieldValue.serverTimestamp()
    }

    // Guardar en Firestore
    await db.collection('orders').doc(orderId).set(orderData)

    // Actualizar stock del pack
    await db.collection('packs').doc(pack_id).update({
      stock: admin.firestore.FieldValue.increment(-cantidad),
      updated_at: admin.firestore.FieldValue.serverTimestamp()
    })

    // Respuesta con datos del pedido y QR
    res.status(201).json({
      message: 'Pedido creado exitosamente',
      order: {
        ...orderData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      qrData
    })

  } catch (error) {
    console.error('Error creando pedido:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

/**
 * GET /orders/:id
 * Obtener un pedido específico
 */
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user.uid

    const orderDoc = await db.collection('orders').doc(id).get()
    if (!orderDoc.exists) {
      return res.status(404).json({ error: 'Pedido no encontrado' })
    }

    const orderData = orderDoc.data()

    // Verificar que el usuario puede ver este pedido
    if (orderData.user_id !== userId && req.user.role !== 'negocio') {
      return res.status(403).json({ error: 'No autorizado' })
    }

    // Si es un negocio, verificar que es su pedido
    if (req.user.role === 'negocio' && orderData.business_id !== req.user.business_id) {
      return res.status(403).json({ error: 'No autorizado' })
    }

    // Obtener datos relacionados
    const [packDoc, userDoc, businessDoc] = await Promise.all([
      db.collection('packs').doc(orderData.pack_id).get(),
      db.collection('users').doc(orderData.user_id).get(),
      db.collection('businesses').doc(orderData.business_id).get()
    ])

    const response = {
      ...orderData,
      pack: packDoc.exists ? packDoc.data() : null,
      user: userDoc.exists ? userDoc.data() : null,
      business: businessDoc.exists ? businessDoc.data() : null
    }

    res.json(response)

  } catch (error) {
    console.error('Error obteniendo pedido:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

/**
 * GET /orders
 * Obtener pedidos del usuario o negocio
 */
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.uid
    const { status, limit = 20, offset = 0 } = req.query

    let query = db.collection('orders')

    // Filtrar por usuario o negocio
    if (req.user.role === 'negocio') {
      query = query.where('business_id', '==', req.user.business_id)
    } else {
      query = query.where('user_id', '==', userId)
    }

    // Filtrar por estado si se especifica
    if (status) {
      query = query.where('estado', '==', status)
    }

    // Ordenar y paginar
    query = query.orderBy('created_at', 'desc')
      .limit(parseInt(limit))
      .offset(parseInt(offset))

    const snapshot = await query.get()
    const orders = []

    for (const doc of snapshot.docs) {
      const orderData = doc.data()
      
      // Obtener datos relacionados
      const [packDoc, userDoc, businessDoc] = await Promise.all([
        db.collection('packs').doc(orderData.pack_id).get(),
        db.collection('users').doc(orderData.user_id).get(),
        db.collection('businesses').doc(orderData.business_id).get()
      ])

      orders.push({
        ...orderData,
        pack: packDoc.exists ? packDoc.data() : null,
        user: userDoc.exists ? userDoc.data() : null,
        business: businessDoc.exists ? businessDoc.data() : null
      })
    }

    res.json({
      orders,
      total: snapshot.size,
      limit: parseInt(limit),
      offset: parseInt(offset)
    })

  } catch (error) {
    console.error('Error obteniendo pedidos:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

/**
 * POST /orders/verify-qr
 * Verificar código QR y obtener información del pedido
 */
router.post('/verify-qr', authenticateToken, async (req, res) => {
  try {
    const { error, value } = verifyQRSchema.validate(req.body)
    if (error) {
      return res.status(400).json({
        error: 'Datos inválidos',
        details: error.details[0].message
      })
    }

    const { qrContent } = value

    // Parsear contenido del QR
    let qrData
    try {
      qrData = JSON.parse(qrContent)
    } catch (parseError) {
      return res.status(400).json({
        valid: false,
        error: 'Formato de QR inválido',
        message: 'El código QR no tiene un formato válido'
      })
    }

    // Validar estructura del QR
    if (!qrData.orderId || !qrData.userId || !qrData.businessId) {
      return res.status(400).json({
        valid: false,
        error: 'QR incompleto',
        message: 'El código QR no contiene toda la información necesaria'
      })
    }

    // Validar expiración y estado
    const validation = validateQRData(qrData)
    if (!validation.valid) {
      return res.status(400).json({
        valid: false,
        error: validation.reason,
        message: validation.reason === 'QR expirado' 
          ? 'Este código QR ha expirado'
          : 'Este código QR ya fue utilizado'
      })
    }

    // Verificar que el pedido existe
    const orderDoc = await db.collection('orders').doc(qrData.orderId).get()
    if (!orderDoc.exists) {
      return res.status(404).json({
        valid: false,
        error: 'Pedido no encontrado',
        message: 'No se encontró el pedido asociado a este QR'
      })
    }

    const orderData = orderDoc.data()

    // Verificar que el negocio puede procesar este pedido
    if (req.user.role === 'negocio' && orderData.business_id !== req.user.business_id) {
      return res.status(403).json({
        valid: false,
        error: 'No autorizado',
        message: 'Este pedido no pertenece a tu negocio'
      })
    }

    // Verificar que el pedido no ha sido entregado
    if (orderData.estado === 'entregado') {
      return res.status(400).json({
        valid: false,
        error: 'Pedido ya entregado',
        message: 'Este pedido ya fue entregado anteriormente'
      })
    }

    // Obtener datos relacionados
    const [packDoc, userDoc, businessDoc] = await Promise.all([
      db.collection('packs').doc(orderData.pack_id).get(),
      db.collection('users').doc(orderData.user_id).get(),
      db.collection('businesses').doc(orderData.business_id).get()
    ])

    const completeOrder = {
      ...orderData,
      pack: packDoc.exists ? packDoc.data() : null,
      user: userDoc.exists ? userDoc.data() : null,
      business: businessDoc.exists ? businessDoc.data() : null
    }

    res.json({
      valid: true,
      message: 'QR válido - Pedido confirmado',
      order: completeOrder
    })

  } catch (error) {
    console.error('Error verificando QR:', error)
    res.status(500).json({
      valid: false,
      error: 'Error interno del servidor',
      message: 'No se pudo verificar el código QR'
    })
  }
})

/**
 * POST /orders/:id/confirm-delivery
 * Confirmar entrega de un pedido
 */
router.post('/:id/confirm-delivery', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params

    // Verificar que el pedido existe
    const orderDoc = await db.collection('orders').doc(id).get()
    if (!orderDoc.exists) {
      return res.status(404).json({ error: 'Pedido no encontrado' })
    }

    const orderData = orderDoc.data()

    // Verificar que el negocio puede confirmar este pedido
    if (req.user.role !== 'negocio' || orderData.business_id !== req.user.business_id) {
      return res.status(403).json({ error: 'No autorizado' })
    }

    // Verificar que el pedido no ha sido entregado
    if (orderData.estado === 'entregado') {
      return res.status(400).json({ error: 'Pedido ya entregado' })
    }

    // Actualizar estado del pedido
    const updateData = {
      estado: 'entregado',
      fecha_entrega: admin.firestore.FieldValue.serverTimestamp(),
      updated_at: admin.firestore.FieldValue.serverTimestamp()
    }

    // Marcar QR como usado
    if (orderData.qr_data) {
      updateData['qr_data.status'] = 'usado'
    }

    await db.collection('orders').doc(id).update(updateData)

    res.json({
      message: 'Entrega confirmada exitosamente',
      order: {
        ...orderData,
        estado: 'entregado',
        fecha_entrega: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Error confirmando entrega:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

/**
 * PUT /orders/:id/status
 * Actualizar estado de un pedido
 */
router.put('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    const { estado } = req.body

    const validStates = ['pendiente', 'confirmado', 'preparando', 'listo', 'entregado', 'cancelado']
    if (!validStates.includes(estado)) {
      return res.status(400).json({ error: 'Estado inválido' })
    }

    // Verificar que el pedido existe
    const orderDoc = await db.collection('orders').doc(id).get()
    if (!orderDoc.exists) {
      return res.status(404).json({ error: 'Pedido no encontrado' })
    }

    const orderData = orderDoc.data()

    // Verificar permisos
    if (req.user.role === 'negocio' && orderData.business_id !== req.user.business_id) {
      return res.status(403).json({ error: 'No autorizado' })
    }

    if (req.user.role === 'usuario' && orderData.user_id !== req.user.uid) {
      return res.status(403).json({ error: 'No autorizado' })
    }

    // Actualizar estado
    const updateData = {
      estado,
      updated_at: admin.firestore.FieldValue.serverTimestamp()
    }

    if (estado === 'entregado') {
      updateData.fecha_entrega = admin.firestore.FieldValue.serverTimestamp()
      if (orderData.qr_data) {
        updateData['qr_data.status'] = 'usado'
      }
    }

    await db.collection('orders').doc(id).update(updateData)

    res.json({
      message: 'Estado actualizado exitosamente',
      order: {
        ...orderData,
        estado,
        updated_at: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Error actualizando estado:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

module.exports = router
