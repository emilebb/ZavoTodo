import { apiService } from './apiService'
import { User, Business, Pack, Order } from '../types'

// Alias para mantener compatibilidad con el código existente
export const supabaseService = {
  // Users
  async getCurrentUser(): Promise<User | null> {
    return apiService.getCurrentUser()
  },

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    return apiService.updateUser(id, updates)
  },

  // Businesses
  async getBusinessByUserId(userId: string): Promise<Business | null> {
    return apiService.getBusinessByUserId(userId)
  },

  async createBusiness(business: Omit<Business, 'id' | 'created_at'>): Promise<Business> {
    return apiService.createBusiness(business)
  },

  async updateBusiness(id: string, updates: Partial<Business>): Promise<Business> {
    return apiService.updateBusiness(id, updates)
  },

  // Packs
  async getPacks(filters?: {
    searchText?: string
    businessId?: string
    activo?: boolean
  }): Promise<Pack[]> {
    return apiService.getPacks(filters)
  },

  async getPackById(id: string): Promise<Pack | null> {
    return apiService.getPackById(id)
  },

  async createPack(pack: Omit<Pack, 'id' | 'created_at' | 'business'>): Promise<Pack> {
    return apiService.createPack(pack)
  },

  async updatePack(id: string, updates: Partial<Pack>): Promise<Pack> {
    return apiService.updatePack(id, updates)
  },

  async deletePack(id: string): Promise<void> {
    return apiService.deletePack(id)
  },

  // Orders
  async getOrders(filters?: {
    userId?: string
    businessId?: string
    packId?: string
  }): Promise<Order[]> {
    return apiService.getOrders(filters)
  },

  async getOrderById(id: string): Promise<Order | null> {
    return apiService.getOrderById(id)
  },

  async createOrder(order: Omit<Order, 'id' | 'created_at' | 'pack' | 'user'>): Promise<Order> {
    return apiService.createOrder(order)
  },

  async updateOrder(id: string, updates: Partial<Order>): Promise<Order> {
    return apiService.updateOrder(id, updates)
  },
}
