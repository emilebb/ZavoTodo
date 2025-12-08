/**
 * ============================================
 * ZAVO - User Profile Component
 * ============================================
 * 
 * Componente de perfil moderno estilo Apple/Stripe
 * - Diseño minimalista y profesional
 * - Responsive para web y móvil
 * - Soporte para usuarios y negocios
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  Store, 
  Tag,
  Edit3, 
  LogOut, 
  ChevronRight,
  Shield,
  Settings,
  Bell,
  CreditCard,
  HelpCircle,
  BookOpen
} from 'lucide-react'
import { useAuthStore } from '../../store/authStore'

// ============================================
// TIPOS
// ============================================

interface UserProfileProps {
  className?: string
  showActions?: boolean
  compact?: boolean
}

interface ProfileItemProps {
  icon: React.ReactNode
  label: string
  value: string | undefined
  fallback?: string
}

interface ActionButtonProps {
  icon: React.ReactNode
  label: string
  onClick: () => void
  variant?: 'default' | 'danger'
  chevron?: boolean
}

// ============================================
// COMPONENTES AUXILIARES
// ============================================

const ProfileItem: React.FC<ProfileItemProps> = ({ 
  icon, 
  label, 
  value, 
  fallback = 'No especificado' 
}) => (
  <div className="flex items-center py-4 border-b border-gray-100 last:border-0">
    <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center mr-4">
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
        {label}
      </p>
      <p className="text-gray-900 font-medium truncate">
        {value || fallback}
      </p>
    </div>
  </div>
)

const ActionButton: React.FC<ActionButtonProps> = ({ 
  icon, 
  label, 
  onClick, 
  variant = 'default',
  chevron = true 
}) => (
  <button
    onClick={onClick}
    className={`
      w-full flex items-center py-4 px-1 border-b border-gray-100 last:border-0
      transition-all duration-200 hover:bg-gray-50 rounded-lg -mx-1 px-3
      ${variant === 'danger' ? 'text-red-600 hover:bg-red-50' : 'text-gray-700'}
    `}
  >
    <div className={`
      w-10 h-10 rounded-xl flex items-center justify-center mr-4
      ${variant === 'danger' ? 'bg-red-50' : 'bg-gray-50'}
    `}>
      {icon}
    </div>
    <span className="flex-1 text-left font-medium">{label}</span>
    {chevron && (
      <ChevronRight className={`w-5 h-5 ${variant === 'danger' ? 'text-red-400' : 'text-gray-400'}`} />
    )}
  </button>
)

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

const UserProfile: React.FC<UserProfileProps> = ({ 
  className = '',
  showActions = true,
  compact = false
}) => {
  const navigate = useNavigate()
  const { user, logout, isAuthenticated } = useAuthStore()
  const [loggingOut, setLoggingOut] = useState(false)

  // ============================================
  // HANDLERS
  // ============================================

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      await logout()
      navigate('/login', { replace: true })
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    } finally {
      setLoggingOut(false)
    }
  }

  const handleEditProfile = () => {
    navigate('/perfil/editar')
  }

  // ============================================
  // HELPERS
  // ============================================

  const getUserName = () => {
    return user?.name || user?.nombre || 'Usuario'
  }

  const getUserRole = () => {
    const role = user?.role || user?.rol || 'usuario'
    return role === 'negocio' || role === 'business' ? 'Negocio' : 'Usuario'
  }

  const getUserInitial = () => {
    const name = getUserName()
    return name.charAt(0).toUpperCase()
  }

  const isBusinessUser = () => {
    const role = user?.role || user?.rol
    return role === 'negocio' || role === 'business'
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No disponible'
    try {
      return new Date(dateString).toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch {
      return 'No disponible'
    }
  }

  // ============================================
  // RENDER - NO AUTENTICADO
  // ============================================

  if (!isAuthenticated || !user) {
    return (
      <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center ${className}`}>
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No has iniciado sesión
        </h3>
        <p className="text-gray-500 mb-6">
          Inicia sesión para ver tu perfil
        </p>
        <button
          onClick={() => navigate('/login')}
          className="px-6 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
        >
          Iniciar sesión
        </button>
      </div>
    )
  }

  // ============================================
  // RENDER - VERSIÓN COMPACTA
  // ============================================

  if (compact) {
    return (
      <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-6 ${className}`}>
        <div className="flex items-center">
          {/* Avatar */}
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <span className="text-white text-xl font-bold">
              {getUserInitial()}
            </span>
          </div>
          
          {/* Info */}
          <div className="ml-4 flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {getUserName()}
            </h3>
            <p className="text-sm text-gray-500">
              {user?.email}
            </p>
          </div>

          {/* Badge */}
          <span className={`
            px-3 py-1 rounded-full text-xs font-medium
            ${isBusinessUser() 
              ? 'bg-purple-50 text-purple-700' 
              : 'bg-emerald-50 text-emerald-700'
            }
          `}>
            {getUserRole()}
          </span>
        </div>
      </div>
    )
  }

  // ============================================
  // RENDER - VERSIÓN COMPLETA
  // ============================================

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header Card - Avatar y Nombre */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Background Gradient */}
        <div className="h-24 bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-600" />
        
        {/* Profile Info */}
        <div className="px-6 pb-6">
          {/* Avatar */}
          <div className="relative -mt-12 mb-4">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 flex items-center justify-center shadow-xl shadow-emerald-500/30 border-4 border-white">
              <span className="text-white text-3xl font-bold">
                {getUserInitial()}
              </span>
            </div>
            
            {/* Verified Badge */}
            {user?.verified && (
              <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md">
                <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            )}
          </div>

          {/* Name & Role */}
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {getUserName()}
              </h2>
              <div className="flex items-center mt-1 space-x-2">
                <span className={`
                  px-3 py-1 rounded-full text-xs font-semibold
                  ${isBusinessUser() 
                    ? 'bg-purple-100 text-purple-700' 
                    : 'bg-emerald-100 text-emerald-700'
                  }
                `}>
                  {getUserRole()}
                </span>
                {user?.active && (
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                    Activo
                  </span>
                )}
              </div>
            </div>

            {/* Edit Button */}
            <button
              onClick={handleEditProfile}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              title="Editar perfil"
            >
              <Edit3 className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>
      </div>

      {/* Info Card - Datos del Usuario */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
          Información Personal
        </h3>
        
        <div className="space-y-1">
          <ProfileItem
            icon={<Mail className="w-5 h-5 text-gray-400" />}
            label="Correo electrónico"
            value={user?.email}
          />
          <ProfileItem
            icon={<Phone className="w-5 h-5 text-gray-400" />}
            label="Teléfono"
            value={user?.phone}
            fallback="No registrado"
          />
          <ProfileItem
            icon={<Calendar className="w-5 h-5 text-gray-400" />}
            label="Miembro desde"
            value={formatDate(user?.created_at)}
          />
        </div>
      </div>

      {/* Business Info Card - Solo para negocios */}
      {isBusinessUser() && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
            Información del Negocio
          </h3>
          
          <div className="space-y-1">
            <ProfileItem
              icon={<Store className="w-5 h-5 text-purple-500" />}
              label="Nombre del negocio"
              value={(user as any)?.businessName || (user as any)?.nombre_negocio}
              fallback="No especificado"
            />
            <ProfileItem
              icon={<MapPin className="w-5 h-5 text-purple-500" />}
              label="Dirección"
              value={(user as any)?.address || (user as any)?.direccion}
              fallback="No especificada"
            />
            <ProfileItem
              icon={<Tag className="w-5 h-5 text-purple-500" />}
              label="Categoría"
              value={(user as any)?.category || (user as any)?.categoria}
              fallback="No especificada"
            />
          </div>
        </div>
      )}

      {/* Actions Card */}
      {showActions && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
            Configuración
          </h3>
          
          <div className="space-y-1">
            <ActionButton
              icon={<Settings className="w-5 h-5 text-gray-500" />}
              label="Configuración de cuenta"
              onClick={() => navigate('/perfil/configuracion')}
            />
            <ActionButton
              icon={<Bell className="w-5 h-5 text-gray-500" />}
              label="Notificaciones"
              onClick={() => navigate('/perfil/notificaciones')}
            />
            <ActionButton
              icon={<CreditCard className="w-5 h-5 text-gray-500" />}
              label="Métodos de pago"
              onClick={() => navigate('/perfil/pagos')}
            />
            <ActionButton
              icon={<HelpCircle className="w-5 h-5 text-gray-500" />}
              label="Ayuda y soporte"
              onClick={() => navigate('/ayuda')}
            />
            <ActionButton
              icon={<BookOpen className="w-5 h-5 text-emerald-500" />}
              label="Ver tutorial de ZAVO"
              onClick={() => navigate('/onboarding')}
            />
          </div>
        </div>
      )}

      {/* Logout Card */}
      {showActions && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <ActionButton
            icon={<LogOut className="w-5 h-5 text-red-500" />}
            label={loggingOut ? "Cerrando sesión..." : "Cerrar sesión"}
            onClick={handleLogout}
            variant="danger"
            chevron={false}
          />
        </div>
      )}

      {/* Footer */}
      <div className="text-center py-4">
        <p className="text-xs text-gray-400">
          ZAVO v1.0.0 • Hecho con 💚 en Colombia
        </p>
      </div>
    </div>
  )
}

export default UserProfile
