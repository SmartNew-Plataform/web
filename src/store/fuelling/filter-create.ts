import { FilterTankData } from '@/app/(app)/abastecimento/create/tank/header'
import { create } from 'zustand'

interface FilterProps {
  filters: FilterTankData | undefined
  setFilter: (data: FilterTankData) => void
}

export const useFilterCreateTank = create<FilterProps>((set) => {
  return {
    filters: undefined,
    setFilter: (data) => set({ filters: data }),
  }
})
