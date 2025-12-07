/**
 * ZAVO OrderTrackingPanel Component
 * Panel de seguimiento de orden con timeline y detalles
 * Responsive: Desktop (sidebar) y Mobile (bottom sheet)
 */

import { useState } from 'react'
import { 
  OrderTracking, 
  Courier, 
  OrderStatus,
  getOrderStatusLabel,
  formatEta 
} from '../../types/location'
import { ORDER_STEPS, STATUS_MESSAGES, VEHICLE_ICONS } from '../../config/realtime'
import { 
  X, 
  Phone, 
  MessageCircle, 
  ChevronUp, 
  ChevronDown,
  Clock,
  MapPin,
  Star,
  Package,
  CheckCircle2,
  Circle,
  Loader2
} from 'lucide-react'
import Button from '../ui/Button'

interface OrderTrackingPanelProps {
  order: OrderTracking | null
  courier: Courier | null
  onClose?: () => void
  onContactSupport?: () => void
  variant?: 'desktop' | 'mobile'
}

/**
 * Timeline de estados de la orden
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
        if (currentStatus === 'canceled') return null
        
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
 * Card de información del courier
 */
function CourierCard({ courier }: { courier: Courier }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-soft border border-gray-100">
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="w-14 h-14 bg-gradient-to-br from-primary-400 to-teal-400 rounded-full flex items-center justify-center text-2xl">
          {VEHICLE_ICONS[courier.vehicleType] || '🛵'}
        </div>
        
        {/* Info */}
        <div className="flex-1">
          <h4 className="font-semibold text-content">{courier.name}</h4>
          <div className="flex items-center gap-2 text-sm text-content-muted">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span>{courier.rating?.toFixed(1) || '4.8'}</span>
            <span>•</span>
            <span className="capitalize">{courier.vehicleType}</span>
          </div>
        </div>
        
        {/* Acciones */}
        <div className="flex gap-2">
          <button 
            className="w-10 h-10 bg-primary-50 rounded-full flex items-center justify-center text-primary-600 hover:bg-primary-100 transition-colors"
            aria-label="Llamar al repartidor"
          >
            <Phone className="w-5 h-5" />
          </button>
          <button 
            className="w-10 h-10 bg-primary-50 rounded-full flex items-center justify-center text-primary-600 hover:bg-primary-100 transition-colors"
            aria-label="Enviar mensaje"
          >
            <MessageCircle className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

/**
 * Panel de tracking - Versión Desktop (sidebar)
 */
function DesktopPanel({ 
  order, 
  courier, 
  onClose,
  onContactSupport 
}: OrderTrackingPanelProps) {
  if (!order) return null
  
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
              aria-label="Cerrar panel"
            >
              <X className="w-5 h-5 text-content-muted" />
            </button>
          )}
        </div>
        
        {/* ETA */}
        {order.etaMinutes && order.status !== 'delivered' && (
          <div className="flex items-center gap-2 text-primary-600">
            <Clock className="w-5 h-5" />
            <span className="font-semibold">{formatEta(order.etaMinutes)}</span>
            <span className="text-content-muted">estimado</span>
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Restaurant info */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
            <Package className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <p className="font-medium text-content">{order.restaurantName}</p>
            <p className="text-sm text-content-muted">Pedido #{order.id.slice(-6)}</p>
          </div>
        </div>
        
        {/* Courier card */}
        {courier && order.status !== 'created' && order.status !== 'confirmed' && (
          <CourierCard courier={courier} />
        )}
        
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
              <p className="text-content">{order.deliveryAddress.formatted}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="p-4 border-t border-gray-100">
        <Button 
          variant="outline" 
          fullWidth
          onClick={onContactSupport}
        >
          ¿Necesitas ayuda?
        </Button>
      </div>
    </div>
  )
}

/**
 * Panel de tracking - Versión Mobile (bottom sheet)
 */
function MobilePanel({ 
  order, 
  courier, 
  onClose: _onClose, // Reservado para uso futuro
  onContactSupport 
}: OrderTrackingPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  
  if (!order) return null
  
  return (
    <div 
      className={`
        fixed bottom-0 left-0 right-0 z-50
        bg-white rounded-t-3xl shadow-2xl
        transition-all duration-300 ease-out
        ${isExpanded ? 'h-[80vh]' : 'h-auto max-h-[40vh]'}
      `}
    >
      {/* Handle */}
      <button
        className="w-full py-3 flex justify-center"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-label={isExpanded ? 'Minimizar panel' : 'Expandir panel'}
      >
        <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
      </button>
      
      {/* Collapsed view */}
      <div className="px-4 pb-4">
        {/* Status + ETA */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-lg font-semibold text-content">
              {getOrderStatusLabel(order.status)}
            </p>
            {order.etaMinutes && order.status !== 'delivered' && (
              <p className="text-sm text-content-muted">
                Llega en ~{formatEta(order.etaMinutes)}
              </p>
            )}
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {isExpanded ? (
              <ChevronDown className="w-5 h-5 text-content-muted" />
            ) : (
              <ChevronUp className="w-5 h-5 text-content-muted" />
            )}
          </button>
        </div>
        
        {/* Mini courier info */}
        {courier && !isExpanded && (
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-teal-400 rounded-full flex items-center justify-center text-lg">
              {VEHICLE_ICONS[courier.vehicleType] || '🛵'}
            </div>
            <div className="flex-1">
              <p className="font-medium text-content text-sm">{courier.name}</p>
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
          {courier && <CourierCard courier={courier} />}
          
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
                <p className="text-content">{order.deliveryAddress.formatted}</p>
              </div>
            </div>
          </div>
          
          {/* Support button */}
          <Button 
            variant="outline" 
            fullWidth
            onClick={onContactSupport}
          >
            ¿Necesitas ayuda?
          </Button>
        </div>
      )}
    </div>
  )
}

/**
 * OrderTrackingPanel - Componente principal
 * Renderiza versión desktop o mobile según el prop variant
 */
export default function OrderTrackingPanel(props: OrderTrackingPanelProps) {
  const { variant = 'desktop' } = props
  
  if (variant === 'mobile') {
    return <MobilePanel {...props} />
  }
  
  return <DesktopPanel {...props} />
}
