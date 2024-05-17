import { SelectData } from '@/@types/select-data'
import { create } from 'zustand'

interface ActiveStoreData {
  selects: {
    client?: SelectData[] | undefined
    equipmentDad?: SelectData[] | undefined
    costCenter?: SelectData[] | undefined
    family?: SelectData[] | undefined
    equipmentStatus?: SelectData[] | undefined
    consumptionType?: SelectData[] | undefined
    unityMeter?: SelectData[] | undefined
    fleet?: SelectData[] | undefined
    componentStatus?: SelectData[] | undefined
  }

  setSelects: (data: ActiveStoreData['selects']) => void
}

export const useActives = create<ActiveStoreData>((set) => {
  return {
    selects: {
      client: undefined,
      equipmentDad: undefined,
      costCenter: undefined,
      family: undefined,
      equipmentStatus: undefined,
      consumptionType: undefined,
      unityMeter: undefined,
      fleet: undefined,
      componentStatus: undefined,
    },

    setSelects(data) {
      set({ selects: { ...data } })
    },
  }
})
