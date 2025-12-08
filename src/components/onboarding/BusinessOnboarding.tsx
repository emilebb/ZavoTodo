/**
 * ============================================
 * ZAVO - Business Onboarding Component
 * ============================================
 * 
 * Onboarding especial para negocios/restaurantes
 * - Cómo publicar productos
 * - Cómo gestionar pedidos
 * - Cómo aumentar ventas
 * - Configuración inicial
 */

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Store, 
  Package, 
  ShoppingBag, 
  TrendingUp,
  Clock,
  Camera,
  ArrowRight, 
  ArrowLeft,
  Sparkles,
  DollarSign,
  Users,
  BarChart3,
  Bell,
  Check,
  X,
  Leaf
} from 'lucide-react'

// ============================================
// TIPOS
// ============================================

interface OnboardingStep {
  id: string
  title: string
  subtitle: string
  description: string
  icon: React.ReactNode
  features: {
    icon: React.ReactNode
    title: string
    description: string
  }[]
  gradient: string
  accentColor: string
}

interface BusinessOnboardingProps {
  onComplete: () => void
  onSkip?: () => void
}

// ============================================
// DATOS DE PASOS
// ============================================

const BUSINESS_STEPS: OnboardingStep[] = [
  {
    id: 'welcome',
    title: '¡Bienvenido a ZAVO Business!',
    subtitle: 'Tu aliado contra el desperdicio',
    description: 'Convierte tu excedente de comida en ingresos mientras ayudas al planeta.',
    icon: <Store className="w-16 h-16 text-white" />,
    features: [
      {
        icon: <DollarSign className="w-5 h-5" />,
        title: 'Genera ingresos extra',
        description: 'Vende productos que de otra forma se perderían'
      },
      {
        icon: <Users className="w-5 h-5" />,
        title: 'Nuevos clientes',
        description: 'Llega a miles de usuarios conscientes'
      },
      {
        icon: <Leaf className="w-5 h-5" />,
        title: 'Impacto positivo',
        description: 'Reduce tu huella ambiental'
      }
    ],
    gradient: 'from-emerald-500 to-teal-600',
    accentColor: 'emerald'
  },
  {
    id: 'products',
    title: 'Publica tus Productos',
    subtitle: 'Es muy fácil',
    description: 'Crea diferentes tipos de ofertas para maximizar tus ventas.',
    icon: <Package className="w-16 h-16 text-white" />,
    features: [
      {
        icon: <Sparkles className="w-5 h-5" />,
        title: 'Bolsas Sorpresa',
        description: 'Packs misteriosos con productos variados del día'
      },
      {
        icon: <Clock className="w-5 h-5" />,
        title: 'Ofertas Flash',
        description: 'Promociones por tiempo limitado'
      },
      {
        icon: <TrendingUp className="w-5 h-5" />,
        title: 'Próximos a vencer',
        description: 'Productos frescos con descuentos agresivos'
      }
    ],
    gradient: 'from-purple-500 to-pink-600',
    accentColor: 'purple'
  },
  {
    id: 'orders',
    title: 'Gestiona Pedidos',
    subtitle: 'Control total',
    description: 'Recibe y gestiona pedidos de forma simple y eficiente.',
    icon: <ShoppingBag className="w-16 h-16 text-white" />,
    features: [
      {
        icon: <Bell className="w-5 h-5" />,
        title: 'Notificaciones',
        description: 'Recibe alertas de nuevos pedidos al instante'
      },
      {
        icon: <Check className="w-5 h-5" />,
        title: 'Confirma y prepara',
        description: 'Acepta pedidos con un solo clic'
      },
      {
        icon: <Camera className="w-5 h-5" />,
        title: 'Escanea QR',
        description: 'Valida la entrega escaneando el código del cliente'
      }
    ],
    gradient: 'from-blue-500 to-indigo-600',
    accentColor: 'blue'
  },
  {
    id: 'analytics',
    title: 'Analiza tu Negocio',
    subtitle: 'Datos en tiempo real',
    description: 'Toma decisiones informadas con estadísticas detalladas.',
    icon: <BarChart3 className="w-16 h-16 text-white" />,
    features: [
      {
        icon: <TrendingUp className="w-5 h-5" />,
        title: 'Ventas y tendencias',
        description: 'Visualiza tus ingresos y crecimiento'
      },
      {
        icon: <Package className="w-5 h-5" />,
        title: 'Productos estrella',
        description: 'Identifica qué se vende mejor'
      },
      {
        icon: <Leaf className="w-5 h-5" />,
        title: 'Impacto ambiental',
        description: 'Mide la comida que has salvado'
      }
    ],
    gradient: 'from-orange-500 to-red-600',
    accentColor: 'orange'
  },
  {
    id: 'ready',
    title: '¡Todo Listo!',
    subtitle: 'Comienza a vender',
    description: 'Tu negocio está configurado. Es hora de crear tu primer producto.',
    icon: <Sparkles className="w-16 h-16 text-white" />,
    features: [
      {
        icon: <Check className="w-5 h-5" />,
        title: 'Perfil creado',
        description: 'Tu negocio está registrado en ZAVO'
      },
      {
        icon: <Package className="w-5 h-5" />,
        title: 'Crea tu primer pack',
        description: 'Publica tu primera oferta ahora'
      },
      {
        icon: <Users className="w-5 h-5" />,
        title: 'Conecta con clientes',
        description: 'Miles de usuarios te están esperando'
      }
    ],
    gradient: 'from-emerald-500 to-cyan-600',
    accentColor: 'emerald'
  }
]

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

