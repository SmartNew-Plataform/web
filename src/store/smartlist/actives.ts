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
  images: string[] | undefined
  equipmentId: number | undefined

  setSelects: (data: ActiveStoreData['selects']) => void
  setImages: (images: string[] | undefined) => void
  setEquipmentId: (id: number | undefined) => void
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
    images: undefined,
    equipmentId: undefined,

    setSelects(data) {
      set({ selects: { ...data } })
    },

    setImages(images) {
      set({ images })
    },

    setEquipmentId(id) {
      set({ equipmentId: id })
    },
  }
})
