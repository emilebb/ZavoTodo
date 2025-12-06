import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { UserRole } from '../types'

interface PrivateRouteProps {
  children: React.ReactNode
  requiredRole?: UserRole
}

const PrivateRoute = ({ children, requiredRole }: PrivateRouteProps) => {
  const { user, loading, initialized } = useAuthStore()

  if (!initialized || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />
  }

  if (requiredRole && user.rol !== requiredRole) {
    return <Navigate to={user.rol === 'negocio' ? '/negocio' : '/'} replace />
  }

  return <>{children}</>
}

export default PrivateRoute
