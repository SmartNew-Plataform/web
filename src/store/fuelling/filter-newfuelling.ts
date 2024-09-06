import { FuellingFilteFormData } from '@/app/(app)/abastecimento/new-fuelling/header'
import { create } from 'zustand'

interface FilterProps {
  filters: FuellingFilteFormData | undefined
  setFilter: (data: FuellingFilteFormData) => void
}

export const useFilterFuelling = create<FilterProps>((set) => {
  return {
    filters: undefined,
    setFilter: (data) => set({ filters: data }),
  }
})
