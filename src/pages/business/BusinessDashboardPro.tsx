/**
 * ============================================
 * ZAVO - Business Dashboard Pro
 * ============================================
 * 
 * Dashboard profesional para negocios con:
 * - Estadísticas en tiempo real
 * - Gestión de productos
 * - Control de órdenes
 * - Inventario
 * - Horarios dinámicos
 * - Cupones y promociones
 */

import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  BarChart3,
  Clock,
  Ticket,
  Settings,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Leaf,
  AlertTriangle,
  Plus,
  ChevronRight,
  Calendar,
  Bell,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  RefreshCw
} from 'lucide-react'
import { useAuthStore } from '../../store/authStore'

// ============================================
// TIPOS
// ============================================

type TabType = 'overview' | 'products' | 'orders' | 'stats' | 'inventory' | 'schedule' | 'promotions'

interface StatCard {
  title: string
  value: string
  change: number
  changeLabel: string
  icon: React.ReactNode
  color: string
}

interface Order {
  id: string
  customer: string
  product: string
  quantity: number
  total: number
  status: 'pending' | 'confirmed' | 'ready' | 'completed' | 'cancelled'
  time: string
}

interface Product {
  id: string
  name: string
  type: string
  price: number
  originalPrice: number
  stock: number
  sold: number
  status: 'active' | 'paused' | 'sold_out'
}

// ============================================
// DATOS MOCK
// ============================================

const MOCK_STATS: StatCard[] = [
  {
    title: 'Ventas Hoy',
    value: '$245.000',
    change: 12.5,
    changeLabel: 'vs ayer',
    icon: <DollarSign className="w-6 h-6" />,
    color: 'emerald'
  },
  {
    title: 'Pedidos',
    value: '18',
    change: 8.3,
    changeLabel: 'vs ayer',
    icon: <ShoppingBag className="w-6 h-6" />,
    color: 'blue'
  },
  {
    title: 'Comida Salvada',
    value: '12.5 kg',
    change: 15.2,
    changeLabel: 'vs ayer',
    icon: <Leaf className="w-6 h-6" />,
    color: 'green'
  },
  {
    title: 'Clientes Nuevos',
    value: '7',
    change: -2.1,
    changeLabel: 'vs ayer',
    icon: <Users className="w-6 h-6" />,
    color: 'purple'
  }
]

const MOCK_ORDERS: Order[] = [
  { id: 'ORD-001', customer: 'María García', product: 'Bolsa Sorpresa Panadería', quantity: 1, total: 15000, status: 'pending', time: 'Hace 5 min' },
  { id: 'ORD-002', customer: 'Carlos López', product: 'Pack Almuerzo', quantity: 2, total: 28000, status: 'confirmed', time: 'Hace 15 min' },
  { id: 'ORD-003', customer: 'Ana Martínez', product: 'Bolsa Sorpresa Panadería', quantity: 1, total: 15000, status: 'ready', time: 'Hace 30 min' },
  { id: 'ORD-004', customer: 'Pedro Sánchez', product: 'Combo Café', quantity: 3, total: 21000, status: 'completed', time: 'Hace 1 hora' },
  { id: 'ORD-005', customer: 'Laura Díaz', product: 'Pack Almuerzo', quantity: 1, total: 14000, status: 'cancelled', time: 'Hace 2 horas' },
]

const MOCK_PRODUCTS: Product[] = [
  { id: 'PRD-001', name: 'Bolsa Sorpresa Panadería', type: 'mystery_bag', price: 15000, originalPrice: 35000, stock: 8, sold: 12, status: 'active' },
  { id: 'PRD-002', name: 'Pack Almuerzo Ejecutivo', type: 'daily_deal', price: 14000, originalPrice: 28000, stock: 5, sold: 15, status: 'active' },
  { id: 'PRD-003', name: 'Combo Café + Croissant', type: 'regular', price: 7000, originalPrice: 12000, stock: 0, sold: 30, status: 'sold_out' },
  { id: 'PRD-004', name: 'Torta de Chocolate', type: 'expiring_soon', price: 8000, originalPrice: 18000, stock: 3, sold: 7, status: 'active' },
  { id: 'PRD-005', name: 'Pack Navideño', type: 'seasonal', price: 45000, originalPrice: 65000, stock: 10, sold: 5, status: 'paused' },
]

// ============================================
// COMPONENTES AUXILIARES
// ============================================

