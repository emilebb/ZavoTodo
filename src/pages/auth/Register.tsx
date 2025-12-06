import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { UserRole } from '../../types'

const Register = () => {
  const [searchParams] = useSearchParams()
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: '',
    rol: (searchParams.get('role') as UserRole) || 'usuario'
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  const { register, loading } = useAuthStore()
  const navigate = useNavigate()

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.nombre) newErrors.nombre = 'El nombre es requerido'
    if (!formData.email) newErrors.email = 'El email es requerido'
    if (!formData.password) newErrors.password = 'La contraseña es requerida'
    if (formData.password.length < 6) newErrors.password = 'La contraseña debe tener al menos 6 caracteres'
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden'
    }

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

    try {
      await register(formData.email, formData.password, formData.nombre, formData.rol)
      navigate('/')
    } catch (error) {
      // Error is handled by the store
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Crear Cuenta</h2>
        <p className="text-gray-600">
          Únete a ZAVO como {formData.rol === 'usuario' ? 'Usuario' : 'Negocio'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nombre completo"
          value={formData.nombre}
          onChange={(e) => handleChange('nombre', e.target.value)}
          error={errors.nombre}
          placeholder="Tu nombre completo"
          autoComplete="name"
        />

        <Input
          type="email"
          label="Email"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          error={errors.email}
          placeholder="tu@email.com"
          autoComplete="email"
        />

        <Input
          type="password"
          label="Contraseña"
          value={formData.password}
          onChange={(e) => handleChange('password', e.target.value)}
          error={errors.password}
          placeholder="••••••••"
          autoComplete="new-password"
          helperText="Mínimo 6 caracteres"
        />

        <Input
          type="password"
          label="Confirmar contraseña"
          value={formData.confirmPassword}
          onChange={(e) => handleChange('confirmPassword', e.target.value)}
          error={errors.confirmPassword}
          placeholder="••••••••"
          autoComplete="new-password"
        />

        <Button
          type="submit"
          fullWidth
          loading={loading}
          className="mt-6"
        >
          Crear Cuenta
        </Button>
      </form>

      <div className="text-center text-sm">
        <p className="text-gray-600">
          ¿Ya tienes una cuenta?{' '}
          <Link 
            to="/auth/login" 
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Inicia sesión
          </Link>
        </p>
      </div>

      <div className="text-center">
        <Link 
          to="/auth/role"
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          ← Cambiar tipo de cuenta
        </Link>
      </div>
    </div>
  )
}

export default Register
