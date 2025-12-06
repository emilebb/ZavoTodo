import { Link, useLocation } from 'react-router-dom'
import { Home, Map, ShoppingBag, User } from 'lucide-react'
import { clsx } from 'clsx'

const UserBottomNav = () => {
  const location = useLocation()

  const navItems = [
    { path: '/', icon: Home, label: 'Inicio' },
    { path: '/mapa', icon: Map, label: 'Mapa' },
    { path: '/perfil/pedidos', icon: ShoppingBag, label: 'Pedidos' },
    { path: '/perfil', icon: User, label: 'Perfil' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-t border-white/20 shadow-lg">
      <div className="flex justify-around items-center py-2">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path

          return (
            <Link
              key={path}
              to={path}
              className={clsx(
                'flex flex-col items-center py-2 px-3 rounded-lg transition-colors duration-200',
                isActive
                  ? 'text-primary-600 bg-primary-50'
                  : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
              )}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

export default UserBottomNav
