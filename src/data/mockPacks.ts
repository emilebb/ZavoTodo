/**
 * ============================================
 * ZAVO - Mock Packs Data
 * ============================================
 * 
 * Datos de prueba para packs de comida
 */

import { Pack, Business } from '../types'

const mockBusinesses: Business[] = [
  {
    id: 'b1',
    user_id: 'u1',
    nombre: 'Panadería San José',
    descripcion: 'Panadería artesanal con productos frescos diarios',
    direccion: 'Calle 85 #15-20, Bogotá',
    categoria: 'panaderia',
    lat: 4.6751,
    lng: -74.0621,
    horario: '6:00 AM - 8:00 PM',
    imagen: undefined,
    rating: 4.8,
    verificado: true,
    activo: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'b2',
    user_id: 'u2',
    nombre: 'Restaurante El Buen Sabor',
    descripcion: 'Comida casera y platos gourmet',
    direccion: 'Carrera 13 #93-40, Bogotá',
    categoria: 'restaurante',
    lat: 4.6782,
    lng: -74.0565,
    horario: '11:00 AM - 10:00 PM',
    imagen: undefined,
    rating: 4.6,
    verificado: true,
    activo: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'b3',
    user_id: 'u3',
    nombre: 'Cafetería Aroma',
    descripcion: 'Café premium y postres artesanales',
    direccion: 'Zona Rosa, Calle 82 #12-15, Bogotá',
    categoria: 'cafe',
    lat: 4.6698,
    lng: -74.0598,
    horario: '7:00 AM - 9:00 PM',
    imagen: undefined,
    rating: 4.9,
    verificado: true,
    activo: true,
    created_at: new Date().toISOString()
  }
]

export const mockPacks: Pack[] = [
  {
    id: '1',
    business_id: 'b1',
    titulo: 'Pack Sorpresa Panadería',
    descripcion: 'Deliciosos panes y pasteles del día anterior con 60% de descuento',
    categoria: 'panaderia',
    precio_original: 25000,
    precio_descuento: 10000,
    porcentaje_descuento: 60,
    stock: 5,
    hora_retiro_desde: '18:00',
    hora_retiro_hasta: '20:00',
    activo: true,
    imagen_url: undefined,
    created_at: new Date().toISOString(),
    business: mockBusinesses[0]
  },
  {
    id: '2',
    business_id: 'b2',
    titulo: 'Pack Gourmet Restaurante',
    descripcion: 'Platos gourmet preparados con ingredientes frescos, perfectos para llevar',
    categoria: 'restaurante',
    precio_original: 45000,
    precio_descuento: 18000,
    porcentaje_descuento: 60,
    stock: 3,
    hora_retiro_desde: '19:00',
    hora_retiro_hasta: '21:00',
    activo: true,
    imagen_url: undefined,
    created_at: new Date().toISOString(),
    business: mockBusinesses[1]
  },
  {
    id: '3',
    business_id: 'b3',
    titulo: 'Pack Café y Postres',
    descripcion: 'Café premium y postres artesanales del día, perfectos para la tarde',
    categoria: 'cafe',
    precio_original: 18000,
    precio_descuento: 7200,
    porcentaje_descuento: 60,
    stock: 8,
    hora_retiro_desde: '17:00',
    hora_retiro_hasta: '20:00',
    activo: true,
    imagen_url: undefined,
    created_at: new Date().toISOString(),
    business: mockBusinesses[2]
  }
]

// Función para obtener packs filtrados
export const getFilteredPacks = (filters: {
  searchText?: string
  categoria?: string
  activo?: boolean
}) => {
  let filteredPacks = [...mockPacks]

  if (filters.activo !== undefined) {
    filteredPacks = filteredPacks.filter(pack => pack.activo === filters.activo)
  }

  if (filters.categoria) {
    filteredPacks = filteredPacks.filter(pack => pack.categoria === filters.categoria)
  }

  if (filters.searchText) {
    const searchLower = filters.searchText.toLowerCase()
    filteredPacks = filteredPacks.filter(pack => 
      pack.titulo.toLowerCase().includes(searchLower) ||
      pack.descripcion.toLowerCase().includes(searchLower) ||
      pack.business?.nombre.toLowerCase().includes(searchLower)
    )
  }

  return filteredPacks
}
