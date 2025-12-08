/**
 * ============================================
 * ZAVO - Payment Routes (Firebase Functions)
 * ============================================
 * 
 * Rutas para manejo de pagos y webhooks
 */

const express = require('express')
const { admin, db } = require('../config/firebase')
const { authenticateToken } = require('../middleware/auth')
const { generateOrderQR } = require('../services/qrService')
const Joi = require('joi')
const crypto = require('crypto')

const router = express.Router()

// ============================================
// ESQUEMAS DE VALIDACIÓN
// ============================================

const createPaymentSchema = Joi.object({
  orderId: Joi.string().required(),
  amount: Joi.number().positive().required(),
  method: Joi.string().valid('STRIPE', 'MERCADOPAGO', 'PAYU', 'NEQUI', 'DAVIPLATA').required(),
  currency: Joi.string().default('COP'),
  customerEmail: Joi.string().email().required()
})

const webhookSchema = Joi.object({
  transactionId: Joi.string().required(),
  orderId: Joi.string().required(),
  status: Joi.string().valid('PAGADO', 'FALLIDO').required(),
  amount: Joi.number().positive().required(),
  method: Joi.string().required(),
  gatewayData: Joi.object().required()
})

// ============================================
// UTILIDADES
// ============================================

const generatePaymentId = () => {
  return 'pay_' + crypto.randomBytes(12).toString('hex')
}

const generateQRForOrder = async (order) => {
  try {
    const qrData = {
      orderId: order.id,
      userId: order.userId,
      businessId: order.businessId,
      total: order.precioTotal,
      timestamp: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    }

    const qrCode = await generateOrderQR(
      order.id,
      order.userId, 
      order.businessId
    )

    return { qrCode, qrData }
  } catch (error) {
    console.error('Error generando QR:', error)
    return null
  }
}

// ============================================
// RUTAS DE PAGO
// ============================================

/**
 * POST /payments/create
 * Crear un pago para un pedido
 */
