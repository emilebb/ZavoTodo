import { ReactNode } from 'react'
import { Outlet } from 'react-router-dom'
import MainNavbar from '../navigation/MainNavbar'

interface MainLayoutProps {
  children?: ReactNode
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-green-50">
      {/* Fixed Navbar */}
      <MainNavbar />
      
      {/* Main Content */}
      <main className="relative">
        {children || <Outlet />}
      </main>
      
      {/* Footer (opcional) */}
      <footer className="bg-white/80 backdrop-blur-md border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* Logo & Description */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-teal-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">🌱</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900">ZAVO</h3>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                Rescata comida deliciosa con hasta 70% de descuento mientras ayudas a reducir 
                el desperdicio alimentario y proteger nuestro planeta.
              </p>
              <div className="flex space-x-4 mt-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-primary-600">2.5K+</div>
                  <div className="text-xs text-gray-500">Packs rescatados</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">150+</div>
                  <div className="text-xs text-gray-500">Negocios aliados</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-teal-600">85%</div>
                  <div className="text-xs text-gray-500">Ahorro promedio</div>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Enlaces Rápidos</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/" className="text-gray-600 hover:text-primary-600 transition-colors">Inicio</a></li>
                <li><a href="/mapa" className="text-gray-600 hover:text-primary-600 transition-colors">Mapa</a></li>
                <li><a href="/register" className="text-gray-600 hover:text-primary-600 transition-colors">Registrarse</a></li>
                <li><a href="/login" className="text-gray-600 hover:text-primary-600 transition-colors">Iniciar Sesión</a></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Soporte</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-600 hover:text-primary-600 transition-colors">Centro de Ayuda</a></li>
                <li><a href="#" className="text-gray-600 hover:text-primary-600 transition-colors">Contacto</a></li>
                <li><a href="#" className="text-gray-600 hover:text-primary-600 transition-colors">Términos de Uso</a></li>
                <li><a href="#" className="text-gray-600 hover:text-primary-600 transition-colors">Privacidad</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-6 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-gray-500">
                © 2024 ZAVO. Todos los derechos reservados.
              </p>
              <p className="text-sm text-gray-500 mt-2 md:mt-0">
                Hecho con ❤️ para reducir el desperdicio alimentario 🌱
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default MainLayout
