import { useState } from 'react'
import { Filter, X, MapPin, Clock, DollarSign, Star } from 'lucide-react'
import { useFilterStore } from '../../store/filterStore'
import Card from '../ui/Card'
import Button from '../ui/Button'
import Select from '../ui/Select'
import Input from '../ui/Input'
import Badge from '../ui/Badge'
import Modal from '../ui/Modal'

const MapFilters = () => {
  const [showFilters, setShowFilters] = useState(false)
  const { 
    categoria, 
    radio, 
    setCategoria, 
    setRadio,
    resetFilters 
  } = useFilterStore()

  const categorias = [
    { value: '', label: 'Todas las categorías' },
    { value: 'panaderia', label: '🥖 Panadería' },
    { value: 'restaurante', label: '🍽️ Restaurante' },
    { value: 'cafeteria', label: '☕ Cafetería' },
    { value: 'supermercado', label: '🛒 Supermercado' },
    { value: 'pasteleria', label: '🧁 Pastelería' },
    { value: 'comida-rapida', label: '🍕 Comida Rápida' },
  ]

  const radios = [
    { value: '1', label: '1 km' },
    { value: '2', label: '2 km' },
    { value: '5', label: '5 km' },
    { value: '10', label: '10 km' },
    { value: '20', label: '20 km' },
  ]

  const activeFiltersCount = (categoria ? 1 : 0) + (radio !== 5 ? 1 : 0)

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowFilters(true)}
        className="relative"
      >
        <Filter className="w-4 h-4 mr-2" />
        Filtros
        {activeFiltersCount > 0 && (
          <Badge 
            variant="error" 
            size="sm" 
            className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center text-xs"
          >
            {activeFiltersCount}
          </Badge>
        )}
      </Button>

      <Modal
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        title="Filtros del Mapa"
        size="md"
      >
        <div className="space-y-6">
          {/* Quick Filters */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Filtros Rápidos</h4>
            <div className="flex flex-wrap gap-2">
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
          </div>

          {/* Distance Filter */}
          <Card className="p-4">
            <div className="flex items-center space-x-2 mb-3">
              <MapPin className="w-5 h-5 text-primary-600" />
              <h4 className="font-medium text-gray-900">Distancia</h4>
            </div>
            <Select
              options={radios}
              value={radio.toString()}
              onChange={(e) => setRadio(Number(e.target.value))}
              placeholder="Seleccionar radio"
            />
          </Card>

          {/* Category Filter */}
          <Card className="p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Filter className="w-5 h-5 text-primary-600" />
              <h4 className="font-medium text-gray-900">Categoría</h4>
            </div>
            <Select
              options={categorias}
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              placeholder="Todas las categorías"
            />
          </Card>

          {/* Price Range */}
          <Card className="p-4">
            <div className="flex items-center space-x-2 mb-3">
              <DollarSign className="w-5 h-5 text-primary-600" />
              <h4 className="font-medium text-gray-900">Rango de Precio</h4>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input
                type="number"
                placeholder="Mín $0"
                min="0"
                step="1000"
              />
              <Input
                type="number"
                placeholder="Máx $50,000"
                min="0"
                step="1000"
              />
            </div>
          </Card>

          {/* Pickup Time */}
          <Card className="p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Clock className="w-5 h-5 text-primary-600" />
              <h4 className="font-medium text-gray-900">Horario de Retiro</h4>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input
                type="time"
                defaultValue="08:00"
              />
              <Input
                type="time"
                defaultValue="22:00"
              />
            </div>
          </Card>

          {/* Rating Filter */}
          <Card className="p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Star className="w-5 h-5 text-primary-600" />
              <h4 className="font-medium text-gray-900">Calificación Mínima</h4>
            </div>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <Button
                  key={rating}
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-1"
                >
                  <Star className="w-3 h-3" />
                  <span>{rating}+</span>
                </Button>
              ))}
            </div>
          </Card>

          {/* Actions */}
          <div className="flex space-x-3 pt-4 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={() => {
                resetFilters()
                setShowFilters(false)
              }}
              className="flex-1"
            >
              <X className="w-4 h-4 mr-2" />
              Limpiar
            </Button>
            <Button
              onClick={() => setShowFilters(false)}
              className="flex-1"
            >
              Aplicar Filtros
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default MapFilters
