import { api } from '@/lib/api'
import { create } from 'zustand'

export type ActionItem = {
  id: number
  actionId: number | null
  description: string | null
  equipment: string
  branch: string
  responsible: {
    login: string
    name: string
  } | null
  startDate: string
  endDate: string | null
  doneAt: string | null
  task: string
  status: string
}

interface StoreData {
  actionList: Array<ActionItem> | undefined
  currentTask: ActionItem | undefined
  responsible:
    | Array<{
        login: string
        name: string
      }>
    | undefined

  fetchActionList: () => Promise<void>
  fetchResponsible: (itemId: number) => Promise<void>
  setCurrentTask: (task: ActionItem) => void
}

export const useActionsStore = create<StoreData>((set, get) => {
  return {
    actionList: undefined,
    currentTask: undefined,
    responsible: undefined,

    fetchActionList: async () => {
      set({ actionList: undefined })
      const response: { action: Array<ActionItem> } = await api
        .get('smart-list/action')
        .then((res) => res.data)

      set({ actionList: response.action })
    },

    fetchResponsible: async (itemId) => {
      set({ responsible: undefined })

      const response = await api
        .get('/smart-list/action/responsible', {
          params: {
            itemId,
          },
        })
        .then((res) => res.data)

      set({ responsible: response.responsible })
    },

    setCurrentTask: (task) => {
      set({ currentTask: task })
    },
  }
})
