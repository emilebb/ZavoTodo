import { Link } from 'react-router-dom'
import { MapPin, Clock, TrendingUp, Leaf, Star } from 'lucide-react'
import { usePacksQuery } from '../../hooks/usePacks'
import { useFilterStore } from '../../store/filterStore'
import { useCurrentLocation } from '../../hooks/useCurrentLocation'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import Badge from '../../components/ui/Badge'
import SearchFilters from '../../components/filters/SearchFilters'
import { Pack } from '../../types'

const Home = () => {
  const { searchText } = useFilterStore()
  const { latitude, longitude } = useCurrentLocation()

  const { data: packs, isLoading, error } = usePacksQuery({
    searchText: searchText || undefined,
    activo: true
  })

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price)
  }

  const PackCard = ({ pack }: { pack: Pack }) => (
    <Link to={`/pack/${pack.id}`}>
      <Card className="hover:shadow-xl transition-all duration-300 overflow-hidden group">
        {/* Image */}
        <div className="aspect-video bg-gradient-to-br from-green-100 to-teal-100 relative overflow-hidden">
          {pack.business?.imagen ? (
            <img 
              src={pack.business.imagen} 
              alt={pack.business.nombre}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-200 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary-700 font-bold text-xl">
                    {pack.business?.nombre?.charAt(0) || 'N'}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{pack.business?.nombre}</p>
              </div>
            </div>
          )}
          
          {/* Discount Badge */}
          <div className="absolute top-3 right-3">
            <Badge variant="error" size="sm" className="font-bold">
              -{pack.porcentaje_descuento}%
            </Badge>
          </div>

          {/* Stock Badge */}
          {pack.stock <= 3 && (
            <div className="absolute top-3 left-3">
              <Badge variant="warning" size="sm">
                ¡Últimas {pack.stock}!
              </Badge>
            </div>
          )}
        </div>
        
        <div className="p-4">
          {/* Business Info */}
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-xs font-medium text-gray-600">
                {pack.business?.nombre?.charAt(0) || 'N'}
              </span>
            </div>
            <span className="text-sm text-gray-600">{pack.business?.nombre}</span>
            <div className="flex items-center space-x-1">
              <Star className="w-3 h-3 text-yellow-500 fill-current" />
              <span className="text-xs text-gray-500">4.8</span>
            </div>
          </div>

          {/* Pack Title */}
          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
            {pack.titulo}
          </h3>
          
          {/* Pack Description */}
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {pack.descripcion}
          </p>
          
          {/* Location & Time */}
          <div className="space-y-1 mb-3">
            <div className="flex items-center text-sm text-gray-500">
              <MapPin className="w-4 h-4 mr-1" />
              <span className="truncate">{pack.business?.direccion}</span>
            </div>
            <div className="flex items-center text-sm text-orange-600">
              <Clock className="w-4 h-4 mr-1" />
              <span>Retiro: {pack.hora_retiro_desde} - {pack.hora_retiro_hasta}</span>
            </div>
          </div>
          
          {/* Price */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500 line-through">
                {formatPrice(pack.precio_original)}
              </div>
              <div className="text-xl font-bold text-primary-600">
                {formatPrice(pack.precio_descuento)}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Ahorro</div>
              <div className="text-lg font-bold text-green-600">
                {formatPrice(pack.precio_original - pack.precio_descuento)}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Hero Section */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Leaf className="w-8 h-8 text-primary-600" />
          <h1 className="text-3xl font-bold text-gray-900">
            Rescata comida deliciosa
          </h1>
        </div>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Encuentra packs sorpresa con hasta 70% de descuento y ayuda a reducir el desperdicio alimentario
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <Card className="text-center p-4">
          <div className="text-2xl font-bold text-primary-600 mb-1">2.5K</div>
          <div className="text-sm text-gray-600">Packs rescatados</div>
        </Card>
        <Card className="text-center p-4">
          <div className="text-2xl font-bold text-green-600 mb-1">85%</div>
          <div className="text-sm text-gray-600">Ahorro promedio</div>
        </Card>
        <Card className="text-center p-4">
          <div className="text-2xl font-bold text-teal-600 mb-1">150+</div>
          <div className="text-sm text-gray-600">Negocios aliados</div>
        </Card>
      </div>

      {/* Search and Filters */}
      <SearchFilters />

      {/* Location Status */}
      {latitude && longitude && (
        <Card className="p-4 mb-6 bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              <div>
                <div className="font-medium text-blue-900">Ubicación detectada</div>
                <div className="text-sm text-blue-700">
                  Mostrando packs cerca de ti
                </div>
              </div>
            </div>
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
        </Card>
      )}

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : error ? (
        <Card className="text-center py-12">
          <div className="text-red-500 mb-4">⚠️</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Error al cargar los packs
          </h3>
          <p className="text-gray-500 mb-4">
            No pudimos conectar con el servidor. Verifica tu conexión.
          </p>
          <Button onClick={() => window.location.reload()}>
            Intentar de nuevo
          </Button>
        </Card>
      ) : !packs || packs.length === 0 ? (
        <Card className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Leaf className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No se encontraron packs
          </h3>
          <p className="text-gray-500 mb-4">
            {searchText 
              ? 'Intenta con otros términos de búsqueda o ajusta los filtros'
              : 'Aún no hay packs disponibles en tu área. ¡Vuelve pronto!'
            }
          </p>
          <div className="flex justify-center space-x-3">
            <Link to="/mapa">
              <Button variant="outline">
                Ver en mapa
              </Button>
            </Link>
            <Button onClick={() => window.location.reload()}>
              Actualizar
            </Button>
          </div>
        </Card>
      ) : (
        <>
          {/* Results Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Packs disponibles ({packs.length})
              </h2>
              <p className="text-gray-600">
                Ordenados por cercanía y disponibilidad
              </p>
            </div>
            <Link to="/mapa">
              <Button variant="outline" size="sm">
                <MapPin className="w-4 h-4 mr-2" />
                Ver en mapa
              </Button>
            </Link>
          </div>

          {/* Packs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packs.map((pack) => (
              <PackCard key={pack.id} pack={pack} />
            ))}
          </div>

          {/* Load More */}
          {packs.length >= 9 && (
            <div className="text-center mt-8">
              <Button variant="outline" size="lg">
                Cargar más packs
              </Button>
            </div>
          )}
        </>
      )}

      {/* Environmental Impact */}
      <Card variant="glass" className="mt-12 text-center p-8">
        <Leaf className="w-12 h-12 text-green-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Impacto Ambiental
        </h3>
        <p className="text-gray-600 mb-4">
          Cada pack que rescatas ayuda a reducir el desperdicio alimentario y protege nuestro planeta
        </p>
        <div className="grid grid-cols-2 gap-6 max-w-md mx-auto">
          <div>
            <div className="text-2xl font-bold text-green-600">2.1 kg</div>
            <div className="text-sm text-gray-600">CO₂ ahorrado promedio</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">1.5 L</div>
            <div className="text-sm text-gray-600">Agua conservada</div>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default Home
