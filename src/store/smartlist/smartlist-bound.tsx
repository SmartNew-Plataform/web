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
  family:
    | Array<{
        branchId: number
        clientId: number
        family: string
        id: number
        observation: string
      }>
    | undefined

  loadBounds: () => Promise<void>
  loadFamily: () => Promise<void>
}

type ErrorMessage = { message: string }

export const useBoundStore = create<SmartListBoundStoreData>((set) => {
  return {
    bounds: undefined,
    family: undefined,

    async loadBounds() {
      set({ bounds: undefined })
      const response = await api
        .get('/smart-list/bound')
        .then((res) => res.data)

      set({
        bounds: response.bound,
      })
    },

    async loadFamily() {
      const response = await api
        .get('/smart-list/family')
        .then((res) => res.data)
        .catch((err: AxiosError<ErrorMessage>) => console.error(err))

      set({
        family: response,
      })
    },
  }
})
