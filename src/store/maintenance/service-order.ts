import { SelectData } from '@/@types/select-data'
import { create } from 'zustand'

type BranchData = {
  branch: SelectData
} & SelectData

interface ServiceOrderStoreData {
  selects: {
    equipment?: BranchData[] | undefined
    branch?: SelectData[] | undefined
    typeMaintenance?: SelectData[] | undefined
    maintenanceSector: SelectData[] | undefined
    requester: SelectData[] | undefined
    status: SelectData[] | undefined
  }

  setSelects: (data: ServiceOrderStoreData['selects']) => void
}

export const useServiceOrder = create<ServiceOrderStoreData>((set) => {
  return {
    selects: {
      branch: undefined,
      equipment: undefined,
      typeMaintenance: undefined,
      maintenanceSector: undefined,
      requester: undefined,
      status: undefined,
    },

    setSelects(data) {
      set({ selects: { ...data } })
    },
  }
})
