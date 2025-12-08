/**
 * ============================================
 * ZAVO - Order Detail Component
 * ============================================
 * 
 * Componente que muestra detalles del pedido y QR solo si está pagado
 */

import { useState, useEffect } from 'react'
import { 
  Package, 
  CreditCard, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  QrCode,
  Download,
  Share2,
  RefreshCw,
  MapPin,
  Store
} from 'lucide-react'
import { Order, PaymentStatus, OrderStatus } from '../../types/payment'
import { useAuthStore } from '../../store/authStore'
import Card from '../ui/Card'
import Button from '../ui/Button'
import Badge from '../ui/Badge'
import LoadingSpinner from '../ui/LoadingSpinner'

interface OrderDetailProps {
  orderId: string
  onPaymentRequired?: (paymentUrl: string) => void
}

const OrderDetail: React.FC<OrderDetailProps> = ({ 
  orderId, 
  onPaymentRequired 
}) => {
  const { user } = useAuthStore()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // ============================================
  // EFECTOS
  // ============================================

  useEffect(() => {
    if (orderId) {
      loadOrderDetails()
    }
  }, [orderId])

  // Polling para actualizar estado de pago cada 30 segundos si está pendiente
  useEffect(() => {
    if (order?.paymentStatus === 'PENDIENTE' || order?.paymentStatus === 'PROCESANDO') {
      const interval = setInterval(() => {
        loadOrderDetails(false) // Sin mostrar loading
      }, 30000) // 30 segundos

      return () => clearInterval(interval)
    }
  }, [order?.paymentStatus])

  // ============================================
  // FUNCIONES
  // ============================================

  const loadOrderDetails = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true)
      setError(null)

      const token = localStorage.getItem('zavo_auth_token')
      const response = await fetch(`${import.meta.env.VITE_API_URL}/payments/order/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      setOrder(data.order)

    } catch (err) {
      console.error('Error cargando pedido:', err)
      setError('No se pudo cargar el pedido')
    } finally {
      if (showLoading) setLoading(false)
    }
  }

  const refreshOrder = async () => {
    setRefreshing(true)
    await loadOrderDetails(false)
    setRefreshing(false)
  }

  const handlePayment = async () => {
    if (!order) return

    try {
      setLoading(true)
      const token = localStorage.getItem('zavo_auth_token')
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/payments/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          orderId: order.id,
          amount: order.precioTotal,
          method: 'MERCADOPAGO', // Por defecto, se puede hacer dinámico
          customerEmail: user?.email
        })
      })

      if (!response.ok) {
        throw new Error('Error creando pago')
      }

      const data = await response.json()
      
      // Redirigir a la pasarela de pago
      if (onPaymentRequired) {
        onPaymentRequired(data.paymentUrl)
      } else {
        window.open(data.paymentUrl, '_blank')
      }

    } catch (err) {
      console.error('Error iniciando pago:', err)
      setError('No se pudo iniciar el pago')
    } finally {
      setLoading(false)
    }
  }

  const downloadQR = () => {
    if (!order?.qrCode) return

    const link = document.createElement('a')
    link.download = `zavo-pedido-${order.id.slice(-6)}.png`
    link.href = order.qrCode
    link.click()
  }

  const shareQR = async () => {
    if (!order?.qrCode) return

    if (navigator.share) {
      try {
        const response = await fetch(order.qrCode)
        const blob = await response.blob()
        const file = new File([blob], `zavo-pedido-${order.id.slice(-6)}.png`, { type: 'image/png' })

        await navigator.share({
          title: `Pedido ZAVO - ${order.pack?.titulo}`,
          text: `Mi pedido en ${order.pack?.business?.nombre}`,
          files: [file]
        })
      } catch (err) {
        console.error('Error compartiendo:', err)
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  // ============================================
  // UTILIDADES
  // ============================================

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price)
  }

  const getPaymentStatusColor = (status: PaymentStatus): 'default' | 'error' | 'warning' | 'info' | 'success' => {
    switch (status) {
      case 'PENDIENTE': return 'warning'
      case 'PROCESANDO': return 'info'
      case 'PAGADO': return 'success'
      case 'FALLIDO': return 'error'
      case 'REEMBOLSADO': return 'default'
      default: return 'default'
    }
  }

  const getPaymentStatusText = (status: PaymentStatus) => {
    const texts = {
      PENDIENTE: 'Pago Pendiente',
      PROCESANDO: 'Procesando Pago',
      PAGADO: 'Pagado',
      FALLIDO: 'Pago Fallido',
      REEMBOLSADO: 'Reembolsado'
    }
    return texts[status] || status
  }

  const getOrderStatusColor = (status: OrderStatus): 'default' | 'error' | 'warning' | 'info' | 'success' => {
    switch (status) {
      case 'CREADO': return 'default'
      case 'CONFIRMADO': return 'info'
      case 'PREPARANDO': return 'warning'
      case 'LISTO': return 'success'
      case 'ENTREGADO': return 'success'
      case 'CANCELADO': return 'error'
      default: return 'default'
    }
  }

  // ============================================
  // RENDER
  // ============================================

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Cargando pedido...</p>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <Card className="p-8 text-center">
        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Error al cargar pedido
        </h3>
        <p className="text-gray-600 mb-6">{error}</p>
        <Button onClick={() => loadOrderDetails()} className="mx-auto">
          <RefreshCw className="w-4 h-4 mr-2" />
          Intentar de nuevo
        </Button>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header con estados */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Pedido #{order.id.slice(-6)}
            </h2>
            <p className="text-gray-600 mt-1">
              Creado el {new Date(order.createdAt).toLocaleDateString('es-CO')}
            </p>
          </div>
          <Button
            onClick={refreshOrder}
            variant="ghost"
            size="sm"
            disabled={refreshing}
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3">
            <Package className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-600">Estado del Pedido</p>
              <Badge variant={getOrderStatusColor(order.orderStatus)}>
                {order.orderStatus}
              </Badge>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <CreditCard className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-600">Estado del Pago</p>
              <Badge variant={getPaymentStatusColor(order.paymentStatus)}>
                {getPaymentStatusText(order.paymentStatus)}
              </Badge>
            </div>
          </div>
        </div>

        {/* Mostrar botón de pago si está pendiente */}
        {order.paymentStatus === 'PENDIENTE' && (
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                <div>
                  <p className="font-medium text-yellow-800">
                    Pago Pendiente
                  </p>
                  <p className="text-sm text-yellow-700">
                    Completa tu pago para confirmar el pedido
                  </p>
                </div>
              </div>
              <Button
                onClick={handlePayment}
                className="bg-yellow-600 hover:bg-yellow-700"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Pagar Ahora
              </Button>
            </div>
          </div>
        )}

        {/* Mostrar mensaje de pago exitoso */}
        {order.paymentStatus === 'PAGADO' && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-medium text-green-800">
                  ¡Pago Confirmado!
                </p>
                <p className="text-sm text-green-700">
                  Tu pedido ha sido confirmado y está siendo preparado
                </p>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* CÓDIGO QR - Solo se muestra si el pago está confirmado */}
      {order.paymentStatus === 'PAGADO' && order.qrCode && (
        <Card className="p-6">
          <div className="text-center">
            <div className="mb-6">
              <QrCode className="w-8 h-8 text-primary-600 mx-auto mb-3" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Código QR de Retiro
              </h3>
              <p className="text-gray-600">
                Presenta este código en el restaurante para retirar tu pedido
              </p>
            </div>

            <div className="inline-block p-6 bg-white rounded-xl shadow-lg border-2 border-gray-100">
              <img 
                src={order.qrCode} 
                alt="Código QR del pedido"
                className="w-64 h-64 mx-auto"
              />
            </div>

            <div className="flex justify-center space-x-3 mt-6">
              <Button onClick={downloadQR} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Descargar
              </Button>
              <Button onClick={shareQR} variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Compartir
              </Button>
            </div>

            {order.qrData && (
              <div className="text-xs text-gray-500 mt-4">
                <p>Válido hasta: {new Date(order.qrData.expiresAt).toLocaleString('es-CO')}</p>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Detalles del pedido */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Detalles del Pedido
        </h3>

        {order.pack && (
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">
                  {order.pack.titulo}
                </h4>
                <p className="text-sm text-gray-600 mt-1">
                  {order.pack.descripcion}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Cantidad: {order.cantidad}
                </p>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-gray-900">
                  {formatPrice(order.precioTotal)}
                </div>
                {order.descuento && order.descuento > 0 && (
                  <div className="text-sm text-green-600">
                    Descuento: -{formatPrice(order.descuento)}
                  </div>
                )}
              </div>
            </div>

            {order.notas && (
              <div className="border-t pt-4">
                <h5 className="font-medium text-gray-900 mb-1">Notas:</h5>
                <p className="text-gray-600">{order.notas}</p>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Información del negocio */}
      {order.pack?.business && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Información del Negocio
          </h3>
          
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <Store className="w-6 h-6 text-primary-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">
                {order.pack.business.nombre}
              </h4>
              <div className="flex items-center mt-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-1" />
                {order.pack.business.direccion}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Información de pago */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Información de Pago
        </h3>
        
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Método de pago:</span>
            <span className="font-medium">{order.paymentDetails.method}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Total:</span>
            <span className="font-semibold text-lg">{formatPrice(order.precioTotal)}</span>
          </div>
          {order.paidAt && (
            <div className="flex justify-between">
              <span className="text-gray-600">Pagado el:</span>
              <span className="font-medium">
                {new Date(order.paidAt).toLocaleString('es-CO')}
              </span>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}

export default OrderDetail
