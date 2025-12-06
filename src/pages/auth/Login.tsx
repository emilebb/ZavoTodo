import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  const { login, loading } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    // Basic validation
    const newErrors: Record<string, string> = {}
    if (!email) newErrors.email = 'El email es requerido'
    if (!password) newErrors.password = 'La contraseña es requerida'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      await login(email, password)
      navigate('/')
    } catch (error) {
      // Error is handled by the store
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Iniciar Sesión</h2>
        <p className="text-gray-600">Bienvenido de vuelta a ZAVO</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="email"
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          placeholder="tu@email.com"
          autoComplete="email"
        />

        <Input
          type="password"
          label="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          placeholder="••••••••"
          autoComplete="current-password"
        />

        <Button
          type="submit"
          fullWidth
          loading={loading}
          className="mt-6"
        >
          Iniciar Sesión
        </Button>
      </form>

      <div className="space-y-4 text-center text-sm">
        <Link 
          to="/auth/forgot-password"
          className="text-primary-600 hover:text-primary-700 font-medium"
        >
          ¿Olvidaste tu contraseña?
        </Link>
        
        <div className="border-t border-gray-200 pt-4">
          <p className="text-gray-600">
            ¿No tienes una cuenta?{' '}
            <Link 
              to="/auth/role" 
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Regístrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
