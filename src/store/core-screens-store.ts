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

  loadFamily: () => Promise<void>
}

export const useCoreScreensStore = create<CareScreensData>((set) => {
  return {
    familyScreen: null,

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
  }
})
