/**
 * ============================================
 * ZAVO - Auth Store (Zustand)
 * ============================================
 * 
 * Sistema robusto de autenticación con JWT
 * - Token management
 * - Auto-verificación
 * - Protección de rutas
 * - Logout completo
 */

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { mockAuthServer } from '../services/mockAuthServer'

// ============================================
// TIPOS
// ============================================

interface User {
  id: string
  name: string
  email: string
  role: 'usuario' | 'negocio'
  created_at: string
}

interface AuthState {
  // Estado
  user: User | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  initialized: boolean
  
  // Métodos
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string, role: 'usuario' | 'negocio') => Promise<void>
  logout: () => void
  verifyToken: () => Promise<boolean>
  checkSession: () => Promise<void>
  
  // Helpers internos
  setToken: (token: string | null) => void
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  clearAuth: () => void
}

// ============================================
// CONFIGURACIÓN API
// ============================================

// Configuración para desarrollo local
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

// Debug: Mostrar qué URL está usando
console.log('🔗 ZAVO API URL:', API_BASE_URL)
console.log('🔗 Environment:', import.meta.env.MODE)
console.log('🔗 Development Mode - Using Mock Server')

// ============================================
// TOKEN MANAGEMENT
// ============================================

const TOKEN_KEY = 'zavo_auth_token'

const getStoredToken = (): string | null => {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

const setStoredToken = (token: string | null): void => {
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token)
    } else {
      localStorage.removeItem(TOKEN_KEY)
    }
  } catch (error) {
    console.error('Error managing token:', error)
  }
}

const clearStoredToken = (): void => {
  try {
    localStorage.removeItem(TOKEN_KEY)
  } catch (error) {
    console.error('Error clearing token:', error)
  }
}

// ============================================
// API CALLS
// ============================================

const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const token = getStoredToken()
  const fullUrl = `${API_BASE_URL}${endpoint}`
  
  // DEBUG: Mostrar URL completa
  console.log('🌐 API CALL - Full URL:', fullUrl)
  console.log('🌐 API CALL - Base URL:', API_BASE_URL)
  console.log('🌐 API CALL - Endpoint:', endpoint)
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  }

  const response = await fetch(fullUrl, config)
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`)
  }
  
  return response.json()
}

// ============================================
// ZUSTAND STORE
// ============================================

export const useAuthStore = create<AuthState>()(
  devtools(
    (set, get) => ({
      // Estado inicial
      user: null,
      token: getStoredToken(),
      isAuthenticated: false,
      loading: false,
      initialized: false,

      // ============================================
      // SETTERS INTERNOS
      // ============================================

      setToken: (token: string | null) => {
        setStoredToken(token)
        set({ 
          token,
          isAuthenticated: !!token 
        })
      },

      setUser: (user: User | null) => {
        set({ 
          user,
          isAuthenticated: !!user && !!get().token
        })
      },

      setLoading: (loading: boolean) => {
        set({ loading })
      },

      clearAuth: () => {
        clearStoredToken()
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          loading: false
        })
      },

      // ============================================
      // LOGIN
      // ============================================

      login: async (email: string, password: string) => {
        try {
          set({ loading: true })

          // Usar mock server en desarrollo
          console.log('🔗 Login URL:', API_BASE_URL + '/auth/login')
          console.log('📤 LOGIN DATA:', { email, password: '***' })
          
          const response = import.meta.env.DEV
            ? await mockAuthServer.login(email, password)
            : await apiCall('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password }),
              })

          const { user, token } = response

          // Validar y limpiar datos del usuario
          const cleanUser = {
            ...user,
            name: user.name || 'Usuario',
            email: user.email || '',
            created_at: user.created_at || new Date().toISOString(),
            role: user.role || 'usuario'
          }

          // Guardar token y usuario
          get().setToken(token)
          get().setUser(cleanUser)

          console.log('✅ Login exitoso:', cleanUser.name)
          
        } catch (error: any) {
          console.error('❌ Login error:', error.message)
          get().clearAuth()
          throw new Error(error.message || 'Error al iniciar sesión')
        } finally {
          set({ loading: false })
        }
      },

      // ============================================
      // REGISTER
      // ============================================

      register: async (email: string, password: string, name: string, role: 'usuario' | 'negocio') => {
        try {
          set({ loading: true })

          // Usar mock server en desarrollo
          const response = import.meta.env.DEV
            ? await mockAuthServer.register(email, password, name, role)
            : await apiCall('/auth/register', {
                method: 'POST',
                body: JSON.stringify({ email, password, name, role }),
              })

          const { user, token } = response

          // Validar y limpiar datos del usuario
          const cleanUser = {
            ...user,
            name: user.name || 'Usuario',
            email: user.email || '',
            created_at: user.created_at || new Date().toISOString(),
            role: user.role || 'usuario'
          }

          // Guardar token y usuario
          get().setToken(token)
          get().setUser(cleanUser)

          console.log('✅ Registro exitoso:', cleanUser.name)
          
        } catch (error: any) {
          console.error('❌ Register error:', error.message)
          get().clearAuth()
          throw new Error(error.message || 'Error al crear la cuenta')
        } finally {
          set({ loading: false })
        }
      },

      // ============================================
      // VERIFY TOKEN
      // ============================================

      verifyToken: async (): Promise<boolean> => {
        const token = get().token
        
        if (!token) {
          get().clearAuth()
          return false
        }

        try {
          // Usar mock server en desarrollo
          const response = import.meta.env.DEV
            ? await mockAuthServer.verify(token)
            : await apiCall('/auth/verify')
            
          const { user } = response

          // Validar y limpiar datos del usuario
          const cleanUser = {
            ...user,
            name: user.name || 'Usuario',
            email: user.email || '',
            created_at: user.created_at || new Date().toISOString(),
            role: user.role || 'usuario'
          }

          get().setUser(cleanUser)
          return true
          
        } catch (error: any) {
          console.error('❌ Token verification failed:', error.message)
          get().clearAuth()
          return false
        }
      },

      // ============================================
      // CHECK SESSION
      // ============================================

      checkSession: async () => {
        try {
          set({ loading: true })
          
          const isValid = await get().verifyToken()
          
          if (!isValid) {
            get().clearAuth()
          }
          
        } catch (error) {
          console.error('❌ Session check error:', error)
          get().clearAuth()
        } finally {
          set({ 
            loading: false,
            initialized: true 
          })
        }
      },

      // ============================================
      // LOGOUT
      // ============================================

      logout: () => {
        console.log('🚪 Cerrando sesión...')
        
        // Limpiar todo inmediatamente
        get().clearAuth()
        
        // Opcional: notificar al backend (no bloqueante)
        apiCall('/auth/logout', { method: 'POST' })
          .catch(error => console.warn('Logout API call failed:', error))
        
        console.log('✅ Sesión cerrada completamente')
      },

    }),
    {
      name: 'zavo-auth-store',
    }
  )
)
