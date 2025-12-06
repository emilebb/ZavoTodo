import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import toast from 'react-hot-toast'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      toast.error('Por favor ingresa tu email')
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      if (error) throw error

      setSent(true)
      toast.success('Email de recuperación enviado')
    } catch (error: any) {
      toast.error(error.message || 'Error al enviar el email')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="space-y-6 text-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Email Enviado</h2>
          <p className="text-gray-600">
            Hemos enviado un enlace de recuperación a <strong>{email}</strong>
          </p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800 text-sm">
            Revisa tu bandeja de entrada y sigue las instrucciones para restablecer tu contraseña.
          </p>
        </div>

        <Link 
          to="/auth/login"
          className="inline-block text-primary-600 hover:text-primary-700 font-medium"
        >
          ← Volver al inicio de sesión
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Recuperar Contraseña</h2>
        <p className="text-gray-600">
          Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="email"
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@email.com"
          autoComplete="email"
        />

        <Button
          type="submit"
          fullWidth
          loading={loading}
          className="mt-6"
        >
          Enviar Enlace de Recuperación
        </Button>
      </form>

      <div className="text-center text-sm">
        <Link 
          to="/auth/login"
          className="text-gray-600 hover:text-gray-700"
        >
          ← Volver al inicio de sesión
        </Link>
      </div>
    </div>
  )
}

export default ForgotPassword
