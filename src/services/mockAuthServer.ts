/**
 * ============================================
 * ZAVO - Mock Auth Server
 * ============================================
 * 
 * Servidor mock para testing del sistema de autenticación
 * Simula las respuestas del backend real
 */

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

interface AuthResponse {
  user: User
  token: string
}

// ============================================
// STORAGE MOCK
// ============================================

const USERS_KEY = 'zavo_mock_users'
const TOKENS_KEY = 'zavo_mock_tokens'

const getUsers = (): User[] => {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
  } catch {
    return []
  }
}

const saveUsers = (users: User[]): void => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

const getTokens = (): Record<string, User> => {
  try {
    return JSON.parse(localStorage.getItem(TOKENS_KEY) || '{}')
  } catch {
    return {}
  }
}

const saveTokens = (tokens: Record<string, User>): void => {
  localStorage.setItem(TOKENS_KEY, JSON.stringify(tokens))
}

// ============================================
// UTILIDADES
// ============================================

const generateToken = (): string => {
  return 'mock_token_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now()
}

const generateId = (): string => {
  return 'user_' + Math.random().toString(36).substr(2, 9)
}

const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// ============================================
// MOCK API ENDPOINTS
// ============================================

export const mockAuthServer = {
  
  // ============================================
  // REGISTER
  // ============================================
  
  async register(email: string, password: string, name: string, role: 'usuario' | 'negocio'): Promise<AuthResponse> {
    await delay(800) // Simular latencia de red
    
    const users = getUsers()
    
    // Verificar si el usuario ya existe
    if (users.find(u => u.email === email)) {
      throw new Error('Este email ya está registrado')
    }
    
    // Validaciones
    if (!email || !email.includes('@')) {
      throw new Error('Email inválido')
    }
    
    if (!password || password.length < 6) {
      throw new Error('La contraseña debe tener al menos 6 caracteres')
    }
    
    if (!name || name.trim().length < 2) {
      throw new Error('El nombre debe tener al menos 2 caracteres')
    }
    
    // Crear usuario
    const user: User = {
      id: generateId(),
      name: name.trim(),
      email: email.toLowerCase(),
      role,
      created_at: new Date().toISOString()
    }
    
    // Guardar usuario
    users.push(user)
    saveUsers(users)
    
    // Generar token
    const token = generateToken()
    const tokens = getTokens()
    tokens[token] = user
    saveTokens(tokens)
    
    console.log('✅ Mock Register:', user.name)
    
    return { user, token }
  },
  
  // ============================================
  // LOGIN
  // ============================================
  
  async login(email: string, password: string): Promise<AuthResponse> {
    await delay(600) // Simular latencia de red
    
    const users = getUsers()
    
    // Buscar usuario
    const user = users.find(u => u.email === email.toLowerCase())
    
    if (!user) {
      throw new Error('Usuario no encontrado')
    }
    
    // En un servidor real, aquí verificarías la contraseña hasheada
    // Por simplicidad, aceptamos cualquier contraseña para usuarios existentes
    if (!password) {
      throw new Error('Contraseña requerida')
    }
    
    // Generar nuevo token
    const token = generateToken()
    const tokens = getTokens()
    tokens[token] = user
    saveTokens(tokens)
    
    console.log('✅ Mock Login:', user.name)
    
    return { user, token }
  },
  
  // ============================================
  // VERIFY TOKEN
  // ============================================
  
  async verify(token: string): Promise<{ user: User }> {
    await delay(300) // Simular latencia de red
    
    const tokens = getTokens()
    const user = tokens[token]
    
    if (!user) {
      throw new Error('Token inválido o expirado')
    }
    
    console.log('✅ Mock Verify:', user.name)
    
    return { user }
  },
  
  // ============================================
  // LOGOUT
  // ============================================
  
  async logout(token: string): Promise<void> {
    await delay(200) // Simular latencia de red
    
    const tokens = getTokens()
    delete tokens[token]
    saveTokens(tokens)
    
    console.log('✅ Mock Logout')
  },
  
  // ============================================
  // UTILIDADES DE DESARROLLO
  // ============================================
  
  // Crear usuarios de prueba
  seedTestUsers(): void {
    const users: User[] = [
      {
        id: 'user_test_1',
        name: 'Usuario Test',
        email: 'usuario@test.com',
        role: 'usuario',
        created_at: new Date().toISOString()
      },
      {
        id: 'user_test_2', 
        name: 'Negocio Test',
        email: 'negocio@test.com',
        role: 'negocio',
        created_at: new Date().toISOString()
      }
    ]
    
    saveUsers(users)
    console.log('✅ Test users created:', users)
  },
  
  // Limpiar datos de prueba
  clearTestData(): void {
    localStorage.removeItem(USERS_KEY)
    localStorage.removeItem(TOKENS_KEY)
    console.log('✅ Test data cleared')
  },
  
  // Ver datos actuales
  getTestData(): { users: User[], tokens: Record<string, User> } {
    return {
      users: getUsers(),
      tokens: getTokens()
    }
  }
}

// ============================================
// AUTO-SEED EN DESARROLLO
// ============================================

if (import.meta.env.DEV) {
  // Crear usuarios de prueba automáticamente en desarrollo
  const users = getUsers()
  if (users.length === 0) {
    mockAuthServer.seedTestUsers()
  }
}
