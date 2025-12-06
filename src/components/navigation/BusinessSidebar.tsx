import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Package, ShoppingCart, User, X } from 'lucide-react'
import { clsx } from 'clsx'
import { useUIStore } from '../../store/uiStore'
import Button from '../ui/Button'

const BusinessSidebar = () => {
  const location = useLocation()
  const { sidebarOpen, setSidebarOpen } = useUIStore()

  const navItems = [
    { path: '/negocio/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/negocio/packs', icon: Package, label: 'Mis Packs' },
    { path: '/negocio/pedidos', icon: ShoppingCart, label: 'Pedidos' },
    { path: '/negocio/perfil', icon: User, label: 'Perfil' },
  ]

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={clsx(
        'fixed top-16 left-0 z-50 w-64 h-full bg-white/90 backdrop-blur-sm border-r border-white/20 shadow-lg transition-transform duration-300 ease-in-out lg:translate-x-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        {/* Mobile close button */}
        <div className="flex justify-end p-4 lg:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="px-4 pb-4">
          <ul className="space-y-2">
            {navItems.map(({ path, icon: Icon, label }) => {
              const isActive = location.pathname === path

              return (
                <li key={path}>
                  <Link
                    to={path}
                    onClick={() => setSidebarOpen(false)}
                    className={clsx(
                      'flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200',
                      isActive
                        ? 'bg-primary-100 text-primary-700 border border-primary-200'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </aside>
    </>
  )
}

export default BusinessSidebar
