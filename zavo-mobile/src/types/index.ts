export type UserRole = 'usuario' | 'negocio'

export type OrderStatus = 'pendiente' | 'confirmado' | 'recogido' | 'cancelado'

export interface User {
  id: string
  email: string
  nombre: string
  rol: UserRole
  created_at: string
}

export interface Business {
  id: string
  user_id: string
  nombre: string
  direccion: string
  lat: number
  lng: number
  horario: string
  imagen?: string
  created_at: string
}

export interface Pack {
  id: string
  business_id: string
  titulo: string
  descripcion: string
  precio_original: number
  precio_descuento: number
  porcentaje_descuento: number
  stock: number
  hora_retiro_desde: string
  hora_retiro_hasta: string
  activo: boolean
  created_at: string
  business?: Business
}

export interface Order {
  id: string
  user_id: string
  pack_id: string
  estado: OrderStatus
  qr_code: string
  created_at: string
  pack?: Pack
  user?: User
}

export interface AuthState {
  user: User | null
  loading: boolean
  initialized: boolean
}

export interface UIState {
  loading: boolean
  theme: 'light' | 'dark'
}

export interface FilterState {
  searchText: string
  categoria: string
  radio: number
  ubicacion: {
    lat: number
    lng: number
  } | null
}