const BusinessOnboarding: React.FC<BusinessOnboardingProps> = ({ onComplete, onSkip }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const navigate = useNavigate()
  
  const step = BUSINESS_STEPS[currentStep]
  const isLastStep = currentStep === BUSINESS_STEPS.length - 1
  const isFirstStep = currentStep === 0

  const handleNext = () => {
    if (isLastStep) {
      handleComplete()
    } else {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handlePrev = () => {
    if (!isFirstStep) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleComplete = () => {
    localStorage.setItem('zavo_business_onboarding_completed', 'true')
    onComplete()
    navigate('/negocio/dashboard-pro')
  }

  const handleSkip = () => {
    localStorage.setItem('zavo_business_onboarding_completed', 'true')
    onSkip?.()
    navigate('/negocio/dashboard-pro')
  }

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  return (
    <div className="fixed inset-0 z-50 bg-white overflow-hidden">
      {/* Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${step.gradient} opacity-5 transition-all duration-700`} />
      
      {/* Skip Button */}
      {!isLastStep && (
        <button
          onClick={handleSkip}
          className="absolute top-6 right-6 z-10 flex items-center gap-2 px-4 py-2 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <span className="text-sm font-medium">Omitir</span>
          <X className="w-4 h-4" />
        </button>
      )}

      {/* Content */}
      <div className="relative h-full flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 overflow-y-auto">
          <div key={step.id} className="max-w-lg mx-auto text-center zavo-animate-fade-in-up">
            
            {/* Icon */}
            <div className={`w-32 h-32 mx-auto mb-8 rounded-3xl bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-2xl zavo-animate-float`}>
              {step.icon}
            </div>

            {/* Badge */}
            <div className={`inline-flex items-center gap-2 px-4 py-2 bg-${step.accentColor}-100 rounded-full mb-4`}>
              <Store className={`w-4 h-4 text-${step.accentColor}-600`} />
              <span className={`text-sm font-semibold text-${step.accentColor}-700`}>
                {step.subtitle}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {step.title}
            </h1>

            {/* Description */}
            <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
              {step.description}
            </p>

            {/* Features */}
            <div className="space-y-4 mb-8">
              {step.features.map((feature, index) => (
                <div 
                  key={index}
                  className="flex items-start gap-4 p-4 bg-white rounded-2xl shadow-sm border border-gray-100 text-left zavo-animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`w-12 h-12 bg-${step.accentColor}-100 rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <div className={`text-${step.accentColor}-600`}>
                      {feature.icon}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white/80 backdrop-blur-lg border-t border-gray-100 px-6 py-4 safe-area-bottom">
          {/* Progress */}
          <div className="flex justify-center gap-2 mb-4">
            {BUSINESS_STEPS.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentStep 
                    ? `w-8 bg-gradient-to-r ${step.gradient}` 
                    : index < currentStep
                    ? 'w-2 bg-gray-400'
                    : 'w-2 bg-gray-200'
                }`}
              />
            ))}
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            {!isFirstStep && (
              <button
                onClick={handlePrev}
                className="flex-1 flex items-center justify-center gap-2 py-4 px-6 bg-gray-100 text-gray-700 rounded-2xl font-semibold hover:bg-gray-200 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Anterior</span>
              </button>
            )}
            
            <button
              onClick={handleNext}
              className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-2xl font-semibold text-white transition-all duration-300 hover:scale-[1.02] ${
                isFirstStep ? 'flex-[2]' : ''
              }`}
              style={{
                background: isLastStep 
                  ? 'linear-gradient(135deg, #10B981 0%, #06B6D4 100%)'
                  : `linear-gradient(135deg, ${
                      step.accentColor === 'emerald' ? '#10B981, #14B8A6' :
                      step.accentColor === 'purple' ? '#A855F7, #EC4899' :
                      step.accentColor === 'blue' ? '#3B82F6, #6366F1' :
                      '#F97316, #EF4444'
                    })`,
                boxShadow: '0 10px 40px -10px rgba(0,0,0,0.3)'
              }}
            >
              <span>{isLastStep ? 'Ir al Dashboard' : 'Siguiente'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Decorative */}
      <div className={`absolute top-20 left-10 w-32 h-32 bg-${step.accentColor}-300/20 rounded-full blur-3xl zavo-animate-float`} />
      <div className={`absolute bottom-40 right-10 w-40 h-40 bg-${step.accentColor}-300/20 rounded-full blur-3xl zavo-animate-float`} style={{ animationDelay: '1s' }} />

      <style>{`
        .safe-area-bottom {
          padding-bottom: max(1rem, env(safe-area-inset-bottom));
        }
      `}</style>
    </div>
  )
}

export default BusinessOnboarding
