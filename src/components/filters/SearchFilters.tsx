import { useState } from 'react'
import { Search, Filter, MapPin, Clock, DollarSign } from 'lucide-react'
import { useFilterStore } from '../../store/filterStore'
import Input from '../ui/Input'
import Select from '../ui/Select'
import Button from '../ui/Button'
import Card from '../ui/Card'
import Modal from '../ui/Modal'

const SearchFilters = () => {
  const { 
    searchText, 
    categoria, 
    radio, 
    ubicacion,
    setSearchText, 
    setCategoria, 
    setRadio,
    resetFilters 
  } = useFilterStore()
  
  const [showFilters, setShowFilters] = useState(false)

  const categorias = [
    { value: '', label: 'Todas las categorías' },
    { value: 'panaderia', label: 'Panadería' },
    { value: 'restaurante', label: 'Restaurante' },
    { value: 'cafeteria', label: 'Cafetería' },
    { value: 'supermercado', label: 'Supermercado' },
    { value: 'pasteleria', label: 'Pastelería' },
    { value: 'comida-rapida', label: 'Comida Rápida' },
  ]

  const radios = [
    { value: '1', label: '1 km' },
    { value: '2', label: '2 km' },
    { value: '5', label: '5 km' },
    { value: '10', label: '10 km' },
    { value: '20', label: '20 km' },
  ]

  const handleReset = () => {
    resetFilters()
    setShowFilters(false)
  }

  return (
    <>
      {/* Search Bar */}
      <div className="flex space-x-2 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Buscar packs, restaurantes..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(true)}
          className="flex items-center space-x-2"
        >
          <Filter className="w-4 h-4" />
          <span>Filtros</span>
          {(categoria || radio !== 5) && (
            <span className="bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {(categoria ? 1 : 0) + (radio !== 5 ? 1 : 0)}
            </span>
          )}
        </Button>
      </div>

      {/* Quick Filters */}
      <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
        <Button
          variant={categoria === 'panaderia' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setCategoria(categoria === 'panaderia' ? '' : 'panaderia')}
        >
          🥖 Panadería
        </Button>
        <Button
          variant={categoria === 'restaurante' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setCategoria(categoria === 'restaurante' ? '' : 'restaurante')}
        >
          🍽️ Restaurante
        </Button>
        <Button
          variant={categoria === 'cafeteria' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setCategoria(categoria === 'cafeteria' ? '' : 'cafeteria')}
        >
          ☕ Cafetería
        </Button>
        <Button
          variant={radio <= 2 ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setRadio(radio <= 2 ? 5 : 2)}
        >
          📍 Cerca de mí
        </Button>
      </div>

      {/* Advanced Filters Modal */}
      <Modal
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        title="Filtros de búsqueda"
        size="md"
      >
        <div className="space-y-6">
          {/* Location */}
          <Card className="p-4">
            <div className="flex items-center space-x-2 mb-3">
              <MapPin className="w-5 h-5 text-primary-600" />
              <h3 className="font-medium text-gray-900">Ubicación</h3>
            </div>
            <Select
              label="Radio de búsqueda"
              options={radios}
              value={radio.toString()}
              onChange={(e) => setRadio(Number(e.target.value))}
            />
            {ubicacion && (
              <div className="mt-2 text-sm text-gray-600">
                📍 Ubicación detectada: {ubicacion.lat.toFixed(4)}, {ubicacion.lng.toFixed(4)}
              </div>
            )}
          </Card>

          {/* Category */}
          <Card className="p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Filter className="w-5 h-5 text-primary-600" />
              <h3 className="font-medium text-gray-900">Categoría</h3>
            </div>
            <Select
              label="Tipo de negocio"
              options={categorias}
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
            />
          </Card>

          {/* Price Range */}
          <Card className="p-4">
            <div className="flex items-center space-x-2 mb-3">
              <DollarSign className="w-5 h-5 text-primary-600" />
              <h3 className="font-medium text-gray-900">Rango de precio</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input
                type="number"
                label="Precio mínimo"
                placeholder="$0"
                min="0"
              />
              <Input
                type="number"
                label="Precio máximo"
                placeholder="$50,000"
                min="0"
              />
            </div>
          </Card>

          {/* Time */}
          <Card className="p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Clock className="w-5 h-5 text-primary-600" />
              <h3 className="font-medium text-gray-900">Horario de retiro</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input
                type="time"
                label="Desde"
              />
              <Input
                type="time"
                label="Hasta"
              />
            </div>
          </Card>

          {/* Actions */}
          <div className="flex space-x-3 pt-4 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={handleReset}
              className="flex-1"
            >
              Limpiar filtros
            </Button>
            <Button
              onClick={() => setShowFilters(false)}
              className="flex-1"
            >
              Aplicar filtros
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default SearchFilters
