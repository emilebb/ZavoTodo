import { ButtonHTMLAttributes, forwardRef } from 'react'
import { clsx } from 'clsx'
import LoadingSpinner from './LoadingSpinner'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'accent'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  loading?: boolean
  fullWidth?: boolean
}

/**
 * Button Component - ZAVO Design System
 * 
 * Variants:
 * - primary: Verde sólido con gradiente (CTAs principales)
 * - secondary: Fondo blanco con borde (acciones secundarias)
 * - outline: Borde verde, fondo transparente
 * - ghost: Sin fondo, solo texto (links en texto)
 * - accent: Naranja para urgencia/descuentos
 * - danger: Rojo para acciones destructivas
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    children, 
    className, 
    variant = 'primary', 
    size = 'md', 
    loading = false,
    fullWidth = false,
    disabled,
    ...props 
  }, ref) => {
    const baseClasses = [
      'inline-flex items-center justify-center',
      'font-semibold rounded-xl',
      'transition-all duration-200 ease-out',
      'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
      'active:scale-[0.98]',
    ].join(' ')
    
    const variantClasses = {
      primary: [
        'bg-gradient-to-r from-primary-600 to-teal-600',
        'hover:from-primary-700 hover:to-teal-700',
        'text-white',
        'shadow-primary hover:shadow-primary-lg',
        'focus-visible:ring-primary-500',
      ].join(' '),
      secondary: [
        'bg-white hover:bg-gray-50',
        'text-content border-2 border-primary-600',
        'shadow-soft hover:shadow-card',
        'focus-visible:ring-primary-500',
      ].join(' '),
      outline: [
        'border-2 border-primary-600',
        'text-primary-600 hover:text-primary-700',
        'hover:bg-primary-50',
        'focus-visible:ring-primary-500',
      ].join(' '),
      ghost: [
        'text-content-secondary hover:text-content',
        'hover:bg-gray-100',
        'focus-visible:ring-gray-500',
      ].join(' '),
      accent: [
        'bg-gradient-to-r from-accent-500 to-accent-400',
        'hover:from-accent-600 hover:to-accent-500',
        'text-white',
        'shadow-accent hover:shadow-lg',
        'focus-visible:ring-accent-500',
      ].join(' '),
      danger: [
        'bg-red-600 hover:bg-red-700',
        'text-white',
        'shadow-md hover:shadow-lg',
        'focus-visible:ring-red-500',
      ].join(' '),
    }
    
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm gap-1.5',
      md: 'px-4 py-2.5 text-sm gap-2',
      lg: 'px-6 py-3 text-base gap-2',
      xl: 'px-8 py-4 text-lg gap-2.5',
    }

    return (
      <button
        ref={ref}
        className={clsx(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          fullWidth && 'w-full',
          className
        )}
        disabled={disabled || loading}
        aria-busy={loading}
        {...props}
      >
        {loading && <LoadingSpinner size="sm" />}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button
