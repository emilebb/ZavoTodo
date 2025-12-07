/**
 * ============================================
 * ZAVO - QR Service
 * ============================================
 * 
 * Servicio para generación y manejo de códigos QR
 */

import QRCode from 'qrcode'
import { QRData, QRVerification } from '../types'

// ============================================
// CONFIGURACIÓN
// ============================================

const QR_EXPIRATION_HOURS = 24 // QR expira en 24 horas
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://us-central1-zavowebmobil.cloudfunctions.net/api'

// ============================================
// GENERACIÓN DE QR
// ============================================

/**
 * Genera un código QR para un pedido
 */
export const generateOrderQR = async (
  orderId: string,
  userId: string,
  businessId: string
): Promise<string> => {
  try {
    const qrData: QRData = {
      orderId,
      userId,
      businessId,
      timestamp: new Date().toISOString(),
      expiresAt: new Date(Date.now() + QR_EXPIRATION_HOURS * 60 * 60 * 1000).toISOString(),
      status: 'activo'
    }

    // Convertir a JSON string para el QR
    const qrContent = JSON.stringify(qrData)

    // Generar QR code como Data URL
    const qrCodeDataURL = await QRCode.toDataURL(qrContent, {
      errorCorrectionLevel: 'M',
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      width: 256
    })

    return qrCodeDataURL
  } catch (error) {
    console.error('Error generando QR:', error)
    throw new Error('No se pudo generar el código QR')
  }
}

/**
 * Genera QR con opciones personalizadas para ZAVO
 */
export const generateZavoQR = async (
  orderId: string,
  userId: string,
  businessId: string,
  options?: {
    size?: number
    logo?: boolean
  }
): Promise<string> => {
  try {
    const qrData: QRData = {
      orderId,
      userId,
      businessId,
      timestamp: new Date().toISOString(),
      expiresAt: new Date(Date.now() + QR_EXPIRATION_HOURS * 60 * 60 * 1000).toISOString(),
      status: 'activo'
    }

    const qrContent = JSON.stringify(qrData)
    const size = options?.size || 256

    const qrCodeDataURL = await QRCode.toDataURL(qrContent, {
      errorCorrectionLevel: 'H', // Alta corrección para poder agregar logo
      margin: 2,
      color: {
        dark: '#16A34A', // Verde ZAVO
        light: '#FFFFFF'
      },
      width: size
    })

    return qrCodeDataURL
  } catch (error) {
    console.error('Error generando QR ZAVO:', error)
    throw new Error('No se pudo generar el código QR')
  }
}

// ============================================
// VALIDACIÓN DE QR
// ============================================

/**
 * Valida el contenido de un QR escaneado
 */
export const validateQRContent = (qrContent: string): QRData | null => {
  try {
    const qrData: QRData = JSON.parse(qrContent)

    // Validar estructura
    if (!qrData.orderId || !qrData.userId || !qrData.businessId) {
      return null
    }

    // Validar expiración
    const now = new Date()
    const expiresAt = new Date(qrData.expiresAt)
    
    if (now > expiresAt) {
      return { ...qrData, status: 'expirado' }
    }

    return qrData
  } catch (error) {
    console.error('Error validando QR:', error)
    return null
  }
}

/**
 * Verifica un QR con el backend
 */
export const verifyQRWithBackend = async (qrContent: string): Promise<QRVerification> => {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/verify-qr`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('zavo_auth_token')}`
      },
      body: JSON.stringify({ qrContent })
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const result: QRVerification = await response.json()
    return result
  } catch (error) {
    console.error('Error verificando QR:', error)
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
      message: 'No se pudo verificar el código QR'
    }
  }
}

// ============================================
// UTILIDADES
// ============================================

/**
 * Extrae datos del QR sin validar con backend
 */
export const parseQRData = (qrContent: string): QRData | null => {
  return validateQRContent(qrContent)
}

/**
 * Verifica si un QR ha expirado
 */
export const isQRExpired = (qrData: QRData): boolean => {
  const now = new Date()
  const expiresAt = new Date(qrData.expiresAt)
  return now > expiresAt
}

/**
 * Formatea la fecha de expiración del QR
 */
export const formatQRExpiration = (qrData: QRData): string => {
  const expiresAt = new Date(qrData.expiresAt)
  return expiresAt.toLocaleString('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// ============================================
// MOCK DATA PARA DESARROLLO
// ============================================

/**
 * Genera datos mock para testing
 */
export const generateMockQR = async (): Promise<string> => {
  return generateOrderQR(
    'order_mock_123',
    'user_mock_456',
    'business_mock_789'
  )
}

/**
 * Simula verificación exitosa para desarrollo
 */
export const mockQRVerification = (): QRVerification => {
  return {
    valid: true,
    message: 'QR válido - Pedido confirmado',
    order: {
      id: 'order_mock_123',
      user_id: 'user_mock_456',
      pack_id: 'pack_mock_789',
      business_id: 'business_mock_789',
      cantidad: 1,
      precio_total: 15000,
      estado: 'listo',
      created_at: new Date().toISOString(),
      user: {
        id: 'user_mock_456',
        nombre: 'Juan Pérez',
        email: 'juan@example.com',
        rol: 'usuario',
        created_at: new Date().toISOString()
      },
      pack: {
        id: 'pack_mock_789',
        business_id: 'business_mock_789',
        titulo: 'Pack Sorpresa Panadería',
        descripcion: 'Deliciosos panes del día',
        precio_original: 25000,
        precio_descuento: 15000,
        porcentaje_descuento: 40,
        stock: 5,
        hora_retiro_desde: '18:00',
        hora_retiro_hasta: '20:00',
        activo: true,
        created_at: new Date().toISOString()
      }
    }
  }
}
