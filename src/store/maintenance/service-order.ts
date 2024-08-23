import { SelectData } from '@/@types/select-data'
import { api } from '@/lib/api'
import { create } from 'zustand'

type EquipmentData = {
  branch: SelectData
} & SelectData

interface ServiceOrderStoreData {
  selects: {
    equipment?: EquipmentData[] | undefined
    branch?: SelectData[] | undefined
    typeMaintenance?: SelectData[] | undefined
    maintenanceSector: SelectData[] | undefined
    requester: SelectData[] | undefined
    status: SelectData[] | undefined
    maintainers: SelectData[] | undefined
  }

  setSelects: (data: ServiceOrderStoreData['selects']) => void
  fetchSelects: () => Promise<ServiceOrderStoreData['selects']>
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
      maintainers: undefined,
    },

    setSelects(data) {
      set({ selects: { ...data } })
    },

    async fetchSelects() {
      const [
        branch,
        allEquipment,
        allTypeMaintenance,
        allMaintenanceSector,
        allStatus,
        allListRequester,
        allMaintainers,
      ] = await Promise.all([
        await api.get('system/list-branch').then((res) => res.data.data),
        await api.get('system/equipment').then((res) => res.data.data),
        await api
          .get('/system/choices/type-maintenance')
          .then((res) => res.data.data),
        await api
          .get('/system/choices/sector-executing')
          .then((res) => res.data.data),
        await api
          .get('/system/choices/status-service-order')
          .then((res) => res.data.data),
        await api.get('/system/choices/requester').then((res) => res.data.data),
        await api
          .get('/system/choices/maintainers')
          .then((res) => res.data.data),
      ])
      // console.log('branch => ', branch)

      const result = {
        branch,
        equipment: allEquipment.map(
          (value: {
            id: number
            equipmentCode: string
            description: string
            branch: SelectData
          }) => {
            return {
              value: value.id.toString(),
              label: `${value.equipmentCode} - ${value.description}`,
              branch: value.branch,
            }
          },
        ),
        typeMaintenance: allTypeMaintenance,
        maintenanceSector: allMaintenanceSector,
        status: allStatus,
        requester: allListRequester,
        maintainers: allMaintainers,
      }

      set({ selects: result })

      return result
    },
  }
})