const StatCardComponent: React.FC<{ stat: StatCard }> = ({ stat }) => (
  <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-300">
    <div className="flex items-start justify-between mb-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-${stat.color}-100`}>
        <div className={`text-${stat.color}-600`}>{stat.icon}</div>
      </div>
      <div className={`flex items-center gap-1 text-sm font-medium ${stat.change >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
        {stat.change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
        <span>{Math.abs(stat.change)}%</span>
      </div>
    </div>
    <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
    <p className="text-sm text-gray-500">{stat.title}</p>
    <p className="text-xs text-gray-400 mt-1">{stat.changeLabel}</p>
  </div>
)

const OrderStatusBadge: React.FC<{ status: Order['status'] }> = ({ status }) => {
  const config = {
    pending: { label: 'Pendiente', bg: 'bg-yellow-100', text: 'text-yellow-700' },
    confirmed: { label: 'Confirmado', bg: 'bg-blue-100', text: 'text-blue-700' },
    ready: { label: 'Listo', bg: 'bg-emerald-100', text: 'text-emerald-700' },
    completed: { label: 'Completado', bg: 'bg-gray-100', text: 'text-gray-700' },
    cancelled: { label: 'Cancelado', bg: 'bg-red-100', text: 'text-red-700' }
  }
  const { label, bg, text } = config[status]
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${bg} ${text}`}>
      {label}
    </span>
  )
}

