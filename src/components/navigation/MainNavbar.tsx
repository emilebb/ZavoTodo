import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { 
  Menu, 
  X, 
  Home, 
  Map, 
  ShoppingBag, 
  User, 
  Leaf,
  Compass,
  LogOut
} from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import Button from '../ui/Button'

/**
 * MainNavbar - ZAVO Design System
 * Navbar sticky premium con indicador de ruta activa
 */
const MainNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user, logout } = useAuthStore()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const isActive = (path: string) => location.pathname === path

  const menuItems = [
    { path: '/', label: 'Inicio', icon: Home },
    { path: '/explorar', label: 'Explorar', icon: Compass },
    { path: '/mapa', label: 'Mapa', icon: Map },
    { path: '/perfil/pedidos', label: 'Pedidos', icon: ShoppingBag },
  ]

  return (
    <>
      {/* Fixed Navbar - Premium Glass Effect */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-navbar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group" aria-label="ZAVO - Ir al inicio">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-teal-500 rounded-xl flex items-center justify-center shadow-primary group-hover:shadow-primary-lg group-hover:scale-105 transition-all duration-200">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <span className="text-xl font-bold font-display bg-gradient-to-r from-primary-600 to-teal-600 bg-clip-text text-transparent">
                  ZAVO
                </span>
                <p className="text-xs text-content-muted -mt-0.5">Rescata comida</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1" aria-label="Navegación principal">
              {menuItems.map((item) => {
                const Icon = item.icon
                const active = isActive(item.path)
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      active
                        ? 'text-primary-700 bg-primary-50'
                        : 'text-content-secondary hover:text-primary-600 hover:bg-gray-50'
                    }`}
                    aria-current={active ? 'page' : undefined}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                    {/* Active indicator */}
                    {active && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary-600 rounded-full" />
                    )}
                  </Link>
                )
              })}
            </nav>

            {/* Right Section */}
            <div className="flex items-center space-x-3">
              {/* User Menu */}
              <div className="hidden md:flex items-center">
                <Link 
                  to="/perfil"
                  className="flex items-center space-x-3 px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-200 cursor-pointer group"
                >
                  <div className="w-9 h-9 bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-200">
                    <span className="text-white text-sm font-bold">
                      {(user?.name || user?.nombre)?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-gray-900">{user?.name || user?.nombre}</p>
                    <p className="text-xs text-gray-500">Usuario</p>
                  </div>
                </Link>
              </div>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200">
            <div className="px-4 py-3 space-y-1">
              
              {/* User Info - Clickeable */}
              <Link
                to="/perfil"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center space-x-3 p-3 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-emerald-50 hover:to-teal-50 rounded-xl mb-3 transition-all duration-200"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-lg font-bold">
                    {(user?.name || user?.nombre)?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{user?.name || user?.nombre}</p>
                  <p className="text-sm text-gray-500">Usuario</p>
                </div>
                <div className="text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>

              {/* Navigation Items */}
              {menuItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-3 py-3 rounded-lg text-base font-medium transition-colors ${
                      isActive(item.path)
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}

              {/* Profile & Logout */}
              <div className="border-t border-gray-200 pt-3 mt-3">
                <Link
                  to="/perfil"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center space-x-3 px-3 py-3 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg"
                >
                  <User className="w-5 h-5" />
                  <span>Perfil</span>
                </Link>
                
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false)
                    handleLogout()
                  }}
                  className="w-full flex items-center space-x-3 px-3 py-3 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Spacer to prevent content from going under fixed navbar */}
      <div className="h-16"></div>
    </>
  )
}

export default MainNavbar
