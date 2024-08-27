import { create } from 'zustand'

interface GridStoreData {
  checklistId: string[] | undefined
  setChecklistId: (params: string[]) => void
}

export const useGridStore = create<GridStoreData>((set) => {
  return {
    checklistId: undefined,

    setChecklistId(checklistId: string[]) {
      set({ checklistId })
    },
  }
})
