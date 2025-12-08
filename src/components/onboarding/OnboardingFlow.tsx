/**
 * ============================================
 * ZAVO - Onboarding Flow Component
 * ============================================
 * 
 * Flujo de onboarding educativo con:
 * - Cómo comprar
 * - Cómo ahorrar
 * - Cómo apoyar negocios locales
 */

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  ShoppingBag, 
  Store, 
  ArrowRight, 
  ArrowLeft,
  Sparkles,
  MapPin,
  Clock,
  Heart,
  Leaf,
  TrendingDown,
  Users,
  X,
  Check
} from 'lucide-react'
import {
  MysteryBagIllustration,
  SavingsIllustration,
  LocationIllustration,
  FoodSavedIllustration,
  SuccessIllustration
} from '../illustrations/ZavoIllustrations'

// ============================================
// TIPOS
// ============================================

interface OnboardingStep {
  id: string
  title: string
  subtitle: string
  description: string
  illustration: React.ReactNode
  features: {
    icon: React.ReactNode
    title: string
    description: string
  }[]
  gradient: string
  accentColor: string
}

interface OnboardingFlowProps {
  onComplete: () => void
  onSkip?: () => void
}

// ============================================
// DATOS DE PASOS
// ============================================

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'welcome',
    title: '¡Bienvenido a ZAVO!',
    subtitle: 'Rescata comida, ahorra dinero',
    description: 'Descubre cómo puedes disfrutar de comida deliciosa mientras ayudas al planeta y a tu bolsillo.',
    illustration: <FoodSavedIllustration size={200} />,
    features: [
      {
        icon: <Leaf className="w-5 h-5" />,
        title: 'Reduce el desperdicio',
        description: 'Cada compra salva comida perfecta'
      },
      {
        icon: <TrendingDown className="w-5 h-5" />,
        title: 'Ahorra hasta 70%',
        description: 'Precios increíbles todos los días'
      },
      {
        icon: <Heart className="w-5 h-5" />,
        title: 'Apoya lo local',
        description: 'Conecta con negocios de tu zona'
      }
    ],
    gradient: 'from-emerald-400 via-teal-500 to-cyan-500',
    accentColor: 'emerald'
  },
  {
    id: 'how-to-buy',
    title: 'Cómo Comprar',
    subtitle: 'Es súper fácil',
    description: 'En solo 3 pasos puedes rescatar comida deliciosa cerca de ti.',
    illustration: <MysteryBagIllustration size={180} />,
    features: [
      {
        icon: <MapPin className="w-5 h-5" />,
        title: '1. Explora cerca de ti',
        description: 'Encuentra ofertas de restaurantes y tiendas en tu zona'
      },
      {
        icon: <ShoppingBag className="w-5 h-5" />,
        title: '2. Elige tu pack',
        description: 'Selecciona bolsas sorpresa o productos con descuento'
      },
      {
        icon: <Clock className="w-5 h-5" />,
        title: '3. Recoge tu pedido',
        description: 'Ve al negocio en el horario indicado y disfruta'
      }
    ],
    gradient: 'from-purple-400 via-pink-500 to-rose-500',
    accentColor: 'purple'
  },
  {
    id: 'how-to-save',
    title: 'Cómo Ahorrar',
    subtitle: 'Maximiza tus beneficios',
    description: 'Aprovecha al máximo cada compra con estos consejos.',
    illustration: <SavingsIllustration size={180} />,
    features: [
      {
        icon: <Sparkles className="w-5 h-5" />,
        title: 'Bolsas Sorpresa',
        description: 'Hasta 70% de descuento en packs misteriosos'
      },
      {
        icon: <Clock className="w-5 h-5" />,
        title: 'Ofertas Flash',
        description: 'Promociones por tiempo limitado con super descuentos'
      },
      {
        icon: <TrendingDown className="w-5 h-5" />,
        title: 'Próximos a vencer',
        description: 'Productos frescos con descuentos agresivos'
      }
    ],
    gradient: 'from-amber-400 via-orange-500 to-red-500',
    accentColor: 'orange'
  },
  {
    id: 'support-local',
    title: 'Apoya lo Local',
    subtitle: 'Haz la diferencia',
    description: 'Cada compra tiene un impacto positivo en tu comunidad y el medio ambiente.',
    illustration: <LocationIllustration size={180} />,
    features: [
      {
        icon: <Store className="w-5 h-5" />,
        title: 'Negocios locales',
        description: 'Ayuda a restaurantes y tiendas de tu barrio'
      },
      {
        icon: <Users className="w-5 h-5" />,
        title: 'Comunidad ZAVO',
        description: 'Únete a miles de personas que hacen la diferencia'
      },
      {
        icon: <Leaf className="w-5 h-5" />,
        title: 'Impacto ambiental',
        description: 'Reduce tu huella de carbono con cada compra'
      }
    ],
    gradient: 'from-cyan-400 via-blue-500 to-indigo-500',
    accentColor: 'blue'
  },
  {
    id: 'ready',
    title: '¡Estás Listo!',
    subtitle: 'Comienza a explorar',
    description: 'Ya tienes todo lo que necesitas para empezar a rescatar comida deliciosa.',
    illustration: <SuccessIllustration size={180} />,
    features: [
      {
        icon: <Check className="w-5 h-5" />,
        title: 'Cuenta creada',
        description: 'Tu perfil está listo para usar'
      },
      {
        icon: <MapPin className="w-5 h-5" />,
        title: 'Ubicación activada',
        description: 'Encontraremos ofertas cerca de ti'
      },
      {
        icon: <Heart className="w-5 h-5" />,
        title: '¡A rescatar!',
        description: 'Explora y haz tu primera compra'
      }
    ],
    gradient: 'from-emerald-400 via-teal-500 to-cyan-500',
    accentColor: 'emerald'
  }
]

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete, onSkip }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const navigate = useNavigate()
  
  const step = ONBOARDING_STEPS[currentStep]
  const isLastStep = currentStep === ONBOARDING_STEPS.length - 1
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
    // Guardar que el usuario completó el onboarding
    localStorage.setItem('zavo_onboarding_completed', 'true')
    onComplete()
    navigate('/')
  }

  const handleSkip = () => {
    localStorage.setItem('zavo_onboarding_completed', 'true')
    onSkip?.()
    navigate('/')
  }

  // Animación de entrada
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  return (
    <div className="fixed inset-0 z-50 bg-white overflow-hidden">
      {/* Background Gradient */}
      <div 
        className={`absolute inset-0 bg-gradient-to-br ${step.gradient} opacity-10 transition-all duration-700`}
      />
      
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
        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 overflow-y-auto">
          <div 
            key={step.id}
            className={`max-w-lg mx-auto text-center zavo-animate-fade-in-up`}
          >
            {/* Illustration */}
            <div className="mb-8 zavo-animate-float">
              {step.illustration}
            </div>

            {/* Badge */}
            <div className={`inline-flex items-center gap-2 px-4 py-2 bg-${step.accentColor}-100 rounded-full mb-4`}>
              <Sparkles className={`w-4 h-4 text-${step.accentColor}-600`} />
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
          {/* Progress Dots */}
          <div className="flex justify-center gap-2 mb-4">
            {ONBOARDING_STEPS.map((_, index) => (
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

          {/* Navigation Buttons */}
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
                background: `linear-gradient(135deg, var(--tw-gradient-stops))`,
                backgroundImage: isLastStep 
                  ? 'linear-gradient(135deg, #10B981 0%, #06B6D4 100%)'
                  : `linear-gradient(135deg, ${
                      step.accentColor === 'emerald' ? '#10B981, #06B6D4' :
                      step.accentColor === 'purple' ? '#A855F7, #EC4899' :
                      step.accentColor === 'orange' ? '#F97316, #EF4444' :
                      '#06B6D4, #6366F1'
                    })`,
                boxShadow: '0 10px 40px -10px rgba(0,0,0,0.3)'
              }}
            >
              <span>{isLastStep ? '¡Comenzar!' : 'Siguiente'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className={`absolute top-20 left-10 w-32 h-32 bg-${step.accentColor}-300/20 rounded-full blur-3xl zavo-animate-float`} />
      <div className={`absolute bottom-40 right-10 w-40 h-40 bg-${step.accentColor}-300/20 rounded-full blur-3xl zavo-animate-float`} style={{ animationDelay: '1s' }} />

      {/* CSS for safe area */}
      <style>{`
        .safe-area-bottom {
          padding-bottom: max(1rem, env(safe-area-inset-bottom));
        }
      `}</style>
    </div>
  )
}

export default OnboardingFlow
