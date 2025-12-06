import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { useCreatePackMutation, useUpdatePackMutation, usePackQuery } from '../../hooks/usePacks'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

const PackForm = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const isEditing = !!id

  const { data: existingPack, isLoading: loadingPack } = usePackQuery(id || '')
  const createPackMutation = useCreatePackMutation()
  const updatePackMutation = useUpdatePackMutation()

  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    precio_original: '',
    precio_descuento: '',
    stock: '',
    hora_retiro_desde: '',
    hora_retiro_hasta: '',
    activo: true
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (existingPack && isEditing) {
      setFormData({
        titulo: existingPack.titulo,
        descripcion: existingPack.descripcion,
        precio_original: existingPack.precio_original.toString(),
        precio_descuento: existingPack.precio_descuento.toString(),
        stock: existingPack.stock.toString(),
        hora_retiro_desde: existingPack.hora_retiro_desde,
        hora_retiro_hasta: existingPack.hora_retiro_hasta,
        activo: existingPack.activo
      })
    }
  }, [existingPack, isEditing])

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.titulo) newErrors.titulo = 'El título es requerido'
    if (!formData.descripcion) newErrors.descripcion = 'La descripción es requerida'
    if (!formData.precio_original) newErrors.precio_original = 'El precio original es requerido'
    if (!formData.precio_descuento) newErrors.precio_descuento = 'El precio con descuento es requerido'
    if (!formData.stock) newErrors.stock = 'El stock es requerido'
    if (!formData.hora_retiro_desde) newErrors.hora_retiro_desde = 'La hora de inicio es requerida'
    if (!formData.hora_retiro_hasta) newErrors.hora_retiro_hasta = 'La hora de fin es requerida'

    const precioOriginal = parseFloat(formData.precio_original)
    const precioDescuento = parseFloat(formData.precio_descuento)

    if (precioOriginal <= 0) newErrors.precio_original = 'El precio debe ser mayor a 0'
    if (precioDescuento <= 0) newErrors.precio_descuento = 'El precio debe ser mayor a 0'
    if (precioDescuento >= precioOriginal) {
      newErrors.precio_descuento = 'El precio con descuento debe ser menor al precio original'
    }

    const stock = parseInt(formData.stock)
    if (stock < 0) newErrors.stock = 'El stock no puede ser negativo'

    return newErrors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    const validationErrors = validateForm()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    const precioOriginal = parseFloat(formData.precio_original)
    const precioDescuento = parseFloat(formData.precio_descuento)
    const porcentajeDescuento = Math.round(((precioOriginal - precioDescuento) / precioOriginal) * 100)

    const packData = {
      business_id: user!.id, // Assuming user ID is business ID for simplicity
      titulo: formData.titulo,
      descripcion: formData.descripcion,
      precio_original: precioOriginal,
      precio_descuento: precioDescuento,
      porcentaje_descuento: porcentajeDescuento,
      stock: parseInt(formData.stock),
      hora_retiro_desde: formData.hora_retiro_desde,
      hora_retiro_hasta: formData.hora_retiro_hasta,
      activo: formData.activo
    }

    try {
      if (isEditing) {
        await updatePackMutation.mutateAsync({ id: id!, updates: packData })
      } else {
        await createPackMutation.mutateAsync(packData)
      }
      navigate('/negocio/packs')
    } catch (error) {
      console.error('Error saving pack:', error)
    }
  }

  if (isEditing && loadingPack) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/negocio/packs')}
          className="mr-3"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditing ? 'Editar Pack' : 'Crear Nuevo Pack'}
        </h1>
      </div>

      {/* Form */}
      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Input
                label="Título del Pack"
                value={formData.titulo}
                onChange={(e) => handleChange('titulo', e.target.value)}
                error={errors.titulo}
                placeholder="Ej: Pack Sorpresa de Panadería"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <textarea
                className="input-field min-h-[100px] resize-none"
                value={formData.descripcion}
                onChange={(e) => handleChange('descripcion', e.target.value)}
                placeholder="Describe qué incluye tu pack sorpresa..."
                rows={4}
              />
              {errors.descripcion && (
                <p className="mt-1 text-sm text-red-600">{errors.descripcion}</p>
              )}
            </div>

            <Input
              type="number"
              label="Precio Original"
              value={formData.precio_original}
              onChange={(e) => handleChange('precio_original', e.target.value)}
              error={errors.precio_original}
              placeholder="15000"
              min="0"
              step="100"
            />

            <Input
              type="number"
              label="Precio con Descuento"
              value={formData.precio_descuento}
              onChange={(e) => handleChange('precio_descuento', e.target.value)}
              error={errors.precio_descuento}
              placeholder="8000"
              min="0"
              step="100"
            />

            <Input
              type="number"
              label="Stock Disponible"
              value={formData.stock}
              onChange={(e) => handleChange('stock', e.target.value)}
              error={errors.stock}
              placeholder="10"
              min="0"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                className="input-field"
                value={formData.activo ? 'true' : 'false'}
                onChange={(e) => handleChange('activo', e.target.value === 'true')}
              >
                <option value="true">Activo</option>
                <option value="false">Inactivo</option>
              </select>
            </div>

            <Input
              type="time"
              label="Hora de Retiro - Desde"
              value={formData.hora_retiro_desde}
              onChange={(e) => handleChange('hora_retiro_desde', e.target.value)}
              error={errors.hora_retiro_desde}
            />

            <Input
              type="time"
              label="Hora de Retiro - Hasta"
              value={formData.hora_retiro_hasta}
              onChange={(e) => handleChange('hora_retiro_hasta', e.target.value)}
              error={errors.hora_retiro_hasta}
            />
          </div>

          {/* Preview */}
          {formData.precio_original && formData.precio_descuento && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Vista Previa</h3>
              <div className="text-sm text-gray-600">
                <p>Descuento: {Math.round(((parseFloat(formData.precio_original) - parseFloat(formData.precio_descuento)) / parseFloat(formData.precio_original)) * 100)}%</p>
                <p>Ahorro: ${(parseFloat(formData.precio_original) - parseFloat(formData.precio_descuento)).toLocaleString()}</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/negocio/packs')}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              loading={createPackMutation.isPending || updatePackMutation.isPending}
              className="flex-1"
            >
              {isEditing ? 'Actualizar Pack' : 'Crear Pack'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

export default PackForm
