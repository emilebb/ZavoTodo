/**
 * ============================================
 * ZAVO - Register Page
 * ============================================
 * 
 * Página de registro que usa Firebase Auth directamente
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import DualRegister from '../../components/auth/DualRegister'
import { RegisterUserData, RegisterBusinessData } from '../../types'
import { useAuthStore } from '../../store/authStore'

const RegisterPage = () => {
  const navigate = useNavigate()
  const { register, loading: authLoading } = useAuthStore()
  const [loading, setLoading] = useState(false)

  // ============================================
  // HANDLERS
  // ============================================

  const handleUserRegister = async (data: RegisterUserData) => {
    try {
      setLoading(true)
      
      // Usar el register del authStore (Firebase o Mock)
      await register(data.email, data.password, data.name, 'usuario')

      toast.success('¡Cuenta creada exitosamente! Bienvenido a ZAVO')
      
      // Redirigir al onboarding para usuarios nuevos
      navigate('/onboarding', { replace: true })

    } catch (error) {
      console.error('Error en registro de usuario:', error)
      toast.error(error instanceof Error ? error.message : 'Error al crear la cuenta')
    } finally {
      setLoading(false)
    }
  }

  const handleBusinessRegister = async (data: RegisterBusinessData) => {
    try {
      setLoading(true)
      
      // Usar el register del authStore (Firebase o Mock)
      await register(data.adminEmail, data.adminPassword, data.adminName, 'negocio')

      toast.success('¡Negocio registrado exitosamente! Bienvenido a ZAVO')
      
      // Redirigir al onboarding de negocios
      navigate('/negocio/onboarding', { replace: true })

    } catch (error) {
      console.error('Error en registro de negocio:', error)
      toast.error(error instanceof Error ? error.message : 'Error al crear la cuenta de negocio')
    } finally {
      setLoading(false)
    }
  }

  // ============================================
  // RENDER
  // ============================================

  return (
    <DualRegister
      onRegisterUser={handleUserRegister}
      onRegisterBusiness={handleBusinessRegister}
      loading={loading || authLoading}
    />
  )
}

export default RegisterPage
