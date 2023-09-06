import { InfoData } from '@/components/columns/columns-info'
import { api } from '@/lib/api'
import { AxiosError } from 'axios'
import dayjs from 'dayjs'
import { create } from 'zustand'
import {
  AskType,
  FamilyData,
  FilterInfoChecklist,
  SchemaAskType,
} from './checklist-types'

type EditingAskType = {
  currentAnswerHasChild?: boolean
} & SchemaAskType

interface CoreScreensData {
  familyScreen: {
    table: Array<FamilyData>
  } | null
  infoScreen: {
    filter?: FilterInfoChecklist
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
    editingAsk: EditingAskType | null
    allDataTable: Array<AskType>
    table: Array<AskType> | null
  } | null

  changeFilter: (params: FilterInfoChecklist) => void
  changeChecklistAsksTable: (status: string[]) => void
  changeAskEditing: (ask: AskType) => Promise<void>
  checkIfAnswerHasChild: (answerId: number) => void

  loadFamily: () => Promise<void>
  loadInfo: () => Promise<void | Array<InfoData> | AxiosError | null>
  loadChecklistAsks: (
    productionId: string,
    resetData?: boolean,
  ) => Promise<void>
}

export const useCoreScreensStore = create<CoreScreensData>((set, get) => {
  return {
    familyScreen: null,
    infoScreen: null,
    checklistAsksScreen: null,

    changeFilter: (params) => {
      const restValue = get()
      set({
        ...restValue,
        infoScreen: {
          filter: params,
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
    changeAskEditing: async (ask) => {
      const restStore = get()
      if (!restStore.checklistAsksScreen) return

      set({
        ...restStore,
        checklistAsksScreen: {
          ...restStore.checklistAsksScreen,
          editingAsk: null,
        },
      })

      const response = await api
        .get('/smart-list/check-list/task-by-id', {
          params: { taskId: ask.id },
        })
        .then((res) => res.data)

      set({
        ...restStore,
        checklistAsksScreen: {
          ...restStore.checklistAsksScreen,
          editingAsk: {
            description: ask.description,
            isLoading: false,
            answerAsked: ask,
            ...response,
          },
        },
      })
    },

    checkIfAnswerHasChild: (answerId) => {
      const restStore = get()
      const answers = restStore.checklistAsksScreen?.editingAsk?.options
      const currentAnswer = answers?.find(({ id }) => id === answerId)
      const hasChild = currentAnswer?.children
        ? currentAnswer?.children.length > 0
        : false

      console.log(currentAnswer, hasChild)

      if (!restStore.checklistAsksScreen?.editingAsk) return

      set({
        checklistAsksScreen: {
          ...restStore.checklistAsksScreen,
          editingAsk: {
            ...restStore.checklistAsksScreen.editingAsk,
            currentAnswerHasChild: hasChild,
          },
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
          filter: undefined,
          table: response || [],
        },
      })

      return response
    },

    loadChecklistAsks: async (productionId, resetData = true) => {
      if (resetData) {
        set({ checklistAsksScreen: null })
      }
      const asks = await api
        .get('smart-list/check-list/find-by-id', {
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
