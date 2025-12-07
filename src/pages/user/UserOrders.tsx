import { Link } from 'react-router-dom'
import { Package, Clock, CheckCircle, XCircle, QrCode } from 'lucide-react'
import { useUserOrdersQuery } from '../../hooks/useOrders'
import { useAuthStore } from '../../store/authStore'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import { Order } from '../../types'

const UserOrders = () => {
  const { user } = useAuthStore()
  const { data: orders, isLoading, error } = useUserOrdersQuery(user?.id || '')

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pendiente':
        return <Clock className="w-5 h-5 text-yellow-600" />
      case 'confirmado':
        return <Package className="w-5 h-5 text-blue-600" />
      case 'recogido':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'cancelado':
        return <XCircle className="w-5 h-5 text-red-600" />
      default:
        return <Package className="w-5 h-5 text-gray-600" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pendiente':
        return 'Pendiente'
      case 'confirmado':
        return 'Confirmado'
      case 'recogido':
        return 'Recogido'
      case 'cancelado':
        return 'Cancelado'
      default:
        return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800'
      case 'confirmado':
        return 'bg-blue-100 text-blue-800'
      case 'recogido':
        return 'bg-green-100 text-green-800'
      case 'cancelado':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const OrderCard = ({ order }: { order: Order }) => (
    <Card className="mb-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          {getStatusIcon(order.estado)}
          <div>
            <h3 className="font-semibold text-gray-900">{order.pack?.titulo}</h3>
            <p className="text-sm text-gray-600">{order.pack?.business?.nombre}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-primary-600">
            {order.pack && formatPrice(order.pack.precio_descuento)}
          </div>
          <div className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.estado)}`}>
            {getStatusText(order.estado)}
          </div>
        </div>
      </div>

      <div className="text-sm text-gray-500 mb-3">
        Pedido #{order.id.slice(-8).toUpperCase()} • {formatDate(order.created_at)}
      </div>

      <div className="flex space-x-2">
        {order.estado === 'confirmado' && (
          <Link to={`/pedido/${order.id}/qr`}>
            <Button size="sm" variant="outline">
              <QrCode className="w-4 h-4 mr-1" />
              Ver QR
            </Button>
          </Link>
        )}
        <Link to={`/pedido/${order.id}/confirmado`}>
          <Button size="sm" variant="ghost">
            Ver Detalles
          </Button>
        </Link>
      </div>
    </Card>
  )

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Error al cargar pedidos</h2>
        <p className="text-gray-600 mb-4">No pudimos cargar tus pedidos.</p>
        <Button onClick={() => window.location.reload()}>
          Intentar de nuevo
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Mis Pedidos</h1>
        <p className="text-gray-600">Historial de tus packs rescatados</p>
      </div>

      {/* Orders */}
      {!orders || orders.length === 0 ? (
        <div className="text-center py-16 px-4">
          {/* Empty State Illustration */}
          <div className="relative w-32 h-32 mx-auto mb-6">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-100 to-teal-100 rounded-full animate-pulse" />
            <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center shadow-soft">
              <Package className="w-12 h-12 text-primary-400" />
            </div>
          </div>
          
          <h3 className="text-xl font-semibold font-display text-content mb-3">
            Aún no has rescatado comida
          </h3>
          <p className="text-content-muted mb-8 max-w-sm mx-auto">
            Empieza explorando packs cerca de ti y únete a la revolución contra el desperdicio alimentario.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/">
              <Button size="lg">
                Explorar Packs
              </Button>
            </Link>
            <Link to="/mapa">
              <Button variant="outline" size="lg">
                Ver Mapa
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div>
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  )
}

export default UserOrders
