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
    allStatus: Array<{
      id: number
      description: string
    }>
    allDataTable: Array<{
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
    }> | null
  } | null

  changeFilterText: (text: string) => void
  changeChecklistAsksTable: (status: string[]) => void

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

    changeChecklistAsksTable: (status) => {
      const allData = get()
      const oldTable = get().checklistAsksScreen?.allDataTable
      const filteredTable =
        status.length === 0
          ? oldTable
          : oldTable?.filter(({ answer }) =>
              answer?.id ? status.includes(String(answer.id)) : false,
            )

      if (!allData.checklistAsksScreen) return

      set({
        ...allData,
        checklistAsksScreen: {
          ...allData.checklistAsksScreen,
          table: filteredTable || null,
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

      const status = await api
        .get('/smart-list/check-list/list-status')
        .then((res) => res.data)

      set({
        checklistAsksScreen: {
          ...asks,
          allStatus: status.map(
            ({ id, descricao }: { id: number; descricao: string }) => ({
              id,
              description: descricao,
            }),
          ),
          startDate: dayjs(asks.startDate).format('DD/MM/YYYY, HH:mm'),
          status: asks.status === 'opene' ? 'Aberto' : 'Finalizado',
          table: asks.tasks,
          allDataTable: asks.tasks,
        },
      })
    },
  }
})
