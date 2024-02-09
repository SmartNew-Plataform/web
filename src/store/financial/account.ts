import { create } from 'zustand'

export type EmissionType = {
  id: number
  process: string
  number: string
  numberRequest: number | null
  dateEmission: Date
  issue: string
  dueDate: Date
  prorogation: Date
  expectDate: Date | null
  totalGross: number
  valuePay: number
  totalLiquid: number
  numberSplit: number
  status: string
}

interface StoreData {
  selectedRows: EmissionType[]
  setSelectedRows: (data: EmissionType[] | undefined) => void
}

export const useAccountStore = create<StoreData>((set, get) => {
  return {
    selectedRows: [],

    setSelectedRows: (data) => {
      set({
        selectedRows: data,
      })
    },
  }
})