router.post('/create', authenticateToken, async (req, res) => {
  try {
    const { error, value } = createPaymentSchema.validate(req.body)
    if (error) {
      return res.status(400).json({
        error: 'Datos inválidos',
        details: error.details[0].message
      })
    }

    const { orderId, amount, method, currency, customerEmail } = value
    const userId = req.user.uid

    // Verificar que el pedido existe y pertenece al usuario
    const orderDoc = await db.collection('orders').doc(orderId).get()
    if (!orderDoc.exists) {
      return res.status(404).json({ error: 'Pedido no encontrado' })
    }

    const orderData = orderDoc.data()
    if (orderData.userId !== userId) {
      return res.status(403).json({ error: 'No autorizado' })
    }

    if (orderData.paymentStatus === 'PAGADO') {
      return res.status(400).json({ error: 'El pedido ya está pagado' })
    }

    // Crear registro de pago
    const paymentId = generatePaymentId()
    const paymentDetails = {
      id: paymentId,
      orderId,
      amount,
      currency,
      method,
      status: 'PENDIENTE',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      description: `Pago pedido ZAVO #${orderId.slice(-6)}`,
      customerEmail
    }

    // Actualizar pedido con información de pago
    await db.collection('orders').doc(orderId).update({
      paymentDetails,
      paymentStatus: 'PENDIENTE',
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    })

    // Guardar pago en colección separada para tracking
    await db.collection('payments').doc(paymentId).set(paymentDetails)

    // Generar URL de pago según la pasarela
    let paymentUrl = ''
    switch (method) {
      case 'STRIPE':
        paymentUrl = `https://checkout.stripe.com/pay/${paymentId}`
        break
      case 'MERCADOPAGO':
        paymentUrl = `https://www.mercadopago.com/checkout/v1/redirect?pref_id=${paymentId}`
        break
      case 'PAYU':
        paymentUrl = `https://checkout.payulatam.com/ppp-web-gateway-payu/${paymentId}`
        break
      default:
        paymentUrl = `/payments/gateway/${method}/${paymentId}`
    }

    res.status(201).json({
      success: true,
      paymentId,
      paymentUrl,
      order: {
        ...orderData,
        paymentDetails,
        paymentStatus: 'PENDIENTE'
      },
      message: 'Pago creado exitosamente'
    })

  } catch (error) {
    console.error('Error creando pago:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

/**
 * POST /payments/webhook/:gateway
 * Webhook para recibir confirmaciones de pago
 */
router.post('/webhook/:gateway', async (req, res) => {
  try {
    const { gateway } = req.params
    
    console.log(`Webhook recibido de ${gateway}:`, req.body)

    // Validar webhook según la pasarela
    let webhookData
    switch (gateway.toLowerCase()) {
      case 'stripe':
        webhookData = await processStripeWebhook(req.body)
        break
      case 'mercadopago':
        webhookData = await processMercadoPagoWebhook(req.body)
        break
      case 'payu':
        webhookData = await processPayUWebhook(req.body)
        break
      default:
        return res.status(400).json({ error: 'Pasarela no soportada' })
    }

    if (!webhookData) {
      return res.status(400).json({ error: 'Webhook inválido' })
    }

    const { error, value } = webhookSchema.validate(webhookData)
    if (error) {
      console.error('Webhook validation error:', error)
      return res.status(400).json({ error: 'Datos de webhook inválidos' })
    }

    const { transactionId, orderId, status, amount, method, gatewayData } = value

    // Verificar que el pedido existe
    const orderDoc = await db.collection('orders').doc(orderId).get()
    if (!orderDoc.exists) {
      return res.status(404).json({ error: 'Pedido no encontrado' })
    }

    const orderData = orderDoc.data()

    // Verificar que el monto coincide
    if (Math.abs(orderData.precioTotal - amount) > 0.01) {
      console.error('Monto no coincide:', { expected: orderData.precioTotal, received: amount })
      return res.status(400).json({ error: 'Monto no coincide' })
    }

    // Preparar actualización
    const updateData = {
      paymentStatus: status,
      'paymentDetails.status': status,
      'paymentDetails.gatewayTransactionId': transactionId,
      'paymentDetails.gatewayResponse': gatewayData,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }

    if (status === 'PAGADO') {
      updateData.paidAt = admin.firestore.FieldValue.serverTimestamp()
      updateData['paymentDetails.paidAt'] = admin.firestore.FieldValue.serverTimestamp()
      
      // Generar QR cuando el pago es exitoso
      const qrResult = await generateQRForOrder(orderData)
      if (qrResult) {
        updateData.qrCode = qrResult.qrCode
        updateData.qrData = qrResult.qrData
      }

      // Cambiar estado del pedido a confirmado
      updateData.orderStatus = 'CONFIRMADO'
    } else if (status === 'FALLIDO') {
      updateData['paymentDetails.failedAt'] = admin.firestore.FieldValue.serverTimestamp()
      updateData['paymentDetails.failureReason'] = gatewayData.error || 'Pago rechazado'
    }

    // Actualizar pedido
    await db.collection('orders').doc(orderId).update(updateData)

    // Actualizar registro de pago
    await db.collection('payments').doc(orderData.paymentDetails.id).update({
      status,
      gatewayTransactionId: transactionId,
      gatewayResponse: gatewayData,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      ...(status === 'PAGADO' && { paidAt: admin.firestore.FieldValue.serverTimestamp() }),
      ...(status === 'FALLIDO' && { 
        failedAt: admin.firestore.FieldValue.serverTimestamp(),
        failureReason: gatewayData.error || 'Pago rechazado'
      })
    })

    console.log(`Pedido ${orderId} actualizado a estado: ${status}`)

    res.json({
      success: true,
      orderId,
      newStatus: status,
      message: `Pago ${status.toLowerCase()} procesado correctamente`
    })

  } catch (error) {
    console.error('Error procesando webhook:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

/**
 * GET /payments/order/:orderId
 * Obtener estado de pago de un pedido
 */
router.get('/order/:orderId', authenticateToken, async (req, res) => {
  try {
    const { orderId } = req.params
    const userId = req.user.uid

    const orderDoc = await db.collection('orders').doc(orderId).get()
    if (!orderDoc.exists) {
      return res.status(404).json({ error: 'Pedido no encontrado' })
    }

    const orderData = orderDoc.data()

    // Verificar permisos
    if (orderData.userId !== userId && req.user.role !== 'negocio') {
      return res.status(403).json({ error: 'No autorizado' })
    }

    // Obtener datos relacionados si es necesario
    const [packDoc, userDoc, businessDoc] = await Promise.all([
      db.collection('packs').doc(orderData.packId).get(),
      db.collection('users').doc(orderData.userId).get(),
      db.collection('businesses').doc(orderData.businessId).get()
    ])

    const completeOrder = {
      ...orderData,
      createdAt: orderData.createdAt?.toDate?.()?.toISOString() || orderData.createdAt,
      updatedAt: orderData.updatedAt?.toDate?.()?.toISOString() || orderData.updatedAt,
      paidAt: orderData.paidAt?.toDate?.()?.toISOString() || orderData.paidAt,
      pack: packDoc.exists ? packDoc.data() : null,
      user: userDoc.exists ? userDoc.data() : null,
      business: businessDoc.exists ? businessDoc.data() : null
    }

    res.json({
      order: completeOrder,
      canShowQR: orderData.paymentStatus === 'PAGADO',
      message: 'Pedido obtenido exitosamente'
    })

  } catch (error) {
    console.error('Error obteniendo pedido:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

// ============================================
// PROCESADORES DE WEBHOOK POR PASARELA
// ============================================

/**
 * Procesar webhook de Stripe
 */
async function processStripeWebhook(body) {
  try {
    // En producción, verificar signature de Stripe
    const { type, data } = body
    
    if (type === 'payment_intent.succeeded') {
      return {
        transactionId: data.object.id,
        orderId: data.object.metadata.orderId,
        status: 'PAGADO',
        amount: data.object.amount / 100, // Stripe usa centavos
        method: 'STRIPE',
        gatewayData: data.object
      }
    } else if (type === 'payment_intent.payment_failed') {
      return {
        transactionId: data.object.id,
        orderId: data.object.metadata.orderId,
        status: 'FALLIDO',
        amount: data.object.amount / 100,
        method: 'STRIPE',
        gatewayData: data.object
      }
    }
    
    return null
  } catch (error) {
    console.error('Error procesando webhook Stripe:', error)
    return null
  }
}

/**
 * Procesar webhook de MercadoPago
 */
async function processMercadoPagoWebhook(body) {
  try {
    const { type, data } = body
    
    if (type === 'payment') {
      const payment = data
      return {
        transactionId: payment.id.toString(),
        orderId: payment.external_reference,
        status: payment.status === 'approved' ? 'PAGADO' : 'FALLIDO',
        amount: payment.transaction_amount,
        method: 'MERCADOPAGO',
        gatewayData: payment
      }
    }
    
    return null
  } catch (error) {
    console.error('Error procesando webhook MercadoPago:', error)
    return null
  }
}

/**
 * Procesar webhook de PayU
 */
async function processPayUWebhook(body) {
  try {
    const { state_pol, reference_sale, value, transaction_id } = body
    
    return {
      transactionId: transaction_id,
      orderId: reference_sale,
      status: state_pol === '4' ? 'PAGADO' : 'FALLIDO',
      amount: parseFloat(value),
      method: 'PAYU',
      gatewayData: body
    }
  } catch (error) {
    console.error('Error procesando webhook PayU:', error)
    return null
  }
}

module.exports = router
