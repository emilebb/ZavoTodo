/**
 * ============================================
 * ZAVO - Business Dashboard
 * ============================================
 * 
 * Dashboard profesional para negocios inspirado en:
 * - Uber Eats Manager
 * - Shopify Admin
 * - Cheaf Business
 * 
 * Diseño minimalista, limpio y administrativo
 */

import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Package,
  ShoppingBag,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Leaf,
  Plus,
  ChevronRight,
  Bell,
  Settings,
  MoreHorizontal,
  Eye,
  Edit2,
  Trash2,
  Power,
  PowerOff,
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCw,
  ChevronDown,
  Zap,
  Users,
  Target,
  Award,
  Droplets,
  Wind
} from 'lucide-react'
import { useAuthStore } from '../../store/authStore'

// ============================================
// TIPOS
// ============================================

interface Order {
  id: string
  customer: string
  customerInitial: string
  items: string
  total: number
  status: 'new' | 'preparing' | 'ready' | 'completed' | 'cancelled'
  time: string
  timeAgo: string
}

interface Product {
  id: string
  name: string
  type: 'mystery_bag' | 'product' | 'daily_deal'
  image: string
  price: number
  originalPrice: number
  stock: number
  sold: number
  active: boolean
  pickupTime?: string
}

// ============================================
// DATOS MOCK
// ============================================

const MOCK_ORDERS: Order[] = [
  { id: 'ORD-2847', customer: 'María García', customerInitial: 'M', items: '1x Bolsa Sorpresa Panadería', total: 15000, status: 'new', time: '14:32', timeAgo: 'Hace 2 min' },
  { id: 'ORD-2846', customer: 'Carlos López', customerInitial: 'C', items: '2x Pack Almuerzo', total: 28000, status: 'preparing', time: '14:28', timeAgo: 'Hace 6 min' },
  { id: 'ORD-2845', customer: 'Ana Martínez', customerInitial: 'A', items: '1x Combo Café + Croissant', total: 12000, status: 'ready', time: '14:15', timeAgo: 'Hace 19 min' },
  { id: 'ORD-2844', customer: 'Pedro Sánchez', customerInitial: 'P', items: '3x Bolsa Sorpresa', total: 45000, status: 'completed', time: '13:45', timeAgo: 'Hace 49 min' },
]

const MOCK_PRODUCTS: Product[] = [
  { id: '1', name: 'Bolsa Sorpresa Panadería', type: 'mystery_bag', image: '🥖', price: 15000, originalPrice: 35000, stock: 8, sold: 24, active: true, pickupTime: '18:00 - 20:00' },
  { id: '2', name: 'Pack Almuerzo Ejecutivo', type: 'daily_deal', image: '🍱', price: 14000, originalPrice: 28000, stock: 5, sold: 18, active: true, pickupTime: '12:00 - 14:00' },
  { id: '3', name: 'Combo Café + Croissant', type: 'product', image: '☕', price: 7000, originalPrice: 12000, stock: 12, sold: 45, active: true },
  { id: '4', name: 'Torta de Chocolate', type: 'product', image: '🎂', price: 8000, originalPrice: 18000, stock: 0, sold: 12, active: false },
  { id: '5', name: 'Bolsa Sorpresa Dulce', type: 'mystery_bag', image: '🧁', price: 12000, originalPrice: 25000, stock: 6, sold: 31, active: true, pickupTime: '16:00 - 18:00' },
]

// ============================================
// COMPONENTES AUXILIARES
// ============================================

