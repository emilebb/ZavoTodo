import { create } from 'zustand'
import { apiService } from '../services/apiService'
import { User, AuthState } from '../types'
import { Alert } from 'react-native'

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
      
      Alert.alert('¡Bienvenido!', `Hola ${user.nombre}, bienvenido a ZAVO`)
    } catch (error: any) {
      console.error('Login error:', error)
      Alert.alert('Error', error.message || 'Error al iniciar sesión')
      set({ loading: false })
      throw error
    }
  },

  register: async (email: string, password: string, nombre: string, rol: 'usuario' | 'negocio') => {
    try {
      set({ loading: true })
      
      const user = await apiService.register(email, password, nombre, rol)
      set({ user, loading: false })
      
      Alert.alert('¡Cuenta creada!', 'Tu cuenta ha sido creada exitosamente')
    } catch (error: any) {
      console.error('Register error:', error)
      Alert.alert('Error', error.message || 'Error al crear la cuenta')
      set({ loading: false })
      throw error
    }
  },

  logout: async () => {
    try {
      set({ loading: true })
      await apiService.logout()
      set({ user: null, loading: false })
      
      Alert.alert('Sesión cerrada', 'Has cerrado sesión exitosamente')
    } catch (error: any) {
      console.error('Logout error:', error)
      Alert.alert('Error', 'Error al cerrar sesión')
      set({ loading: false })
    }
  },

  checkSession: async () => {
    try {
      set({ loading: true })
      
      const user = await apiService.getCurrentUser()
      set({ user, loading: false, initialized: true })
    } catch (error: any) {
      console.error('Session check error:', error)
      set({ user: null, loading: false, initialized: true })
    }
  },
}))
