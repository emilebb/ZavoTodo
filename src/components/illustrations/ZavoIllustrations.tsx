/**
 * ============================================
 * ZAVO - Brand Illustrations
 * ============================================
 * 
 * Ilustraciones SVG animadas para la marca ZAVO
 * Estilo: Moderno, minimalista, neon pastel
 */

import React from 'react'

// ============================================
// LOGO ANIMADO
// ============================================

export const ZavoLogo: React.FC<{ 
  size?: number
  animated?: boolean
  variant?: 'default' | 'white' | 'gradient'
}> = ({ size = 48, animated = true, variant = 'default' }) => {
  const gradientId = `zavo-logo-gradient-${Math.random().toString(36).substr(2, 9)}`
  
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none"
      className={animated ? 'zavo-animate-float' : ''}
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="50%" stopColor="#06B6D4" />
          <stop offset="100%" stopColor="#A855F7" />
        </linearGradient>
      </defs>
      
      {/* Círculo de fondo */}
      <circle 
        cx="50" 
        cy="50" 
        r="45" 
        fill={variant === 'white' ? 'white' : `url(#${gradientId})`}
        className={animated ? 'zavo-animate-pulse-glow' : ''}
      />
      
      {/* Hoja estilizada */}
      <path 
        d="M50 20C35 35 30 55 35 70C40 75 50 78 60 75C70 72 75 60 70 45C65 30 50 20 50 20Z"
        fill={variant === 'white' ? '#10B981' : 'white'}
        opacity="0.9"
      />
      <path 
        d="M50 25C50 25 45 40 48 55C51 70 55 72 55 72"
        stroke={variant === 'white' ? '#059669' : 'rgba(255,255,255,0.5)'}
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  )
}

// ============================================
// ILUSTRACIÓN: BOLSA SORPRESA
// ============================================

export const MysteryBagIllustration: React.FC<{ size?: number }> = ({ size = 120 }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
    <defs>
      <linearGradient id="bag-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#A855F7" />
        <stop offset="100%" stopColor="#EC4899" />
      </linearGradient>
    </defs>
    
    {/* Bolsa */}
    <path 
      d="M30 45L25 100C25 105 30 110 35 110H85C90 110 95 105 95 100L90 45H30Z"
      fill="url(#bag-gradient)"
      className="zavo-animate-float"
    />
    
    {/* Asas */}
    <path 
      d="M40 45C40 30 50 20 60 20C70 20 80 30 80 45"
      stroke="#A855F7"
      strokeWidth="6"
      strokeLinecap="round"
      fill="none"
    />
    
    {/* Signo de interrogación */}
    <text 
      x="60" 
      y="85" 
      textAnchor="middle" 
      fontSize="40" 
      fill="white"
      fontWeight="bold"
      className="zavo-animate-bounce-in"
    >
      ?
    </text>
    
    {/* Estrellas decorativas */}
    <circle cx="25" cy="35" r="3" fill="#FCD34D" className="zavo-animate-pulse-glow" />
    <circle cx="95" cy="30" r="2" fill="#FCD34D" className="zavo-animate-pulse-glow" />
    <circle cx="100" cy="50" r="2.5" fill="#FCD34D" className="zavo-animate-pulse-glow" />
  </svg>
)

// ============================================
// ILUSTRACIÓN: COMIDA SALVADA
// ============================================

