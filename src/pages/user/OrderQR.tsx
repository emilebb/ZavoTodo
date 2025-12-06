import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, MapPin, Clock, Download } from 'lucide-react'
import { useOrderQuery } from '../../hooks/useOrders'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

const OrderQR = () => {
  const { id } = useParams<{ id: string }>()
  const { data: order, isLoading, error } = useOrderQuery(id!)

  const downloadQR = () => {
    if (!order?.qr_code) return

    const link = document.createElement('a')
    link.download = `zavo-order-${order.id}.png`
    link.href = order.qr_code
    link.click()
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

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center mb-6">
        <Link to={`/pedido/${order.id}/confirmado`}>
          <Button variant="ghost" size="sm" className="mr-3">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <h1 className="text-xl font-semibold text-gray-900">Código QR</h1>
      </div>

      {/* Status */}
      <div className="text-center mb-6">
        <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.estado)}`}>
          {getStatusText(order.estado)}
        </div>
      </div>

      {/* QR Code */}
      <Card className="text-center mb-6">
        <div className="p-8">
          <div className="w-64 h-64 mx-auto mb-4 bg-white rounded-lg border-2 border-gray-200 flex items-center justify-center">
            {order.qr_code ? (
              <img 
                src={order.qr_code} 
                alt="QR Code" 
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="text-gray-400">
                <p>QR no disponible</p>
              </div>
            )}
          </div>
          
          <div className="text-sm text-gray-600 mb-4">
            <p className="font-medium">Pedido #{order.id.slice(-8).toUpperCase()}</p>
            <p>Presenta este código al personal del negocio</p>
          </div>

          <Button
            variant="outline"
            onClick={downloadQR}
            disabled={!order.qr_code}
          >
            <Download className="w-4 h-4 mr-2" />
            Descargar QR
          </Button>
        </div>
      </Card>

      {/* Business Info */}
      <Card className="mb-6">
        <h3 className="font-semibold text-gray-900 mb-4">Información de Recogida</h3>
        
        <div className="space-y-3">
          <div>
            <h4 className="font-medium text-gray-900">{order.pack?.titulo}</h4>
            <p className="text-gray-600 text-sm">{order.pack?.descripcion}</p>
          </div>

          <div className="border-t border-gray-200 pt-3">
            <div className="flex items-start mb-2">
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
        <h3 className="font-medium text-gray-900 mb-3">Instrucciones</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <p>• Llega al negocio en el horario indicado</p>
          <p>• Muestra este código QR al personal</p>
          <p>• Espera a que verifiquen tu pedido</p>
          <p>• Recoge tu pack sorpresa</p>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Link to="/perfil/pedidos">
          <Button variant="outline" fullWidth>
            Ver Todos mis Pedidos
          </Button>
        </Link>
        
        <Link to="/">
          <Button variant="outline" fullWidth>
            Buscar Más Packs
          </Button>
        </Link>
      </div>

      {/* Help */}
      <div className="mt-6 text-center text-sm text-gray-500">
        <p>¿Tienes problemas con tu pedido?</p>
        <p>Contacta al negocio directamente o escríbenos a soporte@zavo.co</p>
      </div>
    </div>
  )
}

export default OrderQR
