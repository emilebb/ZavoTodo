import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Star, MapPin, Clock, Leaf, TrendingUp, Package, ShoppingBag, ArrowRight, Sparkles } from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

const DemoPage = () => {
  const [selectedTab, setSelectedTab] = useState('packs')

  return (
    <div className="min-h-screen">
      {/* Hero Section - Premium Y Combinator Ready */}
      <section className="relative py-16 md:py-24 px-4 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200/30 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-200/20 rounded-full blur-3xl" />
        </div>
        
        <div className="max-w-5xl mx-auto">
          {/* Badge de lanzamiento */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 border border-primary-200 rounded-full">
              <Sparkles className="w-4 h-4 text-primary-600" />
              <span className="text-sm font-medium text-primary-700">Nuevo en Colombia</span>
            </div>
          </div>

          {/* Logo y título */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-primary">
                <Leaf className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold font-display bg-gradient-to-r from-primary-600 to-teal-600 bg-clip-text text-transparent">
                ZAVO
              </h1>
            </div>
            
            {/* Headline principal - único H1 semántico */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-display text-content leading-tight mb-6">
              Rescata comida deliciosa con hasta{' '}
              <span className="text-primary-600 relative">
                70% de descuento
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 8" fill="none">
                  <path d="M2 6C50 2 150 2 198 6" stroke="#16A34A" strokeWidth="3" strokeLinecap="round" opacity="0.3"/>
                </svg>
              </span>
            </h2>
            
            <p className="text-lg md:text-xl text-content-muted mb-10 max-w-2xl mx-auto leading-relaxed">
              Únete a la revolución contra el desperdicio alimentario. Encuentra packs sorpresa 
              de tus restaurantes favoritos y ayuda a salvar el planeta.
            </p>
          </div>

          {/* CTAs principales */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/mapa">
              <Button size="xl" className="group">
                Explorar Packs
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/mapa">
              <Button variant="secondary" size="xl">
                <MapPin className="w-5 h-5" />
                Ver en Mapa
              </Button>
            </Link>
          </div>

          {/* Social proof mini */}
          <div className="flex items-center justify-center gap-6 mt-10 text-sm text-content-muted">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-teal-400 border-2 border-white" />
                ))}
              </div>
              <span>+2,500 usuarios activos</span>
            </div>
            <div className="hidden sm:flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span>4.8/5 valoración</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Métricas de Impacto */}
      <section className="py-16 md:py-20 px-4 bg-white/70 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {/* Stat Card - Packs */}
            <div className="group text-center p-6 rounded-2xl bg-white shadow-soft hover:shadow-card transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-primary-100 to-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Package className="w-7 h-7 text-primary-600" />
              </div>
              <div className="text-3xl md:text-4xl font-bold font-display text-primary-600 mb-1">2,500+</div>
              <div className="text-sm text-content-muted font-medium">Packs rescatados</div>
            </div>
            
            {/* Stat Card - Ahorro */}
            <div className="group text-center p-6 rounded-2xl bg-white shadow-soft hover:shadow-card transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-teal-100 to-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-7 h-7 text-teal-600" />
              </div>
              <div className="text-3xl md:text-4xl font-bold font-display text-teal-600 mb-1">85%</div>
              <div className="text-sm text-content-muted font-medium">Ahorro promedio</div>
            </div>
            
            {/* Stat Card - Negocios */}
            <div className="group text-center p-6 rounded-2xl bg-white shadow-soft hover:shadow-card transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <ShoppingBag className="w-7 h-7 text-blue-600" />
              </div>
              <div className="text-3xl md:text-4xl font-bold font-display text-blue-600 mb-1">150+</div>
              <div className="text-sm text-content-muted font-medium">Negocios aliados</div>
            </div>
            
            {/* Stat Card - CO₂ (Accent color) */}
            <div className="group text-center p-6 rounded-2xl bg-white shadow-soft hover:shadow-card transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-accent-100 to-accent-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Leaf className="w-7 h-7 text-accent-600" />
              </div>
              <div className="text-3xl md:text-4xl font-bold font-display text-accent-600 mb-1">2.1 ton</div>
              <div className="text-sm text-content-muted font-medium">CO₂ ahorrado</div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Section - Funcionalidades */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-section font-display text-content mb-4">
              Explora nuestras funcionalidades
            </h2>
            <p className="text-content-muted text-lg max-w-2xl mx-auto">
              Descubre cómo ZAVO está transformando la forma de combatir el desperdicio alimentario
            </p>
          </div>

          {/* Tab Navigation - Premium Pills */}
          <div className="flex justify-center mb-10">
            <div className="inline-flex bg-gray-100/80 backdrop-blur-sm rounded-2xl p-1.5 gap-1">
              <button
                onClick={() => setSelectedTab('packs')}
                className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
                  selectedTab === 'packs'
                    ? 'bg-white text-primary-600 shadow-soft'
                    : 'text-content-muted hover:text-content hover:bg-white/50'
                }`}
              >
                Packs Sorpresa
              </button>
              <button
                onClick={() => setSelectedTab('business')}
                className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
                  selectedTab === 'business'
                    ? 'bg-white text-primary-600 shadow-soft'
                    : 'text-content-muted hover:text-content hover:bg-white/50'
                }`}
              >
                Para Negocios
              </button>
              <button
                onClick={() => setSelectedTab('impact')}
                className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
                  selectedTab === 'impact'
                    ? 'bg-white text-primary-600 shadow-soft'
                    : 'text-content-muted hover:text-content hover:bg-white/50'
                }`}
              >
                Impacto Ambiental
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {selectedTab === 'packs' && (
              <>
                {/* Pack Cards - Premium Design */}
                {[
                  { id: 1, emoji: '🥖', name: 'Panadería El Buen Pan', discount: 47, rating: 4.8, distance: '0.8 km', original: 15000, price: 8000, time: '17:00 - 20:00', stock: 3 },
                  { id: 2, emoji: '☕', name: 'Café Central Premium', discount: 35, rating: 4.9, distance: '1.2 km', original: 18500, price: 12000, time: '18:00 - 21:00', stock: 5 },
                  { id: 3, emoji: '🍽️', name: 'Restaurante Verde', discount: 60, rating: 4.7, distance: '0.5 km', original: 25000, price: 10000, time: '20:00 - 22:00', stock: 2 },
                ].map((pack) => (
                  <Card key={pack.id} className="group overflow-hidden bg-white hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1">
                    {/* Card Image Area */}
                    <div className="aspect-[4/3] bg-gradient-to-br from-primary-50 via-teal-50 to-primary-100 relative overflow-hidden">
                      {/* Discount Badge */}
                      <div className="absolute top-3 right-3 z-10">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-accent-500 text-white text-sm font-bold shadow-accent">
                          -{pack.discount}%
                        </span>
                      </div>
                      
                      {/* Stock Badge */}
                      {pack.stock <= 3 && (
                        <div className="absolute top-3 left-3 z-10">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-amber-500 text-white text-xs font-semibold">
                            ¡Últimas {pack.stock}!
                          </span>
                        </div>
                      )}
                      
                      {/* Center Content */}
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <div className="w-20 h-20 bg-white/80 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-soft group-hover:scale-110 transition-transform duration-300">
                            <span className="text-4xl">{pack.emoji}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Card Content */}
                    <div className="p-5">
                      {/* Business Info */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-content-secondary">{pack.name}</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-semibold text-content">{pack.rating}</span>
                        </div>
                      </div>

                      {/* Pack Title */}
                      <h3 className="font-semibold text-content text-lg mb-2 group-hover:text-primary-600 transition-colors">
                        Pack Sorpresa
                      </h3>
                      
                      {/* Meta Info */}
                      <div className="flex items-center gap-4 mb-4 text-sm">
                        <div className="flex items-center gap-1 text-content-muted">
                          <MapPin className="w-4 h-4" />
                          <span>{pack.distance}</span>
                        </div>
                        <div className="flex items-center gap-1 text-accent-600 font-medium">
                          <Clock className="w-4 h-4" />
                          <span>{pack.time}</span>
                        </div>
                      </div>
                      
                      {/* Price Section */}
                      <div className="flex items-end justify-between pt-3 border-t border-gray-100">
                        <div>
                          <div className="text-sm text-content-muted line-through">${pack.original.toLocaleString('es-CO')}</div>
                          <div className="text-2xl font-bold font-display text-primary-600">${pack.price.toLocaleString('es-CO')}</div>
                        </div>
                        <Button size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          Reservar
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </>
            )}

            {selectedTab === 'business' && (
              <div className="lg:col-span-3">
                <Card className="p-8 text-center">
                  <div className="max-w-2xl mx-auto">
                    <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <ShoppingBag className="w-10 h-10 text-primary-600" />
                    </div>
                    <h4 className="text-2xl font-bold text-gray-900 mb-4">
                      ¿Tienes un negocio de comida?
                    </h4>
                    <p className="text-gray-600 mb-6 text-lg">
                      Únete a ZAVO y convierte tu exceso de comida en ingresos adicionales 
                      mientras ayudas al medio ambiente.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      <div>
                        <div className="text-3xl mb-2">💰</div>
                        <h5 className="font-semibold mb-2">Ingresos Extra</h5>
                        <p className="text-sm text-gray-600">
                          Monetiza tu exceso de comida en lugar de desecharlo
                        </p>
                      </div>
                      <div>
                        <div className="text-3xl mb-2">🌍</div>
                        <h5 className="font-semibold mb-2">Impacto Positivo</h5>
                        <p className="text-sm text-gray-600">
                          Contribuye activamente a la reducción del desperdicio
                        </p>
                      </div>
                      <div>
                        <div className="text-3xl mb-2">👥</div>
                        <h5 className="font-semibold mb-2">Nuevos Clientes</h5>
                        <p className="text-sm text-gray-600">
                          Atrae nuevos clientes que descubran tu negocio
                        </p>
                      </div>
                    </div>
                    <Button size="lg">Registrar mi negocio</Button>
                  </div>
                </Card>
              </div>
            )}

            {selectedTab === 'impact' && (
              <div className="lg:col-span-3">
                <Card className="p-8">
                  <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Leaf className="w-10 h-10 text-green-600" />
                    </div>
                    <h4 className="text-2xl font-bold text-gray-900 mb-4">
                      Nuestro Impacto Ambiental
                    </h4>
                    <p className="text-gray-600 text-lg">
                      Cada pack que rescatas tiene un impacto positivo directo en el planeta
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="text-center p-6 bg-green-50 rounded-xl">
                      <div className="text-3xl font-bold text-green-600 mb-2">2.1 kg</div>
                      <div className="text-sm text-gray-600">CO₂ ahorrado por pack</div>
                    </div>
                    <div className="text-center p-6 bg-blue-50 rounded-xl">
                      <div className="text-3xl font-bold text-blue-600 mb-2">1.5 L</div>
                      <div className="text-sm text-gray-600">Agua conservada</div>
                    </div>
                    <div className="text-center p-6 bg-orange-50 rounded-xl">
                      <div className="text-3xl font-bold text-orange-600 mb-2">0.8 m²</div>
                      <div className="text-sm text-gray-600">Tierra preservada</div>
                    </div>
                    <div className="text-center p-6 bg-purple-50 rounded-xl">
                      <div className="text-3xl font-bold text-purple-600 mb-2">1 kg</div>
                      <div className="text-sm text-gray-600">Comida rescatada</div>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section - Premium Gradient */}
      <section className="relative py-20 md:py-28 px-4 overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-teal-700" />
        
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl" />
        </div>
        
        <div className="relative max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-display text-white mb-6">
            ¿Listo para hacer la diferencia?
          </h2>
          <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            Únete a miles de usuarios que ya están rescatando comida y salvando el planeta
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="xl" 
              className="bg-white text-primary-700 hover:bg-gray-100 shadow-xl hover:shadow-2xl"
            >
              Descargar App
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Link to="/mapa">
              <Button 
                size="xl" 
                className="bg-white/10 hover:bg-white/20 text-white border-2 border-white/30 backdrop-blur-sm"
              >
                Explorar Web
              </Button>
            </Link>
          </div>
          
          {/* Trust badges */}
          <div className="mt-12 flex items-center justify-center gap-8 text-white/70 text-sm">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Sin costo de registro</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Pago seguro</span>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Soporte 24/7</span>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-content py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-teal-500 rounded-xl flex items-center justify-center">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold font-display text-white">ZAVO</span>
            </div>
            
            {/* Links */}
            <div className="flex items-center gap-8 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Términos</a>
              <a href="#" className="hover:text-white transition-colors">Privacidad</a>
              <a href="#" className="hover:text-white transition-colors">Contacto</a>
            </div>
            
            {/* Copyright */}
            <p className="text-sm text-gray-500">
              © 2024 ZAVO. Hecho con 💚 en Colombia
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default DemoPage
