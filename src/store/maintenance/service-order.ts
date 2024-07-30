import { SelectData } from '@/@types/select-data'
import { create } from 'zustand'

interface ServiceOrderStoreData {
  selects: {
    branch?: SelectData[] | undefined
    equipment?: SelectData[] | undefined
    typeMaintenance?: SelectData[] | undefined
  }

  setSelects: (data: ServiceOrderStoreData['selects']) => void
}

export const useServiceOrder = create<ServiceOrderStoreData>((set) => {
  return {
    selects: {
      branch: undefined,
      equipment: undefined,
      typeMaintenance: undefined,
    },

    setSelects(data) {
      set({ selects: { ...data } })
    },
  }
})
