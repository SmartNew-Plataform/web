import { api } from '@/lib/api'
import { create } from 'zustand'

type FamilyType = {
  [key: string]: number
}

interface StoreState {
  summaryCards: Array<{
    id: number
    description: string
    icon: 'close-circle' | 'checkmark-circle' | 'remove-circle'
    color: string
    quantity: number
  }> | null

  family: {
    [key: string]: number
  } | null

  status: {
    [key: string]: number
  } | null

  branch: Array<{
    id: number
    corporateName: string
    fantasyName: string
  }> | null

  equipment: Array<{
    id: number
    code: string
    description: string
    familyId: number
    branchId: number
  }> | null

  allEquipment: Array<{
    id: number
    code: string
    description: string
    familyId: number
    branchId: number
  }> | null

  load: (login: string) => Promise<void>
  loadingDashboard: boolean
  searchData: (data: {
    login: string
    period?:
      | {
          from: Date
          to: Date
        }
      | undefined
    branch?: Array<string> | undefined
    active?: Array<string> | undefined
  }) => Promise<void>
  fillEquipmentsByBranch: (branchIds: Array<string>) => void
}

export const useDashboardChecklistStore = create<StoreState>((set, get) => {
  return {
    summaryCards: null,
    family: null,
    status: null,
    branch: null,
    equipment: null,
    allEquipment: null,
    loadingDashboard: false,

    load: async (login: string) => {
      const {
        searchData,
        fillEquipmentsByBranch,
        equipment: equipmentByBranch,
      } = get()
      const [branch, equipment]: [
        branch: StoreState['branch'],
        equipment: StoreState['equipment'],
      ] = await Promise.all([
        await api
          .get(
            `${process.env.NEXT_PUBLIC_API_URL_CHECKLIST}/public/branch/byLogin`,
            {
              params: {
                login,
              },
            },
          )
          .then((res) => res.data),
        await api
          .get(
            `${process.env.NEXT_PUBLIC_API_URL_CHECKLIST}/public/equipment/byLogin`,
            {
              params: {
                login,
              },
            },
          )
          .then((res) => res.data),
      ])

      const allBranches = branch?.map((item) => String(item.id))
      fillEquipmentsByBranch(allBranches || [])

      const equipmentsFiltered = equipment?.filter(
        ({ branchId }) => allBranches?.includes(String(branchId)),
      )

      searchData({
        login,
        period: undefined,
        branch: [''],
      })

      set({
        allEquipment: equipment,
        branch,
      })
    },
    searchData: async (data) => {
      set({ loadingDashboard: true })

      const response = await api
        .get(
          `${process.env.NEXT_PUBLIC_API_URL_CHECKLIST}/public/checkList/dashForFilter`,
          {
            params: {
              login: data.login,
              startDate: data.period?.from,
              endDate: data.period?.to,
              branch: data.branch?.join(','),
              equipment: data.active?.join(','),
            },
          },
        )
        .then((res) => res.data)

      const family = response.reduce(
        (acc: FamilyType, { family }: { family: FamilyType }) => {
          if (Object.keys(acc).length === 0) return family
          const newFamily = acc
          Object.entries(family).forEach(([name, value]) => {
            newFamily[name] += value || 0
          })
          return newFamily
        },
        {},
      )
      console.log(family)

      // const equipments = Object.fromEntries(
      //   response.family.map((equipment: { name: string; quantity: string }) => {
      //     return [equipment.name, equipment.quantity]
      //   }),
      // )

      // const status = Object.fromEntries(
      //   response.status.reduce((acc: string[], item: any) => {
      //     return [...acc, ...Object.entries(item)]
      //   }, []),
      // )

      set({
        // status,
        family,
        summaryCards: response,
        loadingDashboard: false,
      })
    },
    fillEquipmentsByBranch: async (equipmentsIds) => {
      const allEquipments = get().allEquipment
      const equipmentsFiltered = allEquipments?.filter(({ branchId }) =>
        equipmentsIds.includes(String(branchId)),
      )

      set({ equipment: equipmentsFiltered })
    },
  }
})
