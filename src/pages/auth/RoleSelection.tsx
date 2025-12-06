import { Link } from 'react-router-dom'
import { User, Store } from 'lucide-react'
import Card from '../../components/ui/Card'

const RoleSelection = () => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">¿Cómo quieres usar ZAVO?</h2>
        <p className="text-gray-600">Selecciona tu tipo de cuenta</p>
      </div>

      <div className="space-y-4">
        {/* Usuario */}
        <Link to="/auth/register?role=usuario">
          <Card className="p-6 hover:shadow-lg transition-shadow duration-200 cursor-pointer border-2 hover:border-primary-300">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-primary-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">Usuario</h3>
                <p className="text-gray-600 text-sm">
                  Encuentra y rescata packs sorpresa de comida
                </p>
              </div>
            </div>
          </Card>
        </Link>

        {/* Negocio */}
        <Link to="/auth/register?role=negocio">
          <Card className="p-6 hover:shadow-lg transition-shadow duration-200 cursor-pointer border-2 hover:border-teal-300">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                <Store className="w-6 h-6 text-teal-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">Negocio</h3>
                <p className="text-gray-600 text-sm">
                  Vende tu exceso de comida y reduce el desperdicio
                </p>
              </div>
            </div>
          </Card>
        </Link>
      </div>

      <div className="text-center pt-4">
        <p className="text-sm text-gray-600">
          ¿Ya tienes una cuenta?{' '}
          <Link 
            to="/auth/login" 
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  )
}

export default RoleSelection
