import { create } from 'zustand'

type EditingData = {
  value: number
  text: string
  branchId: number
}

interface StoreDiverseData {
  editingData: EditingData | undefined

  setEditingData: (params: EditingData | undefined) => void
}

export const useDiverse = create<StoreDiverseData>((set) => {
  return {
    editingData: undefined,

    setEditingData(data) {
      set({ editingData: data })
    },
  }
})
