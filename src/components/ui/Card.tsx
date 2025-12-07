import { HTMLAttributes, forwardRef } from 'react'
import { clsx } from 'clsx'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'elevated' | 'interactive'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  hover?: boolean
}

/**
 * Card Component - ZAVO Design System
 * 
 * Variants:
 * - default: Fondo blanco con borde sutil
 * - glass: Efecto glassmorphism
 * - elevated: Sombra más pronunciada
 * - interactive: Con hover effects para cards clickeables
 */
const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', padding = 'md', hover = false, children, ...props }, ref) => {
    const baseClasses = 'rounded-2xl transition-all duration-200'
    
    const variantClasses = {
      default: 'bg-white border border-gray-100 shadow-soft',
      glass: 'bg-white/70 backdrop-blur-sm border border-white/20 shadow-lg',
      elevated: 'bg-white shadow-card border border-gray-50',
      interactive: 'bg-white border border-gray-100 shadow-soft cursor-pointer',
    }
    
    const hoverClasses = hover || variant === 'interactive' 
      ? 'hover:shadow-card-hover hover:-translate-y-0.5 active:translate-y-0' 
      : ''
    
    const paddingClasses = {
      none: '',
      sm: 'p-4',
      md: 'p-5',
      lg: 'p-6',
    }

    return (
      <div
        ref={ref}
        className={clsx(
          baseClasses,
          variantClasses[variant],
          paddingClasses[padding],
          hoverClasses,
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

export default Card
