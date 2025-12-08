/**
 * ============================================
 * ZAVO - Auth Store (Zustand)
 * ============================================
 * 
 * Sistema robusto de autenticación con:
 * - Firebase Auth (producción)
 * - Mock local (desarrollo)
 * - Token management
 * - Auto-verificación
 * - Protección de rutas
 */

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db, isFirebaseConfigured } from '../lib/firebase'

// ============================================
// TIPOS
// ============================================

interface User {
  id: string
  name?: string
  nombre?: string  // Para compatibilidad
  email: string
  phone?: string
  role?: 'usuario' | 'negocio'
  rol?: string     // Para compatibilidad
  created_at?: string
  verified?: boolean
  active?: boolean
  // Campos adicionales para negocios
  businessName?: string
  address?: string
  category?: string
}

interface AuthState {
  // Estado
  user: User | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  initialized: boolean
  
  // Métodos
  login: (email: string, password: string) => Promise<any>
  register: (email: string, password: string, name: string, role: 'usuario' | 'negocio') => Promise<any>
  logout: () => Promise<void>
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
        console.log('🔗 Login iniciado para:', email)
        console.log('� Firebase configurado:', isFirebaseConfigured())
        
        set({ loading: true })

        try {
          // ============================================
          // MODO DESARROLLO: Mock local
          // ============================================
          if (import.meta.env.MODE === 'development' && !isFirebaseConfigured()) {
            console.log('🧪 Usando autenticación MOCK (desarrollo)')
            
            // Simular delay de red
            await new Promise(resolve => setTimeout(resolve, 500))
            
            // Credenciales mock
            const mockUsers = [
              { email: 'usuario@demo.com', password: '123456', name: 'Usuario Demo', role: 'usuario' },
              { email: 'negocio@demo.com', password: '123456', name: 'Negocio Demo', role: 'negocio' },
              { email: 'test@zavo.com', password: 'password', name: 'Test User', role: 'usuario' }
            ]
            
            const user = mockUsers.find(u => u.email === email && u.password === password)
            
            if (user) {
              const mockResponse = {
                token: 'mock_jwt_token_' + Date.now(),
                user: {
                  id: 'user_' + Math.random().toString(36).substr(2, 9),
                  email: user.email,
                  name: user.name,
                  nombre: user.name,
                  role: user.role as 'usuario' | 'negocio',
                  rol: user.role,
                  verified: true,
                  active: true,
                  created_at: new Date().toISOString()
                }
              }
              
              setStoredToken(mockResponse.token)
              set({ user: mockResponse.user, loading: false, isAuthenticated: true })
              
              console.log('✅ Login exitoso (MOCK):', mockResponse.user.name)
              return mockResponse
            } else {
              throw new Error('Credenciales inválidas')
            }
          }
          
          // ============================================
          // MODO PRODUCCIÓN: Firebase Auth real
          // ============================================
          console.log('🔥 Usando Firebase Auth (producción)')
          
          // Login con Firebase
          const userCredential = await signInWithEmailAndPassword(auth, email, password)
          const firebaseUser = userCredential.user
          
          // Obtener token
          const token = await firebaseUser.getIdToken()
          setStoredToken(token)
          
          // Obtener datos adicionales de Firestore
          let userData: any = {
            id: firebaseUser.uid,
            email: firebaseUser.email || email,
            name: firebaseUser.displayName || 'Usuario',
            nombre: firebaseUser.displayName || 'Usuario',
            role: 'usuario',
            rol: 'usuario',
            verified: firebaseUser.emailVerified,
            active: true,
            created_at: firebaseUser.metadata.creationTime || new Date().toISOString()
          }
          
          // Intentar obtener datos extendidos de Firestore
          try {
            const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
            if (userDoc.exists()) {
              const firestoreData = userDoc.data()
              userData = {
                ...userData,
                ...firestoreData,
                id: firebaseUser.uid,
                email: firebaseUser.email || email
              }
            }
          } catch (firestoreError) {
            console.warn('⚠️ No se pudo obtener datos de Firestore:', firestoreError)
          }
          
          set({ user: userData, loading: false, isAuthenticated: true })
          
          console.log('✅ Login exitoso (Firebase):', userData.name || userData.nombre)
          return { token, user: userData }
          
        } catch (error: any) {
          console.error('❌ Login error:', error.message)
          
          // Traducir errores de Firebase
          let errorMessage = 'Error al iniciar sesión'
          if (error.code === 'auth/user-not-found') {
            errorMessage = 'Usuario no encontrado'
          } else if (error.code === 'auth/wrong-password') {
            errorMessage = 'Contraseña incorrecta'
          } else if (error.code === 'auth/invalid-email') {
            errorMessage = 'Email inválido'
          } else if (error.code === 'auth/too-many-requests') {
            errorMessage = 'Demasiados intentos. Intenta más tarde'
          } else if (error.message) {
            errorMessage = error.message
          }
          
          get().clearAuth()
          throw new Error(errorMessage)
        } finally {
          set({ loading: false })
        }
      },

      // ============================================
      // REGISTER
      // ============================================

      register: async (email: string, password: string, name: string, role: 'usuario' | 'negocio') => {
        console.log('📝 Registro iniciado para:', email)
        console.log('🔧 Firebase configurado:', isFirebaseConfigured())
        
        try {
          set({ loading: true })

          // ============================================
          // MODO DESARROLLO: Mock local
          // ============================================
          if (import.meta.env.MODE === 'development' && !isFirebaseConfigured()) {
            console.log('🧪 Usando registro MOCK (desarrollo)')
            
            await new Promise(resolve => setTimeout(resolve, 500))
            
            const mockUser = {
              id: 'user_' + Math.random().toString(36).substr(2, 9),
              email,
              name,
              nombre: name,
              role,
              rol: role,
              verified: false,
              active: true,
              created_at: new Date().toISOString()
            }
            
            const mockToken = 'mock_jwt_token_' + Date.now()
            setStoredToken(mockToken)
            set({ user: mockUser, loading: false, isAuthenticated: true })
            
            console.log('✅ Registro exitoso (MOCK):', name)
            return { token: mockToken, user: mockUser }
          }

          // ============================================
          // MODO PRODUCCIÓN: Firebase Auth real
          // ============================================
          console.log('🔥 Usando Firebase Auth (producción)')
          
          // Crear usuario en Firebase Auth
          const userCredential = await createUserWithEmailAndPassword(auth, email, password)
          const firebaseUser = userCredential.user
          
          // Actualizar perfil con nombre
          await updateProfile(firebaseUser, { displayName: name })
          
          // Obtener token
          const token = await firebaseUser.getIdToken()
          setStoredToken(token)
          
          // Crear documento en Firestore
          const userData = {
            id: firebaseUser.uid,
            email: firebaseUser.email || email,
            name,
            nombre: name,
            role,
            rol: role,
            verified: false,
            active: true,
            created_at: new Date().toISOString()
          }
          
          // Guardar en Firestore
          try {
            await setDoc(doc(db, 'users', firebaseUser.uid), userData)
            console.log('📄 Usuario guardado en Firestore')
          } catch (firestoreError) {
            console.warn('⚠️ Error guardando en Firestore:', firestoreError)
          }
          
          set({ user: userData, loading: false, isAuthenticated: true })
          
          console.log('✅ Registro exitoso (Firebase):', name)
          return { token, user: userData }
          
        } catch (error: any) {
          console.error('❌ Register error:', error.message)
          
          // Traducir errores de Firebase
          let errorMessage = 'Error al crear la cuenta'
          if (error.code === 'auth/email-already-in-use') {
            errorMessage = 'Este email ya está registrado'
          } else if (error.code === 'auth/weak-password') {
            errorMessage = 'La contraseña es muy débil (mínimo 6 caracteres)'
          } else if (error.code === 'auth/invalid-email') {
            errorMessage = 'Email inválido'
          } else if (error.message) {
            errorMessage = error.message
          }
          
          get().clearAuth()
          throw new Error(errorMessage)
        } finally {
          set({ loading: false })
        }
      },

      // ============================================
      // VERIFY TOKEN
      // ============================================

      verifyToken: async (): Promise<boolean> => {
        const token = get().token
        const currentUser = get().user
        
        if (!token) {
          get().clearAuth()
          return false
        }

        try {
          // ============================================
          // MOCK LOCAL: Token mock válido
          // ============================================
          if (token.startsWith('mock_jwt_token_') && currentUser) {
            console.log('✅ Token válido (MOCK)')
            return true
          }
          
          // ============================================
          // FIREBASE: Verificar con Firebase Auth
          // ============================================
          if (isFirebaseConfigured() && auth.currentUser) {
            // Verificar que el token no haya expirado
            try {
              await auth.currentUser.getIdToken(true) // Force refresh
              console.log('✅ Token válido (Firebase)')
              return true
            } catch (firebaseError) {
              console.warn('⚠️ Token de Firebase expirado')
              throw new Error('Token expirado')
            }
          }
          
          // Si llegamos aquí sin usuario de Firebase, verificar si hay usuario en estado
          if (currentUser && token) {
            console.log('✅ Token válido (estado local)')
            return true
          }
          
          throw new Error('Token inválido')
          
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

      logout: async () => {
        console.log('🚪 Cerrando sesión...')
        
        // Limpiar estado local inmediatamente
        get().clearAuth()
        
        // Cerrar sesión en Firebase si está configurado
        if (isFirebaseConfigured()) {
          try {
            await signOut(auth)
            console.log('✅ Sesión cerrada en Firebase')
          } catch (error) {
            console.warn('⚠️ Error cerrando sesión en Firebase:', error)
          }
        }
        
        console.log('✅ Sesión cerrada completamente')
      },

    }),
    {
      name: 'zavo-auth-store',
    }
  )
)