const ProductStatusBadge: React.FC<{ status: Product['status'] }> = ({ status }) => {
  const config = {
    active: { label: 'Activo', bg: 'bg-emerald-100', text: 'text-emerald-700' },
    paused: { label: 'Pausado', bg: 'bg-yellow-100', text: 'text-yellow-700' },
    sold_out: { label: 'Agotado', bg: 'bg-red-100', text: 'text-red-700' }
  }
  const { label, bg, text } = config[status]
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${bg} ${text}`}>
      {label}
    </span>
  )
}

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

const BusinessDashboardPro = () => {
  const { user } = useAuthStore()
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const [searchQuery, setSearchQuery] = useState('')

  const tabs = [
    { id: 'overview', label: 'Resumen', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'products', label: 'Productos', icon: <Package className="w-5 h-5" /> },
    { id: 'orders', label: 'Órdenes', icon: <ShoppingBag className="w-5 h-5" /> },
    { id: 'stats', label: 'Estadísticas', icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'inventory', label: 'Inventario', icon: <Package className="w-5 h-5" /> },
    { id: 'schedule', label: 'Horarios', icon: <Clock className="w-5 h-5" /> },
    { id: 'promotions', label: 'Promociones', icon: <Ticket className="w-5 h-5" /> },
  ]

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price)
  }

  // ============================================
  // RENDER - OVERVIEW TAB
  // ============================================

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {MOCK_STATS.map((stat, index) => (
          <StatCardComponent key={index} stat={stat} />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Link 
          to="/negocio/productos/nuevo"
          className="flex flex-col items-center gap-3 p-6 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl text-white hover:shadow-lg hover:scale-[1.02] transition-all"
        >
          <Plus className="w-8 h-8" />
          <span className="font-semibold">Nuevo Producto</span>
        </Link>
        <button className="flex flex-col items-center gap-3 p-6 bg-white border border-gray-200 rounded-2xl text-gray-700 hover:border-emerald-300 hover:shadow-lg transition-all">
          <Ticket className="w-8 h-8 text-purple-500" />
          <span className="font-semibold">Crear Cupón</span>
        </button>
        <button className="flex flex-col items-center gap-3 p-6 bg-white border border-gray-200 rounded-2xl text-gray-700 hover:border-emerald-300 hover:shadow-lg transition-all">
          <Clock className="w-8 h-8 text-blue-500" />
          <span className="font-semibold">Editar Horarios</span>
        </button>
        <button className="flex flex-col items-center gap-3 p-6 bg-white border border-gray-200 rounded-2xl text-gray-700 hover:border-emerald-300 hover:shadow-lg transition-all">
          <BarChart3 className="w-8 h-8 text-orange-500" />
          <span className="font-semibold">Ver Reportes</span>
        </button>
      </div>

      {/* Recent Orders & Low Stock */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Órdenes Recientes</h3>
            <button 
              onClick={() => setActiveTab('orders')}
              className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
            >
              Ver todas <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="divide-y divide-gray-100">
            {MOCK_ORDERS.slice(0, 4).map(order => (
              <div key={order.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">{order.customer}</span>
                  <OrderStatusBadge status={order.status} />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">{order.product}</span>
                  <span className="font-semibold text-gray-900">{formatPrice(order.total)}</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">{order.time}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              <h3 className="font-semibold text-gray-900">Stock Bajo</h3>
            </div>
            <button 
              onClick={() => setActiveTab('inventory')}
              className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
            >
              Ver inventario <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="divide-y divide-gray-100">
            {MOCK_PRODUCTS.filter(p => p.stock <= 5).map(product => (
              <div key={product.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">{product.name}</span>
                  <span className={`text-sm font-bold ${product.stock === 0 ? 'text-red-600' : 'text-orange-600'}`}>
                    {product.stock === 0 ? 'Agotado' : `${product.stock} unidades`}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Vendidos: {product.sold}</span>
                  <button className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
                    Reabastecer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  // ============================================
  // RENDER - PRODUCTS TAB
  // ============================================

  const renderProducts = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
          />
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl hover:border-gray-300 transition-colors">
            <Filter className="w-5 h-5 text-gray-500" />
            <span className="font-medium text-gray-700">Filtrar</span>
          </button>
          <Link 
            to="/negocio/productos/nuevo"
            className="flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors font-semibold"
          >
            <Plus className="w-5 h-5" />
            <span>Nuevo Producto</span>
          </Link>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Producto</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Tipo</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Precio</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Stock</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Vendidos</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Estado</th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {MOCK_PRODUCTS.map(product => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl flex items-center justify-center">
                        <Package className="w-6 h-6 text-emerald-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-500">ID: {product.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600 capitalize">{product.type.replace('_', ' ')}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-emerald-600">{formatPrice(product.price)}</p>
                      <p className="text-sm text-gray-400 line-through">{formatPrice(product.originalPrice)}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`font-semibold ${product.stock === 0 ? 'text-red-600' : product.stock <= 5 ? 'text-orange-600' : 'text-gray-900'}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-900">{product.sold}</span>
                  </td>
                  <td className="px-6 py-4">
                    <ProductStatusBadge status={product.status} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Ver">
                        <Eye className="w-4 h-4 text-gray-500" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Editar">
                        <Edit className="w-4 h-4 text-gray-500" />
                      </button>
                      <button className="p-2 hover:bg-red-50 rounded-lg transition-colors" title="Eliminar">
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  // ============================================
  // RENDER - ORDERS TAB
  // ============================================

  const renderOrders = () => (
    <div className="space-y-6">
      {/* Order Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {[
          { label: 'Pendientes', count: 3, color: 'yellow' },
          { label: 'Confirmados', count: 5, color: 'blue' },
          { label: 'Listos', count: 2, color: 'emerald' },
          { label: 'Completados', count: 18, color: 'gray' },
          { label: 'Cancelados', count: 1, color: 'red' },
        ].map((stat, index) => (
          <div key={index} className={`bg-${stat.color}-50 rounded-xl p-4 text-center`}>
            <p className={`text-2xl font-bold text-${stat.color}-600`}>{stat.count}</p>
            <p className={`text-sm text-${stat.color}-700`}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Todas las Órdenes</h3>
          <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700">
            <RefreshCw className="w-4 h-4" />
            Actualizar
          </button>
        </div>
        <div className="divide-y divide-gray-100">
          {MOCK_ORDERS.map(order => (
            <div key={order.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-semibold text-gray-900">{order.id}</span>
                    <OrderStatusBadge status={order.status} />
                  </div>
                  <p className="text-gray-600">{order.customer}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">{formatPrice(order.total)}</p>
                  <p className="text-sm text-gray-500">{order.time}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  {order.quantity}x {order.product}
                </p>
                <div className="flex gap-2">
                  {order.status === 'pending' && (
                    <>
                      <button className="flex items-center gap-1 px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-medium hover:bg-emerald-200 transition-colors">
                        <CheckCircle className="w-4 h-4" />
                        Confirmar
                      </button>
                      <button className="flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors">
                        <XCircle className="w-4 h-4" />
                        Rechazar
                      </button>
                    </>
                  )}
                  {order.status === 'confirmed' && (
                    <button className="flex items-center gap-1 px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-medium hover:bg-emerald-200 transition-colors">
                      <CheckCircle className="w-4 h-4" />
                      Marcar Listo
                    </button>
                  )}
                  {order.status === 'ready' && (
                    <button className="flex items-center gap-1 px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-medium hover:bg-emerald-200 transition-colors">
                      <CheckCircle className="w-4 h-4" />
                      Completar
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  // ============================================
  // RENDER - STATS TAB
  // ============================================

  const renderStats = () => (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className="flex gap-2">
        {['Hoy', '7 días', '30 días', '3 meses', 'Año'].map((period, index) => (
          <button
            key={index}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              index === 1 
                ? 'bg-emerald-500 text-white' 
                : 'bg-white border border-gray-200 text-gray-600 hover:border-emerald-300'
            }`}
          >
            {period}
          </button>
        ))}
      </div>

      {/* Charts Placeholder */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Ventas por Día</h3>
          <div className="h-64 flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-emerald-300 mx-auto mb-2" />
              <p className="text-gray-500">Gráfico de ventas</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Productos Más Vendidos</h3>
          <div className="space-y-4">
            {MOCK_PRODUCTS.sort((a, b) => b.sold - a.sold).slice(0, 5).map((product, index) => (
              <div key={product.id} className="flex items-center gap-4">
                <span className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center text-sm font-bold text-emerald-600">
                  {index + 1}
                </span>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{product.name}</p>
                  <div className="w-full bg-gray-100 rounded-full h-2 mt-1">
                    <div 
                      className="bg-emerald-500 h-2 rounded-full" 
                      style={{ width: `${(product.sold / 30) * 100}%` }}
                    />
                  </div>
                </div>
                <span className="font-semibold text-gray-900">{product.sold}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white">
          <h4 className="text-emerald-100 mb-2">Ingresos Totales</h4>
          <p className="text-3xl font-bold">$1.245.000</p>
          <p className="text-emerald-200 text-sm mt-1">+18% vs período anterior</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white">
          <h4 className="text-blue-100 mb-2">Pedidos Completados</h4>
          <p className="text-3xl font-bold">156</p>
          <p className="text-blue-200 text-sm mt-1">+12% vs período anterior</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white">
          <h4 className="text-green-100 mb-2">Comida Salvada</h4>
          <p className="text-3xl font-bold">89.5 kg</p>
          <p className="text-green-200 text-sm mt-1">+25% vs período anterior</p>
        </div>
      </div>
    </div>
  )

  // ============================================
  // RENDER - INVENTORY TAB
  // ============================================

  const renderInventory = () => (
    <div className="space-y-6">
      {/* Inventory Summary */}
      <div className="grid sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Total Productos</p>
          <p className="text-2xl font-bold text-gray-900">5</p>
        </div>
        <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
          <p className="text-sm text-emerald-600 mb-1">En Stock</p>
          <p className="text-2xl font-bold text-emerald-700">3</p>
        </div>
        <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
          <p className="text-sm text-orange-600 mb-1">Stock Bajo</p>
          <p className="text-2xl font-bold text-orange-700">1</p>
        </div>
        <div className="bg-red-50 rounded-xl p-4 border border-red-100">
          <p className="text-sm text-red-600 mb-1">Agotados</p>
          <p className="text-2xl font-bold text-red-700">1</p>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Control de Inventario</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Producto</th>
                <th className="text-center px-6 py-4 text-sm font-semibold text-gray-600">Stock Actual</th>
                <th className="text-center px-6 py-4 text-sm font-semibold text-gray-600">Vendidos Hoy</th>
                <th className="text-center px-6 py-4 text-sm font-semibold text-gray-600">Estado</th>
                <th className="text-center px-6 py-4 text-sm font-semibold text-gray-600">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {MOCK_PRODUCTS.map(product => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{product.name}</td>
                  <td className="px-6 py-4 text-center">
                    <input
                      type="number"
                      defaultValue={product.stock}
                      className="w-20 text-center px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </td>
                  <td className="px-6 py-4 text-center text-gray-600">{Math.floor(Math.random() * 5)}</td>
                  <td className="px-6 py-4 text-center">
                    <ProductStatusBadge status={product.status} />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-medium hover:bg-emerald-200 transition-colors">
                      Actualizar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  // ============================================
  // RENDER - SCHEDULE TAB
  // ============================================

  const renderSchedule = () => {
    const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
    
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-gray-900">Horarios de Recogida</h3>
            <button className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-sm font-semibold hover:bg-emerald-600 transition-colors">
              Guardar Cambios
            </button>
          </div>
          
          <div className="space-y-4">
            {days.map((day, index) => (
              <div key={day} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-32">
                  <label className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      defaultChecked={index < 6}
                      className="w-5 h-5 rounded border-gray-300 text-emerald-500 focus:ring-emerald-500"
                    />
                    <span className="font-medium text-gray-900">{day}</span>
                  </label>
                </div>
                <div className="flex items-center gap-2 flex-1">
                  <input
                    type="time"
                    defaultValue="08:00"
                    className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="text-gray-500">a</span>
                  <input
                    type="time"
                    defaultValue="20:00"
                    className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Ventana de recogida:</span>
                  <select className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    <option>30 min</option>
                    <option>1 hora</option>
                    <option>2 horas</option>
                    <option>3 horas</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Special Hours */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-gray-900">Horarios Especiales</h3>
            <button className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium">
              <Plus className="w-4 h-4" />
              Agregar fecha especial
            </button>
          </div>
          <div className="text-center py-8 text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No hay horarios especiales configurados</p>
            <p className="text-sm">Agrega fechas festivas o cierres temporales</p>
          </div>
        </div>
      </div>
    )
  }

  // ============================================
  // RENDER - PROMOTIONS TAB
  // ============================================

  const renderPromotions = () => (
    <div className="space-y-6">
      {/* Create Promotion */}
      <div className="flex justify-end">
        <button className="flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-xl font-semibold hover:bg-emerald-600 transition-colors">
          <Plus className="w-5 h-5" />
          Crear Promoción
        </button>
      </div>

      {/* Active Promotions */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-900 mb-6">Promociones Activas</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Promo Card 1 */}
          <div className="border border-emerald-200 bg-emerald-50 rounded-xl p-4">
            <div className="flex items-start justify-between mb-3">
              <span className="px-3 py-1 bg-emerald-500 text-white rounded-full text-xs font-semibold">
                Activo
              </span>
              <button className="p-1 hover:bg-emerald-100 rounded">
                <MoreVertical className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            <h4 className="font-bold text-gray-900 mb-1">BIENVENIDO20</h4>
            <p className="text-sm text-gray-600 mb-3">20% de descuento en primera compra</p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Usos: 45/100</span>
              <span className="text-emerald-600 font-medium">Vence: 31 Dic</span>
            </div>
          </div>

          {/* Promo Card 2 */}
          <div className="border border-purple-200 bg-purple-50 rounded-xl p-4">
            <div className="flex items-start justify-between mb-3">
              <span className="px-3 py-1 bg-purple-500 text-white rounded-full text-xs font-semibold">
                Activo
              </span>
              <button className="p-1 hover:bg-purple-100 rounded">
                <MoreVertical className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            <h4 className="font-bold text-gray-900 mb-1">NAVIDAD2024</h4>
            <p className="text-sm text-gray-600 mb-3">15% en packs navideños</p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Usos: 23/50</span>
              <span className="text-purple-600 font-medium">Vence: 25 Dic</span>
            </div>
          </div>

          {/* Add New Card */}
          <button className="border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-emerald-300 hover:text-emerald-500 transition-colors min-h-[160px]">
            <Plus className="w-8 h-8" />
            <span className="font-medium">Nueva Promoción</span>
          </button>
        </div>
      </div>

      {/* Coupon History */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-900 mb-6">Historial de Cupones</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Código</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Descuento</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Usos</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Estado</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Vencimiento</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="px-4 py-3 font-medium">BIENVENIDO20</td>
                <td className="px-4 py-3">20%</td>
                <td className="px-4 py-3">45/100</td>
                <td className="px-4 py-3"><span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">Activo</span></td>
                <td className="px-4 py-3 text-gray-500">31 Dic 2024</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">NAVIDAD2024</td>
                <td className="px-4 py-3">15%</td>
                <td className="px-4 py-3">23/50</td>
                <td className="px-4 py-3"><span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">Activo</span></td>
                <td className="px-4 py-3 text-gray-500">25 Dic 2024</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">BLACKFRIDAY</td>
                <td className="px-4 py-3">30%</td>
                <td className="px-4 py-3">100/100</td>
                <td className="px-4 py-3"><span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">Expirado</span></td>
                <td className="px-4 py-3 text-gray-500">29 Nov 2024</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  // ============================================
  // RENDER PRINCIPAL
  // ============================================

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold">
                  {user?.name?.charAt(0) || 'N'}
                </span>
              </div>
              <div>
                <h1 className="font-bold text-gray-900">{user?.name || 'Mi Negocio'}</h1>
                <p className="text-sm text-gray-500">Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors relative">
                <Bell className="w-5 h-5 text-gray-500" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <Settings className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto scrollbar-hide py-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'products' && renderProducts()}
        {activeTab === 'orders' && renderOrders()}
        {activeTab === 'stats' && renderStats()}
        {activeTab === 'inventory' && renderInventory()}
        {activeTab === 'schedule' && renderSchedule()}
        {activeTab === 'promotions' && renderPromotions()}
      </div>
    </div>
  )
}

export default BusinessDashboardPro
