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
  descriptionAction: string | null
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

  attach: Array<{ url: string }> | undefined

  fetchActionList: () => Promise<void>
  fetchResponsible: (itemId: number) => Promise<void>
  fetchAttach: (actionId: number) => Promise<Array<{ url: string }>>
  setCurrentTask: (task: ActionItem) => void
  clearAttach: () => void
}

export const useActionsStore = create<StoreData>((set) => {
  return {
    actionList: undefined,
    currentTask: undefined,
    responsible: undefined,
    attach: undefined,

    fetchActionList: async () => {
      set({ actionList: undefined })
      const response: { action: Array<ActionItem> } = await api
        .get('smart-list/action')
        .then((res) => res.data)
        .catch(() => set({ actionList: [] }))

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
        .catch(() => set({ responsible: [] }))

      set({ responsible: response.responsible })
    },

    fetchAttach: async (actionId) => {
      set({ attach: undefined })

      const response = await api
        .get(`/smart-list/action/attach/${actionId}`)
        .then((res) => res.data)
        .catch(() => set({ attach: [] }))

      set({ attach: response.img })

      return response.img
    },

    clearAttach: () => {
      set({ attach: undefined })
    },

    setCurrentTask: (task) => {
      set({ currentTask: task })
    },
  }
})
