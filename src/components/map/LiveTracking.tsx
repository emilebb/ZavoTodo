/**
 * ============================================
 * ZAVO - LiveTracking Component
 * ============================================
 * 
 * Componente completo de tracking en tiempo real
 * Estilo Rappi / Uber Eats
 * 
 * Incluye:
 * - Mapa con ubicación del repartidor
 * - Panel lateral con estado del pedido
 * - Timeline de progreso
 * - ETA actualizado
 */

import { useState, useEffect, useMemo } from 'react'
import { useOrderTracking, calculateETA } from '../../hooks/firebase/useOrderTracking'
import LiveMap, { MapMarker, MapRoute, getDirectionsRoute } from './LiveMap'
import { Order, OrderStatus, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '../../types/firebase'
import { 
  Phone, 
  MessageCircle, 
  Clock, 
  MapPin, 
  Package,
  CheckCircle2,
  Circle,
  Loader2,
  ChevronUp,
  ChevronDown,
  Navigation,
  Star,
  X
} from 'lucide-react'
import Button from '../ui/Button'

// ============================================
// TIPOS
// ============================================

interface LiveTrackingProps {
  orderId: string
  onClose?: () => void
  onContactSupport?: () => void
}

// ============================================
// CONSTANTES
// ============================================

const ORDER_STEPS: { status: OrderStatus; label: string; icon: string }[] = [
  { status: 'pending', label: 'Pedido recibido', icon: '📝' },
  { status: 'confirmed', label: 'Confirmado', icon: '✅' },
  { status: 'preparing', label: 'Preparando', icon: '👨‍🍳' },
  { status: 'ready', label: 'Listo', icon: '📦' },
  { status: 'picked_up', label: 'Recogido', icon: '🛵' },
  { status: 'delivering', label: 'En camino', icon: '🚀' },
  { status: 'delivered', label: 'Entregado', icon: '🎉' },
]

const STATUS_MESSAGES: Record<OrderStatus, string> = {
  pending: 'Tu pedido ha sido recibido. Esperando confirmación...',
  confirmed: 'El restaurante ha confirmado tu pedido.',
  preparing: 'Tu pedido está siendo preparado con mucho cariño.',
  ready: 'Tu pedido está listo. Buscando repartidor...',
  picked_up: 'El repartidor ha recogido tu pedido.',
  delivering: '¡Tu pedido está en camino! Ya casi llega.',
  delivered: '¡Pedido entregado! Disfrútalo.',
  completed: 'Pedido completado. ¡Gracias por tu compra!',
  cancelled: 'Pedido cancelado.',
}

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export default function LiveTracking({ 
  orderId, 
  onClose,
  onContactSupport 
}: LiveTrackingProps) {
  const { order, currentLocation, route, isLoading, error } = useOrderTracking(orderId)
  const [isExpanded, setIsExpanded] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [followCourier, setFollowCourier] = useState(true)
  const [calculatedRoute, setCalculatedRoute] = useState<MapRoute | null>(null)

  // Detectar mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Calcular ruta cuando cambie la ubicación
  useEffect(() => {
    if (!order || !currentLocation) return

    const fetchRoute = async () => {
      const destination = order.delivery_coordinates
      const routePoints = await getDirectionsRoute(currentLocation, destination)
      
      setCalculatedRoute({
        id: 'delivery-route',
        points: routePoints,
        color: '#16A34A',
        width: 4,
      })
    }

    fetchRoute()
  }, [order, currentLocation])

  // Calcular ETA
  const eta = useMemo(() => {
    if (!currentLocation || !order) return null
    return calculateETA(currentLocation, order.delivery_coordinates)
  }, [currentLocation, order])

  // Crear marcadores para el mapa
  const markers: MapMarker[] = useMemo(() => {
    if (!order) return []

    const result: MapMarker[] = []

    // Marcador del restaurante
    result.push({
      id: 'restaurant',
      type: 'restaurant',
      position: order.pickup_coordinates,
      label: order.business_name,
    })

    // Marcador de destino
    result.push({
      id: 'delivery',
      type: 'delivery',
      position: order.delivery_coordinates,
      label: 'Tu ubicación',
    })

    return result
  }, [order])

  // Rutas para el mapa
  const routes: MapRoute[] = useMemo(() => {
    const result: MapRoute[] = []

    // Ruta calculada
    if (calculatedRoute) {
      result.push(calculatedRoute)
    }

    // Ruta del tracking (historial)
    if (route.length > 1) {
      result.push({
        id: 'tracking-history',
        points: route,
        color: '#86EFAC',
        width: 3,
        dashed: true,
      })
    }

    return result
  }, [calculatedRoute, route])

  // ============================================
  // LOADING STATE
  // ============================================

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary-500 animate-spin mx-auto mb-4" />
          <p className="text-content-muted">Cargando tracking...</p>
        </div>
      </div>
    )
  }

  // ============================================
  // ERROR STATE
  // ============================================

  if (error || !order) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-content mb-2">
            Pedido no encontrado
          </h2>
          <p className="text-content-muted mb-4">
            {error || 'No pudimos encontrar este pedido'}
          </p>
          <Button onClick={onClose}>Volver</Button>
        </div>
      </div>
    )
  }

  // ============================================
  // RENDER MOBILE
  // ============================================

  if (isMobile) {
    return (
      <div className="h-screen flex flex-col">
        {/* Mapa */}
        <div className="flex-1 relative">
          <LiveMap
            center={currentLocation || order.pickup_coordinates}
            zoom={15}
            markers={markers}
            routes={routes}
            courierLocation={currentLocation}
            followCourier={followCourier}
            className="h-full"
          >
            {/* Botón seguir repartidor */}
            <button
              onClick={() => setFollowCourier(!followCourier)}
              className={`
                absolute top-4 right-4 z-10 p-3 rounded-xl shadow-lg
                ${followCourier ? 'bg-primary-500 text-white' : 'bg-white text-gray-600'}
              `}
              aria-label={followCourier ? 'Dejar de seguir' : 'Seguir repartidor'}
            >
              <Navigation className="w-5 h-5" />
            </button>

            {/* Botón cerrar */}
            {onClose && (
              <button
                onClick={onClose}
                className="absolute top-4 left-4 z-10 p-3 bg-white rounded-xl shadow-lg"
                aria-label="Cerrar"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            )}
          </LiveMap>
        </div>

        {/* Bottom Sheet */}
        <MobileBottomSheet
          order={order}
          eta={eta}
          isExpanded={isExpanded}
          onToggle={() => setIsExpanded(!isExpanded)}
          onContactSupport={onContactSupport}
        />
      </div>
    )
  }

  // ============================================
  // RENDER DESKTOP
  // ============================================

  return (
    <div className="h-screen flex">
      {/* Panel lateral */}
      <DesktopSidebar
        order={order}
        eta={eta}
        onClose={onClose}
        onContactSupport={onContactSupport}
      />

      {/* Mapa */}
      <div className="flex-1 relative">
        <LiveMap
          center={currentLocation || order.pickup_coordinates}
          zoom={15}
          markers={markers}
          routes={routes}
          courierLocation={currentLocation}
          followCourier={followCourier}
          className="h-full"
        >
          {/* Botón seguir repartidor */}
          <button
            onClick={() => setFollowCourier(!followCourier)}
            className={`
              absolute bottom-24 right-4 z-10 p-3 rounded-xl shadow-lg
              ${followCourier ? 'bg-primary-500 text-white' : 'bg-white text-gray-600'}
            `}
            aria-label={followCourier ? 'Dejar de seguir' : 'Seguir repartidor'}
          >
            <Navigation className="w-5 h-5" />
          </button>
        </LiveMap>
      </div>
    </div>
  )
}

