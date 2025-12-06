export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          nombre: string
          rol: 'usuario' | 'negocio'
          created_at: string
        }
        Insert: {
          id: string
          email: string
          nombre: string
          rol: 'usuario' | 'negocio'
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          nombre?: string
          rol?: 'usuario' | 'negocio'
          created_at?: string
        }
      }
      businesses: {
        Row: {
          id: string
          user_id: string
          nombre: string
          direccion: string
          lat: number
          lng: number
          horario: string
          imagen: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          nombre: string
          direccion: string
          lat: number
          lng: number
          horario: string
          imagen?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          nombre?: string
          direccion?: string
          lat?: number
          lng?: number
          horario?: string
          imagen?: string | null
          created_at?: string
        }
      }
      packs: {
        Row: {
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
        }
        Insert: {
          id?: string
          business_id: string
          titulo: string
          descripcion: string
          precio_original: number
          precio_descuento: number
          porcentaje_descuento: number
          stock: number
          hora_retiro_desde: string
          hora_retiro_hasta: string
          activo?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          titulo?: string
          descripcion?: string
          precio_original?: number
          precio_descuento?: number
          porcentaje_descuento?: number
          stock?: number
          hora_retiro_desde?: string
          hora_retiro_hasta?: string
          activo?: boolean
          created_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          pack_id: string
          estado: 'pendiente' | 'confirmado' | 'recogido' | 'cancelado'
          qr_code: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          pack_id: string
          estado?: 'pendiente' | 'confirmado' | 'recogido' | 'cancelado'
          qr_code: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          pack_id?: string
          estado?: 'pendiente' | 'confirmado' | 'recogido' | 'cancelado'
          qr_code?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
