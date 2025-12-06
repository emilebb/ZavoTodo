import { useState } from 'react'
import { MapPin, Clock, Edit } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'

const BusinessProfile = () => {
  const { user } = useAuthStore()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    nombre: user?.nombre || '',
    direccion: 'Calle 123 #45-67, Bogotá', // Placeholder
    horario: '8:00 AM - 6:00 PM', // Placeholder
    telefono: '+57 300 123 4567', // Placeholder
    email: user?.email || ''
  })

  const handleSave = () => {
    // Here you would save the business profile
    setIsEditing(false)
    // TODO: Implement save functionality
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Perfil del Negocio</h1>
          <p className="text-gray-600">Gestiona la información de tu negocio</p>
        </div>
        <Button
          variant="outline"
          onClick={() => setIsEditing(!isEditing)}
        >
          <Edit className="w-4 h-4 mr-2" />
          {isEditing ? 'Cancelar' : 'Editar'}
        </Button>
      </div>

      {/* Business Info */}
      <Card>
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-primary-600 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">
                {formData.nombre.charAt(0)}
              </span>
            </div>
            {isEditing ? (
              <Input
                value={formData.nombre}
                onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                className="text-center font-semibold"
              />
            ) : (
              <h2 className="text-xl font-semibold text-gray-900">{formData.nombre}</h2>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dirección
              </label>
              {isEditing ? (
                <Input
                  value={formData.direccion}
                  onChange={(e) => setFormData(prev => ({ ...prev, direccion: e.target.value }))}
                />
              ) : (
                <div className="flex items-start">
                  <MapPin className="w-4 h-4 mr-2 mt-0.5 text-gray-500" />
                  <span className="text-gray-900">{formData.direccion}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Horario de Atención
              </label>
              {isEditing ? (
                <Input
                  value={formData.horario}
                  onChange={(e) => setFormData(prev => ({ ...prev, horario: e.target.value }))}
                />
              ) : (
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-gray-500" />
                  <span className="text-gray-900">{formData.horario}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Teléfono
              </label>
              {isEditing ? (
                <Input
                  value={formData.telefono}
                  onChange={(e) => setFormData(prev => ({ ...prev, telefono: e.target.value }))}
                />
              ) : (
                <span className="text-gray-900">{formData.telefono}</span>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              {isEditing ? (
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                />
              ) : (
                <span className="text-gray-900">{formData.email}</span>
              )}
            </div>
          </div>

          {isEditing && (
            <div className="flex space-x-3 pt-4 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSave}
                className="flex-1"
              >
                Guardar Cambios
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Map Placeholder */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Ubicación</h3>
        <div className="aspect-video bg-gradient-to-br from-green-100 to-teal-100 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">Mapa de ubicación del negocio</p>
            <p className="text-sm text-gray-500">Integración con Google Maps pendiente</p>
          </div>
        </div>
      </Card>

      {/* Statistics */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Estadísticas</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600">12</div>
            <div className="text-sm text-gray-600">Packs Creados</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">45</div>
            <div className="text-sm text-gray-600">Pedidos Completados</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">$850K</div>
            <div className="text-sm text-gray-600">Ingresos Totales</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">4.8</div>
            <div className="text-sm text-gray-600">Calificación</div>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default BusinessProfile
