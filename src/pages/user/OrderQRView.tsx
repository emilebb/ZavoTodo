/**
 * ============================================
 * ZAVO - Order QR View (Cliente)
 * ============================================
 * 
 * Página donde el cliente ve su pedido y código QR
 */

import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { 
  QrCode, 
  Clock, 
  MapPin, 
  CheckCircle, 
  AlertCircle,
  RefreshCw,
  Download,
  Share2,
  ArrowLeft,
  Package
} from 'lucide-react'
import { Order, QRData } from '../../types'
import { generateZavoQR, formatQRExpiration } from '../../services/qrService'
import { useAuthStore } from '../../store/authStore'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

const OrderQRView = () => {
  const { orderId } = useParams<{ orderId: string }>()
  const { user } = useAuthStore()
  const [order, setOrder] = useState<Order | null>(null)
  const [qrCode, setQrCode] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  // ============================================
  // EFECTOS
  // ============================================

  useEffect(() => {
    if (orderId && user) {
      loadOrder()
    }
  }, [orderId, user])

  // ============================================
  // FUNCIONES
  // ============================================

  const loadOrder = async () => {
    try {
      setLoading(true)
      setError(null)

      // TODO: Reemplazar con llamada real a la API
      // const response = await fetch(`/api/orders/${orderId}`)
      // const orderData = await response.json()

      // MOCK DATA para desarrollo
      const mockOrder: Order = {
        id: orderId!,
        user_id: user!.id,
        pack_id: 'pack_123',
        business_id: 'business_123',
        cantidad: 1,
        precio_total: 15000,
        estado: 'confirmado',
        notas: 'Sin cebolla, por favor',
        fecha_retiro: '2024-12-07T19:00:00Z',
        created_at: new Date().toISOString(),
        pack: {
          id: 'pack_123',
          business_id: 'business_123',
          titulo: 'Pack Sorpresa Panadería',
          descripcion: 'Deliciosos panes y pasteles del día',
          precio_original: 25000,
          precio_descuento: 15000,
          porcentaje_descuento: 40,
          stock: 5,
          hora_retiro_desde: '18:00',
          hora_retiro_hasta: '20:00',
          activo: true,
          created_at: new Date().toISOString()
        },
        business: {
          id: 'business_123',
          user_id: 'business_user_123',
          nombre: 'Panadería San José',
          descripcion: 'Panadería artesanal con productos frescos',
          direccion: 'Calle 85 #15-20, Bogotá',
          categoria: 'panaderia',
          lat: 4.6751,
          lng: -74.0621,
          horario: '6:00 AM - 8:00 PM',
          rating: 4.8,
          verificado: true,
          activo: true,
          created_at: new Date().toISOString()
        }
      }

      setOrder(mockOrder)

      // Generar QR
      const qrDataURL = await generateZavoQR(
        mockOrder.id,
        mockOrder.user_id,
        mockOrder.business_id,
        { size: 300 }
      )
      setQrCode(qrDataURL)

    } catch (err) {
      console.error('Error cargando pedido:', err)
      setError('No se pudo cargar el pedido')
    } finally {
      setLoading(false)
    }
  }

  const refreshOrder = async () => {
    setRefreshing(true)
    await loadOrder()
    setRefreshing(false)
  }

  const downloadQR = () => {
    if (!qrCode) return

    const link = document.createElement('a')
    link.download = `zavo-pedido-${orderId}.png`
    link.href = qrCode
    link.click()
  }

  const shareQR = async () => {
    if (!order || !qrCode) return

    if (navigator.share) {
      try {
        // Convertir data URL a blob
        const response = await fetch(qrCode)
        const blob = await response.blob()
        const file = new File([blob], `zavo-pedido-${orderId}.png`, { type: 'image/png' })

        await navigator.share({
          title: `Pedido ZAVO - ${order.pack?.titulo}`,
          text: `Mi pedido en ${order.business?.nombre}`,
          files: [file]
        })
      } catch (err) {
        console.error('Error compartiendo:', err)
      }
    } else {
      // Fallback: copiar al portapapeles
      navigator.clipboard.writeText(window.location.href)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price)
  }

  const getStatusColor = (status: string) => {
    const colors = {
      pendiente: 'warning',
      confirmado: 'info',
      preparando: 'warning',
      listo: 'success',
      entregado: 'success',
      cancelado: 'error'
    }
    return colors[status as keyof typeof colors] || 'info'
  }

  const getStatusText = (status: string) => {
    const texts = {
      pendiente: 'Pendiente',
      confirmado: 'Confirmado',
      preparando: 'Preparando',
      listo: 'Listo para recoger',
      entregado: 'Entregado',
      cancelado: 'Cancelado'
    }
    return texts[status as keyof typeof texts] || status
  }

  // ============================================
  // RENDER
  // ============================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Cargando pedido...</p>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center p-8">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Error al cargar pedido
          </h2>
          <p className="text-gray-600 mb-6">
            {error || 'No se encontró el pedido solicitado'}
          </p>
          <div className="space-y-3">
            <Button onClick={refreshOrder} className="w-full">
              <RefreshCw className="w-4 h-4 mr-2" />
              Intentar de nuevo
            </Button>
            <Link to="/perfil/pedidos">
              <Button variant="outline" className="w-full">
                Ver mis pedidos
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link to="/perfil/pedidos">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  Pedido #{order.id.slice(-6)}
                </h1>
                <p className="text-sm text-gray-600">
                  {order.business?.nombre}
                </p>
              </div>
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
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Estado del pedido */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Package className="w-6 h-6 text-primary-600" />
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Estado del pedido
                </h2>
                <p className="text-sm text-gray-600">
                  Actualizado hace 2 minutos
                </p>
              </div>
            </div>
            <Badge variant={getStatusColor(order.estado)} size="lg">
              {getStatusText(order.estado)}
            </Badge>
          </div>

          {order.estado === 'listo' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <p className="text-green-800 font-medium">
                  ¡Tu pedido está listo para recoger!
                </p>
              </div>
              <p className="text-green-700 text-sm mt-1">
                Presenta el código QR en el restaurante para retirar tu pedido.
              </p>
            </div>
          )}
        </Card>

        {/* Código QR */}
        <Card className="p-6 text-center">
          <div className="mb-6">
            <QrCode className="w-8 h-8 text-primary-600 mx-auto mb-3" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Código QR de retiro
            </h2>
            <p className="text-gray-600">
              Presenta este código en el restaurante para retirar tu pedido
            </p>
          </div>

          {qrCode ? (
            <div className="space-y-4">
              <div className="inline-block p-4 bg-white rounded-xl shadow-sm border">
                <img 
                  src={qrCode} 
                  alt="Código QR del pedido"
                  className="w-64 h-64 mx-auto"
                />
              </div>
              
              <div className="flex justify-center space-x-3">
                <Button onClick={downloadQR} variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Descargar
                </Button>
                <Button onClick={shareQR} variant="outline" size="sm">
                  <Share2 className="w-4 h-4 mr-2" />
                  Compartir
                </Button>
              </div>

              <div className="text-xs text-gray-500 mt-4">
                <p>Código válido hasta: {formatQRExpiration({
                  orderId: order.id,
                  userId: order.user_id,
                  businessId: order.business_id,
                  timestamp: order.created_at,
                  expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                  status: 'activo'
                })}</p>
              </div>
            </div>
          ) : (
            <div className="py-8">
              <LoadingSpinner />
              <p className="text-gray-600 mt-2">Generando código QR...</p>
            </div>
          )}
        </Card>

        {/* Detalles del pedido */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Detalles del pedido
          </h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">
                  {order.pack?.titulo}
                </h4>
                <p className="text-sm text-gray-600 mt-1">
                  {order.pack?.descripcion}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Cantidad: {order.cantidad}
                </p>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-gray-900">
                  {formatPrice(order.precio_total)}
                </div>
                {order.pack && (
                  <div className="text-sm text-gray-500 line-through">
                    {formatPrice(order.pack.precio_original)}
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

            <div className="border-t pt-4 space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-2" />
                {order.business?.direccion}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="w-4 h-4 mr-2" />
                Horario de retiro: {order.pack?.hora_retiro_desde} - {order.pack?.hora_retiro_hasta}
              </div>
            </div>
          </div>
        </Card>

        {/* Información del negocio */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Información del negocio
          </h3>
          
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center">
              <span className="text-primary-700 font-bold text-xl">
                {order.business?.nombre.charAt(0)}
              </span>
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">
                {order.business?.nombre}
              </h4>
              <p className="text-sm text-gray-600 mt-1">
                {order.business?.descripcion}
              </p>
              <div className="flex items-center mt-2 space-x-4">
                <div className="text-sm text-gray-600">
                  ⭐ {order.business?.rating}/5
                </div>
                <div className="text-sm text-gray-600">
                  📍 {order.business?.direccion}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default OrderQRView
