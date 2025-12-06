import { useParams, Link } from 'react-router-dom'
import { CheckCircle, MapPin, Clock, QrCode } from 'lucide-react'
import { useOrderQuery } from '../../hooks/useOrders'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

const OrderConfirmed = () => {
  const { id } = useParams<{ id: string }>()
  const { data: order, isLoading, error } = useOrderQuery(id!)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Pedido no encontrado</h2>
        <p className="text-gray-600 mb-4">No pudimos encontrar tu pedido.</p>
        <Link to="/">
          <Button>Volver al inicio</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">¡Pedido Confirmado!</h1>
        <p className="text-gray-600">
          Tu pack sorpresa está listo para ser recogido
        </p>
      </div>

      {/* Order Details */}
      <Card className="mb-6">
        <div className="border-b border-gray-200 pb-4 mb-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Detalles del Pedido</h2>
          <div className="text-sm text-gray-500">
            Pedido #{order.id.slice(-8).toUpperCase()}
          </div>
        </div>

        {/* Pack Info */}
        <div className="mb-4">
          <h3 className="font-medium text-gray-900 mb-2">{order.pack?.titulo}</h3>
          <p className="text-gray-600 text-sm mb-3">{order.pack?.descripcion}</p>
          <div className="text-2xl font-bold text-primary-600">
            {order.pack && formatPrice(order.pack.precio_descuento)}
          </div>
        </div>

        {/* Business Info */}
        <div className="border-t border-gray-200 pt-4">
          <h3 className="font-medium text-gray-900 mb-3">Información de Recogida</h3>
          <div className="space-y-2">
            <div className="flex items-start">
              <MapPin className="w-4 h-4 mr-2 mt-0.5 text-gray-500" />
              <div>
                <p className="font-medium text-gray-900">{order.pack?.business?.nombre}</p>
                <p className="text-gray-600 text-sm">{order.pack?.business?.direccion}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2 text-gray-500" />
              <span className="text-gray-600 text-sm">
                Horario: {order.pack?.hora_retiro_desde} - {order.pack?.hora_retiro_hasta}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Instructions */}
      <Card variant="glass" className="mb-6">
        <h3 className="font-medium text-gray-900 mb-3">Instrucciones de Recogida</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <p>1. Dirígete al negocio en el horario indicado</p>
          <p>2. Presenta tu código QR al personal</p>
          <p>3. Recoge tu pack sorpresa y ¡disfrútalo!</p>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Link to={`/pedido/${order.id}/qr`}>
          <Button fullWidth size="lg" className="mb-3">
            <QrCode className="w-5 h-5 mr-2" />
            Ver Código QR
          </Button>
        </Link>

        <div className="grid grid-cols-2 gap-3">
          <Link to="/perfil/pedidos">
            <Button variant="outline" fullWidth>
              Mis Pedidos
            </Button>
          </Link>
          <Link to="/">
            <Button variant="outline" fullWidth>
              Buscar Más Packs
            </Button>
          </Link>
        </div>
      </div>

      {/* Environmental Impact */}
      <Card variant="glass" className="mt-6 text-center">
        <div className="text-sm text-gray-600">
          <p className="mb-1">🌱 <strong>¡Felicitaciones!</strong></p>
          <p>
            Has ayudado a rescatar comida y reducir el desperdicio alimentario.
            Cada pack cuenta para un planeta más sostenible.
          </p>
        </div>
      </Card>
    </div>
  )
}

export default OrderConfirmed