export const FoodSavedIllustration: React.FC<{ size?: number }> = ({ size = 120 }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
    <defs>
      <linearGradient id="food-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#10B981" />
        <stop offset="100%" stopColor="#06B6D4" />
      </linearGradient>
    </defs>
    
    {/* Plato */}
    <ellipse cx="60" cy="90" rx="45" ry="15" fill="#E5E7EB" />
    <ellipse cx="60" cy="85" rx="40" ry="12" fill="white" />
    
    {/* Comida */}
    <circle cx="45" cy="65" r="15" fill="#F97316" className="zavo-animate-float" />
    <circle cx="70" cy="60" r="12" fill="#EF4444" className="zavo-animate-float" style={{ animationDelay: '0.2s' }} />
    <circle cx="55" cy="50" r="10" fill="#22C55E" className="zavo-animate-float" style={{ animationDelay: '0.4s' }} />
    
    {/* Corazón */}
    <path 
      d="M60 25C55 15 40 15 40 30C40 45 60 55 60 55C60 55 80 45 80 30C80 15 65 15 60 25Z"
      fill="url(#food-gradient)"
      className="zavo-animate-pulse-glow"
    />
    
    {/* Check */}
    <path 
      d="M52 30L58 36L70 24"
      stroke="white"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

// ============================================
// ILUSTRACIÓN: UBICACIÓN
// ============================================

export const LocationIllustration: React.FC<{ size?: number }> = ({ size = 120 }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
    <defs>
      <linearGradient id="location-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#06B6D4" />
        <stop offset="100%" stopColor="#10B981" />
      </linearGradient>
    </defs>
    
    {/* Círculos de radar */}
    <circle cx="60" cy="60" r="50" stroke="#10B981" strokeWidth="1" opacity="0.2" className="zavo-animate-pulse-glow" />
    <circle cx="60" cy="60" r="35" stroke="#10B981" strokeWidth="1" opacity="0.3" className="zavo-animate-pulse-glow" />
    <circle cx="60" cy="60" r="20" stroke="#10B981" strokeWidth="1" opacity="0.4" className="zavo-animate-pulse-glow" />
    
    {/* Pin de ubicación */}
    <path 
      d="M60 20C45 20 35 32 35 45C35 65 60 85 60 85C60 85 85 65 85 45C85 32 75 20 60 20Z"
      fill="url(#location-gradient)"
      className="zavo-animate-float"
    />
    <circle cx="60" cy="42" r="10" fill="white" />
    
    {/* Puntos de negocios */}
    <circle cx="30" cy="50" r="5" fill="#A855F7" className="zavo-animate-pulse-glow" />
    <circle cx="85" cy="65" r="4" fill="#EC4899" className="zavo-animate-pulse-glow" />
    <circle cx="45" cy="80" r="3" fill="#F97316" className="zavo-animate-pulse-glow" />
  </svg>
)

// ============================================
// ILUSTRACIÓN: CARRITO VACÍO
// ============================================

export const EmptyCartIllustration: React.FC<{ size?: number }> = ({ size = 150 }) => (
  <svg width={size} height={size} viewBox="0 0 150 150" fill="none">
    <defs>
      <linearGradient id="cart-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#E5E7EB" />
        <stop offset="100%" stopColor="#D1D5DB" />
      </linearGradient>
    </defs>
    
    {/* Carrito */}
    <path 
      d="M30 40H40L55 100H115L130 50H50"
      stroke="url(#cart-gradient)"
      strokeWidth="6"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    
    {/* Ruedas */}
    <circle cx="65" cy="115" r="8" fill="#9CA3AF" />
    <circle cx="105" cy="115" r="8" fill="#9CA3AF" />
    
    {/* Cara triste */}
    <circle cx="85" cy="70" r="20" fill="#F3F4F6" stroke="#E5E7EB" strokeWidth="2" />
    <circle cx="78" cy="65" r="3" fill="#9CA3AF" />
    <circle cx="92" cy="65" r="3" fill="#9CA3AF" />
    <path d="M78 80C78 80 82 75 92 80" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />
    
    {/* Hoja decorativa */}
    <path 
      d="M110 30C105 35 105 45 110 50C115 45 115 35 110 30Z"
      fill="#10B981"
      opacity="0.5"
      className="zavo-animate-float"
    />
  </svg>
)

// ============================================
// ILUSTRACIÓN: ÉXITO / CELEBRACIÓN
// ============================================

export const SuccessIllustration: React.FC<{ size?: number }> = ({ size = 120 }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
    <defs>
      <linearGradient id="success-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#10B981" />
        <stop offset="100%" stopColor="#34D399" />
      </linearGradient>
    </defs>
    
    {/* Círculo de fondo */}
    <circle 
      cx="60" 
      cy="60" 
      r="45" 
      fill="url(#success-gradient)"
      className="zavo-animate-bounce-in"
    />
    
    {/* Check */}
    <path 
      d="M40 60L55 75L85 45"
      stroke="white"
      strokeWidth="6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="zavo-animate-fade-in-up"
    />
    
    {/* Confeti */}
    <circle cx="20" cy="30" r="4" fill="#FCD34D" className="zavo-animate-float" />
    <circle cx="100" cy="25" r="3" fill="#EC4899" className="zavo-animate-float" />
    <circle cx="95" cy="90" r="4" fill="#A855F7" className="zavo-animate-float" />
    <circle cx="25" cy="85" r="3" fill="#06B6D4" className="zavo-animate-float" />
    
    <rect x="15" y="50" width="8" height="3" rx="1" fill="#F97316" transform="rotate(-20)" className="zavo-animate-float" />
    <rect x="100" y="60" width="8" height="3" rx="1" fill="#10B981" transform="rotate(15)" className="zavo-animate-float" />
  </svg>
)

// ============================================
// ILUSTRACIÓN: ERROR / NO ENCONTRADO
// ============================================

export const NotFoundIllustration: React.FC<{ size?: number }> = ({ size = 150 }) => (
  <svg width={size} height={size} viewBox="0 0 150 150" fill="none">
    <defs>
      <linearGradient id="notfound-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F3F4F6" />
        <stop offset="100%" stopColor="#E5E7EB" />
      </linearGradient>
    </defs>
    
    {/* Lupa */}
    <circle 
      cx="60" 
      cy="55" 
      r="35" 
      stroke="#D1D5DB" 
      strokeWidth="8" 
      fill="url(#notfound-gradient)"
    />
    <line 
      x1="85" 
      y1="80" 
      x2="115" 
      y2="110" 
      stroke="#D1D5DB" 
      strokeWidth="8" 
      strokeLinecap="round"
    />
    
    {/* Cara confundida */}
    <circle cx="48" cy="50" r="4" fill="#9CA3AF" />
    <circle cx="72" cy="50" r="4" fill="#9CA3AF" />
    <path d="M50 70C50 70 55 65 70 70" stroke="#9CA3AF" strokeWidth="3" strokeLinecap="round" />
    
    {/* Signos de interrogación */}
    <text x="25" y="30" fontSize="16" fill="#D1D5DB" className="zavo-animate-float">?</text>
    <text x="110" y="45" fontSize="12" fill="#D1D5DB" className="zavo-animate-float">?</text>
    <text x="120" y="75" fontSize="14" fill="#D1D5DB" className="zavo-animate-float">?</text>
  </svg>
)

// ============================================
// ILUSTRACIÓN: LOADING / CARGANDO
// ============================================

export const LoadingIllustration: React.FC<{ size?: number }> = ({ size = 80 }) => (
  <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
    <defs>
      <linearGradient id="loading-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#10B981" />
        <stop offset="50%" stopColor="#06B6D4" />
        <stop offset="100%" stopColor="#A855F7" />
      </linearGradient>
    </defs>
    
    {/* Círculo de carga */}
    <circle 
      cx="40" 
      cy="40" 
      r="30" 
      stroke="#E5E7EB" 
      strokeWidth="6" 
      fill="none"
    />
    <circle 
      cx="40" 
      cy="40" 
      r="30" 
      stroke="url(#loading-gradient)" 
      strokeWidth="6" 
      fill="none"
      strokeLinecap="round"
      strokeDasharray="60 140"
      className="zavo-animate-rotate"
      style={{ transformOrigin: 'center' }}
    />
    
    {/* Logo pequeño en el centro */}
    <path 
      d="M40 25C35 32 33 40 35 48C37 52 40 54 45 53C50 52 52 46 50 38C48 30 40 25 40 25Z"
      fill="#10B981"
      opacity="0.5"
    />
  </svg>
)

// ============================================
// ILUSTRACIÓN: WALLET / AHORRO
// ============================================

export const SavingsIllustration: React.FC<{ size?: number }> = ({ size = 120 }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
    <defs>
      <linearGradient id="savings-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#10B981" />
        <stop offset="100%" stopColor="#059669" />
      </linearGradient>
    </defs>
    
    {/* Billetera */}
    <rect 
      x="20" 
      y="35" 
      width="80" 
      height="55" 
      rx="8" 
      fill="url(#savings-gradient)"
      className="zavo-animate-float"
    />
    <rect x="20" y="50" width="80" height="10" fill="#059669" />
    
    {/* Cierre */}
    <circle cx="90" cy="62" r="8" fill="#047857" />
    <circle cx="90" cy="62" r="4" fill="#10B981" />
    
    {/* Monedas */}
    <circle cx="35" cy="25" r="12" fill="#FCD34D" stroke="#F59E0B" strokeWidth="2" className="zavo-animate-bounce-in" />
    <text x="35" y="29" textAnchor="middle" fontSize="12" fill="#92400E" fontWeight="bold">$</text>
    
    <circle cx="55" cy="18" r="10" fill="#FCD34D" stroke="#F59E0B" strokeWidth="2" className="zavo-animate-bounce-in" style={{ animationDelay: '0.1s' }} />
    <text x="55" y="22" textAnchor="middle" fontSize="10" fill="#92400E" fontWeight="bold">$</text>
    
    <circle cx="72" cy="22" r="8" fill="#FCD34D" stroke="#F59E0B" strokeWidth="2" className="zavo-animate-bounce-in" style={{ animationDelay: '0.2s' }} />
    <text x="72" y="25" textAnchor="middle" fontSize="8" fill="#92400E" fontWeight="bold">$</text>
    
    {/* Flecha de ahorro */}
    <path 
      d="M95 100L105 90L95 80"
      stroke="#10B981"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <path 
      d="M105 90H85"
      stroke="#10B981"
      strokeWidth="3"
      strokeLinecap="round"
    />
  </svg>
)

// ============================================
// EXPORT ALL
// ============================================

export default {
  ZavoLogo,
  MysteryBagIllustration,
  FoodSavedIllustration,
  LocationIllustration,
  EmptyCartIllustration,
  SuccessIllustration,
  NotFoundIllustration,
  LoadingIllustration,
  SavingsIllustration
}
