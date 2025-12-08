/**
 * ============================================
 * ZAVO - QR Service (Backend)
 * ============================================
 * 
 * Servicio para generación de códigos QR en el backend
 */

const QRCode = require('qrcode')

// ============================================
// CONFIGURACIÓN
// ============================================

const QR_EXPIRATION_HOURS = 24

// ============================================
// GENERACIÓN DE QR
// ============================================

/**
 * Genera un código QR para un pedido pagado
 */
const generateOrderQR = async (orderId, userId, businessId, options = {}) => {
  try {
    const qrData = {
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
      margin: 2,
      color: {
        dark: '#16A34A', // Verde ZAVO
        light: '#FFFFFF'
      },
      width: options.size || 256
    })

    return qrCodeDataURL
  } catch (error) {
    console.error('Error generando QR:', error)
    throw new Error('No se pudo generar el código QR')
  }
}

module.exports = {
  generateOrderQR
}
