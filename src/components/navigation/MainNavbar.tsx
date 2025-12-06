import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { 
  Menu, 
  X, 
  Home, 
  Map, 
  ShoppingBag, 
  User, 
  BarChart3, 
  Package, 
  Plus,
  LogOut,
  Leaf
} from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import Button from '../ui/Button'

const MainNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user, logout } = useAuthStore()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/auth/role')
  }

  const isActive = (path: string) => location.pathname === path

  const userMenuItems = [
    { path: '/', label: 'Inicio', icon: Home },
    { path: '/mapa', label: 'Mapa', icon: Map },
    { path: '/perfil/pedidos', label: 'Mis Pedidos', icon: ShoppingBag },
  ]

  const businessMenuItems = [
    { path: '/negocio/dashboard', label: 'Dashboard', icon: BarChart3 },
    { path: '/negocio/packs', label: 'Mis Packs', icon: Package },
    { path: '/negocio/pedidos', label: 'Pedidos', icon: ShoppingBag },
  ]

  const menuItems = user?.rol === 'negocio' ? businessMenuItems : userMenuItems

  return (
    <>
      {/* Fixed Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-navbar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-teal-500 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-teal-600 bg-clip-text text-transparent">
                  ZAVO
                </h1>
                <p className="text-xs text-gray-500 -mt-1">Rescata comida</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {menuItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive(item.path)
                        ? 'bg-primary-100 text-primary-700 shadow-sm'
                        : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-3">
              
              {/* Create Pack Button (Business only) */}
              {user?.rol === 'negocio' && (
                <Link to="/negocio/packs/nuevo" className="hidden sm:block">
                  <Button size="sm" className="bg-gradient-to-r from-primary-600 to-teal-600 hover:from-primary-700 hover:to-teal-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Crear Pack
                  </Button>
                </Link>
              )}

              {/* User Menu */}
              <div className="hidden md:flex items-center space-x-3">
                <div className="flex items-center space-x-3 px-3 py-2 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-teal-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user?.nombre.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">{user?.nombre}</p>
                    <p className="text-xs text-gray-500 capitalize">{user?.rol}</p>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-gray-500 hover:text-red-600"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
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
              
              {/* User Info */}
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-teal-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">
                    {user?.nombre.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{user?.nombre}</p>
                  <p className="text-sm text-gray-500 capitalize">{user?.rol}</p>
                </div>
              </div>

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

              {/* Create Pack Button (Business Mobile) */}
              {user?.rol === 'negocio' && (
                <Link
                  to="/negocio/packs/nuevo"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center space-x-3 px-3 py-3 bg-gradient-to-r from-primary-600 to-teal-600 text-white rounded-lg font-medium mt-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>Crear Pack</span>
                </Link>
              )}

              {/* Profile & Logout */}
              <div className="border-t border-gray-200 pt-3 mt-3">
                <Link
                  to={user?.rol === 'negocio' ? '/negocio/perfil' : '/perfil'}
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
