/**
 * ============================================
 * ZAVO - Order Detail Page
 * ============================================
 * 
 * Página que usa el componente OrderDetail
 */

import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import OrderDetail from '../../components/orders/OrderDetail'
import Button from '../../components/ui/Button'

const OrderDetailPage = () => {
  const { orderId } = useParams<{ orderId: string }>()
  const navigate = useNavigate()

  const handlePaymentRequired = (paymentUrl: string) => {
    // Redirigir a la pasarela de pago
    window.location.href = paymentUrl
  }

  if (!orderId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Pedido no encontrado
          </h2>
          <p className="text-gray-600 mb-4">
            No se especificó un ID de pedido válido
          </p>
          <Button onClick={() => navigate('/perfil/pedidos')}>
            Ver mis pedidos
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-3">
            <Button 
              onClick={() => navigate('/perfil/pedidos')}
              variant="ghost" 
              size="sm"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                Detalle del Pedido
              </h1>
              <p className="text-sm text-gray-600">
                Información completa y código QR
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <OrderDetail 
          orderId={orderId}
          onPaymentRequired={handlePaymentRequired}
        />
      </div>
    </div>
  )
}

export default OrderDetailPage
