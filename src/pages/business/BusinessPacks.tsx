import { Link } from 'react-router-dom'
import { Plus, Package, Edit, Trash2, Eye, EyeOff } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { useBusinessPacksQuery, useUpdatePackMutation, useDeletePackMutation } from '../../hooks/usePacks'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

const BusinessPacks = () => {
  const { user } = useAuthStore()
  const { data: packs, isLoading } = useBusinessPacksQuery(user?.id || '')
  const updatePackMutation = useUpdatePackMutation()
  const deletePackMutation = useDeletePackMutation()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price)
  }

  const handleToggleActive = async (packId: string, currentStatus: boolean) => {
    try {
      await updatePackMutation.mutateAsync({
        id: packId,
        updates: { activo: !currentStatus }
      })
    } catch (error) {
      console.error('Error updating pack:', error)
    }
  }

  const handleDelete = async (packId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este pack?')) {
      try {
        await deletePackMutation.mutateAsync(packId)
      } catch (error) {
        console.error('Error deleting pack:', error)
      }
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Mis Packs</h1>
          <p className="text-gray-600">Gestiona tus packs sorpresa</p>
        </div>
        <Link to="/negocio/packs/nuevo">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Crear Pack
          </Button>
        </Link>
      </div>

      {/* Packs List */}
      {!packs || packs.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No tienes packs creados
          </h3>
          <p className="text-gray-500 mb-4">
            Crea tu primer pack sorpresa y comienza a vender tu exceso de comida
          </p>
          <Link to="/negocio/packs/nuevo">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Crear Mi Primer Pack
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packs.map((pack) => (
            <Card key={pack.id} className="relative">
              {/* Status Badge */}
              <div className="absolute top-4 right-4">
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  pack.activo && pack.stock > 0
                    ? 'bg-green-100 text-green-800'
                    : pack.activo && pack.stock === 0
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {pack.activo && pack.stock > 0 ? 'Activo' : 
                   pack.activo && pack.stock === 0 ? 'Agotado' : 'Inactivo'}
                </div>
              </div>

              {/* Pack Info */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 pr-16">
                  {pack.titulo}
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {pack.descripcion}
                </p>
                
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="text-sm text-gray-500 line-through">
                      {formatPrice(pack.precio_original)}
                    </div>
                    <div className="text-xl font-bold text-primary-600">
                      {formatPrice(pack.precio_descuento)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Stock</div>
                    <div className="text-lg font-semibold text-gray-900">
                      {pack.stock}
                    </div>
                  </div>
                </div>

                <div className="text-sm text-gray-500">
                  Retiro: {pack.hora_retiro_desde} - {pack.hora_retiro_hasta}
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleToggleActive(pack.id, pack.activo)}
                  loading={updatePackMutation.isPending}
                >
                  {pack.activo ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
                
                <Link to={`/negocio/packs/${pack.id}/editar`} className="flex-1">
                  <Button variant="outline" size="sm" fullWidth>
                    <Edit className="w-4 h-4 mr-1" />
                    Editar
                  </Button>
                </Link>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(pack.id)}
                  loading={deletePackMutation.isPending}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default BusinessPacks
