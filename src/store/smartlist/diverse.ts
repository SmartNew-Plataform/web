import { SelectData } from '@/@types/select-data'
import { create } from 'zustand'

type EditingData = {
  value: number
  text: string
  tag: string
  branchId: number
}

interface StoreDiverseData {
  editingData: EditingData | undefined
  qrCodeDiverse: string[] | undefined
  diverse: SelectData[] | undefined

  setEditingData: (params: EditingData | undefined) => void
  setQrCodeDiverse: (diverse: string[] | undefined) => void
  setDiverse: (diverse: SelectData[] | undefined) => void
}

export const useDiverse = create<StoreDiverseData>((set) => {
  return {
    editingData: undefined,
    qrCodeDiverse: undefined,
    diverse: undefined,

    setEditingData(data) {
      set({ editingData: data })
    },

    setQrCodeDiverse(diverse) {
      set({ qrCodeDiverse: diverse })
    },

    setDiverse(diverse) {
      set({ diverse })
    },
  }
})
