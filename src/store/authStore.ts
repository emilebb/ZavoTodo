import { create } from 'zustand'
import { apiService } from '../services/apiService'
import { User, AuthState } from '../types'
import toast from 'react-hot-toast'

interface AuthStore extends AuthState {
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, nombre: string, rol: 'usuario' | 'negocio') => Promise<void>
  logout: () => Promise<void>
  checkSession: () => Promise<void>
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  loading: false,
  initialized: false,

  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),

  login: async (email: string, password: string) => {
    try {
      set({ loading: true })
      
      const user = await apiService.login(email, password)
      set({ user, loading: false })
      toast.success('¡Bienvenido a ZAVO!')
    } catch (error: any) {
      console.error('Login error:', error)
      toast.error(error.message || 'Error al iniciar sesión')
      set({ loading: false })
      throw error
    }
  },

  register: async (email: string, password: string, nombre: string, rol: 'usuario' | 'negocio') => {
    try {
      set({ loading: true })
      
      const user = await apiService.register(email, password, nombre, rol)
      set({ user, loading: false })
      toast.success('¡Cuenta creada exitosamente!')
    } catch (error: any) {
      console.error('Register error:', error)
      toast.error(error.message || 'Error al crear la cuenta')
      set({ loading: false })
      throw error
    }
  },

  logout: async () => {
    try {
      set({ loading: true })
      await apiService.logout()
      set({ user: null, loading: false })
      toast.success('Sesión cerrada')
    } catch (error: any) {
      console.error('Logout error:', error)
      toast.error('Error al cerrar sesión')
      set({ loading: false })
    }
  },

  checkSession: async () => {
    try {
      set({ loading: true })
      
      const user = apiService.getCurrentUser()
      set({ user, loading: false, initialized: true })
    } catch (error: any) {
      console.error('Session check error:', error)
      set({ user: null, loading: false, initialized: true })
    }
  },
}))
