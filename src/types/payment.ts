/**
 * ============================================
 * ZAVO - Payment & Order Types
 * ============================================
 * 
 * Tipos para sistema de pagos y pedidos
 */

// ============================================
// ENUMS
// ============================================

export type PaymentStatus = 'PENDIENTE' | 'PROCESANDO' | 'PAGADO' | 'FALLIDO' | 'REEMBOLSADO'
export type PaymentMethod = 'STRIPE' | 'MERCADOPAGO' | 'PAYU' | 'NEQUI' | 'DAVIPLATA' | 'EFECTIVO'
export type OrderStatus = 'CREADO' | 'CONFIRMADO' | 'PREPARANDO' | 'LISTO' | 'ENTREGADO' | 'CANCELADO'

// ============================================
// INTERFACES DE PAGO
// ============================================

/**
 * PaymentDetails - Información detallada del pago
 */
export interface PaymentDetails {
  id: string
  orderId: string
  amount: number
  currency: string
  method: PaymentMethod
  status: PaymentStatus
  
  // Información de la pasarela
  gatewayTransactionId?: string
  gatewayResponse?: any
  
  // Timestamps
  createdAt: string
  paidAt?: string
  failedAt?: string
  
  // Información adicional
  description?: string
  customerEmail?: string
  failureReason?: string
}

/**
 * PaymentWebhookData - Datos del webhook de pago
 */
export interface PaymentWebhookData {
  transactionId: string
  orderId: string
  status: PaymentStatus
  amount: number
  currency: string
  method: PaymentMethod
  timestamp: string
  gatewayData: any
}

// ============================================
// MODELO COMPLETO DE PEDIDO
// ============================================

/**
 * Order - Modelo completo del pedido con información de pago
 */
export interface Order {
  // Identificadores
  id: string
  userId: string
  packId: string
  businessId: string
  
  // Información del pedido
  cantidad: number
  precioUnitario: number
  precioTotal: number
  descuento?: number
  impuestos?: number
  
  // Estados
  orderStatus: OrderStatus
  paymentStatus: PaymentStatus
  
  // Información de pago
  paymentDetails: PaymentDetails
  
  // QR (solo se genera cuando está pagado)
  qrCode?: string
  qrData?: {
    orderId: string
    userId: string
    businessId: string
    total: number
    timestamp: string
    expiresAt: string
  }
  
  // Información adicional
  notas?: string
  fechaRetiro?: string
  fechaEntrega?: string
  
  // Timestamps
  createdAt: string
  updatedAt: string
  paidAt?: string
  
  // Relaciones (populadas según necesidad)
  pack?: {
    id: string
    titulo: string
    descripcion: string
    precio: number
    business: {
      id: string
      nombre: string
      direccion: string
    }
  }
  
  user?: {
    id: string
    nombre: string
    email: string
    telefono?: string
  }
}

// ============================================
// RESPUESTAS DE API
// ============================================

/**
 * CreateOrderResponse - Respuesta al crear pedido
 */
export interface CreateOrderResponse {
  order: Order
  paymentUrl: string // URL para redirigir al usuario a pagar
  message: string
}

/**
 * OrderDetailResponse - Respuesta con detalle del pedido
 */
export interface OrderDetailResponse {
  order: Order
  canShowQR: boolean // Helper para determinar si mostrar QR
  message: string
}

/**
 * PaymentWebhookResponse - Respuesta del webhook
 */
export interface PaymentWebhookResponse {
  success: boolean
  orderId: string
  newStatus: PaymentStatus
  message: string
}
