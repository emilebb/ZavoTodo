/**
 * ============================================
 * ZAVO - Logo Component
 * ============================================
 * 
 * Componente del logo de ZAVO reutilizable
 */


interface ZavoLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'default' | 'white' | 'dark'
  showText?: boolean
  className?: string
}

const sizeClasses = {
  sm: 'w-6 h-6',
  md: 'w-8 h-8', 
  lg: 'w-12 h-12',
  xl: 'w-16 h-16'
}

const textSizeClasses = {
  sm: 'text-lg',
  md: 'text-xl',
  lg: 'text-2xl', 
  xl: 'text-3xl'
}

export default function ZavoLogo({ 
  size = 'md', 
  variant = 'default',
  showText = false,
  className = '' 
}: ZavoLogoProps) {
  
  const getColors = () => {
    switch (variant) {
      case 'white':
        return {
          bg: '#ffffff',
          text: '#16A34A',
          accent: '#F97316'
        }
      case 'dark':
        return {
          bg: '#1f2937',
          text: '#ffffff', 
          accent: '#F97316'
        }
      default:
        return {
          bg: '#16A34A',
          text: '#ffffff',
          accent: '#F97316'
        }
    }
  }

  const colors = getColors()

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Logo SVG */}
      <svg 
        className={sizeClasses[size]}
        viewBox="0 0 32 32" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Fondo circular */}
        <circle 
          cx="16" 
          cy="16" 
          r="15" 
          fill={colors.bg}
          stroke={variant === 'white' ? '#e5e7eb' : 'none'}
          strokeWidth={variant === 'white' ? '1' : '0'}
        />
        
        {/* Letra Z estilizada */}
        <path 
          d="M8 10 L24 10 L24 12 L12 22 L24 22 L24 24 L8 24 L8 22 L20 12 L8 12 Z" 
          fill={colors.text}
        />
        
        {/* Punto decorativo */}
        <circle 
          cx="25" 
          cy="7" 
          r="2" 
          fill={colors.accent}
        />
      </svg>

      {/* Texto del logo */}
      {showText && (
        <span 
          className={`font-bold font-display ${textSizeClasses[size]} ${
            variant === 'white' ? 'text-gray-800' : 
            variant === 'dark' ? 'text-white' : 
            'text-primary-600'
          }`}
        >
          ZAVO
        </span>
      )}
    </div>
  )
}
