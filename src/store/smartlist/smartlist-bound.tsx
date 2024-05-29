import { api } from '@/lib/api'
import { AxiosError } from 'axios'
import { create } from 'zustand'

interface BoundType {
  id: number
  family: string
  description: string
}

interface SmartListBoundStoreData {
  bounds: BoundType[] | undefined
  diverse:
    | Array<{
        value: string
        label: string
      }>
    | undefined
  family:
    | Array<{
        branchId: number
        clientId: number
        family: string
        id: number
        observation: string
      }>
    | undefined
  filterText: string | undefined

  setFilterText: (param: string) => void
  loadBounds: (p: { filterText: string | undefined }) => Promise<BoundType[]>
  loadFamily: () => Promise<SmartListBoundStoreData['family']>
  loadDiverse: () => Promise<SmartListBoundStoreData['diverse']>
}

type ErrorMessage = { message: string }

export const useBoundStore = create<SmartListBoundStoreData>((set) => {
  return {
    bounds: undefined,
    diverse: undefined,
    family: undefined,
    filterText: undefined,

    setFilterText(filterText) {
      set({ filterText })
    },

    async loadBounds({ filterText }) {
      set({ bounds: undefined })
      const response = await api
        .get<{
          bound: BoundType[]
        }>('/smart-list/bound', { params: { filterText } })
        .then((res) => res.data)

      set({
        bounds: response.bound,
      })

      return response.bound
    },

    async loadFamily() {
      const response = await api
        .get('/smart-list/family')
        .then((res) => res.data)
        .catch((err: AxiosError<ErrorMessage>) => console.error(err))

      set({
        family: response,
      })

      return response
    },

    async loadDiverse() {
      const response = await api
        .get('/system/list-diverse')
        .then((res) => res.data)
        .catch((err: AxiosError<ErrorMessage>) => console.error(err))

      set({
        diverse: response,
      })

      return response
    },
  }
})
