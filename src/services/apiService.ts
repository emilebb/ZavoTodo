import { User, Business, Pack, Order } from '../types'

const API_BASE_URL = 'http://localhost:3001'

// Simulación de autenticación local
const AUTH_KEY = 'zavo_auth'
const getCurrentUser = (): User | null => {
  const stored = localStorage.getItem(AUTH_KEY)
  return stored ? JSON.parse(stored) : null
}

const setCurrentUser = (user: User | null) => {
  if (user) {
    localStorage.setItem(AUTH_KEY, JSON.stringify(user))
  } else {
    localStorage.removeItem(AUTH_KEY)
  }
}

// Utilidades HTTP
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  const response = await fetch(url, config)
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

export const apiService = {
  // ===== AUTENTICACIÓN =====
  async login(email: string, _password: string): Promise<User> {
    // Simulación de login - en producción esto sería más seguro
    const users = await apiRequest('/users')
    const user = users.find((u: User) => u.email === email)
    
    if (!user) {
      throw new Error('Usuario no encontrado')
    }
    
    // En un sistema real, verificarías la contraseña
    setCurrentUser(user)
    return user
  },

  async register(email: string, _password: string, nombre: string, rol: 'usuario' | 'negocio'): Promise<User> {
    // Verificar si el usuario ya existe
    const users = await apiRequest('/users')
    const existingUser = users.find((u: User) => u.email === email)
    
    if (existingUser) {
      throw new Error('El usuario ya existe')
    }

    // Crear nuevo usuario
    const newUser: Omit<User, 'id'> = {
      email,
      nombre,
      rol,
      created_at: new Date().toISOString()
    }

    const user = await apiRequest('/users', {
      method: 'POST',
      body: JSON.stringify(newUser)
    })

    setCurrentUser(user)
    return user
  },

  async logout(): Promise<void> {
    setCurrentUser(null)
  },

  getCurrentUser,

  // ===== USUARIOS =====
  async getUser(id: string): Promise<User> {
    return apiRequest(`/users/${id}`)
  },

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    return apiRequest(`/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates)
    })
  },

  // ===== NEGOCIOS =====
  async getBusinesses(): Promise<Business[]> {
    return apiRequest('/businesses')
  },

  async getBusinessByUserId(userId: string): Promise<Business | null> {
    const businesses = await apiRequest('/businesses')
    return businesses.find((b: Business) => b.user_id === userId) || null
  },

  async createBusiness(business: Omit<Business, 'id' | 'created_at'>): Promise<Business> {
    const newBusiness = {
      ...business,
      created_at: new Date().toISOString()
    }
    return apiRequest('/businesses', {
      method: 'POST',
      body: JSON.stringify(newBusiness)
    })
  },

  async updateBusiness(id: string, updates: Partial<Business>): Promise<Business> {
    return apiRequest(`/businesses/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates)
    })
  },

  // ===== PACKS =====
  async getPacks(filters?: {
    searchText?: string
    businessId?: string
    activo?: boolean
  }): Promise<Pack[]> {
    let packs = await apiRequest('/packs')
    
    // Aplicar filtros
    if (filters?.activo !== undefined) {
      packs = packs.filter((p: Pack) => p.activo === filters.activo)
    }
    
    if (filters?.businessId) {
      packs = packs.filter((p: Pack) => p.business_id === filters.businessId)
    }
    
    if (filters?.searchText) {
      const searchLower = filters.searchText.toLowerCase()
      packs = packs.filter((p: Pack) => 
        p.titulo.toLowerCase().includes(searchLower) ||
        p.descripcion.toLowerCase().includes(searchLower)
      )
    }

    // Agregar información del negocio
    const businesses = await apiRequest('/businesses')
    return packs.map((pack: Pack) => ({
      ...pack,
      business: businesses.find((b: Business) => b.id === pack.business_id)
    }))
  },

  async getPackById(id: string): Promise<Pack | null> {
    try {
      const pack = await apiRequest(`/packs/${id}`)
      const businesses = await apiRequest('/businesses')
      return {
        ...pack,
        business: businesses.find((b: Business) => b.id === pack.business_id)
      }
    } catch (error) {
      return null
    }
  },

  async createPack(pack: Omit<Pack, 'id' | 'created_at' | 'business'>): Promise<Pack> {
    const newPack = {
      ...pack,
      created_at: new Date().toISOString()
    }
    const createdPack = await apiRequest('/packs', {
      method: 'POST',
      body: JSON.stringify(newPack)
    })

    // Agregar información del negocio
    const businesses = await apiRequest('/businesses')
    return {
      ...createdPack,
      business: businesses.find((b: Business) => b.id === createdPack.business_id)
    }
  },

  async updatePack(id: string, updates: Partial<Pack>): Promise<Pack> {
    const updatedPack = await apiRequest(`/packs/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates)
    })

    // Agregar información del negocio
    const businesses = await apiRequest('/businesses')
    return {
      ...updatedPack,
      business: businesses.find((b: Business) => b.id === updatedPack.business_id)
    }
  },

  async deletePack(id: string): Promise<void> {
    await apiRequest(`/packs/${id}`, {
      method: 'DELETE'
    })
  },

  // ===== PEDIDOS =====
  async getOrders(filters?: {
    userId?: string
    businessId?: string
    packId?: string
  }): Promise<Order[]> {
    let orders = await apiRequest('/orders')
    
    // Aplicar filtros
    if (filters?.userId) {
      orders = orders.filter((o: Order) => o.user_id === filters.userId)
    }
    
    if (filters?.packId) {
      orders = orders.filter((o: Order) => o.pack_id === filters.packId)
    }

    // Agregar información relacionada
    const [packs, users, businesses] = await Promise.all([
      apiRequest('/packs'),
      apiRequest('/users'),
      apiRequest('/businesses')
    ])

    return orders.map((order: Order) => {
      const pack = packs.find((p: Pack) => p.id === order.pack_id)
      const user = users.find((u: User) => u.id === order.user_id)
      const business = pack ? businesses.find((b: Business) => b.id === pack.business_id) : null

      return {
        ...order,
        pack: pack ? { ...pack, business } : undefined,
        user
      }
    }).filter((order: Order) => {
      // Filtrar por business_id si se especifica
      if (filters?.businessId) {
        return order.pack?.business?.id === filters.businessId
      }
      return true
    })
  },

  async getOrderById(id: string): Promise<Order | null> {
    try {
      const order = await apiRequest(`/orders/${id}`)
      
      // Agregar información relacionada
      const [packs, users, businesses] = await Promise.all([
        apiRequest('/packs'),
        apiRequest('/users'),
        apiRequest('/businesses')
      ])

      const pack = packs.find((p: Pack) => p.id === order.pack_id)
      const user = users.find((u: User) => u.id === order.user_id)
      const business = pack ? businesses.find((b: Business) => b.id === pack.business_id) : null

      return {
        ...order,
        pack: pack ? { ...pack, business } : undefined,
        user
      }
    } catch (error) {
      return null
    }
  },

  async createOrder(order: Omit<Order, 'id' | 'created_at' | 'pack' | 'user'>): Promise<Order> {
    const newOrder = {
      ...order,
      created_at: new Date().toISOString()
    }
    
    const createdOrder = await apiRequest('/orders', {
      method: 'POST',
      body: JSON.stringify(newOrder)
    })

    // Actualizar stock del pack
    const pack = await apiRequest(`/packs/${order.pack_id}`)
    if (pack && pack.stock > 0) {
      await apiRequest(`/packs/${order.pack_id}`, {
        method: 'PATCH',
        body: JSON.stringify({ stock: pack.stock - 1 })
      })
    }

    return this.getOrderById(createdOrder.id) as Promise<Order>
  },

  async updateOrder(id: string, updates: Partial<Order>): Promise<Order> {
    await apiRequest(`/orders/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates)
    })

    return this.getOrderById(id) as Promise<Order>
  },
}
