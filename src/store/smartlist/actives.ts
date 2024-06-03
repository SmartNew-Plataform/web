import { Component } from '@/@types/active'
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
    typeEquipment?: SelectData[] | undefined
  }
  images: string[] | undefined
  equipmentId: number | undefined
  components: Component[] | undefined
  qrCodeEquipments: string[] | undefined

  setSelects: (data: ActiveStoreData['selects']) => void
  setImages: (images: string[] | undefined) => void
  setEquipmentId: (id: number | undefined) => void
  setComponents: (components: Component[] | undefined) => void
  setQrCodeEquipments: (equipments: string[] | undefined) => void
  removeComponent: (componentId: number) => void
  addComponent: (component: Component) => void
}

export const useActives = create<ActiveStoreData>((set, get) => {
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
    components: undefined,
    qrCodeEquipments: undefined,

    setSelects(data) {
      set({ selects: { ...data } })
    },

    setEquipmentId(id) {
      set({ equipmentId: id })
    },

    setImages(images) {
      set({ images })
    },

    setQrCodeEquipments(equipments) {
      set({ qrCodeEquipments: equipments })
    },

    setComponents(components) {
      set({ components })
    },

    removeComponent(componentId) {
      const components = get().components?.filter(
        ({ id }) => id !== componentId,
      )

      set({ components })
    },

    addComponent(component) {
      const components = get().components
      components?.push(component)

      set({ components })
    },
  }
})
