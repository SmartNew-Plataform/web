import { InfoData } from '@/app/(app)/checklist/info/columns'
import { api } from '@/lib/api'
import { AxiosError } from 'axios'
import dayjs from 'dayjs'
import { create } from 'zustand'

export type FamilyData = {
  id: string
  family: string
  description: string
  task: {
    id: string
    description: string
  }
}

interface CareScreensData {
  familyScreen: {
    table: Array<FamilyData>
  } | null
  infoScreen: {
    filterText: string | null
    table: Array<InfoData>
  } | null
  checklistAsksScreen: {
    id: number
    status: string
    startDate: string
    endDate: string
    equipment: string
    user: string
    table: Array<{
      description: string
      id: number
      img: Array<string>
      answer: {
        color: string
        description: string
        icon: 'close-circle' | 'checkmark-circle' | 'question-circle'
        id: number
        children: {
          id: number
          description: string
        }
      }
    }>
  } | null

  changeFilterText: (text: string) => void

  loadFamily: () => Promise<void>
  loadInfo: () => Promise<void | Array<InfoData> | AxiosError | null>
  loadChecklistAsks: (productionId: string) => Promise<void>
}

export const useCoreScreensStore = create<CareScreensData>((set, get) => {
  return {
    familyScreen: null,
    infoScreen: null,
    checklistAsksScreen: null,

    changeFilterText: (text) => {
      const restValue = get()
      set({
        ...restValue,
        infoScreen: {
          filterText: text,
          table: restValue.infoScreen?.table || [],
        },
      })
    },

    loadFamily: async () => {
      const response: Array<FamilyData> | null = await api
        .get('family')
        .then((res) => res.data)

      set({
        familyScreen: {
          table: response || [],
        },
      })
    },

    loadInfo: async () => {
      const response: Array<InfoData> | null = await api
        .get('/smart-list/check-list')
        .then((res) => res.data.data)

      set({
        infoScreen: {
          filterText: '',
          table: response || [],
        },
      })

      return response
    },

    loadChecklistAsks: async (productionId) => {
      set({ checklistAsksScreen: null })
      const asks = await api
        .get('smart-list/check-list/findById', {
          params: {
            productionId,
          },
        })
        .then((res) => res.data.response)

      set({
        checklistAsksScreen: {
          ...asks,
          startDate: dayjs(asks.startDate).format('DD/MM/YYYY, HH:mm'),
          status: asks.status === 'opene' ? 'Aberto' : 'Finalizado',
          table: asks.tasks,
        },
      })
    },
  }
})
