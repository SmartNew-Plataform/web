import { InfoData } from '@/app/(app)/checklist/info/columns'
import { api } from '@/lib/api'
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
    table: Array<InfoData>
  } | null

  loadFamily: () => Promise<void>
  loadInfo: () => Promise<void>
}

export const useCoreScreensStore = create<CareScreensData>((set) => {
  return {
    familyScreen: null,
    infoScreen: null,

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
          table: response || [],
        },
      })
    },
  }
})
