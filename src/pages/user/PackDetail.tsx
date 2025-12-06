import { useParams, useNavigate } from 'react-router-dom'
import { MapPin, Clock, ArrowLeft, ShoppingBag } from 'lucide-react'
import { usePackQuery } from '../../hooks/usePacks'
import { useCreateOrderMutation } from '../../hooks/useOrders'
import { useAuthStore } from '../../store/authStore'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import QRCode from 'qrcode'
import { useState } from 'react'

const PackDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [purchasing, setPurchasing] = useState(false)

  const { data: pack, isLoading, error } = usePackQuery(id!)
  const createOrderMutation = useCreateOrderMutation()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price)
  }

  const handlePurchase = async () => {
    if (!pack || !user) return

    setPurchasing(true)

    try {
      // Generate QR code for the order
      const qrData = `ZAVO-ORDER-${Date.now()}-${pack.id}-${user.id}`
      const qrCode = await QRCode.toDataURL(qrData)

      const newOrder = await createOrderMutation.mutateAsync({
        user_id: user.id,
        pack_id: pack.id,
        estado: 'pendiente',
        qr_code: qrCode,
      })

      navigate(`/pedido/${newOrder.id}/confirmado`)
    } catch (error) {
      console.error('Error creating order:', error)
    } finally {
      setPurchasing(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error || !pack) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Pack no encontrado</h2>
        <p className="text-gray-600 mb-4">El pack que buscas no existe o ya no está disponible.</p>
        <Button onClick={() => navigate('/')}>
          Volver al inicio
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="mr-3"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-xl font-semibold text-gray-900">Detalle del Pack</h1>
      </div>

      {/* Pack Image */}
      <div className="aspect-video bg-gradient-to-br from-green-100 to-teal-100 rounded-lg mb-6 flex items-center justify-center overflow-hidden">
        {pack.business?.imagen ? (
          <img 
            src={pack.business.imagen} 
            alt={pack.business.nombre}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-200 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-primary-700 font-bold text-2xl">
                {pack.business?.nombre.charAt(0)}
              </span>
            </div>
            <p className="text-lg text-gray-600">{pack.business?.nombre}</p>
          </div>
        )}
      </div>

      {/* Pack Info */}
      <Card className="mb-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{pack.titulo}</h2>
            <p className="text-gray-600">{pack.descripcion}</p>
          </div>
          <div className="text-right ml-4">
            <div className="text-lg text-gray-500 line-through mb-1">
              {formatPrice(pack.precio_original)}
            </div>
            <div className="text-3xl font-bold text-primary-600">
              {formatPrice(pack.precio_descuento)}
            </div>
            <div className="bg-red-100 text-red-800 text-sm px-2 py-1 rounded-full inline-block mt-2">
              -{pack.porcentaje_descuento}% OFF
            </div>
          </div>
        </div>

        {/* Business Info */}
        <div className="border-t border-gray-200 pt-4">
          <h3 className="font-semibold text-gray-900 mb-3">Información del Negocio</h3>
          <div className="space-y-2">
            <div className="flex items-center text-gray-600">
              <MapPin className="w-4 h-4 mr-2" />
              <span>{pack.business?.direccion}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Clock className="w-4 h-4 mr-2" />
              <span>Horario de retiro: {pack.hora_retiro_desde} - {pack.hora_retiro_hasta}</span>
            </div>
          </div>
        </div>

        {/* Stock */}
        <div className="border-t border-gray-200 pt-4 mt-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Stock disponible:</span>
            <span className="font-semibold text-gray-900">{pack.stock} unidades</span>
          </div>
        </div>
      </Card>

      {/* Purchase Button */}
      <div className="sticky bottom-6">
        <Button
          fullWidth
          size="lg"
          onClick={handlePurchase}
          loading={purchasing || createOrderMutation.isPending}
          disabled={pack.stock === 0 || !pack.activo}
          className="shadow-lg"
        >
          <ShoppingBag className="w-5 h-5 mr-2" />
          {pack.stock === 0 ? 'Agotado' : 'Comprar y Rescatar'}
        </Button>
      </div>

      {/* Savings Info */}
      <Card variant="glass" className="mt-4 text-center">
        <div className="text-sm text-gray-600">
          <p className="mb-1">🌱 <strong>Impacto ambiental</strong></p>
          <p>
            Al comprar este pack evitas que {formatPrice(pack.precio_original - pack.precio_descuento)} 
            en comida se desperdicie
          </p>
        </div>
      </Card>
    </div>
  )
}

export default PackDetail