// ============================================
// COMPONENTES AUXILIARES
// ============================================

/**
 * Timeline de estados del pedido
 */
function OrderTimeline({ currentStatus }: { currentStatus: OrderStatus }) {
  const currentIndex = ORDER_STEPS.findIndex(step => step.status === currentStatus)

  return (
    <div className="space-y-3">
      {ORDER_STEPS.map((step, index) => {
        const isCompleted = index < currentIndex
        const isCurrent = index === currentIndex
        const isPending = index > currentIndex

        // No mostrar pasos después de delivered
        if (currentStatus === 'delivered' && index > currentIndex) return null
        if (currentStatus === 'cancelled') return null

        return (
          <div key={step.status} className="flex items-start gap-3">
            {/* Indicador */}
            <div className="flex flex-col items-center">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm
                transition-all duration-300
                ${isCompleted ? 'bg-primary-500 text-white' : ''}
                ${isCurrent ? 'bg-primary-500 text-white ring-4 ring-primary-100' : ''}
                ${isPending ? 'bg-gray-100 text-gray-400' : ''}
              `}>
                {isCompleted ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : isCurrent ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Circle className="w-5 h-5" />
                )}
              </div>
              {/* Línea conectora */}
              {index < ORDER_STEPS.length - 1 && (
                <div className={`
                  w-0.5 h-6 mt-1
                  ${isCompleted ? 'bg-primary-500' : 'bg-gray-200'}
                `} />
              )}
            </div>

            {/* Contenido */}
            <div className={`flex-1 pb-4 ${isPending ? 'opacity-50' : ''}`}>
              <div className="flex items-center gap-2">
                <span className="text-lg">{step.icon}</span>
                <span className={`font-medium ${isCurrent ? 'text-primary-600' : 'text-content'}`}>
                  {step.label}
                </span>
              </div>
              {isCurrent && (
                <p className="text-sm text-content-muted mt-1">
                  {STATUS_MESSAGES[step.status]}
                </p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

/**
 * Card de información del repartidor
 */
function CourierCard({ order }: { order: Order }) {
  if (!order.driver_name) return null

  return (
    <div className="bg-white rounded-2xl p-4 shadow-soft border border-gray-100">
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="w-14 h-14 bg-gradient-to-br from-primary-400 to-teal-400 rounded-full flex items-center justify-center text-2xl">
          🛵
        </div>

        {/* Info */}
        <div className="flex-1">
          <h4 className="font-semibold text-content">{order.driver_name}</h4>
          <div className="flex items-center gap-2 text-sm text-content-muted">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span>4.9</span>
            <span>•</span>
            <span>Moto</span>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex gap-2">
          <button
            className="w-10 h-10 bg-primary-50 rounded-full flex items-center justify-center text-primary-600 hover:bg-primary-100 transition-colors"
            aria-label="Llamar"
          >
            <Phone className="w-5 h-5" />
          </button>
          <button
            className="w-10 h-10 bg-primary-50 rounded-full flex items-center justify-center text-primary-600 hover:bg-primary-100 transition-colors"
            aria-label="Mensaje"
          >
            <MessageCircle className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

/**
 * Sidebar para desktop
 */
function DesktopSidebar({
  order,
  eta,
  onClose,
  onContactSupport,
}: {
  order: Order
  eta: number | null
  onClose?: () => void
  onContactSupport?: () => void
}) {
  return (
    <div className="w-96 h-full bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold font-display text-content">
            Seguimiento de Pedido
          </h2>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5 text-content-muted" />
            </button>
          )}
        </div>

        {/* ETA */}
        {eta && order.status !== 'delivered' && (
          <div className="flex items-center gap-2 text-primary-600">
            <Clock className="w-5 h-5" />
            <span className="font-semibold">{eta} min</span>
            <span className="text-content-muted">estimado</span>
          </div>
        )}

        {/* Status badge */}
        <div className="mt-3">
          <span className={`
            inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
            ${ORDER_STATUS_COLORS[order.status]}
          `}>
            {ORDER_STATUS_LABELS[order.status]}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Restaurant info */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
            <Package className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <p className="font-medium text-content">{order.business_name}</p>
            <p className="text-sm text-content-muted">Pedido #{order.id.slice(-6)}</p>
          </div>
        </div>

        {/* Courier card */}
        <CourierCard order={order} />

        {/* Timeline */}
        <div>
          <h3 className="text-sm font-semibold text-content-muted uppercase tracking-wide mb-4">
            Estado del pedido
          </h3>
          <OrderTimeline currentStatus={order.status} />
        </div>

        {/* Delivery address */}
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-content-muted mt-0.5" />
            <div>
              <p className="text-sm font-medium text-content-muted">Entregar en</p>
              <p className="text-content">{order.delivery_address}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100">
        <Button variant="outline" fullWidth onClick={onContactSupport}>
          ¿Necesitas ayuda?
        </Button>
      </div>
    </div>
  )
}

/**
 * Bottom sheet para mobile
 */
function MobileBottomSheet({
  order,
  eta,
  isExpanded,
  onToggle,
  onContactSupport,
}: {
  order: Order
  eta: number | null
  isExpanded: boolean
  onToggle: () => void
  onContactSupport?: () => void
}) {
  return (
    <div
      className={`
        bg-white rounded-t-3xl shadow-2xl
        transition-all duration-300 ease-out
        ${isExpanded ? 'h-[60vh]' : 'h-auto'}
      `}
    >
      {/* Handle */}
      <button
        className="w-full py-3 flex justify-center"
        onClick={onToggle}
        aria-label={isExpanded ? 'Minimizar' : 'Expandir'}
      >
        <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
      </button>

      {/* Collapsed view */}
      <div className="px-4 pb-4">
        {/* Status + ETA */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-lg font-semibold text-content">
              {ORDER_STATUS_LABELS[order.status]}
            </p>
            {eta && order.status !== 'delivered' && (
              <p className="text-sm text-content-muted">
                Llega en ~{eta} min
              </p>
            )}
          </div>
          <button onClick={onToggle} className="p-2">
            {isExpanded ? (
              <ChevronDown className="w-5 h-5 text-content-muted" />
            ) : (
              <ChevronUp className="w-5 h-5 text-content-muted" />
            )}
          </button>
        </div>

        {/* Mini courier info */}
        {order.driver_name && !isExpanded && (
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-teal-400 rounded-full flex items-center justify-center text-lg">
              🛵
            </div>
            <div className="flex-1">
              <p className="font-medium text-content text-sm">{order.driver_name}</p>
              <p className="text-xs text-content-muted">Tu repartidor</p>
            </div>
            <button
              className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white"
              aria-label="Llamar"
            >
              <Phone className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Expanded content */}
      {isExpanded && (
        <div className="flex-1 overflow-y-auto px-4 pb-8 space-y-6">
          {/* Courier card */}
          <CourierCard order={order} />

          {/* Timeline */}
          <div>
            <h3 className="text-sm font-semibold text-content-muted uppercase tracking-wide mb-4">
              Estado del pedido
            </h3>
            <OrderTimeline currentStatus={order.status} />
          </div>

          {/* Delivery address */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-content-muted mt-0.5" />
              <div>
                <p className="text-sm font-medium text-content-muted">Entregar en</p>
                <p className="text-content">{order.delivery_address}</p>
              </div>
            </div>
          </div>

          {/* Support button */}
          <Button variant="outline" fullWidth onClick={onContactSupport}>
            ¿Necesitas ayuda?
          </Button>
        </div>
      )}
    </div>
  )
}
