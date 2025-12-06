import { CheckCircle, Clock, Package, User } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { useBusinessOrdersQuery, useUpdateOrderMutation } from '../../hooks/useOrders'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

const BusinessOrders = () => {
  const { user } = useAuthStore()
  const { data: orders, isLoading } = useBusinessOrdersQuery(user?.id || '')
  const updateOrderMutation = useUpdateOrderMutation()

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

  const handleMarkAsPickedUp = async (orderId: string) => {
    try {
      await updateOrderMutation.mutateAsync({
        id: orderId,
        updates: { estado: 'recogido' }
      })
    } catch (error) {
      console.error('Error updating order:', error)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pendiente':
        return <Clock className="w-5 h-5 text-yellow-600" />
      case 'confirmado':
        return <Package className="w-5 h-5 text-blue-600" />
      case 'recogido':
        return <CheckCircle className="w-5 h-5 text-green-600" />
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

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Pedidos</h1>
        <p className="text-gray-600">Gestiona los pedidos de tus packs</p>
      </div>

      {/* Orders List */}
      {!orders || orders.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No tienes pedidos aún
          </h3>
          <p className="text-gray-500">
            Los pedidos aparecerán aquí cuando los usuarios compren tus packs
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(order.estado)}
                  <div>
                    <h3 className="font-semibold text-gray-900">{order.pack?.titulo}</h3>
                    <p className="text-sm text-gray-600">
                      Pedido #{order.id.slice(-8).toUpperCase()}
                    </p>
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

              {/* Customer Info */}
              <div className="border-t border-gray-200 pt-4 mb-4">
                <div className="flex items-center space-x-2 mb-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700">{order.user?.nombre}</span>
                </div>
                <div className="text-sm text-gray-500">
                  Pedido realizado: {formatDate(order.created_at)}
                </div>
              </div>

              {/* Actions */}
              {order.estado === 'confirmado' && (
                <div className="border-t border-gray-200 pt-4">
                  <Button
                    onClick={() => handleMarkAsPickedUp(order.id)}
                    loading={updateOrderMutation.isPending}
                    size="sm"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Marcar como Recogido
                  </Button>
                </div>
              )}

              {order.estado === 'recogido' && (
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center text-sm text-green-600">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    <span>Pedido completado exitosamente</span>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default BusinessOrders
