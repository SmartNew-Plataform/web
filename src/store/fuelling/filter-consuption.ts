import { FilterFormData } from '@/app/(app)/abastecimento/consumo/header'
import { create } from 'zustand'

interface FilterProps {
  filters: FilterFormData | undefined
  setFilter: (data: FilterFormData) => void
}

export const useFilterConsuption = create<FilterProps>((set) => {
  return {
    filters: undefined,
    setFilter: (data) => set({ filters: data }),
  }
})
