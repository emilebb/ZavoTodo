import { create } from 'zustand'
import { FilterState } from '../types'

interface FilterStore extends FilterState {
  setSearchText: (text: string) => void
  setCategoria: (categoria: string) => void
  setRadio: (radio: number) => void
  setUbicacion: (ubicacion: { lat: number; lng: number } | null) => void
  resetFilters: () => void
}

export const useFilterStore = create<FilterStore>((set) => ({
  searchText: '',
  categoria: '',
  radio: 5, // 5km default
  ubicacion: null,

  setSearchText: (searchText) => set({ searchText }),
  setCategoria: (categoria) => set({ categoria }),
  setRadio: (radio) => set({ radio }),
  setUbicacion: (ubicacion) => set({ ubicacion }),
  resetFilters: () => set({
    searchText: '',
    categoria: '',
    radio: 5,
    ubicacion: null,
  }),
}))
