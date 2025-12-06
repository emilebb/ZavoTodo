import { TrendingUp, Package, ShoppingCart, DollarSign } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { useBusinessPacksQuery } from '../../hooks/usePacks'
import { useBusinessOrdersQuery } from '../../hooks/useOrders'
import Card from '../../components/ui/Card'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

const BusinessDashboard = () => {
  const { user } = useAuthStore()
  const { data: packs, isLoading: packsLoading } = useBusinessPacksQuery(user?.id || '')
  const { data: orders, isLoading: ordersLoading } = useBusinessOrdersQuery(user?.id || '')

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price)
  }

  const stats = {
    totalPacks: packs?.length || 0,
    activePacks: packs?.filter(p => p.activo && p.stock > 0).length || 0,
    totalOrders: orders?.length || 0,
    completedOrders: orders?.filter(o => o.estado === 'recogido').length || 0,
    totalRevenue: orders
      ?.filter(o => o.estado === 'recogido')
      ?.reduce((sum, o) => sum + (o.pack?.precio_descuento || 0), 0) || 0,
    savedFood: orders
      ?.filter(o => o.estado === 'recogido')
      ?.reduce((sum, o) => sum + (o.pack?.precio_original || 0) - (o.pack?.precio_descuento || 0), 0) || 0
  }

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    color = 'primary' 
  }: { 
    title: string
    value: string | number
    icon: any
    color?: 'primary' | 'green' | 'blue' | 'orange'
  }) => {
    const colorClasses = {
      primary: 'bg-primary-100 text-primary-600',
      green: 'bg-green-100 text-green-600',
      blue: 'bg-blue-100 text-blue-600',
      orange: 'bg-orange-100 text-orange-600'
    }

    return (
      <Card>
        <div className="flex items-center">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
          <div className="ml-4">
            <p className="text-sm text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          </div>
        </div>
      </Card>
    )
  }

  if (packsLoading || ordersLoading) {
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
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">
          Bienvenido de vuelta, {user?.nombre}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Packs Totales"
          value={stats.totalPacks}
          icon={Package}
          color="primary"
        />
        <StatCard
          title="Packs Activos"
          value={stats.activePacks}
          icon={TrendingUp}
          color="green"
        />
        <StatCard
          title="Pedidos Totales"
          value={stats.totalOrders}
          icon={ShoppingCart}
          color="blue"
        />
        <StatCard
          title="Pedidos Completados"
          value={stats.completedOrders}
          icon={ShoppingCart}
          color="green"
        />
      </div>

      {/* Revenue and Impact */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center mb-4">
            <DollarSign className="w-6 h-6 text-green-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Ingresos Totales</h3>
          </div>
          <div className="text-3xl font-bold text-green-600 mb-2">
            {formatPrice(stats.totalRevenue)}
          </div>
          <p className="text-sm text-gray-600">
            De {stats.completedOrders} pedidos completados
          </p>
        </Card>

        <Card>
          <div className="flex items-center mb-4">
            <TrendingUp className="w-6 h-6 text-primary-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Impacto Ambiental</h3>
          </div>
          <div className="text-3xl font-bold text-primary-600 mb-2">
            {formatPrice(stats.savedFood)}
          </div>
          <p className="text-sm text-gray-600">
            En comida rescatada del desperdicio
          </p>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Actividad Reciente</h3>
        
        {!orders || orders.length === 0 ? (
          <div className="text-center py-8">
            <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No hay pedidos recientes</p>
            <p className="text-sm text-gray-400">Los pedidos aparecerán aquí cuando los usuarios compren tus packs</p>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div>
                  <p className="font-medium text-gray-900">{order.pack?.titulo}</p>
                  <p className="text-sm text-gray-600">
                    Pedido #{order.id.slice(-8).toUpperCase()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">
                    {order.pack && formatPrice(order.pack.precio_descuento)}
                  </p>
                  <p className={`text-sm ${
                    order.estado === 'recogido' ? 'text-green-600' :
                    order.estado === 'confirmado' ? 'text-blue-600' :
                    'text-yellow-600'
                  }`}>
                    {order.estado}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}

export default BusinessDashboard
