import { api } from '@/lib/api'
import { create } from 'zustand'

export type ActionItem = {
  id: number
  equipment: string
  branch: string
  responsible: string | null
  startDate: string
  endDate: string | null
  task: string
  status: string
}

interface StoreData {
  actionList: Array<ActionItem> | undefined

  fetchActionList: () => Promise<void>
}

export const useActionsStore = create<StoreData>((set) => {
  return {
    actionList: undefined,

    fetchActionList: async () => {
      const response = await api
        .get('smart-list/action')
        .then((res) => res.data)

      set({ actionList: response.action })
    },
  }
})
