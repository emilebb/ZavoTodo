/**
 * ============================================
 * ZAVO - QR Scanner (Restaurantes)
 * ============================================
 * 
 * Página donde los restaurantes escanean códigos QR
 */

import { useState, useRef, useEffect } from 'react'
import { 
  Camera, 
  QrCode, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  RefreshCw,
  User,
  Package,
  Clock,
  MapPin,
  Phone
} from 'lucide-react'
import { QRVerification, Order } from '../../types'
import { verifyQRWithBackend, mockQRVerification } from '../../services/qrService'
import { useAuthStore } from '../../store/authStore'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

const QRScanner = () => {
  const { user } = useAuthStore()
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [verification, setVerification] = useState<QRVerification | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [manualInput, setManualInput] = useState('')
  const [showManualInput, setShowManualInput] = useState(false)

  // ============================================
  // EFECTOS
  // ============================================

  useEffect(() => {
    return () => {
      // Limpiar stream al desmontar
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [stream])

  // ============================================
  // FUNCIONES DE CÁMARA
  // ============================================

  const startCamera = async () => {
    try {
      setError(null)
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment', // Cámara trasera preferida
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      })
      
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        videoRef.current.play()
      }
      setIsScanning(true)
    } catch (err) {
      console.error('Error accediendo a la cámara:', err)
      setError('No se pudo acceder a la cámara. Verifica los permisos.')
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
    setIsScanning(false)
  }

  const captureFrame = () => {
    if (!videoRef.current || !canvasRef.current) return null

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    if (!context) return null

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    context.drawImage(video, 0, 0)

    return canvas.toDataURL('image/png')
  }

  // ============================================
  // FUNCIONES DE VERIFICACIÓN
  // ============================================

  const processQRCode = async (qrContent: string) => {
    try {
      setLoading(true)
      setError(null)

      // En desarrollo, usar mock
      let result: QRVerification
      if (import.meta.env.DEV) {
        // Simular delay
        await new Promise(resolve => setTimeout(resolve, 1500))
        result = mockQRVerification()
      } else {
        result = await verifyQRWithBackend(qrContent)
      }

      setVerification(result)
      
      if (result.valid) {
        stopCamera()
      }
    } catch (err) {
      console.error('Error procesando QR:', err)
      setError('Error al verificar el código QR')
    } finally {
      setLoading(false)
    }
  }

  const handleManualInput = async () => {
    if (!manualInput.trim()) return
    await processQRCode(manualInput.trim())
    setManualInput('')
    setShowManualInput(false)
  }

  const confirmDelivery = async () => {
    if (!verification?.order) return

    try {
      setLoading(true)
      
      // TODO: Llamada real a la API
      // await fetch(`/api/orders/${verification.order.id}/confirm-delivery`, {
      //   method: 'POST',
      //   headers: { 'Authorization': `Bearer ${token}` }
      // })

      // Simular confirmación
      await new Promise(resolve => setTimeout(resolve, 1000))

      setVerification({
        ...verification,
        order: {
          ...verification.order,
          estado: 'entregado',
          fecha_entrega: new Date().toISOString()
        },
        message: '¡Pedido entregado exitosamente!'
      })

    } catch (err) {
      console.error('Error confirmando entrega:', err)
      setError('Error al confirmar la entrega')
    } finally {
      setLoading(false)
    }
  }

  const resetScanner = () => {
    setVerification(null)
    setError(null)
    setManualInput('')
    setShowManualInput(false)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price)
  }

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <QrCode className="w-6 h-6 text-primary-600" />
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  Escáner QR
                </h1>
                <p className="text-sm text-gray-600">
                  Escanea códigos QR para confirmar entregas
                </p>
              </div>
            </div>
            <Button
              onClick={resetScanner}
              variant="ghost"
              size="sm"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Resultado de verificación */}
        {verification && (
          <Card className="p-6">
            <div className="flex items-start space-x-4">
              <div className={`p-2 rounded-full ${
                verification.valid ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {verification.valid ? (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-600" />
                )}
              </div>
              <div className="flex-1">
                <h3 className={`text-lg font-semibold ${
                  verification.valid ? 'text-green-900' : 'text-red-900'
                }`}>
                  {verification.valid ? 'QR Válido' : 'QR Inválido'}
                </h3>
                <p className={`text-sm ${
                  verification.valid ? 'text-green-700' : 'text-red-700'
                }`}>
                  {verification.message}
                </p>
              </div>
            </div>

            {verification.valid && verification.order && (
              <div className="mt-6 space-y-4">
                {/* Información del pedido */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Package className="w-4 h-4 mr-2" />
                    Detalles del pedido
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Pedido ID:</label>
                      <p className="text-gray-900">#{verification.order.id.slice(-6)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Estado:</label>
                      <Badge variant={verification.order.estado === 'entregado' ? 'success' : 'info'}>
                        {verification.order.estado}
                      </Badge>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Pack:</label>
                      <p className="text-gray-900">{verification.order.pack?.titulo}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Cantidad:</label>
                      <p className="text-gray-900">{verification.order.cantidad}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Total:</label>
                      <p className="text-gray-900 font-semibold">
                        {formatPrice(verification.order.precio_total)}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Fecha:</label>
                      <p className="text-gray-900">
                        {new Date(verification.order.created_at).toLocaleDateString('es-CO')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Información del cliente */}
                {verification.order.user && (
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      Información del cliente
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Nombre:</label>
                        <p className="text-gray-900">{verification.order.user.nombre}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Email:</label>
                        <p className="text-gray-900">{verification.order.user.email}</p>
                      </div>
                      {verification.order.user.telefono && (
                        <div>
                          <label className="text-sm font-medium text-gray-700">Teléfono:</label>
                          <p className="text-gray-900 flex items-center">
                            <Phone className="w-4 h-4 mr-1" />
                            {verification.order.user.telefono}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Notas del pedido */}
                {verification.order.notas && (
                  <div className="bg-yellow-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Notas especiales
                    </h4>
                    <p className="text-gray-700">{verification.order.notas}</p>
                  </div>
                )}

                {/* Botón de confirmación */}
                {verification.order.estado !== 'entregado' && (
                  <div className="pt-4 border-t">
                    <Button
                      onClick={confirmDelivery}
                      disabled={loading}
                      className="w-full bg-green-600 hover:bg-green-700"
                      size="lg"
                    >
                      {loading ? (
                        <>
                          <LoadingSpinner size="sm" className="mr-2" />
                          Confirmando entrega...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-5 h-5 mr-2" />
                          Confirmar entrega
                        </>
                      )}
                    </Button>
                  </div>
                )}

                {verification.order.estado === 'entregado' && (
                  <div className="pt-4 border-t">
                    <div className="bg-green-100 border border-green-200 rounded-lg p-4 text-center">
                      <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <p className="text-green-800 font-medium">
                        ¡Pedido entregado exitosamente!
                      </p>
                      <p className="text-green-700 text-sm mt-1">
                        Entregado el {new Date(verification.order.fecha_entrega!).toLocaleString('es-CO')}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </Card>
        )}

        {/* Escáner de cámara */}
        {!verification && (
          <Card className="p-6">
            <div className="text-center mb-6">
              <Camera className="w-12 h-12 text-primary-600 mx-auto mb-3" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Escanear código QR
              </h2>
              <p className="text-gray-600">
                Apunta la cámara hacia el código QR del cliente
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-2">
                  <XCircle className="w-5 h-5 text-red-600" />
                  <p className="text-red-800">{error}</p>
                </div>
              </div>
            )}

            {!isScanning ? (
              <div className="space-y-4">
                <Button
                  onClick={startCamera}
                  className="w-full"
                  size="lg"
                >
                  <Camera className="w-5 h-5 mr-2" />
                  Iniciar cámara
                </Button>
                
                <div className="text-center">
                  <button
                    onClick={() => setShowManualInput(!showManualInput)}
                    className="text-sm text-primary-600 hover:text-primary-700"
                  >
                    ¿No puedes escanear? Ingresa manualmente
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative bg-black rounded-lg overflow-hidden">
                  <video
                    ref={videoRef}
                    className="w-full h-64 object-cover"
                    autoPlay
                    playsInline
                    muted
                  />
                  <div className="absolute inset-0 border-2 border-primary-500 rounded-lg pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-white rounded-lg"></div>
                  </div>
                </div>
                
                <canvas ref={canvasRef} className="hidden" />
                
                <div className="flex space-x-3">
                  <Button
                    onClick={() => {
                      // Simular escaneo exitoso para demo
                      processQRCode('{"orderId":"order_mock_123","userId":"user_mock_456","businessId":"business_mock_789"}')
                    }}
                    className="flex-1"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <LoadingSpinner size="sm" className="mr-2" />
                        Verificando...
                      </>
                    ) : (
                      <>
                        <QrCode className="w-4 h-4 mr-2" />
                        Escanear (Demo)
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={stopCamera}
                    variant="outline"
                  >
                    Detener
                  </Button>
                </div>
              </div>
            )}

            {/* Input manual */}
            {showManualInput && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">
                  Ingreso manual
                </h4>
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={manualInput}
                    onChange={(e) => setManualInput(e.target.value)}
                    placeholder="Pega aquí el contenido del QR"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <Button
                    onClick={handleManualInput}
                    disabled={!manualInput.trim() || loading}
                  >
                    Verificar
                  </Button>
                </div>
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  )
}

export default QRScanner