const StatusBadge: React.FC<{ status: Order['status'] }> = ({ status }) => {
  const config = {
    new: { label: 'Nuevo', bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-500' },
    preparing: { label: 'Preparando', bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' },
    ready: { label: 'Listo', bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' },
    completed: { label: 'Entregado', bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400' },
    cancelled: { label: 'Cancelado', bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' }
  }
  const { label, bg, text, dot } = config[status]
  
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${bg} ${text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  )
}

const MetricCard: React.FC<{
  title: string
  value: string
  change?: number
  icon: React.ReactNode
  iconBg: string
}> = ({ title, value, change, icon, iconBg }) => (
  <div className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between">
      <div className={`w-11 h-11 ${iconBg} rounded-xl flex items-center justify-center`}>
        {icon}
      </div>
      {change !== undefined && (
        <div className={`flex items-center gap-1 text-xs font-medium ${change >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
          {change >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
          {Math.abs(change)}%
        </div>
      )}
    </div>
    <div className="mt-4">
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500 mt-0.5">{title}</p>
    </div>
  </div>
)

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

const NewBusinessDashboard = () => {
  const { user } = useAuthStore()
  const [isOpen, setIsOpen] = useState(true)
  const [orders] = useState(MOCK_ORDERS)
  const [products, setProducts] = useState(MOCK_PRODUCTS)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [activeProductMenu, setActiveProductMenu] = useState<string | null>(null)

  const businessName = user?.name || 'Mi Negocio'
  const businessInitial = businessName.charAt(0).toUpperCase()

  // Simular actualización de pedidos
  const refreshOrders = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
    }, 1000)
  }

  // Formatear precio
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price)
  }

  // Toggle producto activo
  const toggleProductActive = (productId: string) => {
    setProducts(prev => prev.map(p => 
      p.id === productId ? { ...p, active: !p.active } : p
    ))
  }

  // Contar pedidos por estado
  const orderCounts = {
    new: orders.filter(o => o.status === 'new').length,
    preparing: orders.filter(o => o.status === 'preparing').length,
    ready: orders.filter(o => o.status === 'ready').length,
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* ============================================
          HEADER
          ============================================ */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Business Info */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <span className="text-white font-bold text-lg">{businessInitial}</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-semibold text-gray-900">{businessName}</h1>
                  <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                      isOpen 
                        ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${isOpen ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                    {isOpen ? 'Abierto' : 'Cerrado'}
                    <ChevronDown className="w-3 h-3" />
                  </button>
                </div>
                <p className="text-xs text-gray-500">Panel de Administración</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button className="relative p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors">
                <Bell className="w-5 h-5" />
                {orderCounts.new > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </button>
              <button className="p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              <div className="w-px h-8 bg-gray-200 mx-1" />
              <Link 
                to="/perfil"
                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-gray-700 to-gray-900 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-medium">{businessInitial}</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ============================================
          MAIN CONTENT
          ============================================ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3 mb-6">
          <Link
            to="/negocio/productos/nuevo"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium shadow-lg shadow-emerald-600/20 transition-all hover:shadow-xl hover:shadow-emerald-600/30"
          >
            <Plus className="w-5 h-5" />
            Crear Pack Sorpresa
          </Link>
          <Link
            to="/negocio/productos/nuevo?type=product"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-gray-50 text-gray-700 rounded-xl font-medium border border-gray-200 transition-colors"
          >
            <Package className="w-5 h-5" />
            Nuevo Producto
          </Link>
          <button
            onClick={refreshOrders}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-gray-600 hover:text-gray-900 hover:bg-white rounded-xl transition-colors ml-auto"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Actualizar
          </button>
        </div>

        {/* ============================================
            METRICS GRID
            ============================================ */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <MetricCard
            title="Ventas de Hoy"
            value="$328.500"
            change={12.5}
            icon={<DollarSign className="w-5 h-5 text-emerald-600" />}
            iconBg="bg-emerald-100"
          />
          <MetricCard
            title="Pedidos"
            value="24"
            change={8}
            icon={<ShoppingBag className="w-5 h-5 text-blue-600" />}
            iconBg="bg-blue-100"
          />
          <MetricCard
            title="Packs Vendidos"
            value="18"
            change={-3}
            icon={<Package className="w-5 h-5 text-purple-600" />}
            iconBg="bg-purple-100"
          />
          <MetricCard
            title="Productos Activos"
            value={`${products.filter(p => p.active).length}`}
            icon={<Zap className="w-5 h-5 text-amber-600" />}
            iconBg="bg-amber-100"
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* ============================================
              PEDIDOS EN TIEMPO REAL
              ============================================ */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <h2 className="font-semibold text-gray-900">Pedidos en Tiempo Real</h2>
                {orderCounts.new > 0 && (
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                    {orderCounts.new} nuevos
                  </span>
                )}
              </div>
              <Link 
                to="/negocio/pedidos"
                className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
              >
                Ver todos <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Order Tabs */}
            <div className="flex border-b border-gray-100 px-5">
              {[
                { label: 'Nuevos', count: orderCounts.new, color: 'blue' },
                { label: 'Preparando', count: orderCounts.preparing, color: 'amber' },
                { label: 'Listos', count: orderCounts.ready, color: 'emerald' },
              ].map((tab, i) => (
                <button
                  key={tab.label}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    i === 0 
                      ? 'border-emerald-500 text-emerald-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                  {tab.count > 0 && (
                    <span className={`px-1.5 py-0.5 rounded text-xs bg-${tab.color}-100 text-${tab.color}-700`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Orders List */}
            <div className="divide-y divide-gray-100">
              {orders.slice(0, 4).map((order) => (
                <div key={order.id} className="px-5 py-4 hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-gray-600 font-medium">{order.customerInitial}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">{order.id}</span>
                          <StatusBadge status={order.status} />
                        </div>
                        <p className="text-sm text-gray-600 mt-0.5">{order.customer}</p>
                        <p className="text-sm text-gray-500">{order.items}</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-semibold text-gray-900">{formatPrice(order.total)}</p>
                      <p className="text-xs text-gray-500 mt-1">{order.timeAgo}</p>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  {order.status === 'new' && (
                    <div className="flex gap-2 mt-3 ml-13">
                      <button className="flex-1 py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors">
                        Aceptar Pedido
                      </button>
                      <button className="py-2 px-4 border border-gray-200 hover:bg-gray-50 text-gray-600 text-sm font-medium rounded-lg transition-colors">
                        Rechazar
                      </button>
                    </div>
                  )}
                  {order.status === 'preparing' && (
                    <div className="flex gap-2 mt-3 ml-13">
                      <button className="flex-1 py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors">
                        Marcar como Listo
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ============================================
              IMPACTO AMBIENTAL
              ============================================ */}
          <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-6 text-white">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                <Leaf className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-semibold">Impacto Ambiental</h2>
                <p className="text-emerald-200 text-sm">Tu contribución este mes</p>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <div className="flex items-end justify-between mb-2">
                  <span className="text-emerald-200 text-sm">Comida Salvada</span>
                  <span className="text-2xl font-bold">127 kg</span>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full" style={{ width: '78%' }} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                  <Droplets className="w-5 h-5 text-emerald-300 mb-2" />
                  <p className="text-xl font-bold">2,450 L</p>
                  <p className="text-emerald-200 text-xs">Agua conservada</p>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                  <Wind className="w-5 h-5 text-emerald-300 mb-2" />
                  <p className="text-xl font-bold">89 kg</p>
                  <p className="text-emerald-200 text-xs">CO₂ evitado</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white/10 backdrop-blur rounded-xl p-4">
                <Award className="w-8 h-8 text-yellow-400" />
                <div>
                  <p className="font-medium">¡Héroe Ambiental!</p>
                  <p className="text-emerald-200 text-sm">Top 10% de negocios ZAVO</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================
            MIS PRODUCTOS / PACKS
            ============================================ */}
        <div className="mt-6 bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Mis Productos y Packs</h2>
            <Link 
              to="/negocio/productos"
              className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
            >
              Gestionar <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Products Grid */}
          <div className="p-5">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map((product) => (
                <div 
                  key={product.id}
                  className={`relative bg-gray-50 rounded-xl p-4 border-2 transition-all ${
                    product.active 
                      ? 'border-transparent hover:border-emerald-200 hover:bg-emerald-50/30' 
                      : 'border-transparent opacity-60'
                  }`}
                >
                  {/* Menu */}
                  <div className="absolute top-3 right-3">
                    <button 
                      onClick={() => setActiveProductMenu(activeProductMenu === product.id ? null : product.id)}
                      className="p-1.5 hover:bg-white rounded-lg transition-colors"
                    >
                      <MoreHorizontal className="w-4 h-4 text-gray-400" />
                    </button>
                    
                    {activeProductMenu === product.id && (
                      <div className="absolute right-0 top-8 w-40 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-10">
                        <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                          <Eye className="w-4 h-4" /> Ver detalles
                        </button>
                        <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                          <Edit2 className="w-4 h-4" /> Editar
                        </button>
                        <button 
                          onClick={() => toggleProductActive(product.id)}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          {product.active ? <PowerOff className="w-4 h-4" /> : <Power className="w-4 h-4" />}
                          {product.active ? 'Desactivar' : 'Activar'}
                        </button>
                        <div className="border-t border-gray-100 my-1" />
                        <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50">
                          <Trash2 className="w-4 h-4" /> Eliminar
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Product Image */}
                  <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-3xl mb-3 shadow-sm">
                    {product.image}
                  </div>

                  {/* Product Info */}
                  <h3 className="font-medium text-gray-900 text-sm mb-1 pr-6">{product.name}</h3>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-emerald-600">{formatPrice(product.price)}</span>
                    <span className="text-xs text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
                  </div>

                  {product.pickupTime && (
                    <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                      <Clock className="w-3 h-3" />
                      {product.pickupTime}
                    </div>
                  )}

                  {/* Stats */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <div className="flex items-center gap-1">
                      <span className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-emerald-500' : 'bg-red-500'}`} />
                      <span className="text-xs text-gray-600">
                        {product.stock > 0 ? `${product.stock} disponibles` : 'Agotado'}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">{product.sold} vendidos</span>
                  </div>
                </div>
              ))}

              {/* Add New Card */}
              <Link
                to="/negocio/productos/nuevo"
                className="flex flex-col items-center justify-center bg-gray-50 hover:bg-emerald-50 border-2 border-dashed border-gray-200 hover:border-emerald-300 rounded-xl p-6 transition-all group min-h-[200px]"
              >
                <div className="w-12 h-12 bg-gray-200 group-hover:bg-emerald-200 rounded-xl flex items-center justify-center mb-3 transition-colors">
                  <Plus className="w-6 h-6 text-gray-400 group-hover:text-emerald-600" />
                </div>
                <span className="text-sm font-medium text-gray-500 group-hover:text-emerald-600">
                  Agregar Producto
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* ============================================
            ESTADÍSTICAS RÁPIDAS
            ============================================ */}
        <div className="mt-6 grid sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900">Ventas esta semana</h3>
              <TrendingUp className="w-5 h-5 text-emerald-500" />
            </div>
            <div className="h-24 flex items-end gap-1">
              {[40, 65, 45, 80, 55, 90, 70].map((height, i) => (
                <div key={i} className="flex-1 bg-emerald-100 rounded-t" style={{ height: `${height}%` }}>
                  <div 
                    className="w-full bg-emerald-500 rounded-t transition-all hover:bg-emerald-600" 
                    style={{ height: `${height}%` }} 
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span>Lun</span>
              <span>Mar</span>
              <span>Mié</span>
              <span>Jue</span>
              <span>Vie</span>
              <span>Sáb</span>
              <span>Dom</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900">Clientes recurrentes</h3>
              <Users className="w-5 h-5 text-blue-500" />
            </div>
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="40" cy="40" r="35" stroke="#E5E7EB" strokeWidth="6" fill="none" />
                  <circle 
                    cx="40" cy="40" r="35" 
                    stroke="#3B82F6" 
                    strokeWidth="6" 
                    fill="none"
                    strokeDasharray={`${68 * 2.2} ${100 * 2.2}`}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-gray-900">
                  68%
                </span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">156</p>
                <p className="text-sm text-gray-500">clientes fieles</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900">Tasa de conversión</h3>
              <Target className="w-5 h-5 text-purple-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">87%</p>
            <p className="text-sm text-gray-500 mb-3">de pedidos completados</p>
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span className="text-gray-600">208 exitosos</span>
              </div>
              <div className="flex items-center gap-1">
                <XCircle className="w-4 h-4 text-red-400" />
                <span className="text-gray-600">31 cancelados</span>
              </div>
            </div>
          </div>
        </div>

      </main>

      {/* Click outside to close menu */}
      {activeProductMenu && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setActiveProductMenu(null)} 
        />
      )}
    </div>
  )
}

export default NewBusinessDashboard
