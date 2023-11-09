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
  currentTaskId: number | undefined
  responsible:
    | Array<{
        login: string
        name: string
      }>
    | undefined

  fetchActionList: () => Promise<void>
  fetchResponsible: (itemId: number) => Promise<void>
  setCurrentTaskId: (taskId: number) => void
}

export const useActionsStore = create<StoreData>((set, get) => {
  return {
    actionList: undefined,
    currentTaskId: undefined,
    responsible: undefined,

    fetchActionList: async () => {
      const response: { action: Array<ActionItem> } = await api
        .get('smart-list/action')
        .then((res) => res.data)

      set({ actionList: response.action })
    },

    fetchResponsible: async (itemId) => {
      const response = await api
        .get('/smart-list/action/responsible', {
          params: {
            itemId,
          },
        })
        .then((res) => res.data)

      set({ responsible: response.responsible })
    },

    setCurrentTaskId: (taskId) => {
      set({ currentTaskId: taskId })
    },
  }
})
