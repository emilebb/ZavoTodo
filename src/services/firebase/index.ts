/**
 * ============================================
 * ZAVO - Firebase Services Index
 * ============================================
 * 
 * Exporta todos los servicios de Firebase
 */

// Auth Service
export * from './authService'

// Product Service
export * from './productService'

// Order Service
export * from './orderService'

// Notification Service
export * from './notificationService'

// Re-export firebase instances
export { auth, db, storage } from '../../lib/firebase'
