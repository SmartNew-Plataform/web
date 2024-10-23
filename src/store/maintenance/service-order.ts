import { SelectData } from '@/@types/select-data'
import { api } from '@/lib/api'
import { create } from 'zustand'

type EquipmentData = {
  branch: SelectData
} & SelectData

export type ServiceOrder = {
  id: number
  codeServiceOrder: string
  equipment: string
  requester: string
  dateTimeRequest: string
  dateEmission: string
  requestDate: string
  datePrev: string
  branch: {
    id: number
    branchNumber: string
    companyName: string
  }
  status: {
    value: number
    label: string
    color: string
    hasFinished: boolean
    hasJustify: boolean
  }

  statusOrderService: {
    id: number
    status: string
    color: string
    hasFinished: boolean
    hasJustify: boolean
  }
  typeMaintenance: {
    id: number
    label: string
    typeMaintenance: string
  }
}

export type StatusFilterData = {
  id: string
  name: string
  color: string
  hasFinished?: boolean
  hasJustify?: boolean
  count: number
}

interface ServiceOrderStoreData {
  selects: {
    equipment?: EquipmentData[] | undefined
    branch?: SelectData[] | undefined
    typeMaintenance?: SelectData[] | undefined
    maintenanceSector: SelectData[] | undefined
    requester: SelectData[] | undefined
    status: StatusFilterData[] | undefined // Atualizado
    maintainers: SelectData[] | undefined
  }
  statusFilterValue: string | undefined
  setStatusFilterValue: (data: string | undefined) => void

  serviceOrders: ServiceOrder[] | undefined
  fetchServiceOrders: () => Promise<void>

  statusFilterData: StatusFilterData[] | undefined
  setStatusFilterData: (data: StatusFilterData[] | undefined) => void
  updateServiceOrderStatus: (
    orderId: number,
    newStatusId: number,
    additionalData?: { justify?: string; dateEnd?: string | null },
  ) => Promise<void>

  setSelects: (data: ServiceOrderStoreData['selects']) => void
  fetchSelects: () => Promise<ServiceOrderStoreData['selects']>

  viewMode: 'kanban' | 'grid'
  setViewMode: (viewMode: 'kanban' | 'grid') => void
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
    statusFilterValue: undefined,
    serviceOrders: undefined,
    statusFilterData: undefined,
    viewMode: 'kanban',

    setStatusFilterValue(data) {
      set({ statusFilterValue: data })
    },

    setStatusFilterData(data) {
      set({ statusFilterData: data })
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
        status: allStatus, // Atualizado
        requester: allListRequester,
        maintainers: allMaintainers,
      }

      set({ selects: result })

      return result
    },

    async fetchServiceOrders() {
      const response = await api.get('/maintenance/service-order/list-table', {
        params: {
          index: null,
          perPage: false, // enviar false
        },
      })
      const serviceOrders = response.data.rows
      set({ serviceOrders })
    },

    async updateServiceOrderStatus(
      orderId: number,
      newStatusId: number,
      additionalData?: { justify?: string; dateEnd?: string | null },
    ) {
      try {
        const updatedOrderData: any = {
          idStatusServiceOrder: newStatusId,
          ...additionalData,
        }

        const response = await api.put(
          `/maintenance/service-order/${orderId}/status`,
          updatedOrderData,
        )

        console.log('Status atualizado com sucesso:', response.data)

        set((state) => {
          const updatedOrders = state.serviceOrders?.map((order) => {
            if (order.id === orderId) {
              return {
                ...order,
                statusOrderService: {
                  ...order.statusOrderService,
                  id: newStatusId,
                },
              }
            }
            return order
          })
          return { serviceOrders: updatedOrders }
        })
      } catch (error) {
        console.error('Erro ao atualizar o status da ordem de serviço:', error)
      }
    },

    setViewMode(viewMode) {
      set({ viewMode })
    },
  }
})
