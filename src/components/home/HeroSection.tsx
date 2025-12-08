/**
 * ============================================
 * ZAVO - Hero Section Component
 * ============================================
 * 
 * Sección hero con identidad visual ZAVO
 * - Gradientes neon
 * - Ilustraciones animadas
 * - Animaciones sutiles
 */

import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles, TrendingDown, MapPin } from 'lucide-react'
import { 
  FoodSavedIllustration, 
  SavingsIllustration 
} from '../illustrations/ZavoIllustrations'

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden">
      {/* Background con gradiente Aurora */}
      <div 
        className="absolute inset-0 zavo-animate-gradient"
        style={{
          background: 'linear-gradient(135deg, #ecfdf5 0%, #cffafe 25%, #f3e8ff 50%, #fce7f3 75%, #ecfdf5 100%)',
          backgroundSize: '400% 400%'
        }}
      />
      
      {/* Círculos decorativos */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-emerald-300/20 rounded-full blur-3xl zavo-animate-float" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl zavo-animate-float" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-300/20 rounded-full blur-3xl zavo-animate-float" style={{ animationDelay: '2s' }} />
      
      <div className="relative max-w-7xl mx-auto px-4 py-16 sm:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left zavo-animate-fade-in-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg mb-6 zavo-animate-bounce-in">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <span className="text-sm font-medium text-gray-700">
                Rescata comida, ahorra dinero
              </span>
              <span className="text-xs px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full font-semibold">
                Nuevo
              </span>
            </div>
            
            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="text-gray-900">Comida deliciosa</span>
              <br />
              <span 
                className="zavo-text-gradient-neon"
                style={{
                  background: 'linear-gradient(135deg, #10B981 0%, #06B6D4 50%, #A855F7 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                a precios increíbles
              </span>
            </h1>
            
            {/* Description */}
            <p className="text-lg text-gray-600 mb-8 max-w-lg mx-auto lg:mx-0">
              Descubre ofertas exclusivas de restaurantes y tiendas cerca de ti. 
              Ahorra hasta un <span className="font-bold text-emerald-600">70%</span> mientras 
              ayudas a reducir el desperdicio de alimentos.
            </p>
            
            {/* Stats */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-6 mb-8">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <TrendingDown className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">70%</p>
                  <p className="text-xs text-gray-500">Ahorro promedio</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-cyan-100 rounded-xl flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-cyan-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">500+</p>
                  <p className="text-xs text-gray-500">Negocios</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">10K+</p>
                  <p className="text-xs text-gray-500">Comidas salvadas</p>
                </div>
              </div>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link 
                to="/explorar"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-semibold text-white transition-all duration-300 hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #10B981 0%, #06B6D4 100%)',
                  boxShadow: '0 10px 40px -10px rgba(16, 185, 129, 0.5)'
                }}
              >
                <span>Explorar ofertas</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link 
                to="/mapa"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white rounded-2xl font-semibold text-gray-700 border-2 border-gray-200 hover:border-emerald-300 hover:text-emerald-600 transition-all duration-300"
              >
                <MapPin className="w-5 h-5" />
                <span>Ver mapa</span>
              </Link>
            </div>
          </div>
          
          {/* Illustrations */}
          <div className="relative hidden lg:block">
            <div className="relative">
              {/* Main Illustration */}
              <div className="relative z-10 flex justify-center">
                <FoodSavedIllustration size={280} />
              </div>
              
              {/* Floating Cards */}
              <div className="absolute top-0 right-0 zavo-animate-float" style={{ animationDelay: '0.5s' }}>
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-white/50">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl flex items-center justify-center">
                      <span className="text-white text-xl">🎁</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Bolsa Sorpresa</p>
                      <p className="text-sm text-emerald-600 font-medium">-60% OFF</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="absolute bottom-10 left-0 zavo-animate-float" style={{ animationDelay: '1s' }}>
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-white/50">
                  <div className="flex items-center gap-3">
                    <SavingsIllustration size={50} />
                    <div>
                      <p className="font-semibold text-gray-900">Ahorraste</p>
                      <p className="text-lg text-emerald-600 font-bold">$45.000</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="absolute top-1/2 -left-10 zavo-animate-float" style={{ animationDelay: '1.5s' }}>
                <div className="bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-full p-3 shadow-lg">
                  <span className="text-2xl">🥗</span>
                </div>
              </div>
              
              <div className="absolute bottom-0 right-10 zavo-animate-float" style={{ animationDelay: '2s' }}>
                <div className="bg-gradient-to-br from-orange-400 to-pink-400 rounded-full p-3 shadow-lg">
                  <span className="text-2xl">🍕</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Wave Divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path 
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" 
            fill="#F9FAFB"
          />
        </svg>
      </div>
    </section>
  )
}

export default HeroSection
