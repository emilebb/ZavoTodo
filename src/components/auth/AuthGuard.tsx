/**
 * ============================================
 * ZAVO - AuthGuard Component
 * ============================================
 * 
 * Protección de rutas privadas
 * - Verifica token JWT
 * - Redirige a login si no hay autenticación
 * - Maneja estados de carga
 */

import { useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import LoadingSpinner from '../ui/LoadingSpinner'

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
}

const AuthGuard = ({ children, requireAuth = true }: AuthGuardProps) => {
  const { 
    isAuthenticated, 
    loading, 
    initialized, 
    checkSession
  } = useAuthStore()
  
  const location = useLocation()

  useEffect(() => {
    // Solo verificar sesión si no está inicializado
    if (!initialized) {
      checkSession()
    }
  }, [initialized, checkSession])

  // Mostrar loading mientras se inicializa
  if (!initialized || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    )
  }

  // Si requiere autenticación pero no está autenticado
  if (requireAuth && !isAuthenticated) {
    console.log('🚫 Acceso denegado - Redirigiendo a login')
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Si no requiere autenticación pero está autenticado (ej: login page)
  if (!requireAuth && isAuthenticated) {
    console.log('✅ Usuario autenticado - Redirigiendo a home')
    return <Navigate to="/home" replace />
  }

  // Si todo está bien, mostrar el contenido
  return <>{children}</>
}

export default AuthGuard
